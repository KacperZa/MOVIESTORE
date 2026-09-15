import { useUser } from '../context/useUser'
import useFetchWatchedMedia, { type HistoryItem } from '../hooks/useFetchWatchedMedia'
import MediaCard from '@/ui/MediaCard'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import useFetchIds from '../hooks/useFetchFavouriteIds'
import MediaCardSkeleton from '@/ui/MediaCardSkeleton'
import { useState } from 'react'
import useAddFavourite from '@/hooks/FavouriteHooks/useAddFavourite'
import useRemoveFavourite from '@/hooks/FavouriteHooks/useRemoveFavourite'


function WatchedFilms() {
  const [currentStatus, setCurrentStatus] = useState<string | null>(null)
  
  const { user } = useUser()

  const { isError: isErrorIds, data: favouriteIds, error: errorFavouriteIds } = useFetchIds({userId: user?._id, type: "favourite"})
  if(isErrorIds) console.log('An Error occured during fetching favouriteIds', errorFavouriteIds?.message)

  const { mutate: addFavourite } = useAddFavourite()
  const { mutate: removeFavourite } = useRemoveFavourite()

  // Fetching watched media
  const { isPending : isPendingWatchedMedia, isError: isErrorWatchedMedia, data: watchedMedia, error: errorWatchedMedia } = useFetchWatchedMedia()

  if(isErrorWatchedMedia) console.log('An error occured during fetching watched media', errorWatchedMedia?.message)

  const navigate = useNavigate()

  const sortedData = watchedMedia?.filter(media => media.status === currentStatus)

  const finalData = currentStatus ? sortedData : watchedMedia



  if (isErrorWatchedMedia) {
    return (
            <div className='flex flex-col w-full h-full border-t border-card p-2 items-center scrollbar-thumb-primary scrollbar-gutter-stable bg-radial from-card from-5% to-background'>
              <div className='text-3xl p-5 font-bold tracking-wide text-secondary'>Watched films</div>
                <div className='w-full h-full flex justify-center items-center'>
                  <p className='text-2xl text-text font-bold tracking-wider'>An error has occurred during fetching watched films, please reload the page.</p>
                </div>
            </div>
    )        
  }
    
    return (
      <>
        <div className='flex flex-col w-full h-full border-t border-card p-2 items-center scrollbar-thumb-primary scrollbar-gutter-stable bg-radial from-card from-5% to-background'>
            <div className='xl:text-3xl text-4xl p-5 font-bold tracking-wide text-secondary text-shadow-2xl shadow-secondary flex  flex-col gap-2 md:gap-0 md:flex-row w-full items-center px-6'>
              <p className='flex-1 min-h-0 flex font-extrabold justify-center text-5xl tracking-widest'>Watchlist</p>

              {/* Filters  */}
              <div className='px-4 py-2 bg-card rounded-lg gap-2 flex flex-col'>
                <div className='flex flex-row gap-2 items-center justify-between'>
                  <p className='text-2xl py-1 px-2'>Status</p>
                  <p className={`text-text text-lg self-end cursor-pointer py-0.5 px-2 rounded-lg select-none transition-all duration-200 ease ${currentStatus === null ? 'bg-gray-600' : 'hover:bg-gray-600/40' }`} onClick={() => setCurrentStatus(null)}>All</p>
                </div>
                <div className='w-full text-base flex flex-row gap-2 text-text'>
                  <p className={`cursor-pointer py-1 px-2 rounded-lg select-none transition-all duration-200 ease ${currentStatus === 'watched' ? 'bg-gray-600' : 'hover:bg-gray-600/40' }`} onClick={() => setCurrentStatus('watched')}>Watched</p>
                  <p className={`cursor-pointer py-1 px-2 rounded-lg select-none transition-all duration-200 ease ${currentStatus === 'pending' ? 'bg-gray-600' : 'hover:bg-gray-600/40' }`} onClick={() => setCurrentStatus('pending')}>Pending</p>
                </div>
              </div>

            </div>
              {finalData?.length !== 0 ?
            <div className='grid md:grid-cols-2 xl:grid-cols-4 gap-y-5 overflow-auto w-full h-full'>
              {isPendingWatchedMedia ? 
                <>
                  <MediaCardSkeleton count={8}/>
                </>
              :
              finalData?.map((media: HistoryItem) => {
                  return <MediaCard<HistoryItem> key={media.id}  media={media} type={media.mediaType} favouriteIds={favouriteIds ?? new Set()} addFavourite={addFavourite} removeFavourite={removeFavourite} userId={user?._id}/>
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