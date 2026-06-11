import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { MovieGenreContext } from '../context/MovieGenreContext'
import { TvGenreContext } from '../context/TvMovieGenreContext'
import { useParams, useSearchParams } from 'react-router-dom'


  interface Films {
    adult: boolean
    backdrop_path: string
    genre_ids: number[]
    id: number
    original_language: string
    original_title?: string
    overview: string
    popularity: Float32Array
    poster_path: string
    release_date: string
    title?: string
    name?: string
    video: boolean
    vote_average: Float32Array
    vote_count: Float32Array
  }

  interface FilmsWithGenres extends Films{
    gatunki: string[]
  }
  interface Genres {
    id: number
    name: string
  }

  interface Props {
    search: string,
    page: number, 
    id_genre?: string,
    setPage: (page: number) => void
  }

export default function useFetchMedia({search, page, id_genre, setPage} : Props ) {
    const [films, setFilms] = useState<any[]>([])
    const [hasMore, setHasMore] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const [searchParams, setSearchParams] = useSearchParams();


    const { type } = useParams()

    const movieGenreHolder = useContext(MovieGenreContext)
    const tvGenreHolder = useContext(TvGenreContext)

    const genreHolder = type === "tv" ? tvGenreHolder : movieGenreHolder

    useEffect(() => {
      setPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[type, id_genre])
    
      useEffect(() => {

        if(page === 1) setFilms([])
        setSearchParams({query: search, page: `${page}`});

        const controller = new AbortController() 


        if (!genreHolder || (genreHolder as Genres[]).length === 0) return;
        const pobierz = async () =>{
        setLoading(true)
        setError(false)
    
          try {

            let data;

            if(id_genre){
              const res = await axios.get(
                `/api/${type}/${id_genre}?keywords=${search}&page=${page}`,
                { signal: controller.signal }
              )  
              data = res.data            
            }else {
              const res = await axios.get(
                `${type === 'tv' ? '/api/tv' : '/api'}?keywords=${search}&page=${page}`,
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
          
            setFilms(prev => {
              if(page === 1) return filmyZGatunkami
              const existingIds = new Set(prev.map(f => f.id))
              const newFilms = filmyZGatunkami.filter(f => !existingIds.has(f.id))
              return [...prev, ...newFilms]
            })
            setHasMore(data.total_pages > page)
            setLoading(false)
    
          } catch(err) {
            if (axios.isCancel(err)) return;
            setError(true)
          } finally {
            setLoading(false)
          }
    
        }
        pobierz()

        return () => controller.abort()
      },[search, page, type, genreHolder, id_genre])

  return { films, loading, error, hasMore }
}


