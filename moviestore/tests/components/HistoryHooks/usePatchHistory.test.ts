import { useUser } from '@/context/useUser'
import usePatchHistory, { type PatchHistoryProps } from '@/hooks/HistoryHooks/usePatchHistory'
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, it, expect, describe, vi } from 'vitest'
import { createWrapper } from '../../utils/createWrapper'

const userData = {
    _id: '122',
    age: 12,
    creationDate: '2012-12-02',
    username: 'testname',
    email: 'testmail@op.pl',
    password: 'testpassword',
    __v: 0
}

const fetchData : PatchHistoryProps = {
    mediaType: 'tv',
    tmdbId: 4, 
    status: 'pending'
}

const mockFetch = vi.fn()
globalThis.fetch = mockFetch

vi.mock('@/context/useUser', () => ({
    useUser: vi.fn()
}))

describe('usePatchHistory', () => {
    beforeEach(() => vi.clearAllMocks)

    it('should call fetch from correct URL', async() => {
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
            usePatchHistory(), 
            { wrapper: createWrapper()}
        )

        act(() => result.current.mutate(fetchData))

        await waitFor(() => expect(result.current.isPending).toBe(false))

        expect(fetch).toHaveBeenCalledWith('http://localhost:5000/history/4', 
            {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(fetchData)
            }
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
            usePatchHistory(),
            { wrapper: createWrapper() }
        )

        act(() => result.current.mutate(fetchData))

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe('HTTP error: 404')
    })
})