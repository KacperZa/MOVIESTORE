import { useEffect, useState } from 'react'
import type { Genres } from './useFetchMedia'
import type { ProductionCompany, ProductionCountry, SpokenLanguage } from './useFetchMovieDetails'

interface FetchDetailsProps {
    id: string | undefined
}

interface Creator {
    id: number
    credit_id: string
    name: string
    gender: string
    profile_path: string
}

interface LastEpisode {
    id: number
    name: string
    overview: string
    vote_average: number
    vote_count: number
    air_date: string
    episode_number: number
    production_code: string
    runtime: number
    season_number: number
    show_id: number
    still_path: string
}

interface Network {
    id: number
    logo_path: string
    name: string
    origin_country: string
}

interface Season {
    air_date: string
    episode_count: number
    id: number
    name: string
    overview: string
    poster_path: string
    season_number: number
    vote_average: number
}

interface Details {
    adult: boolean
    backdrop_path: string
    created_by: Creator[]
    episode_run_time: number[]
    first_air_time: string
    genres: Genres[]
    homepage: string
    id: number
    in_production: boolean
    languages: string[]
    last_air_date: string
    last_episode_to_air: LastEpisode
    name: string
    next_episode_to_air: string
    networks: Network[]
    number_of_episodes: number
    number_of_seasons: number
    origin_country: string[]
    original_language: string
    original_name: string
    overview: string
    popularity: number
    poster_path: string
    production_companies: ProductionCompany[]
    production_countries: ProductionCountry[]
    seasons: Season[]
    spoken_languages: SpokenLanguage[]
    status: string
    tagline: string
    type: string
    vote_average: number
    vote_count: number
}

export default function useFetchDetails({id} : FetchDetailsProps) {
    const [details, setDetails] = useState<Details>()

    useEffect(() => {
        const fetchDetails = async () => {
            try{
                const res = await fetch(`http://localhost:5000/details/tv/${id}`, {
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