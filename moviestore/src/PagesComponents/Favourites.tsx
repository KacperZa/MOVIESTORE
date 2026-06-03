import React, { useEffect, useState } from 'react'
import { useUser } from '../context/useUser'
import { motion, spring } from 'motion/react'
import { FavouriteIcon, NoImageIcon } from '../components/Icons'
import { Link } from 'react-router-dom'


function Favourites() {

    interface Media {
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
    }

    const [favourites, setFavourites] = useState<Media[]>([])

    const { user } = useUser()

    useEffect(() => {
        const favourites = async () => {
            const res = await fetch('http://localhost:5000/favourite/', {
                method: 'GET'
            })
            const data = await res.json()
            console.log(data)
            setFavourites(data)
        }
        favourites()
    },[])

    const filteredData = favourites.filter((media) => media.userId === user?._id )

    return (
    <>
        <div className='flex flex-col ml-5 flex-8 g-4 rounded-2xl w-screen bg-amber-300 p-2 items-center'>
            <div className='text-6xl p-5 font-medium tracking-wide'>Favourites</div>
            <div className='grid grid-cols-4'>
                {filteredData.map((media, i) => (
              <motion.div key={i} 
              initial={{ opacity: 0, x: -200, scale: 1}}
              animate={{ opacity: 1, x: 0}}
              whileHover={{scale: 1.05}}
              transition={{type: spring, stiffness: 100, damping: 10, mass: 1 }}
              // exit={{ opacity: 0, x: -200}}
              className="aspect-2/3 m-0 relative w-7/10 mx-auto"
              >
 
                <Link to={`/movie/${media.tmdbId}`}>
                <motion.div className="" initial="hidden" whileHover="visible" transition={{ duration: 0.3, staggerChildren: 0, when: "beforeChildren"}}>
                  {/* Default image if poster image doesn't exist */}
                {media.poster_path ? 
                <img src={`https://image.tmdb.org/t/p/w500/${media.poster_path}`} className=" aspect-2/3 rounded-xl shadow-lg/20 justify-self-center select-none" />
                : 
                <div className="aspect-2/3 bg-gray-500 flex rounded-2xl justify-center items-center"> 
                  <div className="">
                  <NoImageIcon />
                  </div>
                </div>
              }
              {/* Overlay for posters  */}
              <motion.div className={`absolute inset-0 flex px-7 py-10  gap-2 ${media.adult ? `justify-between` : `justify-end`} items-center flex-col text-white bg-linear-to-b to-gray-800/80 from-gray-500/0 rounded-xl`}
                  variants={{
                    hidden: { opacity: 0, y:0},
                    visible: { opacity: 1, y:0}
                  }}
                  transition={{ duration: 0.3}}>

                  {media.adult ? <div className="bg-red-500 px-2 py-1 rounded-lg">18+</div> : null }

                  <motion.div className="flex flex-col items-center"
                  variants={{
                    hidden: { opacity: 0, y: 10},
                    visible: { opacity: 1, y: 0, }  
                  }}
                  transition={{duration: 0.3}}
                  >
                    <div className="text-xl font-bold text-center">{media.title}</div>
                      {/* <div className="flex flex-row w-1/2 text-xs justify-center items-center gap-1.5">
                          <div className=""><FavouriteIcon size="1.5em" color="#ff0" fill="#ff0"/></div>
                          <div>{Math.round(media.vote_average * 10)}%</div>
                      </div> */}

                  </motion.div>
              </motion.div>
              </motion.div>
                </Link>
              </motion.div>
            ))}
    
            </div>
        </div>
    </>
  )
}

export default Favourites