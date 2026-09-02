import { useEffect, useRef, useState } from 'react'
import type { GenreSectionProps } from '@/PagesComponents/HomePageComponents/GenreSection'
import type { Films, FilmsWithGenres } from '@/ui/MediaCard'
import { useQuery } from '@tanstack/react-query'
import type { Genres } from './useFetchMedia'
import { useMovieGenres } from '@/context/useMovieGenres'
import { useTvGenres } from '@/context/useTvGenres'


function useGenreSection({genreId, type} : GenreSectionProps) {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

  const {movieGenres: movieGenresHolder} = useMovieGenres()
  const {tvGenres: tvGenresHolder} = useTvGenres()

    const genreHolder = type === "tv" ? tvGenresHolder : movieGenresHolder
    
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


