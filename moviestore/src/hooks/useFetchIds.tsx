import { useQuery } from '@tanstack/react-query'

interface FetchIdsProps {
  userId?: string
  type: "favourite" | "history"
}

function useFetchIds({userId, type} : FetchIdsProps) {

  const url = type === "favourite" ? `http://localhost:5000/favourite/ids/${userId}` : `http://localhost:5000/history/ids/${userId}`
  const queryKey = type === "favourite" ? ['favouriteIds', userId] : ['historyIds', userId]
  
        const fetchIds = async (): Promise<Set<number | string>> => {
            const res = await fetch(url)
            if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
            
            const data = await res.json()
            return new Set(data.map((item: {tmdbId: number}) => item.tmdbId))          
        }

    const { isPending, isError, data, error} = useQuery({
      queryKey: queryKey,
      queryFn: fetchIds,
      enabled: !!userId
    })
    
  return { isPending, isError, data, error }
}

export default useFetchIds