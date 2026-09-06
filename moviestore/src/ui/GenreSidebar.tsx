import ReactDom from 'react-dom'


import { useMovieGenres } from "@/context/useMovieGenres";
import { useTvGenres } from "@/context/useTvGenres";

import { Link } from "react-router-dom";
import type { SetStateAction } from 'react';
import { motion } from 'motion/react';

interface GenreSidebarProps {
  genre: "movie" | "tv" | undefined
  setIsVisibleSidebar: React.Dispatch<SetStateAction<boolean>>
}

const GenreSidebar = ({genre, setIsVisibleSidebar} : GenreSidebarProps) => {

  // fetching genres 
  const {movieGenres, isPending: isPendingMovieGenres} = useMovieGenres()
  const {tvGenres, isPending: isPendingTvGenres} = useTvGenres()


  // Creating react portal
  const portalRoot = document.getElementById('portal')
  if(!portalRoot) return null

  return ReactDom.createPortal(
      <motion.div 
      className='z-100 min-w-screen max-h-screen min-h-screen h-screen w-screen bg-black/50 fixed top-0 left-0 flex justify-start items-center flex-row gap-10 backdrop-blur-xs' 
      onClick={() => setIsVisibleSidebar(false)}
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{ opacity: 0}}
      >

        <motion.div 
        initial={{x: -300}}
        animate={{x:0}}
        exit={{x: -300}}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
        className="h-full xl:w-1/6 lg:w-1/4 md:w-1/3 shrink-0 bg-secondary rounded-r-xl flex flex-col py-3" 
        onClick={(e) => e.stopPropagation()}>
          <p className="font-bold text-3xl p-4 text-text">{genre?.toUpperCase()} GENRES</p>
          <div className="flex flex-row w-full px-4 gap-5 justify-center items-center h-full">
            
          {genre === "movie" ?
            <div className="w-full flex flex-col h-full">
              <div className="flex gap-1 flex-col h-full">
                {/* <p className="font-semibold text-xl">MOVIES</p> */}
                <div className="w-full h-full flex flex-col justify-evenly px-1">
                  {isPendingMovieGenres ? 
                    Array.from({ length: 15}).map((_, i) =>(
                    <div key={i} className="w-full h-6 bg-gray-450 animate-pulse rounded-lg" />
                    ))
                  :
                  movieGenres?.map(movieGenre => (
                    <Link key={movieGenre.id} to={`/movie/genre/${movieGenre.id}/${movieGenre.name}`} onClick={(e) => {e.stopPropagation(); setIsVisibleSidebar(false)}} className="w-fit">
                      <p className="underline-animate w-fit cursor-pointer text-lg font-semibold">{movieGenre.name}</p>
                    </Link>
                  ))
                  }
                </div>
              </div>
            </div>
            :
            <div className="w-full flex flex-col h-full">
              <div className="flex gap-1 flex-col h-full">
              {/* <p className="font-semibold text-xl">TV SHOWS</p> */}
                <div className="w-full h-full flex flex-col justify-evenly px-1">
                {isPendingTvGenres ? 
                    Array.from({ length: 15}).map((_, i) =>(
                    <div key={i} className="w-full h-6 bg-gray-450 animate-pulse rounded-lg text-text" />
                    ))
                :
                tvGenres?.map(tvGenre => (
                  <Link key={tvGenre.id} to={`/tv/genre/${tvGenre.id}/${tvGenre.name}`} className="w-fit">
                    <p  className="underline-animate w-fit cursor-pointer text-lg font-semibold ">{tvGenre.name}</p>
                  </Link>
                ))}
                </div>
              </div>
            </div>
          }
          </div>
        </motion.div>

      </motion.div>
      ,
      portalRoot
  )
}

export default GenreSidebar