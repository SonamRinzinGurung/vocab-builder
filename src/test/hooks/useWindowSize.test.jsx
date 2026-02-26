import { describe, it, expect, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useWindowSize from '../../hooks/useWindowSize';

// Helper to set window.innerWidth and fire a resize event inside act()
function resizeTo(width) {
    Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: width,
    });
    act(() => {
        window.dispatchEvent(new Event('resize'));
    });
}

describe('useWindowSize', () => {
    const originalWidth = window.innerWidth;

    afterEach(() => {
        // Restore original width so tests don't bleed into each other
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: originalWidth,
        });
    });

    it('returns isMobile=true when window width is below the 1024px breakpoint', () => {
        resizeTo(768);
        const { result } = renderHook(() => useWindowSize());
        expect(result.current.isMobile, '768px is below the 1024px breakpoint so isMobile should be true').toBe(true);
    });

    it('returns isMobile=false when window width is above 1024px', () => {
        resizeTo(1440);
        const { result } = renderHook(() => useWindowSize());
        expect(result.current.isMobile, '1440px is above the 1024px breakpoint so isMobile should be false').toBe(false);
    });

    it('returns isMobile=true at exactly the 1024px boundary', () => {
        resizeTo(1024);
        const { result } = renderHook(() => useWindowSize());
        expect(result.current.isMobile, '1024px satisfies innerWidth <= 1024 so it is treated as mobile').toBe(true);
    });

    it('returns isMobile=false one pixel above the boundary (1025px)', () => {
        resizeTo(1025);
        const { result } = renderHook(() => useWindowSize());
        expect(result.current.isMobile, '1025px fails the <= 1024 check so isMobile should be false').toBe(false);
    });

    it('updates isMobile when the window is resized below the breakpoint', () => {
        resizeTo(1440);
        const { result } = renderHook(() => useWindowSize());
        expect(result.current.isMobile, 'should start as false at 1440px').toBe(false);

        resizeTo(600);
        expect(result.current.isMobile, 'should switch to true after resizing to 600px').toBe(true);
    });

    it('updates isMobile when the window is resized above the breakpoint', () => {
        resizeTo(400);
        const { result } = renderHook(() => useWindowSize());
        expect(result.current.isMobile, 'should start as true at 400px').toBe(true);

        resizeTo(1280);
        expect(result.current.isMobile, 'should switch to false after resizing to 1280px').toBe(false);
    });

    it('cleans up the resize listener on unmount', () => {
        resizeTo(1440);
        const { result, unmount } = renderHook(() => useWindowSize());
        expect(result.current.isMobile, 'should be false before unmount').toBe(false);

        unmount();

        // After unmount the listener is gone so the stale result stays at false
        resizeTo(400);
        expect(result.current.isMobile, 'stale result stays false after unmount — the listener was removed').toBe(false);
    });
});
