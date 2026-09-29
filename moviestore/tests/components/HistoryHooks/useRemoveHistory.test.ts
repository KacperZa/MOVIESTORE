import { beforeEach, it, expect, describe, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import useRemoveHistory from '@/hooks/HistoryHooks/useRemoveHistory'
import { createWrapper } from '../../utils/createWrapper'
import { useUser } from '@/context/useUser'

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

describe('useRemoveHistory', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

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
            useRemoveHistory(), { wrapper: createWrapper() }
        )

        act(() => {
            result.current.mutate({ id: 5})
        })

        await waitFor(() => expect(result.current.isPending).toBe(false))

        expect(fetch).toHaveBeenCalledWith('http://localhost:5000/history/5', 
            {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'}
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
            useRemoveHistory(), { wrapper: createWrapper() }
        )

        act(() => {
            result.current.mutate({ id: 5 })
        })

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe('HTTP error: 404')
    })


})