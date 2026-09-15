import { useQuery } from '@tanstack/react-query'

interface FetchIdsProps {
  userId?: string
}

interface HistoryData {
    userId: number
    mediaType: string
    tmdbId: number
    status: "watched" | "pending"
}

function useFetchHistoryData({userId} : FetchIdsProps) {

  const url = `http://localhost:5000/history/ids/${userId}`
  const queryKey = ['historyIds', userId]
  
        const fetchIds = async () => {
            const res = await fetch(url)
            if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
            
            const data = await res.json()

            const historyData = new Map<number, string>(
                data.map((entry : HistoryData) => [entry.tmdbId, entry.status])
            )

            return historyData        
        }

    const { isPending, isError, data, error} = useQuery({
      queryKey: queryKey,
      queryFn: fetchIds,
      enabled: !!userId
    })
    
  return { isPending, isError, data, error }
}

export default useFetchHistoryData