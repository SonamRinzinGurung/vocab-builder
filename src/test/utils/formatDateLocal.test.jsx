import { describe, it, expect } from 'vitest';
import { formatDateLocal } from '../../utils/formatDateLocal';

describe('formatDateLocal', () => {
    it('formats a date in YYYY-MM-DD format', () => {
        const date = new Date(2025, 0, 15); // Jan 15, 2025
        expect(formatDateLocal(date), 'Jan 15 2025 should format as 2025-01-15').toBe('2025-01-15');
    });

    it('zero-pads single-digit months', () => {
        const date = new Date(2025, 2, 5); // Mar 5, 2025
        expect(formatDateLocal(date), 'month 3 should be padded to "03", not "3"').toBe('2025-03-05');
    });

    it('zero-pads single-digit days', () => {
        const date = new Date(2024, 11, 1); // Dec 1, 2024
        expect(formatDateLocal(date), 'day 1 should be padded to "01", not "1"').toBe('2024-12-01');
    });

    it('handles December correctly (month index 11)', () => {
        const date = new Date(2025, 11, 31); // Dec 31, 2025
        expect(formatDateLocal(date), 'JS month index 11 should map to calendar month 12').toBe('2025-12-31');
    });

    it('produces a string matching YYYY-MM-DD pattern', () => {
        const date = new Date(2025, 5, 20);
        expect(formatDateLocal(date), 'output should always match the YYYY-MM-DD ISO-like format').toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
});
