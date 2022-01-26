import { act, renderHook } from '@testing-library/react-hooks';

import useScript from '../useScript';

describe('#useScript', () => {
    it('returns idle if script not provided', () => {
        const { result } = renderHook(() => useScript(null));

        expect(result.current).toBe('idle');
    });

    it('returns different status if script is provided', () => {
        const src = 'https://test.com';
        const { result } = renderHook(() => useScript(src));

        expect(result.current).toBe('loading');

        // Test Error event
        const documentScriptLoading = document.querySelector(
            'script[data-status="loading"]'
        );

        act(() => {
            const event = new Event('error');
            documentScriptLoading.dispatchEvent(event);
        });

        expect(result.current).toBe('error');

        // Test Loading event
        const documentScriptError = document.querySelector(
            'script[data-status="error"]'
        );

        act(() => {
            const event = new Event('load');
            documentScriptError.dispatchEvent(event);
        });

        expect(result.current).toBe('ready');

        // Test loading already loaded script
        const { result: result2 } = renderHook(() => useScript(src));

        expect(result2.current).toBe('ready');
    });
});
