import useFetchFavouriteIds from '@/hooks/useFetchFavouriteIds'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, it, expect, describe, vi } from 'vitest'
import { createWrapper } from '../utils/createWrapper'

const mockFetch = vi.fn()
globalThis.fetch = mockFetch

const mockData = [
    {
        _id: "testId",
        userId: "121232",
        mediaType: "tv",
        tmdbId: 1212,
        addedAt: "2021-12-03",
        __v: 0
    },
    {
        _id: "testId",
        userId: "121232",
        mediaType: "tv",
        tmdbId: 3232,
        addedAt: "2021-12-03",
        __v: 0
    }
]

describe('useFetchFavouriteIds', () => {
    beforeEach(() =>{
        vi.clearAllMocks()
    })

    it('should fetch favouriteIds for current user', async () => {
        mockFetch.mockReturnValueOnce({
            ok: true,
            status: 200,
            json: async () => mockData
        })

        const { result } = renderHook(() => 
            useFetchFavouriteIds({userId: "121232" }),
            { wrapper: createWrapper() }
        )

        await waitFor(() =>
            expect(result.current.isPending).toBe(false)
        )

        expect(result.current.data).toEqual(new Set([1212, 3232]))
    })

    it('should set isError when error occure', async () => {
        mockFetch.mockReturnValueOnce({
            ok: false,
            status: 404
        })

        const { result } = renderHook(() => 
            useFetchFavouriteIds({userId: "121232" }),
            { wrapper: createWrapper() }
        )

        await waitFor(() =>
            expect(result.current.isPending).toBe(false)
        )
        expect(result.current.error?.message).toBe('HTTP error: 404')
    })

    it('should call fetch from correct URL', async () => {
        mockFetch.mockReturnValue({
            ok: true,
            status: 200,
            json: async () => mockData
        })

        const { result  } = renderHook(() =>
            useFetchFavouriteIds({userId: "121232" }),
            { wrapper: createWrapper()}
        )

        await waitFor(() => 
            expect(result.current.isPending).toBe(false)
        )

        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:5000/favourite/ids/121232',
            { method: 'GET' }
        )
    })
})