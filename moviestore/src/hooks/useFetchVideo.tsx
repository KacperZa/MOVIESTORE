import { useEffect, useState } from 'react'

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
    const [videos, setVideos] = useState<Video[]>()

    useEffect(() => {

        if (!enabled) return 

        const fetchVideos = async () => {
            try{
                const res = await fetch(`http://localhost:5000/${type}/videos/${id}`,{
                    method: 'GET'
                });

                if (!res.ok) throw new Error(`HTTP error: ${res.status}`)

                const data = await res.json()
                setVideos(data)
            } catch (err) {
                console.error(err)
            }
        }
        fetchVideos()
    },[id, type, enabled])
  return videos 
}

export default useFetchVideo