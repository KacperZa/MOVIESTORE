import { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { MovieGenreContext } from '../context/MovieGenreContext'
import { TvGenreContext } from '../context/TvMovieGenreContext'
import { useParams, useSearchParams } from 'react-router-dom'
import type { ComboboxItem } from "@mantine/core";
import type { Films, FilmsWithGenres } from '@/ui/MediaCard';




  export interface Genres {
    id: number
    name: string
  }

  interface Props {
    search?: string,
    page?: number, 
    id_genre?: string,
    filters?: ComboboxItem | undefined,
    adultFilms?: boolean
    setPage?: (page: number) => void
    customType?: string
  }


export default function useFetchMedia({search, page, id_genre, filters, adultFilms, setPage, customType} : Props ) {
    const [films, setFilms] = useState<FilmsWithGenres[]>([])
    const [hasMore, setHasMore] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const [searchParams, setSearchParams] = useSearchParams();


    const { type } = useParams()
 
    const movieGenreHolder = useContext(MovieGenreContext)
    const tvGenreHolder = useContext(TvGenreContext)

    const genreHolder = type === "tv" ? tvGenreHolder : movieGenreHolder

    useEffect(() => {
      if (setPage) setPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[type, id_genre, filters?.value, adultFilms])


    
      useEffect(() => {

        const params: Record<string, string> = {
          query: search ?? '',
          page: `${page}`,
        }

        if (filters?.value) {
          params.filters = filters?.value
        }
        if(adultFilms) {
          params.adultFilms = `${adultFilms}`
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        if(page === 1) setFilms([])
        setSearchParams(params);

        const controller = new AbortController() 

        if (!genreHolder || (genreHolder as Genres[]).length === 0) return;
        const pobierz = async () =>{
        setLoading(true)
        setError(false)
    
          try {
            let data;

            if(id_genre){
              const res = await axios.get(
                `/api/${type}/${id_genre}?${search ? `keywords=${search}` : ''}&page=${page}${filters ? `&filters=${filters.value}` : ''}&adult=${adultFilms}`,
                { signal: controller.signal }
              )  
              data = res.data            
            }else {
              const res = await axios.get(
                `${type === 'tv' ? '/api/tv' : '/api'}?${search ? `keywords=${search}` : ''}&page=${page}${filters ? `&filters=${filters.value}` : ''}&adult=${adultFilms}`,
                { signal: controller.signal }
              )
              data = res.data
            }
    
            const filmy = data.results
            console.log(filmy)
          
            const genreMap: Record<number, string> = {};
            (genreHolder as Genres[]).forEach(g => genreMap[g.id] = g.name);
          
            const filmyZGatunkami: FilmsWithGenres[] = (filmy as Films[]).map(film => ({
              ...film, 
              gatunki: film.genre_ids.map((id: number) => genreMap[id] ?? 'Unknown')
            }));

            if(setPage && page) {

              setFilms(prev => {
                if(page === 1) return filmyZGatunkami
                const existingIds = new Set(prev.map(f => f.id))
                const newFilms = filmyZGatunkami.filter(f => !existingIds.has(f.id))
                return [...prev, ...newFilms]
              })
              setHasMore(data.total_pages > page)
              setLoading(false)
              
            }
          
    
          } catch(err) {
            if (axios.isCancel(err)) return;
            setError(true)
            console.error(err)
          } finally {
            setLoading(false)
          }
    
        }
        pobierz()

        return () => controller.abort()
      },[search, page, type, genreHolder, id_genre, filters, adultFilms])

  return { films, loading, error, hasMore }
}


