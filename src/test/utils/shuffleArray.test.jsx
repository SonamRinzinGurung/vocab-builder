import { describe, it, expect } from 'vitest';
import { shuffleArray } from '../../utils/shuffleArray';

describe('shuffleArray', () => {
    it('returns an array of the same length', () => {
        const arr = [1, 2, 3, 4, 5];
        expect(shuffleArray([...arr]), 'shuffling should not add or remove elements').toHaveLength(arr.length);
    });

    it('contains the same elements as the original', () => {
        const arr = [1, 2, 3, 4, 5];
        const shuffled = shuffleArray([...arr]);
        expect(shuffled.sort(), 'sorted result should equal sorted original — no elements lost or duplicated').toEqual([...arr].sort());
    });

    it('returns an empty array unchanged', () => {
        expect(shuffleArray([]), 'shuffling an empty array should return an empty array').toEqual([]);
    });

    it('returns a single-element array unchanged', () => {
        expect(shuffleArray(['only']), 'a single-element array has only one possible order').toEqual(['only']);
    });

    it('mutates and returns the same array reference', () => {
        const arr = [1, 2, 3];
        const result = shuffleArray(arr);
        expect(result, 'shuffleArray should mutate in place and return the same reference').toBe(arr);
    });

    it('produces a different order at least sometimes over many runs', () => {
        // With 7 elements the chance of 30 consecutive identical orders is (1/7!)^29 ≈ 0
        const original = [1, 2, 3, 4, 5, 6, 7];
        const orders = new Set();
        for (let i = 0; i < 30; i++) {
            orders.add(shuffleArray([...original]).join(','));
        }
        expect(orders.size, 'should produce more than 1 unique ordering across 30 runs').toBeGreaterThan(1);
    });
});
