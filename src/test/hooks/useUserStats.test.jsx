import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getDoc } from 'firebase/firestore';
import useUserStats from '../../hooks/useUserStats';

// ─── module mocks ─────────────────────────────────────────────────────────────
vi.mock('../../firebase-config', () => ({ db: {} }));

// doc() builds a reference; getDoc() is the only call that returns real data.
vi.mock('firebase/firestore', () => ({
    doc: vi.fn(() => 'docRef'),
    getDoc: vi.fn(),
}));

// ─── helpers ──────────────────────────────────────────────────────────────────
// Produce a Firestore DocumentSnapshot-shaped object.
const makeSnap = (exists, data) => ({
    exists: () => exists,
    data: () => data,
});

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

// ─── tests ────────────────────────────────────────────────────────────────────
describe('useUserStats', () => {
    // Pin the clock at a known date so formatDateLocal() is deterministic
    const TODAY = '2026-02-26';
    const FIXED_NOW = new Date('2026-02-26T10:00:00.000Z');

    beforeEach(() => {
        // Only fake the Date constructor — leaving setTimeout/setInterval real so
        // waitFor() and React Query's internals continue to work correctly.
        vi.useFakeTimers({ toFake: ['Date'] });
        vi.setSystemTime(FIXED_NOW);
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('returns null when the user stats document does not exist in Firestore', async () => {
        getDoc.mockResolvedValue(makeSnap(false, null));

        const { result } = renderHook(() => useUserStats('user1'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            // The query has settled — data was returned (null in this case)
            expect(result.current.userStats).toBeNull();
        });

        expect(
            result.current.userStats,
            'userStats should be null when no Firestore document exists for this user'
        ).toBeNull();
    });

    it('returns userStats unchanged when the stored date matches today', async () => {
        const storedStats = {
            date: TODAY,
            streak: 5,
            reviewsToday: 3,
            xpToday: 30,
            lifetimeXp: 500,
        };

        getDoc.mockResolvedValue(makeSnap(true, storedStats));

        const { result } = renderHook(() => useUserStats('user1'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.userStats).not.toBeNull();
        });

        expect(
            result.current.userStats.reviewsToday,
            'reviewsToday should be unaffected when the stored date is still today'
        ).toBe(3);

        expect(
            result.current.userStats.xpToday,
            'xpToday should be unaffected when the stored date is still today'
        ).toBe(30);

        expect(
            result.current.userStats.streak,
            'streak should be passed through unchanged'
        ).toBe(5);
    });

    it('resets reviewsToday and xpToday to 0 when the stored date is in the past', async () => {
        const staleStats = {
            date: '2025-06-14', // yesterday
            streak: 7,
            reviewsToday: 12,
            xpToday: 120,
            lifetimeXp: 1000,
        };

        getDoc.mockResolvedValue(makeSnap(true, staleStats));

        const { result } = renderHook(() => useUserStats('user1'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.userStats).not.toBeNull();
        });

        expect(
            result.current.userStats.reviewsToday,
            'reviewsToday should reset to 0 on a new day so the daily counter starts fresh'
        ).toBe(0);

        expect(
            result.current.userStats.xpToday,
            'xpToday should reset to 0 on a new day so the daily XP bar starts fresh'
        ).toBe(0);

        expect(
            result.current.userStats.streak,
            'streak should not be affected by the daily reset logic in this hook'
        ).toBe(7);

        expect(
            result.current.userStats.lifetimeXp,
            'lifetimeXp should not be affected by the daily reset'
        ).toBe(1000);
    });

    it('exposes a refetchUserStats function', async () => {
        getDoc.mockResolvedValue(makeSnap(false, null));

        const { result } = renderHook(() => useUserStats('user1'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.userStats).toBeNull();
        });

        expect(
            typeof result.current.refetchUserStats,
            'hook should expose refetchUserStats as a function so callers can trigger a reload'
        ).toBe('function');
    });
});
