import { useQuery } from '@tanstack/react-query'

function useFetchFavouritesIds(userId?: string) {

  
        const fetchFavouriteIds = async (): Promise<Set<number | string>> => {
            const res = await fetch(`http://localhost:5000/favourite/ids/${userId}`)
            if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
            
            const data = await res.json()
            return new Set(data.map((item: {tmdbId: number}) => item.tmdbId))          
        }

    const { isPending, isError, data, error} = useQuery({
      queryKey: ['favouriteIds', userId],
      queryFn: fetchFavouriteIds,
      enabled: !!userId
    })
    
  return { isPending, isError, data, error }
}

export default useFetchFavouritesIds