import type { Films, FilmsWithGenres } from '../PagesComponents/MediaCard'
import { useUser } from '@/context/useUser'

interface functionProps {
    movie: FilmsWithGenres
    type: string | undefined
}

function usePostAsWatched({movie, type} : functionProps) {

    const { user } = useUser()
    
        const postAsWatched = async () => {
            if(user !== null) {
            try {
                const res = await fetch(`http://localhost:5000/history/add/${user._id}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                        userId: user._id,
                        mediaType: type,
                        tmdbId: movie.id,
                        adult: movie.adult,
                        backdrop_path: movie.backdrop_path,
                        genre_ids: movie.genre_ids,
                        original_language: movie.original_language,
                        original_title: movie.original_title,
                        overview: movie.overview,
                        popularity: movie.popularity,
                        poster_path: movie.poster_path,
                        release_date: movie.release_date,
                        title: type === "tv" ? movie.name : movie.title,
                        video: movie.video,
                        vote_average: movie.vote_average,
                        vote_count: movie.vote_count
                })
                })
                if(res.ok){
                    const data = await res.json()
                    console.log(data)
                } else {
                    console.error(res.status + ' ' + res.statusText)
                }
            } catch (err) {
                console.error(err)
            }
            }
        }
        postAsWatched()
  return { postAsWatched }
}

export default usePostAsWatched