import { useUser } from '@/context/useUser'
import { useQuery } from '@tanstack/react-query'
import type { MovieDetails } from './useFetchMovieDetails'
import type { TvDetails } from './useFetchTvDetails'


interface HistoryMovieItem extends MovieDetails {
    mediaType: 'movie';
    userId: string;
    status: 'watched' | 'pending'

}

interface HistoryTvItem extends TvDetails {
    mediaType: 'tv';
    userId: string;
    status: 'watched' | 'pending'
}

export type HistoryItem = HistoryMovieItem | HistoryTvItem

function useFetchWatchedMedia() {

    const { user } = useUser()

        const history = async (): Promise<HistoryItem[]> => {
            const res = await fetch(`http://localhost:5000/history/${user?._id}`, {
                method: 'GET'
            })
            if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
                // console.log(res.json())
            return await res.json()
        }

    const { isPending, isError, data, error } = useQuery({
        queryKey: ['watchedFilms'],
        queryFn: history
    })
    
  return { isPending, isError, data, error }
}

export default useFetchWatchedMedia