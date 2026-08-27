import { useUser } from '../context/useUser'

import type { MediaWithUser } from './FavouritesPage'
import useFetchFavouritesIds from '../hooks/useFetchFavouritesIds'
import FavouriteToggle from './FavouriteToggle'
import useFetchWatchedMedia from '../hooks/useFetchWatchedMedia'
import MediaCard from '@/ui/MediaCard'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'


function WatchedFilms() {
  
  const { user } = useUser()

  const { favouriteIds, setFavouriteIds } = useFetchFavouritesIds(user?._id)
  const { addFavourite, removeFavourite } = FavouriteToggle()
  const { watchedFilms } = useFetchWatchedMedia()

  const navigate = useNavigate()
    
    return (
      <>
        <div className='flex flex-col w-full h-full border-t border-card p-2 items-center scrollbar-thumb-primary scrollbar-gutter-stable bg-radial from-card from-5% to-background'>
            <p className='text-3xl p-5 font-bold tracking-wide text-secondary text-shadow-2xl shadow-secondary'>Watched films</p>
              {watchedFilms.length !== 0 ?
            <div className='grid grid-cols-4 gap-y-5 overflow-auto w-full'>
              {watchedFilms.map(media => {
                  return <MediaCard<MediaWithUser> key={media.id}  media={media} type={media.type} favouriteIds={favouriteIds} setFavouriteIds={setFavouriteIds} addFavourite={addFavourite} removeFavourite={removeFavourite}/>
                })}
            </div>

                :
                <>
                  <div className='h-full w-full flex justify-center items-center flex-col gap-2'>
                    <p className='text-text py-2 px-4 font-medium text-lg'>Your watch history is empty.</p>

                    <div className='flex flex-row gap-3'>
                      <motion.button 
                      className='bg-secondary px-4 py-2 border-4 border-accent rounded-lg shadow-2xl shadow-secondary cursor-pointer'
                      onClick={() => navigate('/browse/movie')}
                      initial={{y: 0}}
                      whileHover={{y: 1}}
                      whileTap={{scale: 0.95}}
                      >
                        View movies
                      </motion.button>

                      <motion.button 
                      className='bg-secondary px-4 py-2 border-4 border-accent rounded-lg shadow-2xl shadow-secondary cursor-pointer'
                      onClick={() => navigate('/browse/tv')}
                      initial={{y: 0}}
                      whileHover={{y: 1}}
                      whileTap={{scale: 0.95}}
                      >
                        View TV shows
                      </motion.button>
                    </div>

                  </div>
                </>

              }
        </div>
    </>
  )
}

export default WatchedFilms