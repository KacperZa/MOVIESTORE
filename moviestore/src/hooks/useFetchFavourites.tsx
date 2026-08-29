import { useUser } from '@/context/useUser'
import type { Details } from './useFetchMovieDetails'
import { useQuery } from '@tanstack/react-query'

export interface DetailsWithUser extends Details {
    userId: string 
    mediaType: string 
}

export default function useFetchFavourites() {

    const {user} = useUser()
    
    const favourites = async (): Promise<DetailsWithUser[]> => {
        const res = await fetch(`http://localhost:5000/favourite/${user?._id}`, {
            method: 'GET'
        })
        const data = await res.json()
        return data
    }
    
    const {isPending, isError, data, error} = useQuery({
        queryKey: ['favourites'],
        queryFn: favourites
    })
  return { isPending, isError, data, error }
}

