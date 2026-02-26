import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getDocs } from 'firebase/firestore';
import useDueWords from '../../hooks/useDueWords';

// ─── module mocks ─────────────────────────────────────────────────────────────
// firebase-config only needs to export a db reference; the value doesn't matter
// because all Firestore functions are mocked below.
vi.mock('../../firebase-config', () => ({ db: {} }));

// Mock every Firestore function the hook touches. collection/query/where just
// build query descriptors — the value they return doesn't matter here because
// getDocs is the only mock that needs to resolve real data.
vi.mock('firebase/firestore', () => ({
    collection: vi.fn(() => 'collectionRef'),
    query: vi.fn(() => 'queryRef'),
    where: vi.fn(() => 'whereClause'),
    getDocs: vi.fn(),
}));

// ─── helpers ──────────────────────────────────────────────────────────────────
// Produce a minimal Firestore DocumentSnapshot-shaped object.
const makeDoc = (id, data) => ({ id, data: () => data });

// Each test gets a fresh QueryClient so cached results never bleed between tests.
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

// ─── tests ────────────────────────────────────────────────────────────────────
describe('useDueWords', () => {
    beforeEach(() => vi.clearAllMocks());

    it('returns empty arrays before the query resolves', () => {
        // A never-resolving promise keeps the query in loading state permanently,
        // so no async state update fires outside act() after we assert.
        getDocs.mockReturnValue(new Promise(() => { }));
        const { result, unmount } = renderHook(() => useDueWords('user1'), {
            wrapper: createWrapper(),
        });

        expect(result.current.dueWords, 'dueWords should default to [] while loading').toEqual([]);
        expect(result.current.unReviewed, 'unReviewed should default to [] while loading').toEqual([]);

        unmount(); // release the hanging promise
    });

    it('returns due words when Firestore has matching documents', async () => {
        const dueWord = { word: 'apple', uid: 'user1', reviewCount: 3 };
        getDocs.mockResolvedValue({ docs: [makeDoc('docA', dueWord)] });

        const { result } = renderHook(() => useDueWords('user1'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.dueWords.length, 'should have one due word').toBe(1);
        });

        expect(
            result.current.dueWords[0].id,
            'should merge the Firestore document id into the word object'
        ).toBe('docA');

        expect(
            result.current.dueWords[0].word,
            'should carry over the word field from the Firestore document'
        ).toBe('apple');
    });

    it('falls back to unReviewed words when no due words exist', async () => {
        const newWord = { word: 'banana', uid: 'user1', reviewCount: 0 };

        // First getDocs call (due query) returns nothing; second (all-words query) returns newWord.
        getDocs
            .mockResolvedValueOnce({ docs: [] })
            .mockResolvedValueOnce({ docs: [makeDoc('docB', newWord)] });

        const { result } = renderHook(() => useDueWords('user1'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.unReviewed.length, 'should have one unreviewed word').toBe(1);
        });

        expect(
            result.current.dueWords,
            'dueWords should remain empty when there are no due words'
        ).toEqual([]);

        expect(
            result.current.unReviewed[0].word,
            'unReviewed should contain the word returned by the fallback query'
        ).toBe('banana');
    });

    it('excludes words that already have a reviewCount > 0 from unReviewed', async () => {
        const reviewed = { word: 'cherry', uid: 'user1', reviewCount: 2 };
        const unreviewed = { word: 'date', uid: 'user1', reviewCount: 0 };

        getDocs
            .mockResolvedValueOnce({ docs: [] })
            .mockResolvedValueOnce({
                docs: [makeDoc('docC', reviewed), makeDoc('docD', unreviewed)],
            });

        const { result } = renderHook(() => useDueWords('user1'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.unReviewed.length, 'only the word with reviewCount=0 should be included').toBe(1);
        });

        expect(
            result.current.unReviewed[0].word,
            'the reviewed word should be filtered out, leaving only the new word'
        ).toBe('date');
    });

    it('includes words that have no reviewCount field at all', async () => {
        // A word freshly added to Firestore may not have a reviewCount field yet.
        const brandNew = { word: 'elderberry', uid: 'user1' };

        getDocs
            .mockResolvedValueOnce({ docs: [] })
            .mockResolvedValueOnce({ docs: [makeDoc('docE', brandNew)] });

        const { result } = renderHook(() => useDueWords('user1'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(
                result.current.unReviewed.length,
                'words without a reviewCount field should be treated as new'
            ).toBe(1);
        });
    });

    it('limits unReviewed to at most 10 words', async () => {
        const manyWords = Array.from({ length: 15 }, (_, i) => ({
            word: `word${i}`,
            uid: 'user1',
            reviewCount: 0,
        }));

        getDocs
            .mockResolvedValueOnce({ docs: [] })
            .mockResolvedValueOnce({ docs: manyWords.map((w, i) => makeDoc(`doc${i}`, w)) });

        const { result } = renderHook(() => useDueWords('user1'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(
                result.current.unReviewed.length,
                'unReviewed should be capped at 10 regardless of how many new words exist'
            ).toBe(10);
        });
    });
});
