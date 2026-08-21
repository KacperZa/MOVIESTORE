import { useEffect, useState } from 'react'
import { useUser } from '@/context/useUser'
import type { Details } from './useFetchMovieDetails'

export interface DetailsWithUser extends Details {
    userId: string 
    mediaType: string 
}

export default function useFetchFavourites() {

    const [favourites, setFavourites] = useState<DetailsWithUser[]>()

    const {user} = useUser()

        useEffect(() => {
            const favourites = async () => {
                const res = await fetch(`http://localhost:5000/favourite/${user?._id}`, {
                    method: 'GET'
                })
                const data = await res.json()
                setFavourites(data)
            }
            favourites()
        },[user?._id])

  return { favourites }
}

