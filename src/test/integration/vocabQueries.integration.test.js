/**
 * Integration tests — run against the local Firebase Emulator.
 *
 * These verify the Firestore query logic that vi.mock() cannot:
 *   • compound where clauses actually filter correctly
 *   • Timestamp comparisons use real Firestore semantics
 *   • updateDoc / getDoc round-trips preserve the right fields
 *
 * Start the emulator before running:
 *   npm run emulators
 * Then in a second terminal:
 *   npm run test:integration
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    updateDoc,
    query,
    where,
    Timestamp,
} from 'firebase/firestore';
import { createEmulatorEnv } from '../emulator-env.js';

let env;

beforeAll(async () => {
    env = await createEmulatorEnv();
});

afterAll(async () => {
    await env.cleanup();
});

beforeEach(async () => {
    // Wipe all Firestore data so each test starts with a clean slate.
    await env.clearFirestore();
});

// ─── helpers ──────────────────────────────────────────────────────────────────
function db() {
    // unauthenticatedContext bypasses security rules — fine for integration
    // tests where we own both the seed data and the assertions.
    return env.unauthenticatedContext().firestore();
}

async function seedVocabDoc(id, data) {
    await setDoc(doc(db(), 'vocab', id), data);
}

// ─── due-words query (used by useDueWords hook) ───────────────────────────────
describe('due-words query', () => {
    it('returns documents whose nextReview is in the past', async () => {
        const yesterday = Timestamp.fromDate(new Date(Date.now() - 86400000));

        await seedVocabDoc('overdue', {
            word: 'ephemeral',
            uid: 'user1',
            reviewCount: 2,
            nextReview: yesterday,
        });

        const q = query(
            collection(db(), 'vocab'),
            where('uid', '==', 'user1'),
            where('nextReview', '<=', Timestamp.now())
        );

        const snap = await getDocs(q);
        expect(snap.docs.length, 'one overdue document should satisfy the query').toBe(1);
        expect(snap.docs[0].data().word, 'should return the word field').toBe('ephemeral');
    });

    it('excludes documents whose nextReview is in the future', async () => {
        const tomorrow = Timestamp.fromDate(new Date(Date.now() + 86400000));

        await seedVocabDoc('future', {
            word: 'transient',
            uid: 'user1',
            reviewCount: 1,
            nextReview: tomorrow,
        });

        const q = query(
            collection(db(), 'vocab'),
            where('uid', '==', 'user1'),
            where('nextReview', '<=', Timestamp.now())
        );

        const snap = await getDocs(q);
        expect(snap.docs.length, 'a future-due document should not be returned').toBe(0);
    });

    it('only returns documents belonging to the queried user', async () => {
        const yesterday = Timestamp.fromDate(new Date(Date.now() - 86400000));

        await seedVocabDoc('user1-word', { word: 'serendipity', uid: 'user1', reviewCount: 1, nextReview: yesterday });
        await seedVocabDoc('user2-word', { word: 'serenity', uid: 'user2', reviewCount: 1, nextReview: yesterday });

        const q = query(
            collection(db(), 'vocab'),
            where('uid', '==', 'user1'),
            where('nextReview', '<=', Timestamp.now())
        );

        const snap = await getDocs(q);
        expect(snap.docs.length, 'should only return docs for user1').toBe(1);
        expect(snap.docs[0].data().uid, 'returned doc must belong to user1').toBe('user1');
    });

    it('returns multiple overdue documents for the same user', async () => {
        const yesterday = Timestamp.fromDate(new Date(Date.now() - 86400000));

        await seedVocabDoc('w1', { word: 'a', uid: 'user1', reviewCount: 1, nextReview: yesterday });
        await seedVocabDoc('w2', { word: 'b', uid: 'user1', reviewCount: 2, nextReview: yesterday });
        await seedVocabDoc('w3', { word: 'c', uid: 'user1', reviewCount: 3, nextReview: yesterday });

        const q = query(
            collection(db(), 'vocab'),
            where('uid', '==', 'user1'),
            where('nextReview', '<=', Timestamp.now())
        );

        const snap = await getDocs(q);
        expect(snap.docs.length, 'all three overdue documents should be returned').toBe(3);
    });
});

// ─── SRS update round-trip (used by updateWordSRS in ReviewSession) ───────────
describe('updateDoc — SRS fields', () => {
    it('persists interval, ease, reviewCount and nextReview after an updateDoc call', async () => {
        await seedVocabDoc('word-to-update', {
            word: 'tenacious',
            uid: 'user1',
            interval: 3,
            ease: 2.5,
            reviewCount: 1,
            nextReview: Timestamp.fromDate(new Date()),
        });

        const docRef = doc(db(), 'vocab', 'word-to-update');

        // Simulate what updateSRS returns then updateDoc writes
        const nextReview = new Date(Date.now() + 7 * 86400000);
        await updateDoc(docRef, {
            interval: 7,
            ease: 2.52,
            reviewCount: 2,
            nextReview: Timestamp.fromDate(nextReview),
            lastReviewed: Timestamp.now(),
        });

        const snap = await getDoc(docRef);
        const data = snap.data();

        expect(data.interval, 'interval should be persisted by updateDoc').toBe(7);
        expect(data.ease, 'ease should be persisted by updateDoc').toBeCloseTo(2.52, 5);
        expect(data.reviewCount, 'reviewCount should be incremented to 2').toBe(2);
        expect(data.nextReview, 'nextReview should be a Timestamp').toBeInstanceOf(Timestamp);
        expect(data.lastReviewed, 'lastReviewed should be written').toBeInstanceOf(Timestamp);
    });

    it('does not overwrite fields that were not included in updateDoc', async () => {
        await seedVocabDoc('partial-update', {
            word: 'resilient',
            uid: 'user1',
            definition: 'able to recover',
            interval: 1,
        });

        const docRef = doc(db(), 'vocab', 'partial-update');
        await updateDoc(docRef, { interval: 3 });

        const snap = await getDoc(docRef);
        expect(
            snap.data().word,
            'word field should survive a partial updateDoc'
        ).toBe('resilient');
        expect(
            snap.data().definition,
            'definition field should survive a partial updateDoc'
        ).toBe('able to recover');
    });
});

// ─── userStats document round-trip (used by updateDailyStats in ReviewSession) ─
describe('userStats document', () => {
    it('creates a stats document with setDoc when none exists yet', async () => {
        const statsRef = doc(db(), 'userStats', 'user1');
        await setDoc(statsRef, {
            date: '2025-06-15',
            reviewsToday: 1,
            xpToday: 10,
            totalReviews: 1,
            lifetimeXp: 10,
            streak: 1,
            longestStreak: 1,
            lastActive: '2025-06-15',
        });

        const snap = await getDoc(statsRef);
        expect(snap.exists(), 'document should exist after setDoc').toBe(true);
        expect(snap.data().streak, 'streak should be 1 on first use').toBe(1);
        expect(snap.data().lifetimeXp, 'lifetimeXp should be 10').toBe(10);
    });

    it('increments reviewsToday and lifetimeXp with updateDoc on subsequent reviews', async () => {
        const statsRef = doc(db(), 'userStats', 'user1');

        await setDoc(statsRef, {
            date: '2025-06-15',
            reviewsToday: 2,
            xpToday: 20,
            totalReviews: 10,
            lifetimeXp: 100,
            streak: 3,
            longestStreak: 5,
        });

        await updateDoc(statsRef, {
            reviewsToday: 3,
            xpToday: 30,
            totalReviews: 11,
            lifetimeXp: 110,
        });

        const snap = await getDoc(statsRef);
        const data = snap.data();

        expect(data.reviewsToday, 'reviewsToday should reflect the incremented value').toBe(3);
        expect(data.lifetimeXp, 'lifetimeXp should reflect the incremented value').toBe(110);
        expect(data.streak, 'streak should be untouched by the daily increment update').toBe(3);
    });
});
