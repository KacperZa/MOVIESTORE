import { useEffect, useState } from 'react'
import type { MediaWithUser } from '../PagesComponents/FavouritesPage'

export default function useFetchFavourites() {

const [favourites, setFavourites] = useState<MediaWithUser[]>()

        useEffect(() => {
            const favourites = async () => {
                const res = await fetch('http://localhost:5000/favourite/', {
                    method: 'GET'
                })
                const data = await res.json()
                console.log(data)
                setFavourites(data)
            }
            favourites()
        },[])

  return { favourites }
}

