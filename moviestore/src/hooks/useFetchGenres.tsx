import type { Genre } from "@/context/MovieGenreContext"
import { useQuery } from "@tanstack/react-query"


const useFetchGenres = ({type} : {type: string}) => {

    const fetchGenres = async () : Promise<Genre[]> => {
        const res = await fetch(`api/${type}/genres`,
            { method: 'GET' }
        )
        if(!res.ok) throw new Error(`HTTP error: ${res.status}`)

        return await res.json()
    }

    const {
        data, 
        isPending, 
        isError,
        error
    } = useQuery({
        queryKey:['genre', type],
        queryFn: () => fetchGenres()
    })

  return { data, isPending, isError, error}
}

export default useFetchGenres