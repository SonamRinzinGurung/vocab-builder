import { describe, it, expect } from 'vitest';
import { getWordMastery } from '../../utils/getWordMastery';

describe('getWordMastery', () => {
    it('returns 0 (New) for a word that has never been reviewed', () => {
        expect(getWordMastery({ reviewCount: 0 }), 'reviewCount=0 means the word has never been seen').toBe(0);
    });

    it('returns 0 (New) when reviewCount defaults to 0', () => {
        expect(getWordMastery({}), 'missing reviewCount should default to 0 (New)').toBe(0);
    });

    it('returns 1 (Learning) after first review', () => {
        expect(
            getWordMastery({ reviewCount: 1, interval: 1, ease: 2.5 }),
            'one review with a short interval should be Learning'
        ).toBe(1);
    });

    it('returns 1 (Learning) when interval is less than 3 even with many reviews', () => {
        expect(
            getWordMastery({ reviewCount: 10, interval: 2, ease: 2.5 }),
            'interval < 3 forces Learning regardless of reviewCount'
        ).toBe(1);
    });

    it('returns 2 (Familiar) when reviewCount is under 5', () => {
        expect(
            getWordMastery({ reviewCount: 4, interval: 14, ease: 2.5 }),
            'reviewCount=4 is below the Mastered threshold of 5'
        ).toBe(2);
    });

    it('returns 2 (Familiar) when interval is under 14', () => {
        expect(
            getWordMastery({ reviewCount: 5, interval: 13, ease: 2.5 }),
            'interval=13 is below the Mastered threshold of 14'
        ).toBe(2);
    });

    it('returns 2 (Familiar) when ease is below 2.2', () => {
        expect(
            getWordMastery({ reviewCount: 5, interval: 14, ease: 2.1 }),
            'ease=2.1 is below the Mastered threshold of 2.2'
        ).toBe(2);
    });

    it('returns 3 (Mastered) when all criteria are met', () => {
        expect(
            getWordMastery({ reviewCount: 5, interval: 21, ease: 2.3 }),
            'reviewCount>=5, interval>=21, ease>=2.3 should all qualify as Mastered'
        ).toBe(3);
    });

    it('returns 3 (Mastered) well above all thresholds', () => {
        expect(
            getWordMastery({ reviewCount: 20, interval: 60, ease: 2.8 }),
            'word reviewed many times with a long interval should be Mastered'
        ).toBe(3);
    });
});
