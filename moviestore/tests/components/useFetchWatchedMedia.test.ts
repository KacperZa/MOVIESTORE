import { useUser } from "@/context/useUser";
import useFetchWatchedMedia from "@/hooks/useFetchWatchedMedia";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createWrapper } from "../utils/createWrapper";

const userData = {
    age: 12,
    _id: '123',
    creationDate: '2012-02-01',
    username: 'testUser',
    email: 'testmail@123.op.pl',
    password: 'testpass',
    __v: 0
}

vi.mock('@/context/useUser', () => ({
    useUser: vi.fn()
}))

const mockFetch = vi.fn()
globalThis.fetch = mockFetch

describe('useFetchWatchedMedia', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should set isError when error occure', async () => {

        mockFetch.mockResolvedValueOnce({ ok: false, status: 404})
        // mock user context
        vi.mocked(useUser).mockReturnValue({
            user: userData,
            setUser: vi.fn()
        })

        const { result } = renderHook(() => 
            useFetchWatchedMedia(),
            { wrapper: createWrapper() }
        )

        await waitFor(() => expect(result.current.isPending).toBe(false))

        expect(result.current.error?.message).toBe('HTTP error: 404')
    })

    it('should call fetch from correct URL', async() => {

        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({})
        })

        vi.mocked(useUser).mockReturnValueOnce({
            user: userData,
            setUser: vi.fn()
        })

        const { result } = renderHook(() => 
            useFetchWatchedMedia(),
            { wrapper: createWrapper() }
        )

        await waitFor(() => expect(result.current.isPending).toBe(false))

        expect(fetch).toHaveBeenCalledWith('http://localhost:5000/history/123', { method: 'GET'})
    })

    it('should not fetch data when user is not logged in', () => {
        vi.mocked(useUser).mockReturnValue({
            user: null,
            setUser: vi.fn()
        })

        renderHook(
            () => useFetchWatchedMedia(),
            { wrapper: createWrapper() }
        )

        expect(fetch).not.toHaveBeenCalled()
    })
})