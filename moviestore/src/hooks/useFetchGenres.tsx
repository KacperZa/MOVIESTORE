import { useQuery } from "@tanstack/react-query"

const useFetchGenres = ({type} : {type: string}) => {

    const fetchGenres = async ({type} : {type: string}) => {
        const res = await fetch(`/api/${type}/genres`)
        if(!res.ok) throw new Error(`HTTP: ${res.status}`)

        return await res.json()
    }

    const {
        data, 
        isPending, 
        isError,
        error
    } = useQuery({
        queryKey:['genre', type],
        queryFn: () => fetchGenres({type})
    })

  return { data, isPending, isError, error}
}

export default useFetchGenres