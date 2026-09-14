import { useQuery } from '@tanstack/react-query'

interface FetchProvidersProps {
    id: string | undefined
    type: string | undefined
}

interface Provider {
    logo_path: string;
    provider_id: number;
    provider_name: string;
    display_priority: number;
}


interface ProvidersData {
    link: string;
    rent: Provider[];
    flatrate: Provider[];
    buy: Provider[];
}

const useFetchProviders = ({id, type} : FetchProvidersProps) => {

    const fetchProviders = async (): Promise<ProvidersData> => {
        const res = await fetch(`http://localhost:5000/${type}/providers/${id}`)

        if(!res.ok) {
            throw new Error(`HTTP status: ${res.status}`)
        }

        return await res.json()
    }

    const { isError, error, isPending, data} = useQuery({
        queryKey: ['providers', type, id],
        queryFn: fetchProviders
    })
  return { isError, error, isPending, data}
}

export default useFetchProviders