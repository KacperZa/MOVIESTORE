import { useMovieGenres } from '@/context/useMovieGenres'
import { useTvGenres } from '@/context/useTvGenres'
import useGenreSection from '@/hooks/useGenreSection'
import { act, render, waitFor } from '@testing-library/react'
import { beforeEach, it, expect, describe, vi } from 'vitest'
import { createWrapper } from '../utils/createWrapper'
import type { GenreSectionProps } from '@/PagesComponents/HomePageComponents/GenreSection'

const mockFetch = vi.fn()
globalThis.fetch = mockFetch

vi.mock('@/context/useTvGenres', () =>({
    useTvGenres: vi.fn()
}))
vi.mock('@/context/useMovieGenres', () =>({
    useMovieGenres: vi.fn()
}))

// mocking IntersectionObserver
let observerCallback: IntersectionObserverCallback
let observerInstance: IntersectionObserver

const mockObserve = vi.fn()
const mockUnobserve = vi.fn()

window.IntersectionObserver = vi.fn().mockImplementation( function(callback: IntersectionObserverCallback )  {
    observerCallback = callback
    observerInstance = {
        observe: mockObserve,
        unobserve: mockUnobserve,
        disconnect: vi.fn(),
        takeRecords: vi.fn(() => [])
    } as unknown as IntersectionObserver
    return observerInstance
})

function TestComponent(props: GenreSectionProps) {
    const { ref, data, error, isError } = useGenreSection(props)
    return (
        <div>
            <div ref={ref} data-testid="target" />
            <span data-testid="error-msg">{isError ? ' error' : 'ok'}</span>
            <span data-testid="status">{error?.message ?? ''}</span>
            <span data-testid="count">{data?.length ?? 0}</span>
        </div>
    )
}

describe('useGenreSection', () => {
    beforeEach(() => vi.clearAllMocks())

    it('should call fetch from correct URL', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({ results: [{ id: 2 }, { id: 3 }]})
        })


        vi.mocked(useTvGenres).mockReturnValue({
            tvGenres: [{ id: 12, name: 'Action' }],
            isPending: false
        })
        
        vi.mocked(useMovieGenres).mockReturnValue({
            movieGenres: [{ id: 13, name: 'Action' }],
            isPending: false
        })

        const { getByTestId } = render(<TestComponent genreId={12} type='tv' />, {
            wrapper: createWrapper()
        });

        const el = getByTestId('target')

        expect(mockObserve).toHaveBeenCalledWith(el)

        act(() => {
            observerCallback(
                [{ isIntersecting: true, target: el } as unknown as IntersectionObserverEntry], 
                observerInstance
            )
        })

        expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/tv/12', 
            { method: 'GET'}
        )

        waitFor(() => expect(getByTestId('count')).toHaveTextContent('2'))

        expect(getByTestId('error-msg')).toHaveTextContent('ok')

        expect(fetch).toHaveBeenCalledTimes(1)

    })

    it('should not call fetch when is not in view', () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({ results: []})
        })


        vi.mocked(useTvGenres).mockReturnValue({
            tvGenres: [{ id: 12, name: 'Action' }],
            isPending: false
        })
        
        vi.mocked(useMovieGenres).mockReturnValue({
            movieGenres: [{ id: 13, name: 'Action' }],
            isPending: false
        })

        const { getByTestId } = render(<TestComponent genreId={12} type='tv' />, {
            wrapper: createWrapper()
        });

        const el = getByTestId('target')

        expect(mockObserve).toHaveBeenCalledWith(el)

        act(() => {
            observerCallback(
                [{ isIntersecting: false, target: el } as unknown as IntersectionObserverEntry], 
                observerInstance
            )
        })

        expect(fetch).not.toHaveBeenCalled()

    })

    it('should set error states when error occure', () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            json: async () => ({ results: [{ id: 2 }, { id: 3 }]})
        })


        vi.mocked(useTvGenres).mockReturnValue({
            tvGenres: [{ id: 12, name: 'Action' }],
            isPending: false
        })
        
        vi.mocked(useMovieGenres).mockReturnValue({
            movieGenres: [{ id: 13, name: 'Action' }],
            isPending: false
        })

        const { getByTestId,  } = render(<TestComponent genreId={12} type='tv' />, {
            wrapper: createWrapper()
        });

        const el = getByTestId('target')

        expect(mockObserve).toHaveBeenCalledWith(el)

        act(() => {
            observerCallback(
                [{ isIntersecting: false, target: el } as unknown as IntersectionObserverEntry], 
                observerInstance
            )
        })

        waitFor(() => expect(getByTestId('status')).toHaveTextContent('error'))
        expect(getByTestId('')) 
        
    })
})