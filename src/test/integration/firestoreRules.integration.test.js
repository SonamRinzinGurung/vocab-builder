/**
 * Integration tests — Firestore security rules enforcement.
 *
 * These tests verify that the rules in firestore.rules correctly allow or
 * deny reads and writes based on authentication and document ownership.
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
} from 'firebase/firestore';
import { createEmulatorEnvWithRules } from '../emulator-env.js';

let env;

beforeAll(async () => {
    env = await createEmulatorEnvWithRules();
});

afterAll(async () => {
    await env.cleanup();
});

beforeEach(async () => {
    // Wipe all Firestore data so each test starts with a clean slate.
    await env.clearFirestore();
});


// ─── seed helpers ─────────────────────────────────────────────────────────────
// Both helpers bypass rules via withSecurityRulesDisabled so seeding never
// depends on the authentication state being tested.

async function seedVocabDoc(id, data) {
    await env.withSecurityRulesDisabled(async (ctx) => {
        await setDoc(doc(ctx.firestore(), 'vocab', id), data);
    });
}

async function seedUserStatsDoc(userId, data) {
    await env.withSecurityRulesDisabled(async (ctx) => {
        await setDoc(doc(ctx.firestore(), 'userStats', userId), data);
    });
}


// ─── vocab collection ─────────────────────────────────────────────────────────
describe('vocab collection — security rules', () => {
    const OWNER_UID = 'owner-uid-abc';
    const OTHER_UID = 'other-uid-xyz';
    const DOC_ID = 'test-vocab-doc';

    const vocabData = {
        word: 'ephemeral',
        uid: OWNER_UID,
        reviewCount: 1,
        interval: 1,
        ease: 2.5,
    };

    it('authenticated owner can read their own vocab doc', async () => {
        await seedVocabDoc(DOC_ID, vocabData);

        const ownerDb = env.authenticatedContext(OWNER_UID).firestore();
        const snap = await assertSucceeds(
            getDoc(doc(ownerDb, 'vocab', DOC_ID))
        );
        expect(
            snap.exists(),
            'owner getDoc should return an existing document without a permission error'
        ).toBe(true);
    });

    it('authenticated owner can create a vocab doc with their own uid', async () => {
        const ownerDb = env.authenticatedContext(OWNER_UID).firestore();
        const result = await assertSucceeds(
            setDoc(doc(ownerDb, 'vocab', 'new-owner-doc'), {
                word: 'tenacious',
                uid: OWNER_UID,
                reviewCount: 0,
            })
        );
        expect(
            result,
            'owner setDoc should resolve without a permission error'
        ).toBeUndefined();
    });

    it('authenticated owner can update their own vocab doc', async () => {
        await seedVocabDoc(DOC_ID, vocabData);

        const ownerDb = env.authenticatedContext(OWNER_UID).firestore();
        const result = await assertSucceeds(
            updateDoc(doc(ownerDb, 'vocab', DOC_ID), { reviewCount: 2 })
        );
        expect(
            result,
            'owner updateDoc should resolve without a permission error'
        ).toBeUndefined();
    });

    it('authenticated user cannot read another user\'s vocab doc', async () => {
        await seedVocabDoc(DOC_ID, vocabData); // owned by OWNER_UID

        const otherDb = env.authenticatedContext(OTHER_UID).firestore();
        const error = await assertFails(
            getDoc(doc(otherDb, 'vocab', DOC_ID))
        );
        expect(
            error.code,
            'non-owner read should be rejected with permission-denied'
        ).toBe('permission-denied');
    });

    it('authenticated user cannot create a vocab doc with a different uid', async () => {
        const otherDb = env.authenticatedContext(OTHER_UID).firestore();
        const error = await assertFails(
            setDoc(doc(otherDb, 'vocab', 'spoofed-doc'), {
                word: 'deceive',
                uid: OWNER_UID, // uid does not match the authenticated user
                reviewCount: 0,
            })
        );
        expect(
            error.code,
            'creating a doc with a mismatched uid should be rejected with permission-denied'
        ).toBe('permission-denied');
    });

    it('unauthenticated user cannot read any vocab doc', async () => {
        await seedVocabDoc(DOC_ID, vocabData);

        const anonDb = env.unauthenticatedContext().firestore();
        const error = await assertFails(
            getDoc(doc(anonDb, 'vocab', DOC_ID))
        );
        expect(
            error.code,
            'unauthenticated read should be rejected with permission-denied'
        ).toBe('permission-denied');
    });

    it('unauthenticated user cannot write any vocab doc', async () => {
        const anonDb = env.unauthenticatedContext().firestore();
        const error = await assertFails(
            setDoc(doc(anonDb, 'vocab', 'anon-doc'), {
                word: 'stealth',
                uid: '',
                reviewCount: 0,
            })
        );
        expect(
            error.code,
            'unauthenticated write should be rejected with permission-denied'
        ).toBe('permission-denied');
    });
});


// ─── userStats collection ─────────────────────────────────────────────────────
describe('userStats collection — security rules', () => {
    const USER_UID = 'stats-user-abc';
    const OTHER_UID = 'other-stats-xyz';

    const statsData = {
        date: '2026-03-02',
        reviewsToday: 5,
        xpToday: 50,
        totalReviews: 20,
        lifetimeXp: 200,
        streak: 3,
        longestStreak: 7,
        lastActive: '2026-03-02',
    };

    it('authenticated user can read their own userStats doc', async () => {
        await seedUserStatsDoc(USER_UID, statsData);

        const userDb = env.authenticatedContext(USER_UID).firestore();
        const snap = await assertSucceeds(
            getDoc(doc(userDb, 'userStats', USER_UID))
        );
        expect(
            snap.exists(),
            'user getDoc on their own userStats doc should succeed and return an existing document'
        ).toBe(true);
    });

    it('authenticated user can write their own userStats doc', async () => {
        const userDb = env.authenticatedContext(USER_UID).firestore();
        const result = await assertSucceeds(
            setDoc(doc(userDb, 'userStats', USER_UID), statsData)
        );
        expect(
            result,
            'user setDoc on their own userStats doc should resolve without a permission error'
        ).toBeUndefined();
    });

    it('authenticated user cannot read another user\'s userStats doc', async () => {
        await seedUserStatsDoc(USER_UID, statsData);

        const otherDb = env.authenticatedContext(OTHER_UID).firestore();
        const error = await assertFails(
            getDoc(doc(otherDb, 'userStats', USER_UID))
        );
        expect(
            error.code,
            'reading another user\'s userStats doc should be rejected with permission-denied'
        ).toBe('permission-denied');
    });

    it('unauthenticated user cannot access any userStats doc', async () => {
        await seedUserStatsDoc(USER_UID, statsData);

        const anonDb = env.unauthenticatedContext().firestore();
        const error = await assertFails(
            getDoc(doc(anonDb, 'userStats', USER_UID))
        );
        expect(
            error.code,
            'unauthenticated access to userStats should be rejected with permission-denied'
        ).toBe('permission-denied');
    });
});
