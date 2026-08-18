import { useEffect, useRef, useState } from 'react'
import type { GenreSectionProps } from '@/PagesComponents/HomePageComponents/GenreSection'
import type { Films } from '@/ui/MediaCard'


function useGenreSection({genreId, type} : GenreSectionProps) {
    const [movies, setMovies] = useState<Films[]>([])
    const [loading, setLoading] = useState(false)
    const [hasFetched, setHasFetched] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    
    
    const fetchGenreMovies = async () => {
        setLoading(true)
        setMovies([])
        setHasFetched(true)
        try {
            const res = await fetch(`http://localhost:5000/api/${type}/${genreId}`)
            const data = await res.json()
            setMovies(data.results)
        } catch(err){
            console.error(err)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasFetched){
                    fetchGenreMovies()
                }
            },
            { threshold: 0.1}
        )
        if (ref.current) observer.observe(ref.current)
        return  () => observer.disconnect()
    }, [hasFetched])

  return { ref, movies, loading }

}

export default useGenreSection


