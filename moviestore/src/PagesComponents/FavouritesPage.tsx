import React, { useEffect, useState } from 'react'
import { useUser } from '../context/useUser'
import { motion, spring } from 'motion/react'
import { NoImageIcon } from '../components-folder/Icons'
import { Link, useSearchParams } from 'react-router-dom'
import MediaCard, { type FilmsWithGenres } from './MediaCard'
import useInfiniteScroll from '../hooks/useInfiniteScroll'
import useFetchFavourites from '../hooks/useFetchFavourites'
import FavouriteToggle from './favouriteToggle'

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
  const [mediaVisibleId, setMediaVisibleId] = useState<number | null>(null)
  const [favouriteIds, setFavouriteIds] = useState<Set<number>>(new Set())

  const { user } = useUser()

  // fetching data 
  const { favourites } = useFetchFavourites()

  const { addFavourite, removeFavourite} = FavouriteToggle()

    const filteredData = favourites?.filter((media) => media.userId === user?._id )

    return (
    <>
        <div className='flex flex-col ml-5 flex-8 g-4 rounded-2xl w-screen bg-amber-300 p-2 items-center'>
            <div className='text-6xl p-5 font-bold tracking-wide'>Favourites</div>
            <div className='grid grid-cols-4 gap-y-5 overflow-auto'>
                {filteredData?.map((media, i) =>{
                  return <MediaCard<MediaWithUser> key={i} setMediaVisibleId={setMediaVisibleId} media={media} type={media.type} favouriteIds={favouriteIds} setFavouriteIds={setFavouriteIds} addFavourite={addFavourite} removeFavourite={removeFavourite} addToHistory/>
                }
                )}
    
            </div>
        </div>
    </>
  )
}

export default Favourites