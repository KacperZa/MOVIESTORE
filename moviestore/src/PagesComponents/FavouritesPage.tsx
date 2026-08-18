import { useState } from 'react'
import { useUser } from '../context/useUser'
import useFetchFavourites from '../hooks/useFetchFavourites'
import FavouriteToggle from './FavouriteToggle'
import MediaCard, { type FilmsWithGenres } from '@/ui/MediaCard'

export interface MediaWithUser extends FilmsWithGenres {
  userId: string
  mediaType: string
  tmdbId: number
  adult: boolean
  backdrop_path: string
  genre_ids: number[]
  original_language: string 
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  release_date: string
  title?: string
  name?: string
  video: boolean
  vote_average: number
  vote_count: number
  type: string
}

function Favourites() {
  const [favouriteIds, setFavouriteIds] = useState<Set<number>>(new Set())

  const { user } = useUser()

  // fetching data 
  const { favourites } = useFetchFavourites()

  const { addFavourite, removeFavourite} = FavouriteToggle()

    const filteredData = favourites?.filter((media) => media.userId === user?._id )

    return (
    <>
        <div className='flex flex-col w-full h-full border-t border-card p-2 items-center scrollbar-thumb-amber-700 scrollbar-gutter-stable'>
            <div className='text-3xl p-5 font-bold tracking-wide text-secondary'>Favourites</div>
            <div className='grid grid-cols-4 gap-y-5 overflow-auto w-full h-full'>
                {filteredData?.map((media, i) =>{
                  return <MediaCard<MediaWithUser> key={i} media={media} type={media.type} favouriteIds={favouriteIds} setFavouriteIds={setFavouriteIds} addFavourite={addFavourite} removeFavourite={removeFavourite} addToHistory/>
                }
                )}
    
            </div>
        </div>
    </>
  )
}

export default Favourites