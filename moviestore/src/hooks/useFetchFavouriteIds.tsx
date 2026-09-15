import { useQuery } from '@tanstack/react-query'

interface FetchIdsProps {
  userId?: string
  type: "favourite" | "history"
}

function useFetchFavouriteIds({userId } : FetchIdsProps) {

  const url = `http://localhost:5000/favourite/ids/${userId}`
  const queryKey = ['favouriteIds', userId] 
  
  const fetchIds = async (): Promise<Set<number | string>> => {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
      
      const data = await res.json()
      return new Set(data.map((item: {tmdbId: number}) => item.tmdbId))          
  }

    const { isPending, isError, data, error } = useQuery({
      queryKey: queryKey,
      queryFn: fetchIds,
      enabled: !!userId
    })
    
  return { isPending, isError, data, error }
}

export default useFetchFavouriteIds