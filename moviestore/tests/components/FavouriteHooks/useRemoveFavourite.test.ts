import { useUser } from '@/context/useUser'
import useRemoveFavourite from '@/hooks/FavouriteHooks/useRemoveFavourite'
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

describe('useRemoveFavourite', () => {
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
            useRemoveFavourite(),
            { wrapper: createWrapper()} 
        )

        act(() => result.current.mutate({ id: 12 }))

        await waitFor(() => expect(result.current.isPending).toBe(false))

        expect(fetch).toHaveBeenCalledWith('http://localhost:5000/favourite/12', 
            {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'}
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
            useRemoveFavourite(),
            { wrapper: createWrapper() }
        )

        act(() => result.current.mutate({ id: 12 }))

        await waitFor(() => expect(result.current.isError).toBe(true))
        
        expect(result.current.error?.message).toBe('HTTP error: 404')
    })

})