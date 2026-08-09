import { useUser } from '../context/useUser'

import type { MediaWithUser } from './FavouritesPage'
import useFetchFavouritesIds from '../hooks/useFetchFavouritesIds'
import FavouriteToggle from './FavouriteToggle'
import useFetchWatchedMedia from '../hooks/useFetchWatchedMedia'
import MediaCard from '@/ui/MediaCard'


function WatchedFilms() {
  
  const { user } = useUser()

  const { favouriteIds, setFavouriteIds } = useFetchFavouritesIds(user?._id)
  const { addFavourite, removeFavourite } = FavouriteToggle()
  const { watchedFilms } = useFetchWatchedMedia()
    
    return (
      <>
        <div className='flex flex-col w-full h-full rounded-2xl bg-indigo-400 p-2 items-center'>
            <div className='text-3xl p-5 font-bold tracking-wide'>Watched films</div>
            <div className='grid grid-cols-4 gap-y-5 overflow-auto w-full'>
              {[...watchedFilms].map((media, i) => {
                  return <MediaCard<MediaWithUser> key={i}  media={media} type={media.type} favouriteIds={favouriteIds} setFavouriteIds={setFavouriteIds} addFavourite={addFavourite} removeFavourite={removeFavourite} addToHistory/>
                })}
            </div>
        </div>
    </>
  )
}

export default WatchedFilms