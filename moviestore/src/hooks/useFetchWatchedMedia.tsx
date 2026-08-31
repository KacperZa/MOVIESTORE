import { useUser } from '@/context/useUser'
import type { MediaWithUser } from '@/PagesComponents/FavouritesPage'
import { useQuery } from '@tanstack/react-query'

function useFetchWatchedMedia() {

    const { user } = useUser()

        const history = async (): Promise<MediaWithUser[]> => {
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