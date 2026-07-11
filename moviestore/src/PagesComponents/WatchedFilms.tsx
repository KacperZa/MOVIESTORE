import { useState } from 'react'
import { useUser } from '../context/useUser'

import MediaCard from './MediaCard'
import type { MediaWithUser } from './FavouritesPage'
import useFetchFavouritesIds from '../hooks/useFetchFavouritesIds'
import FavouriteToggle from './FavouriteToggle'
import useFetchWatchedMedia from '../hooks/useFetchWatchedMedia'


function WatchedFilms() {
  const [mediaVisibleId, setMediaVisibleId] = useState<number | null>(null)
  
  const { user } = useUser()

  const { favouriteIds, setFavouriteIds } = useFetchFavouritesIds(user?._id)
  const { addFavourite, removeFavourite } = FavouriteToggle()
  const { watchedFilms } = useFetchWatchedMedia()
    
    return (
      <>
        <div className='flex flex-col ml-5 flex-8 g-4 rounded-2xl w-screen bg-indigo-400 p-2 items-center'>
            <div className='text-6xl p-5 font-bold tracking-wide'>Watched films</div>
            <div className='grid grid-cols-4 gap-y-5 overflow-auto'>
              {[...watchedFilms].map((media, i) => {
                  return <MediaCard<MediaWithUser> key={i} setMediaVisibleId={setMediaVisibleId} media={media} type={media.type} favouriteIds={favouriteIds} setFavouriteIds={setFavouriteIds} addFavourite={addFavourite} removeFavourite={removeFavourite} addToHistory/>
                })}
            </div>
        </div>
    </>
  )
}

export default WatchedFilms