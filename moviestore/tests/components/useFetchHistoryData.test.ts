import useFetchHistoryData from '@/hooks/useFetchHistoryData'
import {   renderHook, waitFor } from '@testing-library/react'
import { beforeEach, it, expect, describe, vi } from 'vitest'
import { createWrapper } from '../utils/createWrapper'

const mockFetch = vi.fn()
globalThis.fetch = mockFetch

const mockData = [
    {
        userId: 123,
        mediaType: 'tv',
        tmdbId: 2122,
        status: "watched",
    },
    {
        userId: 123,
        mediaType: 'tv',
        tmdbId: 1122,
        status: "pending"
    }
]

describe('useFetchHistoryData', () => { 
    beforeEach(() =>
        vi.clearAllMocks()
    )

    it('should call fetch from correct URL', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({})
        })

        const { result } = renderHook(() => 
            useFetchHistoryData({ userId: "123"}),
            { wrapper: createWrapper()}
        )

        await waitFor(() => expect(result.current.isPending).toBe(false))

        expect(fetch).toHaveBeenCalledWith('http://localhost:5000/history/ids/123',
            { method: 'GET' }
        )
    })

    it('should set isError when error occure', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 404
        })

        const { result } = renderHook(() => 
            useFetchHistoryData({ userId: "123" }),
            { wrapper: createWrapper()}
        )

        await waitFor(() => expect(result.current.isPending).toBe(false))

        expect(result.current.error?.message).toBe('HTTP error: 404')
    })

    it('should not fetch when userId is not provided', () => {
        renderHook(() => useFetchHistoryData({ userId: undefined }), { wrapper: createWrapper()})

        expect(fetch).not.toHaveBeenCalled()
    })

    it('should transform fetched data into a map', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => mockData
        })

        const { result } = renderHook(() => 
            useFetchHistoryData({userId: '123'}),
            { wrapper: createWrapper()}
        )

        await waitFor(() => expect(result.current.isPending).toBe(false))

        expect(result.current.data).toEqual(new Map<number, string>([[2122, 'watched'], [1122, "pending"]]))
    })
})