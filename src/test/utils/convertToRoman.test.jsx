import { describe, it, expect } from 'vitest';
import { convertToRoman } from '../../utils/convertToRoman';

describe('convertToRoman', () => {
    it('returns empty string for numbers less than 1', () => {
        expect(convertToRoman(0), '0 is out of range and should return empty string').toBe('');
        expect(convertToRoman(-5), 'negative numbers are out of range and should return empty string').toBe('');
    });

    it('converts single digits correctly', () => {
        expect(convertToRoman(1), '1 → i').toBe('i');
        expect(convertToRoman(4), '4 uses subtractive notation → iv').toBe('iv');
        expect(convertToRoman(5), '5 → v').toBe('v');
        expect(convertToRoman(9), '9 uses subtractive notation → ix').toBe('ix');
    });

    it('converts tens correctly', () => {
        expect(convertToRoman(10), '10 → x').toBe('x');
        expect(convertToRoman(40), '40 uses subtractive notation → xl').toBe('xl');
        expect(convertToRoman(50), '50 → l').toBe('l');
    });

    it('converts compound numbers correctly', () => {
        expect(convertToRoman(14), '14 = x + iv → xiv').toBe('xiv');
        expect(convertToRoman(42), '42 = xl + ii → xlii').toBe('xlii');
        expect(convertToRoman(58), '58 = l + v + iii → lviii').toBe('lviii');
        expect(convertToRoman(89), '89 = lxxx + ix → lxxxix').toBe('lxxxix');
    });

    it('converts level numbers common in the app', () => {
        expect(convertToRoman(15), 'level 15 → xv').toBe('xv');
        expect(convertToRoman(20), 'level 20 → xx').toBe('xx');
    });
});
