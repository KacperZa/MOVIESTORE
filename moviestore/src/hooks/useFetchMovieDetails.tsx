import { useEffect, useState } from 'react'

interface FetchDetailsProps {
    id: string | undefined
}

interface BelongsToCollection {
    name: string
    poster_path: string
    backdrop_path: string
}

interface DetailGenre {
    id: number
    name: string
}

export interface ProductionCompany {
    id: number
    logo_path: string
    name: string
    origin_country: string
}

export interface ProductionCountry {
    iso_3166_1: string
    name: string
}

export interface SpokenLanguage {
    english_name: string
    iso_639_1: string
    name: string
}

export interface Details {
    adult: boolean,
    backdrop_path: string
    belong_to_collection: BelongsToCollection[]
    budget: number
    genres: DetailGenre[]
    homepage: string
    id: number
    imdb_id: string
    origin_country: string[]
    original_title: string
    overview: string
    popularity: number
    poster_path: string
    production_companies: ProductionCompany[]
    production_countries: ProductionCountry[]
    release_date: string
    revenue: number
    runtime: number
    spoken_languages: SpokenLanguage[]
    status: string
    tagline: string
    title: string
    video: boolean
    vote_average: number
    vote_count: number
}

export default function useFetchDetails({id} : FetchDetailsProps) {
    const [details, setDetails] = useState<Details>()

    useEffect(() => {
        const fetchDetails = async () => {
            try{
                const res = await fetch(`http://localhost:5000/details/movie/${id}`, {
                    method: 'GET'
                });

                if(!res.ok) throw new Error(`HTTP error: ${res.status}`)

                const data = await res.json()
                setDetails(data)
            } catch(err) {
            console.error(err)
            }
        }
        fetchDetails()
   },[id])
  return { details }
}