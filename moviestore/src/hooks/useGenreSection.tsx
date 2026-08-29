import { useContext, useEffect, useRef, useState } from 'react'
import type { GenreSectionProps } from '@/PagesComponents/HomePageComponents/GenreSection'
import type { Films, FilmsWithGenres } from '@/ui/MediaCard'
import { useQuery } from '@tanstack/react-query'
import { MovieGenreContext } from '@/context/MovieGenreContext'
import { TvGenreContext } from '@/context/TvMovieGenreContext'
import type { Genres } from './useFetchMedia'


function useGenreSection({genreId, type} : GenreSectionProps) {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    const movieGenreHolder = useContext(MovieGenreContext)
    const tvGenreHolder = useContext(TvGenreContext)

    const genreHolder = type === "tv" ? tvGenreHolder : movieGenreHolder
    
    const fetchGenreMovies = async (): Promise<FilmsWithGenres[]> => {
            const res = await fetch(`http://localhost:5000/api/${type}/${genreId}`)
            if(!res.ok) throw new Error(`HTTP error: ${res.status}`)

            const data = await res.json()

            const media = data.results
            const genreMap: Record<number, string> = {};
            (genreHolder as Genres[]).forEach(g => genreMap[g.id] = g.name);
        
            const filmyZGatunkami: FilmsWithGenres[] = (media as Films[]).map(film => ({
            ...film, 
            gatunki: film.genre_ids?.map((id: number) => genreMap[id] ?? 'Unknown')
            }));

            return filmyZGatunkami
    }

    const { data, isPending, isError } = useQuery({
        queryKey: ['homeGenreMovies',type, genreId],
        queryFn: fetchGenreMovies,
        enabled: isVisible
    })


    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting){
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 1}
        )
        if (ref.current) observer.observe(ref.current)
        return  () => observer.disconnect()
    }, [])


  return { ref, data, isPending, isError }

}

export default useGenreSection


