import useFetchFavourites, { type DetailsWithUser } from '../hooks/useFetchFavourites'
import MediaCard, { type FilmsWithGenres } from '@/ui/MediaCard'
import FavouriteToggle from './FavouriteToggle'
import useFetchFavouritesIds from '@/hooks/useFetchFavouritesIds'
import { useUser } from '@/context/useUser'

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
  const { user } = useUser()

  // fetching data 
  const { favourites } = useFetchFavourites()

  const { addFavourite, removeFavourite} = FavouriteToggle()

    const { favouriteIds, setFavouriteIds } = useFetchFavouritesIds(user?._id)


    return (
    <>
        <div className='flex flex-col w-full h-full border-t border-card p-2 items-center scrollbar-thumb-amber-700 scrollbar-gutter-stable'>
            <div className='text-3xl p-5 font-bold tracking-wide text-secondary'>Favourites</div>
            <div className='grid grid-cols-4 gap-y-5 overflow-auto w-full h-full justify-center'>
                {favourites?.map(media =>{
                  return <MediaCard<DetailsWithUser> key={media.id} media={media} type={media.mediaType} favouriteIds={favouriteIds} setFavouriteIds={setFavouriteIds} addFavourite={addFavourite} removeFavourite={removeFavourite}/>
                }
                )}
    
            </div>
        </div>
    </>
  )
}

export default Favourites