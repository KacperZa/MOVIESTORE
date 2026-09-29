import { useUser } from '@/context/useUser'
import type { MovieDetails } from './useFetchMovieDetails'
import { useQuery } from '@tanstack/react-query'

export interface DetailsWithUser extends MovieDetails {
    userId: string 
    mediaType: string 
}

export default function useFetchFavourites() {

    const {user} = useUser()
    
    const favourites = async (): Promise<DetailsWithUser[]> => {
        const res = await fetch(`http://localhost:5000/favourite/${user?._id}`, {
            method: 'GET'
        })
        
        if(!res.ok) throw new Error(`HTTP error: ${res.status}`)
            
        return await res.json()


    }
    
    const {isPending, isError, data, error} = useQuery({
        queryKey: ['favourites'],
        queryFn: favourites,
        enabled: !!user?._id
    })
  return { isPending, isError, data, error }
}

