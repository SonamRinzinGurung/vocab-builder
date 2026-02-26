import { describe, it, expect, vi } from 'vitest';
import { renderHook, fireEvent } from '@testing-library/react';
import useKeyPress from '../../hooks/useKeyPress';

describe('useKeyPress', () => {
    it('calls the callback when the matching key is pressed', () => {
        const callback = vi.fn();
        renderHook(() => useKeyPress('/', callback));

        fireEvent.keyDown(document, { key: '/' });

        expect(callback, 'callback should fire exactly once when the registered key is pressed').toHaveBeenCalledTimes(1);
    });

    it('passes the keyboard event to the callback', () => {
        const callback = vi.fn();
        renderHook(() => useKeyPress('Enter', callback));

        fireEvent.keyDown(document, { key: 'Enter' });

        expect(callback, 'callback should receive the native keyboard event object').toHaveBeenCalledWith(
            expect.objectContaining({ key: 'Enter' })
        );
    });

    it('does not call the callback for a different key', () => {
        const callback = vi.fn();
        renderHook(() => useKeyPress('/', callback));

        fireEvent.keyDown(document, { key: 'Escape' });
        fireEvent.keyDown(document, { key: 'Enter' });
        fireEvent.keyDown(document, { key: 'a' });

        expect(callback, 'callback should not fire when unregistered keys are pressed').not.toHaveBeenCalled();
    });

    it('calls the callback multiple times for repeated key presses', () => {
        const callback = vi.fn();
        renderHook(() => useKeyPress('k', callback));

        fireEvent.keyDown(document, { key: 'k' });
        fireEvent.keyDown(document, { key: 'k' });
        fireEvent.keyDown(document, { key: 'k' });

        expect(callback, 'each individual key press should trigger the callback independently').toHaveBeenCalledTimes(3);
    });

    it('stops responding after unmount (event listener is cleaned up)', () => {
        const callback = vi.fn();
        const { unmount } = renderHook(() => useKeyPress('/', callback));

        unmount();
        fireEvent.keyDown(document, { key: '/' });

        expect(callback, 'the event listener should be removed on unmount so the callback never fires').not.toHaveBeenCalled();
    });

    it('uses the latest callback without re-attaching the listener', () => {
        // The hook stores callback in a ref so swapping it via rerender takes effect immediately
        // without needing to remove and re-add the document listener.
        const first = vi.fn();
        const second = vi.fn();

        const { rerender } = renderHook(({ cb }) => useKeyPress('/', cb), {
            initialProps: { cb: first },
        });

        rerender({ cb: second });
        fireEvent.keyDown(document, { key: '/' });

        expect(first, 'the stale first callback should not be called after rerender').not.toHaveBeenCalled();
        expect(second, 'the updated second callback should be called after rerender').toHaveBeenCalledTimes(1);
    });
});
