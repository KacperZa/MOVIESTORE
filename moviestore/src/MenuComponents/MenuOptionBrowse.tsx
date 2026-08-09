import type React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Link } from "react-router-dom"
import { useState, useContext } from "react"
import { MovieGenreContext } from "../context/MovieGenreContext"
import { TvGenreContext } from "../context/TvMovieGenreContext"


interface MenuOptionsProps {
  text: string
  icon: React.ReactNode
  // url: string
}

function MenuOption({ text, icon}: MenuOptionsProps) {
  const [isOpen, setIsOpen] = useState<boolean | null>(false)

  const movieGenres = useContext(MovieGenreContext);
  const tvGenres = useContext(TvGenreContext);


  if (movieGenres?.length !== 0 && tvGenres?.length !== 0){
    console.log("Dziala menu")
  }
  return (
    <>
    <div className="relative group w-fit" >
      <div className=" w-full cursor-pointer">
          <motion.div 
          className="flex flex-row items-center gap-3 p-2 rounded-lg hover:bg-blue-500 transition-all ease-in-out duration-350"
          onClick={() => setIsOpen(prev => !prev)}>
              {icon}
              <div className='text-xl font-medium'>
                {text}
                </div>
          </motion.div>
      </div>
      <AnimatePresence>
      {/* DROPDOWN */}
      {isOpen && 
        <motion.div 
        initial={{ opacity: 0, height: 0}}
        animate={{ opacity: 1, height: "auto"}}
        exit={{ opacity:0, height: 0}}
        transition={{duration: 0.3}}
        className="absolute"
        >
          <div className="bg-blue-300 px-3 py-1.5 mt-2 rounded-lg w-full z-50">
            <div className="flex flex-row gap-1 ">
              <ul className="flex flex-col gap-1 p-2 py-1 font-medium border-r-amber-700"> {/* List of movie genres */}
                  <Link to={`/browse/movie`}>
                    <div className="font-bold w-full pb-1 underline-animate
                    "> MOVIES</div>
                  </Link> 
                {movieGenres?.map((genres, id) => (
                  <Link to={`movie/genre/${genres.id}/${genres.name}`} key={id} className="w-fit underline-animate
                    ">
                    {genres.name}
                  </Link> 
                ))}
              </ul>
              <ul className="flex flex-col gap-1 p-2 py-1 font-medium"> {/* List of tv genres */}
                  <Link to={`/browse/tv`}>
                    <div className="font-bold w-full pb-1 underline-animate"> TV SERIES</div>
                  </Link> 
                {tvGenres?.map((genres, id) => (
                  <Link to={`tv/genre/${genres.id}/${genres.name}`} key={id} className="w-fit underline-animate"> {genres.name}
                  </Link> 
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
    } 
    </AnimatePresence>
        {/* DROPDOWN */}
      
      </div>
    </>
  )
}

export default MenuOption