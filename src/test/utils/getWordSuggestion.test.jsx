import { describe, it, expect, vi, beforeEach } from 'vitest';
import Typo from 'typo-js';
import getWordSuggestion from '../../utils/getWordSuggestion';

vi.mock('typo-js', () => {
    return {
        default: vi.fn(),
    };
});

describe('getWordSuggestion', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('creates dictionary with expected language and path', () => {
        const mockCheck = vi.fn().mockReturnValue(true);
        const mockSuggest = vi.fn();

        Typo.mockImplementation(function () {
            return {
                check: mockCheck,
                suggest: mockSuggest,
            };
        });

        getWordSuggestion('hello', vi.fn());

        expect(
            Typo,
            'should initialise the en_US dictionary from the /dictionaries path'
        ).toHaveBeenCalledWith('en_US', false, false, {
            dictionaryPath: '/dictionaries',
        });
    });

    it('calls setSuggestedWords when word is a mistake', () => {
        const setSuggestedWords = vi.fn();
        const suggestions = ['hello', 'help'];

        Typo.mockImplementation(function () {
            return {
                check: vi.fn().mockReturnValue(false),
                suggest: vi.fn().mockReturnValue(suggestions),
            };
        });

        getWordSuggestion('hlelo', setSuggestedWords);

        expect(
            setSuggestedWords,
            'should call the setter with the array of suggestions when the word fails the spell check'
        ).toHaveBeenCalledWith(suggestions);
        expect(
            setSuggestedWords,
            'setter should be called exactly once per invocation'
        ).toHaveBeenCalledTimes(1);
    });

    it('does not call setSuggestedWords when word is correct', () => {
        const setSuggestedWords = vi.fn();
        const suggest = vi.fn();

        Typo.mockImplementation(function () {
            return {
                check: vi.fn().mockReturnValue(true),
                suggest,
            };
        });

        getWordSuggestion('hello', setSuggestedWords);

        expect(suggest, 'suggest() should not be called when the word passes the spell check').not.toHaveBeenCalled();
        expect(setSuggestedWords, 'setter should not be called for a correctly spelled word').not.toHaveBeenCalled();
    });
});
