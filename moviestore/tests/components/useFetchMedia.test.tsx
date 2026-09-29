import { beforeEach, afterEach, it, expect, describe, vi } from 'vitest'
import nock from 'nock'
import { act, renderHook, waitFor } from '@testing-library/react'
import useFetchMedia from '@/hooks/useFetchMedia'
import { useTvGenres } from "@/context/useTvGenres";
import { useMovieGenres } from "@/context/useMovieGenres";
import axios from 'axios'
import routerWrapper from '../utils/routerWrapper'

const generateMockedApiResponse = (page : number) => {
    return {
        total_pages: 3,
        results: [
            {id: page * 10 + 1, title: `Movie ${page}-1`, genre_ids: [123]},
            {id: page * 20 + 1, title: `Movie ${page}-2`, genre_ids: [123]}
        ]
    }
}

const generateExpectedPage = (page : number) => {
    return {
        nextPage: page < 3 ? page + 1 : null,
        filmyZGatunkami: generateExpectedFilms(page)
    }
}

const generateExpectedFilms = (page: number) => {
    return [
        {id: page * 10 + 1, title: `Movie ${page}-1`, genre_ids: [123], gatunki: ['testname']},
        {id: page * 20 + 1, title: `Movie ${page}-2`, genre_ids: [123], gatunki: ['testname']}
    ]
}

vi.mock('@/context/useTvGenres', () => ({
    useTvGenres: vi.fn()
}))

vi.mock('@/context/useMovieGenres', () => ({
    useMovieGenres: vi.fn()
}))


describe('useFetchMedia', async () => {

    
    beforeEach(() => {
        nock.disableNetConnect()
        axios.defaults.baseURL = 'http://localhost:5000'
    })

    afterEach(() => {
        nock.cleanAll()
        nock.enableNetConnect()
    })
    it('should fetch next page and glue it to the previous one when fetchNextPage is used', async () => {

        vi.mocked(useTvGenres).mockReturnValue({
            tvGenres: [{ id: 123, name: "testname"}],
            isPending: false,
        })

        vi.mocked(useMovieGenres).mockReturnValue({
            movieGenres: [{ id: 123, name: "testname"}],
            isPending: false,
        })
        
        const expectation = nock('http://localhost:5000')
            .persist()
            .get('/api/tv')
            .query(true)
            .reply(200, (uri) => {
                const url = new URL(`http://localhost:5000${uri}`)
                const { page } = Object.fromEntries(url.searchParams)
                return generateMockedApiResponse(Number(page))
            })
        
            const mockParams = {
                customType: 'tv', 
                page: 1, 
                search: 'batman',
                filters: undefined, 
                adultFilms: false,
                genreHolder: undefined, 
                signal: new AbortController().signal
            }
        
        const { result } = renderHook(
            () => useFetchMedia(mockParams),
            { wrapper: routerWrapper })

        await waitFor(() => expect(result.current.isPending).toBe(false))

        expect(result.current.films).toStrictEqual(generateExpectedFilms(1))

        await act(async () => {
            await result.current.fetchNextPage()
        })

        await waitFor(() => 
            expect(result.current.data?.pages).toStrictEqual([
                generateExpectedPage(1),
                generateExpectedPage(2),
            ]),    
        )

        expect(result.current.films).toStrictEqual([
            ...generateExpectedFilms(1),
            ...generateExpectedFilms(2),
        ])

        expectation.done()
    })

    it('should fetch and transform media with genres', () => {
        nock('http://localhost:5000')
        .get('/api/tv?')
    })
    
})

