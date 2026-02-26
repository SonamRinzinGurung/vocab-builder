import { describe, it, expect } from 'vitest';
import { getLevel } from '../../utils/getLevel';

describe('getLevel', () => {
    it('returns level 1 at 0 XP', () => {
        const result = getLevel(0);
        expect(result.level, 'level should be 1 when XP is 0').toBe(1);
        expect(result.currentLevelXP, 'currentLevelXP should be 0 (start of level 1)').toBe(0);
        expect(result.nextLevelXP, 'nextLevelXP should be 100 (first level threshold)').toBe(100);
        expect(result.progress, 'progress should be 0 at the very start of a level').toBe(0);
    });

    it('returns level 2 at exactly 100 XP', () => {
        const result = getLevel(100);
        expect(result.level, 'should cross into level 2 at the exact 100 XP threshold').toBe(2);
    });

    it('returns level 5 at exactly 1000 XP', () => {
        const result = getLevel(1000);
        expect(result.level, 'should be level 5 at the 1000 XP threshold').toBe(5);
    });

    it('calculates progress correctly mid-level', () => {
        // Level 1 spans 0–100 XP. At 50 XP, progress = 50/100 = 0.5
        const result = getLevel(50);
        expect(result.level, 'should still be level 1 at 50 XP').toBe(1);
        expect(result.progress, 'halfway through level 1 (50/100 XP) should give 0.5 progress').toBe(0.5);
    });

    it('returns level 15 at max XP threshold', () => {
        const result = getLevel(10500);
        expect(result.level, 'should reach level 15 at the max XP threshold').toBe(15);
    });

    it('caps at level 15 beyond max XP', () => {
        const result = getLevel(99999);
        expect(result.level, 'level should not exceed 15 regardless of XP').toBe(15);
    });

    it('returns progress between 0 and 1 for any valid XP', () => {
        [0, 250, 1750, 5000, 10000].forEach(xp => {
            const { progress } = getLevel(xp);
            expect(progress, `progress at ${xp} XP should be >= 0`).toBeGreaterThanOrEqual(0);
            expect(progress, `progress at ${xp} XP should be <= 1`).toBeLessThanOrEqual(1);
        });
    });
});
