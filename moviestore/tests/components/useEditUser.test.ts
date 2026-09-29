import { useUser } from '@/context/useUser'
import useEditUser from '@/hooks/useEditUser'
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, it, expect, describe, vi } from 'vitest'

const mockUser = () => {
    vi.mocked(useUser).mockReturnValue({
        user: userData,
        setUser: vi.fn()
    })
}

const mockFetch = vi.fn()
globalThis.fetch = mockFetch



const userData = {
    age: 12,
    _id: '122',
    creationDate: '2012-12-02',
    username: 'testname',
    email: 'testmail@op.pl',
    password: 'testpassword',
    __v: 0
}

const editPayload = {
    username: 'Kacper',
    email: 'akcper123@op.pl',
    age: 12,
    password: 'testpassword'
}

vi.mock('@/context/useUser', () =>({
    useUser: vi.fn()
}))

describe('useEditUser', () => {
    beforeEach(() =>
        vi.clearAllMocks()
    )

    it('should call fetch from correct URL', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => userData
        })

        mockUser()

        const { result } = renderHook(() => useEditUser())

        await act(() => {
            result.current.editUser(editPayload)
        })

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(fetch).toHaveBeenCalledWith('http://localhost:5000/profile/122', 
            { 
                method: 'PATCH', 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(editPayload)
            }
            
        )
    })

    it.each([
        { username: null, email: 'testmail123@op.pl', age: 12, password: 'testpassword'},
        { username: 'Kacper', email: null, age: 12, password: 'testpassword'},
        { username: 'Kacper', email: 'testmail123@op.pl', age: null, password: 'testpassword'},
        { username: 'Kacper', email: 'testmail123@op.pl', age: 12, password: null}
    ])('should call fetch from with payload %o', async (payload) => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => userData
        })

        mockUser()

        const { result } = renderHook(() => useEditUser())

        await act(() => {
            result.current.editUser(payload)
        })

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(fetch).toHaveBeenCalledWith('http://localhost:5000/profile/122', 
            { method: 'PATCH', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        }
            
        )
    })

    it('should set error state when error occure', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            json: async () => ({} )
        })
        mockUser()

        const { result } = renderHook(() => useEditUser())

        act(() => {
            result.current.editUser(editPayload)
        })

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(result.current.error).toEqual('HTTP error: 404')
    })


})