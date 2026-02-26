import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { updateSRS } from '../../utils/updateSRS';

describe('updateSRS', () => {
    // Pin time so nextReview calculations are deterministic
    const FIXED_NOW = new Date('2025-01-15T12:00:00.000Z');
    beforeAll(() => { vi.useFakeTimers(); vi.setSystemTime(FIXED_NOW); });
    afterAll(() => { vi.useRealTimers(); });

    describe('quality 0 (Forgot)', () => {
        it('resets interval to 1', () => {
            const result = updateSRS({ interval: 10, ease: 2.5, reviewCount: 3 }, 0);
            expect(result.interval, 'forgetting a word resets the review interval to 1 day').toBe(1);
        });

        it('lowers the ease factor by 0.2 on top of the normal adjustment', () => {
            // newEase baseline: 2.5 + (0.1 - 3*0.08) = 2.36, then -0.2 for quality 0 = 2.16
            const result = updateSRS({ ease: 2.5, interval: 5, reviewCount: 1 }, 0);
            expect(result.ease, 'ease should be 2.16 (2.5 - 0.14 adjustment - 0.2 forgot penalty)').toBeCloseTo(2.16, 5);
        });

        it('can drop ease below 1.3 because the quality-0 penalty is applied after the lower-bound clamp', () => {
            // Clamp to 1.3 runs first, then -= 0.2 for quality 0, so result is ~1.1
            const result = updateSRS({ ease: 1.3, interval: 1, reviewCount: 1 }, 0);
            expect(result.ease, 'ease ends at ~1.1 because the -0.2 penalty runs after the 1.3 clamp').toBeCloseTo(1.1, 5);
        });
    });

    describe('quality 1 (Hard)', () => {
        it('halves the interval (rounded)', () => {
            const result = updateSRS({ interval: 10, ease: 2.5, reviewCount: 2 }, 1);
            expect(result.interval, 'Hard halves the interval: round(10 * 0.5) = 5').toBe(5);
        });

        it('interval is at least 1 even when halving a small value', () => {
            const result = updateSRS({ interval: 1, ease: 2.5, reviewCount: 2 }, 1);
            expect(result.interval, 'interval should never fall below 1 day').toBe(1);
        });
    });

    describe('quality 2 (Good) and 3 (Easy)', () => {
        it('sets interval to 1 on first review (interval was 0)', () => {
            const result = updateSRS({ interval: 0, ease: 2.5, reviewCount: 0 }, 2);
            expect(result.interval, 'first-ever review sets interval to 1 day').toBe(1);
        });

        it('sets interval to 3 on second review (interval was 1)', () => {
            const result = updateSRS({ interval: 1, ease: 2.5, reviewCount: 1 }, 2);
            expect(result.interval, 'second review hard-codes interval to 3 days').toBe(3);
        });

        it('multiplies interval by ease for subsequent reviews', () => {
            const result = updateSRS({ interval: 10, ease: 2.5, reviewCount: 4 }, 2);
            // newEase = 2.5 + (0.1 - 1*0.08) = 2.52; newInterval = round(10 * 2.52) = 25
            expect(result.interval, 'interval = round(10 * newEase 2.52) = 25').toBe(25);
        });

        it('caps interval at 180 days', () => {
            const result = updateSRS({ interval: 150, ease: 2.5, reviewCount: 10 }, 3);
            expect(result.interval, 'interval should never exceed the 180-day maximum').toBeLessThanOrEqual(180);
        });
    });

    describe('return shape', () => {
        it('increments reviewCount by 1', () => {
            const result = updateSRS({ reviewCount: 4, interval: 3, ease: 2.5 }, 2);
            expect(result.reviewCount, 'every successful review increments reviewCount by 1').toBe(5);
        });

        it('defaults reviewCount to 0 when missing', () => {
            const result = updateSRS({ interval: 1, ease: 2.5 }, 2);
            expect(result.reviewCount, 'missing reviewCount should default to 0 and then be incremented to 1').toBe(1);
        });

        it('nextReview is interval days after now', () => {
            const result = updateSRS({ interval: 0, ease: 2.5, reviewCount: 0 }, 2);
            // interval becomes 1, so nextReview = FIXED_NOW + 1 day
            const expectedMs = FIXED_NOW.getTime() + 1 * 24 * 60 * 60 * 1000;
            expect(result.nextReview.getTime(), 'nextReview should be exactly 1 day (the new interval) from now').toBe(expectedMs);
        });

        it('lastReviewed equals now', () => {
            const result = updateSRS({ interval: 1, ease: 2.5, reviewCount: 1 }, 2);
            expect(result.lastReviewed.getTime(), 'lastReviewed should be set to the current timestamp').toBe(FIXED_NOW.getTime());
        });
    });
});
