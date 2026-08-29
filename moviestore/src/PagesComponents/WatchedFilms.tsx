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

  const { isError: isErrorIds, data: favouriteIds, error: errorFavouriteIds } = useFetchFavouritesIds(user?._id)
  if(isErrorIds) console.log('An Error occured during fetching favouriteIds', errorFavouriteIds?.message)

  const { addFavourite, removeFavourite } = FavouriteToggle()
  const { isPending : isPendingWatchedMedia, isError: isErrorWatchedMedia, data: watchedFilms, error: errorWatchedMedia } = useFetchWatchedMedia()

  if(isErrorWatchedMedia) console.log('An error occured during fetching watched media', errorWatchedMedia?.message)

  const navigate = useNavigate()


  if (isPendingWatchedMedia) {
    return (
            <div className='flex flex-col w-full h-full border-t border-card p-2 items-center scrollbar-thumb-primary scrollbar-gutter-stable bg-radial from-card from-5% to-background'>
              <div className='text-3xl p-5 font-bold tracking-wide text-secondary'>Watched films</div>
                <div className='w-full h-full flex justify-center items-center'>
                  <p className='text-2xl text-text font-bold tracking-wider'>Loading...</p>
                </div>
            </div>
    )        
  }

  if (isErrorWatchedMedia) {
    return (
            <div className='flex flex-col w-full h-full border-t border-card p-2 items-center scrollbar-thumb-primary scrollbar-gutter-stable bg-radial from-card from-5% to-background'>
              <div className='text-3xl p-5 font-bold tracking-wide text-secondary'>Watched films</div>
                <div className='w-full h-full flex justify-center items-center'>
                  <p className='text-2xl text-text font-bold tracking-wider'>An Error has occurred during fetching watched films, please reload the page.</p>
                </div>
            </div>
    )        
  }
    
    return (
      <>
        <div className='flex flex-col w-full h-full border-t border-card p-2 items-center scrollbar-thumb-primary scrollbar-gutter-stable bg-radial from-card from-5% to-background'>
            <p className='text-3xl p-5 font-bold tracking-wide text-secondary text-shadow-2xl shadow-secondary'>Watched films</p>
              {watchedFilms?.length !== 0 ?
            <div className='grid grid-cols-4 gap-y-5 overflow-auto w-full'>
              {watchedFilms?.map((media: MediaWithUser) => {
                  return <MediaCard<MediaWithUser> key={media.id}  media={media} type={media.type} favouriteIds={favouriteIds ?? new Set()} addFavourite={addFavourite} removeFavourite={removeFavourite}/>
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