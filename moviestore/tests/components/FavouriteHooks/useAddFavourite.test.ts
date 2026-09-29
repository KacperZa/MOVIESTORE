import { useUser } from '@/context/useUser'
import useAddFavourite from '@/hooks/FavouriteHooks/useAddFavourite'
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

const mockFetch = vi.fn()
globalThis.fetch = mockFetch

vi.mock('@/context/useUser', () => ({
    useUser: vi.fn()
}))

describe('useAddFavourite', () => {
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
            useAddFavourite(),
            { wrapper: createWrapper()} 
        )

        act(() => result.current.mutate({ userId: '122', id: 4, type: "tv"}))

        await waitFor(() => expect(result.current.isPending).toBe(false))

        expect(fetch).toHaveBeenCalledWith('http://localhost:5000/favourite/122', 
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    mediaType: 'tv',
                    tmdbId: 4
                })
            }
        )
    })

    it('should set error and isError when error occure', async () => {
        mockFetch.mockReturnValueOnce({
            ok: false,
            status: 404
        })

        vi.mocked(useUser).mockReturnValue({
            user: userData,
            setUser: vi.fn()
        })

        const { result } = renderHook(() => 
            useAddFavourite(),
            { wrapper: createWrapper() }
        )

        act(() => result.current.mutate({ userId: '122', id: 4, type: "tv"}))

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe('HTTP error: 404')
    })
})