import { useUser } from '@/context/useUser'
import { useEffect, useState } from 'react'
import type { MediaWithUser } from '../PagesComponents/FavouritesPage'

function useFetchWatchedMedia() {
  const [watchedFilms, setWatchedFilms] = useState<MediaWithUser[]>([])

    const { user } = useUser()

    useEffect(() => {
        const favourites = async () => {
            try {
                const res = await fetch(`http://localhost:5000/history/me/${user?._id}`, {
                    method: 'GET'
                })
                const data = await res.json()
                console.log(data)
                setWatchedFilms(data)
            } catch(err) {
                console.error(err)
            }
        }
        favourites()
    },[user?._id])
  return { watchedFilms }
}

export default useFetchWatchedMedia