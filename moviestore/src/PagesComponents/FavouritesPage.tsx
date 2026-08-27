import useFetchFavourites, { type DetailsWithUser } from '../hooks/useFetchFavourites'
import MediaCard, { type FilmsWithGenres } from '@/ui/MediaCard'
import FavouriteToggle from './FavouriteToggle'
import useFetchFavouritesIds from '@/hooks/useFetchFavouritesIds'
import { useUser } from '@/context/useUser'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'

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

  const navigate = useNavigate()
  
    return (
    <>
        <div className='flex flex-col w-full h-full border-t border-card p-2 items-center scrollbar-thumb-primary scrollbar-gutter-stable bg-radial from-card from-5% to-background'>
            <div className='text-3xl p-5 font-bold tracking-wide text-secondary'>Favourites</div>
                {favourites?.length !== 0 ?
                    <div className='grid grid-cols-4 gap-y-5 overflow-auto w-full h-full justify-center'>
                  {favourites?.map(media =>
                  {
                    return <MediaCard<DetailsWithUser> key={media.id} media={media} type={media.mediaType} favouriteIds={favouriteIds} setFavouriteIds={setFavouriteIds} addFavourite={addFavourite} removeFavourite={removeFavourite}/>
                    }
                  )}
                    </div>
                  :
                  <>
                  <div className='h-full w-full flex justify-center items-center flex-col gap-2'>
                    <p className='text-text py-2 px-4 font-medium text-lg'>No favourite media found.</p>
                    <div className='flex flex-row gap-3'>
                      <motion.button 
                      className='bg-secondary px-4 py-2 border-4 border-accent rounded-lg shadow-2xl/50 shadow-secondary cursor-pointer'
                      onClick={() => navigate('/browse/movie')}
                      initial={{y: 0}}
                      whileHover={{y: 1}}
                      whileTap={{scale: 0.95}}
                      >
                        View movies
                      </motion.button>

                      <motion.button 
                      className='bg-secondary px-4 py-2 border-4 border-accent rounded-lg shadow-2xl/50 shadow-secondary cursor-pointer'
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

export default Favourites