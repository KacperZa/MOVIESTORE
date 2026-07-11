import { useEffect, useState } from 'react'

function useFetchFavouritesIds(userId?: string | undefined) {

  const [favouriteIds, setFavouriteIds] = useState<Set<number>>(new Set())

    useEffect(() => {
        if(!userId) return

        const fetchFavouriteIds = async () => {
          try {
            const res = await fetch(`http://localhost:5000/favourite/ids/${userId}`)
            if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
            
            const data = await res.json()
            setFavouriteIds(new Set(data.map((item: {tmdbId: number}) => item.tmdbId)))
    
          } catch(err) {
            console.error(err)
          }
        }
        console.log('Pobieram favouriteIds')

        fetchFavouriteIds()
    },[userId])


    
  return { favouriteIds, setFavouriteIds }
}

export default useFetchFavouritesIds