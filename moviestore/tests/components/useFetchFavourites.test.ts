import { useUser } from "@/context/useUser";
import useFetchFavourites from "@/hooks/useFetchFavourites";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, it, expect, describe, vi } from 'vitest'
import { createWrapper } from "../utils/createWrapper";

const userData = {
    age: 12,
    _id: '122',
    creationDate: '2012-12-02',
    username: 'testname',
    email: 'testmail@op.pl',
    password: 'testpassword',
    __v: 0
}

vi.mock('@/context/useUser', () => ({
    useUser: vi.fn()
}))

const mockFetch = vi.fn()
globalThis.fetch = mockFetch

describe('useFetchFavourites', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    });


    it('should set isError when error occure', async () => {

        mockFetch.mockResolvedValueOnce({ ok: false, status: 404})

        vi.mocked(useUser).mockReturnValue({
            user: userData,
            setUser: vi.fn()
        })

        const { result } = renderHook(() => 
            useFetchFavourites(),
            { wrapper: createWrapper()}
        )

        await waitFor(() =>
            expect(result.current.isPending).toBe(false)
        )

        expect(result.current.error?.message).toBe('HTTP error: 404')
    })

    it('should call fetch from correct URL', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({})
        })

        vi.mocked(useUser).mockReturnValue({
            user: userData,
            setUser: vi.fn()
        })

        const { result } = renderHook(() => 
            useFetchFavourites(),
            { wrapper: createWrapper() }
        )

        await waitFor(() =>
            expect(result.current.isPending).toBe(false)
        )

        expect(fetch).toHaveBeenCalledWith('http://localhost:5000/favourite/122', { method: 'GET' })
    })

    it('should not fetch when user is not logged in', () => {
        vi.mocked(useUser).mockReturnValue({
            user: null,
            setUser: vi.fn(),
        })

        renderHook(
            () => useFetchFavourites(),
            { wrapper: createWrapper() }
        )
        expect(fetch).not.toHaveBeenCalled()
    })
})