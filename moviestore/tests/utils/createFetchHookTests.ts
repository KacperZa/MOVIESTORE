import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, it, expect, describe, vi } from 'vitest'
import { createWrapper } from '../utils/createWrapper';


interface FetchHookTestConfig<TParams, TData> {
    hookName: string,
    useHook: (params: TParams) => { isPending: boolean; isError: boolean; error: Error | null; data: TData | null | undefined}
    validParams: TParams,
    expectedUrl: string,
}

export const createFetchHookTests = <TParams, TData>({ hookName, useHook, validParams, expectedUrl } : FetchHookTestConfig<TParams, TData>) => {
    const mockFetch = vi.fn()
    globalThis.fetch = mockFetch
    
    describe(`${hookName}`, () => {
        beforeEach(() =>  mockFetch.mockClear());
    

        it(`${hookName}: should call fetch with correct URL`, async () => {

            mockFetch.mockResolvedValue({
                ok: true,
                status: 200,
                json: async () => ({})
            })

            const { result } = renderHook(() =>
                useHook(validParams),
                { wrapper: createWrapper() }
            )

            await waitFor(() => 
                expect(result.current.isPending).toBe(true)
            )
            
            expect(fetch).toHaveBeenCalledWith(expectedUrl, { method: 'GET'})
        });
    
        it(`${hookName}: should set isError when error occure`, async () => {
            mockFetch.mockResolvedValueOnce({ok: false, status: 404})
    
            const { result } = renderHook(
                () => useHook(validParams),
                { wrapper: createWrapper() }
            );
    
            await waitFor(
                () => expect(result.current.isError).toBe(true)
            );
            expect(result.current.error?.message).toBe('HTTP error: 404')
        });
    })
}