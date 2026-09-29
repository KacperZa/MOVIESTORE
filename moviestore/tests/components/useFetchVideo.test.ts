import useFetchVideo from '@/hooks/useFetchVideo';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, it, expect, describe, vi } from 'vitest'
import { createWrapper } from '../utils/createWrapper';

const mockFetch = vi.fn()
globalThis.fetch = mockFetch

describe('useFetchVideos', () => {
    beforeEach(() => {
        mockFetch.mockClear()
    });


    it('should call fetch from correct URL', async () => {

        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({})
        })

        const { result } = renderHook(() => 
            useFetchVideo({type: "movie", id: '123', enabled: true}),
            { wrapper: createWrapper() }
        )

        await waitFor(() =>
            expect(result.current)
        )

        expect(fetch).toHaveBeenCalledWith(
            `http://localhost:5000/movie/videos/123`,
            { method: 'GET' }
        );
        
    })

    it('should set isError when error occure', async () => {
        mockFetch.mockResolvedValueOnce({ok: false, status: 404})

        const { result } = renderHook(
            () => useFetchVideo({type: "movie", id: '123', enabled: true}),
            { wrapper: createWrapper() }
        );

        await waitFor(
            () => expect(result.current.isError).toBe(true)
        );
        expect(result.current.error?.message).toBe('HTTP error: 404')
    });

    it('should not fetch when enabled=false', () => {
        renderHook(
            () => useFetchVideo({type: "movie", id: "221", enabled: false}),
            { wrapper: createWrapper() }
        );

        expect(fetch).not.toHaveBeenCalled()
    });

    it('should not fetch when id is not provided', () => {
        renderHook(
            () => useFetchVideo({type: "movie", id: undefined, enabled: true}),
            { wrapper: createWrapper() }
        );

        expect(fetch).not.toHaveBeenCalled()
    })
})