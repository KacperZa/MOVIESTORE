import { useUser } from '@/context/useUser'
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, it, expect, describe, vi } from 'vitest'
import { createWrapper } from '../../utils/createWrapper'
import useAddHistory from '@/hooks/HistoryHooks/useAddHistory'
import type { HistoryPropsWithStatus } from '@/hooks/HistoryHooks/usePatchHistory'

const userData = {
    _id: '122',
    age: 12,
    creationDate: '2012-12-02',
    username: 'testname',
    email: 'testmail@op.pl',
    password: 'testpassword',
    __v: 0
}

const mockFetch = vi.fn()
globalThis.fetch = mockFetch

vi.mock('@/context/useUser', () => ({
    useUser: vi.fn()
}))

const fetchBody : HistoryPropsWithStatus = {
    tmdbId: 4, 
    userId: '122',  
    mediaType: "tv", 
    status: "watched"
}

describe('useAddHistory', () => {
    beforeEach(() => vi.clearAllMocks())

    it('should call fetch from correct URL', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({})
        })

        vi.mocked(useUser).mockResolvedValue({
            user: userData,
            setUser: vi.fn()
        })

        const { result } = renderHook(() => 
            useAddHistory(), { wrapper: createWrapper() }
        )

        act(() => {
            result.current.mutate(fetchBody)
        })

        await waitFor(() => expect(result.current.isPending).toBe(false))

        expect(fetch).toHaveBeenCalledWith('http://localhost:5000/history/122', 
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ 
                    mediaType: "tv", 
                    tmdbId: 4, 
                    status: "watched"
                })
            },
        )
    })

    it('should set isError and error when error occure', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false, 
            status: 404
        })

        vi.mocked(useUser).mockResolvedValue({
            user: userData,
            setUser: vi.fn()
        })

        const { result } = renderHook(() => 
            useAddHistory(), 
            { wrapper: createWrapper() }
        )

        act(() => result.current.mutate(fetchBody))

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe('HTTP error: 404')
    })
})