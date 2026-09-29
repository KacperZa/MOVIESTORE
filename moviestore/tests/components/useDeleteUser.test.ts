import { useUser } from '@/context/useUser'
import useDeleteUser from '@/hooks/useDeleteUser'
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, it, expect, describe, vi } from 'vitest'
import routerWrapper from '../utils/routerWrapper'
import { useNavigate } from 'react-router-dom'

const mockFetch = vi.fn()
globalThis.fetch = mockFetch

vi.mock('@/context/useUser', () => ({
    useUser: vi.fn()
}))

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>()
    return {
        ...actual,
        useNavigate: vi.fn()
    }
})

const userData = {
    age: 12,
    _id: '122',
    creationDate: '2012-12-02',
    username: 'testname',
    email: 'testmail@op.pl',
    password: 'testpassword',
    __v: 0
}



describe('useDeleteUser', () => {
    const mockNavigate = vi.fn()
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(useNavigate).mockReturnValue(mockNavigate)
    })

    it('should call fetch with correct URL', async () => {
        
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
            useDeleteUser(),
            { wrapper: routerWrapper }
        )

        await act(async () => {
            result.current.deleteUser()
        })
    
        await waitFor(() => expect(result.current.loading).toBe(false))
    
        expect(fetch).toHaveBeenCalledWith('http://localhost:5000/profile/delete/122',
            { method: 'DELETE' }
        )
    })

    it('should set Error state when error occure', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            json: async () => ({})
        })

        vi.mocked(useUser).mockReturnValue({
            user: userData,
            setUser: vi.fn()
        })

        const { result } = renderHook(() => 
            useDeleteUser(),
            { wrapper: routerWrapper }
        )

        await act(async () => {
            result.current.deleteUser()
        })

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(result.current.error).toBe('HTTP error: 404')
    })

    it('should set user to null', async () => {

        const mockSetUser = vi.fn()
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({})
        })

        vi.mocked(useUser).mockReturnValue({
            user: userData,
            setUser: mockSetUser
        })

        const { result } = renderHook(() =>
            useDeleteUser(),
            { wrapper: routerWrapper }
        )

        await act(async () => {
            result.current.deleteUser()
        })

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(mockSetUser).toHaveBeenCalledWith(null)
    })

    it('should navigate to `/` route', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({})
        })

        vi.mocked(useUser).mockReturnValue({
            user: userData,
            setUser: vi.fn()
        })

        const mockNavigate = vi.fn()

        vi.mocked(useNavigate).mockReturnValue(mockNavigate)

        const { result } = renderHook(() => 
            useDeleteUser(),
            { wrapper: routerWrapper}
        )

        await waitFor(() => expect(result.current.loading).toBe(false))

        await act(() =>
            result.current.deleteUser()
        )

        expect(mockNavigate).toHaveBeenCalledWith('/')
    })
})