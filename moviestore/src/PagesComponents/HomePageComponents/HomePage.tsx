import '../.././App.css'
import { motion } from 'motion/react'
import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom"
import Autoplay from 'embla-carousel-autoplay';


import { Carousel } from '@mantine/carousel';
import { MovieGenreContext } from '@/context/MovieGenreContext'
import { TvGenreContext } from '@/context/TvMovieGenreContext'
import useFetchMedia from '@/hooks/useFetchMedia'
import GenreSection from './GenreSection'


function App() {
  const [searchParams, ] = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get('page') || 1))
  const [selectedGenre, setSelectedGenre] = useState("movie")

  
  const { films: movies } = useFetchMedia({page, setPage, customType: "movie"})
  const { films: shows } = useFetchMedia({page, setPage, customType: "tv"})
  
  const movieGenreHolder = useContext(MovieGenreContext)
  const tvGenreHolder = useContext(TvGenreContext)

  const navigate = useNavigate()

  const moviesWithType = movies.map(movie => {
    return {
      ...movie,
      type: "movie"
    }
  })

  const showsWithType = shows.map(show => {
    return {
      ...show,
      type: "tv"
    }
  })

  const slideItemVariants = {
    hidden: {
      y: 10,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4
      }
    }
  }

  const slideContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.4
      }
    }
  }

  const slideOverlayVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  }
  
  const popularShows = showsWithType.slice(0,5)
  const popularMovies = moviesWithType.slice(0,5)
  
  const topMedias = [...popularMovies, ...popularShows]
  
  console.log("Dlugosc films to: ", movies.length)
  
  // embla plugins
  // eslint-disable-next-line react-hooks/refs
  const autoplay = useRef(
    Autoplay({ delay: 3000})
  ).current

  console.log( selectedGenre + "genre", movieGenreHolder)

  useEffect(() => {
    console.log(movies)
      console.log("Dlugosc films to: ", movies.length)

  },[movies])
  return (
  <>

    {/* MAIN PANEL  */}
    <div className="flex flex-col w-full h-full items-center gap-5 rounded-2xl bg-background pb-6 max-w-full overflow-y-auto overflow-x-hidden scrollbar-thumb-gray-600  scrollbar-gutter-stable">

      <div className="flex flex-row gap-16 items-center w-full">

        {/* OBRAZEK */}
        {movies.length > 0 && (
          <Carousel withIndicators 
          height='100%' 
          key={popularShows.length}
          slideSize={{base: "80%", sm: "30%", md: "60%"}}
          slideGap={{ base: 'sm', sm: 'md', lg: 'lg' }}
          controlSize={30}
          
          plugins={[autoplay]}
          onMouseEnter={() => {autoplay.stop(); console.log('najechane')}}
          onMouseLeave={() => autoplay.play()}
          emblaOptions={{
            loop: true,
            align: 'center',
          }}
          className='group'
          classNames={{
            viewport: 'overflow-visible! mask-x-from-80% mask-x-to-100%',
            controls: 'opacity-0 group-hover:opacity-100 transition-opacity duration-300 !px-20',
            indicators: 'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
          }}
          >
            {topMedias.map(media => (
            <Carousel.Slide key={media.id} className='w-full h-full flex justify-center '>
              <motion.div className='relative inline-block'
              onClick={() => navigate(`/detail/${media.type}/${media.id}`)}
              variants={slideContainerVariants} 
              initial="hidden"
              whileHover="visible"
              >

                <motion.img src={`https://image.tmdb.org/t/p/w1280/${media.backdrop_path}`} alt="" className='rounded-lg w-full h-auto select-none shadow-lg'/>
                <motion.div className="absolute inset-0 rounded-lg flex px-7 py-10 gap-2 justify-end flex-col text-white bg-linear-to-b to-gray-800/80 from-gray-500/0 cursor-pointer"
                variants={slideOverlayVariants}
                initial="hidden"
                whileHover="visible">
                    <motion.div variants={slideItemVariants} className='text-3xl font-bold'>{media.title ?? media.name}</motion.div>
                      <div className='flex flex-col gap-0 font-medium'> 
                        <motion.div
                        variants={slideItemVariants}
                        >
                          {Math.round(media.vote_average * 10)}% Rating</motion.div>
                        <motion.div
                        variants={slideItemVariants}
                        >
                          {(media.gatunki ?? [])
                            .map((g, i, arr: string[]) => (
                              <span key={i} className="font-semibold"> {i === arr.length - 1 ? g  : g+","}</span>
                            )
                          )}
                        </motion.div>
                    </div>
                </motion.div>
              </motion.div>

            </Carousel.Slide>
            ))}
          </Carousel>
        )}

      </div>

      <div className='flex flex-col min-w-full gap-4'>
        <div className='flex flex-row justify-evenly items-center gap-2 min-w-full p-5 bg-secondary rounded-2xl'>
          <motion.div 
          className={` bg-accent p-2 px-5 rounded-lg font-medium text-xl cursor-pointer select-none ${selectedGenre === "tv" && 'shadow-2xs'}`} 
          onClick={() => setSelectedGenre("tv")}
          whileHover={{scale: 1.02}}
          transition={{type: "spring", stiffness: 150, damping: 8, mass: 1 }} 
          >
            Shows
          </motion.div>
          <motion.div 
          className={`bg-accent p-2 px-5 rounded-lg font-medium text-xl cursor-pointer select-none ${selectedGenre === "movies" && 'shadow-2xs'}`} 
          onClick={() => setSelectedGenre("movies")}
          whileHover={{scale: 1.02}}
          transition={{type: "spring", stiffness: 150, damping: 8, mass: 1 }} 
          >
            Movies
          </motion.div>
        </div>

        {selectedGenre === "movies" ? 
          movieGenreHolder?.map((movieGenre) => {
            return <GenreSection type='movie' key={`movie-${movieGenre.id}`} genreId={movieGenre.id} genreName={movieGenre.name}/>
          }): tvGenreHolder?.map((tvGenre) => {
            return <GenreSection type='tv' key={`tv-${tvGenre.id}`} genreId={tvGenre.id} genreName={tvGenre.name}/>
          })
        
        }
      </div>
      

    </div>
      </>
)
}

export default App
