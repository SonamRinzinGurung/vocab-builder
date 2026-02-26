import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import useSetTitle from '../../hooks/useSetTitle';

describe('useSetTitle', () => {
    const ORIGINAL_TITLE = 'original title';

    beforeEach(() => {
        document.title = ORIGINAL_TITLE;
    });

    it('sets document.title to the given title on mount', () => {
        renderHook(() => useSetTitle('My Page'));
        expect(document.title, 'document.title should reflect the title passed to the hook').toBe('My Page');
    });

    it('updates document.title when the title argument changes', () => {
        const { rerender } = renderHook(({ t }) => useSetTitle(t), {
            initialProps: { t: 'First' },
        });
        expect(document.title, 'initial title should be set on first render').toBe('First');

        rerender({ t: 'Second' });
        expect(document.title, 'title should update when the prop changes').toBe('Second');
    });

    it('restores the original title on unmount when prevailOnUnmount is false (default)', () => {
        const { unmount } = renderHook(() => useSetTitle('Temporary'));
        expect(document.title, 'title should change while the hook is mounted').toBe('Temporary');

        unmount();
        expect(document.title, 'title should revert to the pre-mount value after unmount').toBe(ORIGINAL_TITLE);
    });

    it('keeps the title after unmount when prevailOnUnmount is true', () => {
        const { unmount } = renderHook(() => useSetTitle('Sticky', true));
        unmount();
        expect(document.title, 'title should persist after unmount when prevailOnUnmount=true').toBe('Sticky');
    });

    it('handles an empty string title', () => {
        renderHook(() => useSetTitle(''));
        expect(document.title, 'empty string should be a valid title value').toBe('');
    });
});
