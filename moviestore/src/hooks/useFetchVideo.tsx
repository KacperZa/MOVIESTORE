import { useQuery } from '@tanstack/react-query'

interface FetchVideosProps {
    type: string | undefined
    id: string | undefined
    enabled?: boolean
}

export interface Video {
    iso_639_1: string
    iso_3166_1: string
    name: string
    key: string
    site: string
    size: number
    type: string
    official: boolean
    published_at: string
    id: string
}

const useFetchVideo = ({type, id, enabled} : FetchVideosProps) => {

    const fetchVideos = async (): Promise<Video[] | null> => {
        const res = await fetch(`http://localhost:5000/${type}/videos/${id}`,{
            method: 'GET'
        });

        if (!res.ok) throw new Error(`HTTP error: ${res.status}`)

        return await res.json()
    }

    const { isPending, isError, error, data } = useQuery({
        queryKey: ['videos', id, type],
        queryFn: fetchVideos,
        enabled: enabled && !!id && !!type
    })

  return { isPending, isError, error, data }
}

export default useFetchVideo