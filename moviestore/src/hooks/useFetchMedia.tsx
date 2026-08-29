import { useContext, useEffect, useMemo } from 'react'
import axios from 'axios';
import { MovieGenreContext, type MovieGenres } from '../context/MovieGenreContext'
import { TvGenreContext, type TvGenres } from '../context/TvMovieGenreContext'
import { useParams, useSearchParams } from 'react-router-dom'
import type { Films, FilmsWithGenres } from '@/ui/MediaCard';
import type { FilterItem } from '@/ui/Filters';
import { useInfiniteQuery } from '@tanstack/react-query';




  export interface Genres {
    id: number
    name: string
  }

  interface Props {
    search?: string,
    page?: number, 
    id_genre?: string,
    filters?: FilterItem | undefined,
    adultFilms?: boolean
    setPage?: (page: number) => void
    customType?: string
  }

  interface fetchMediaProps {
    type: string, 
    id_genre?: string
    search?: string,
    page: number,
    filters: FilterItem | undefined,
    adultFilms?: boolean,
    genreHolder: MovieGenres[] | TvGenres[] | null
    signal: AbortSignal
  }

  export interface FetchMediaResults {
    filmyZGatunkami: FilmsWithGenres[],
    nextPage: number | null
  }

const fetchMedia = async ({type, id_genre, search, page, filters, adultFilms, genreHolder, signal} : fetchMediaProps): Promise<FetchMediaResults> =>{
    
    // if (!genreHolder || (genreHolder as Genres[]).length === 0) return;
      let data;

      if(id_genre){
        const res = await axios.get(
          `/api/${type}/${id_genre}?${search ? `keywords=${search}` : ''}&page=${page}${filters ? `&filters=${filters.value}` : ''}&adult=${adultFilms}`,
          { signal }
        )  
        data = res.data            
      }else {
        const res = await axios.get(
          `${type === 'tv' ? '/api/tv' : '/api'}?${search ? `keywords=${search}` : ''}&page=${page}${filters ? `&filters=${filters.value}` : ''}&adult=${adultFilms}`,
          { signal }
        )
        data = res.data
      }
      // const hasMore = data.total_pages > page

      const filmy = data.results
      // console.log(filmy)
    
      const genreMap: Record<number, string> = {};
      (genreHolder as Genres[]).forEach(g => genreMap[g.id] = g.name);
    
      const filmyZGatunkami: FilmsWithGenres[] = (filmy as Films[]).map(film => ({
        ...film, 
        gatunki: film.genre_ids?.map((id: number) => genreMap[id] ?? 'Unknown')
      }));

      return {
        filmyZGatunkami,
        nextPage: data.total_pages > page ? page + 1 : null
      }

      // if(setPage && page) {

      //   setFilms(prev => {
      //     if(page === 1) return filmyZGatunkami
      //     const existingIds = new Set(prev.map(f => f.id))
      //     const newFilms = filmyZGatunkami.filter(f => !existingIds.has(f.id))
      //     return [...prev, ...newFilms]
      //   })
      //   setLoading(false)
        
      // }
    
}


export default function useFetchMedia({search, page, id_genre, filters, adultFilms, setPage, customType} : Props ) {
    // const [films, setFilms] = useState<FilmsWithGenres[]>([])


    const [, setSearchParams] = useSearchParams();


    
    const { type: paramType } = useParams()

    const type = paramType ?? customType
 
    const movieGenreHolder = useContext(MovieGenreContext)
    const tvGenreHolder = useContext(TvGenreContext)

    const genreHolder = type === "tv" ? tvGenreHolder : movieGenreHolder

    
    useEffect(() => {
      if (setPage) setPage(1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[type, id_genre, filters?.value, adultFilms, search])
    
    
    
    const { 
      data,
      fetchNextPage,
      isFetchNextPageError,
      isFetchingNextPage,
      isPending,
      isError,
      hasNextPage,
      error
     } = useInfiniteQuery({
      queryKey: ['allMedia', search, type, id_genre, filters, adultFilms],
      queryFn: ({pageParam, signal}) => fetchMedia({
        type: type as string,
        id_genre,
        search,
        page: pageParam,
        filters,
        adultFilms,
        genreHolder,
        signal
      }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextPage,
      enabled: !!genreHolder && genreHolder.length > 0,
    })
        // const controller = new AbortController() 
        
    const films = useMemo(
      () => data?.pages.flatMap(page => page.filmyZGatunkami) ?? [],
    [data])
        
      const currentPage = data?.pages.length ?? 0
      useEffect(() => {
        const params: Record<string, string> = { query: search ?? '', page: `${currentPage}`}
        if (filters?.value) params.filters = filters?.value
        if(adultFilms) params.adultFilms = `${adultFilms}`
        setSearchParams(params)
        
        // if(page === 1) setFilms([])
          setSearchParams(params);
        
      },[adultFilms, page, filters?.value, search, setSearchParams, currentPage])



  return { error, films, fetchNextPage, isFetchNextPageError, isFetchingNextPage, isPending, isError, hasNextPage }
}