import '../.././App.css'
import { motion } from 'motion/react'
import { useContext, useEffect, useRef, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useSearchParams } from "react-router-dom"
import Autoplay from 'embla-carousel-autoplay';


import { Carousel } from '@mantine/carousel';
import { MovieGenreContext } from '@/context/MovieGenreContext'
import { TvGenreContext } from '@/context/TvMovieGenreContext'
import useFetchMedia from '@/hooks/useFetchMedia'
import GenreSection from './GenreSection'


function App() {
  const [search, setSearch] = useState("")
  const [debouncedSearch] = useDebounce(search, 400)
  const [searchParams, ] = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get('page') || 1))
  const [selectedGenre, setSelectedGenre] = useState("movie")

  // embla plugins

  const { films: movies } = useFetchMedia({page, setPage, customType: "movie"})
  const { films: shows } = useFetchMedia({page, setPage, customType: "tv"})

  const movieGenreHolder = useContext(MovieGenreContext)
  const tvGenreHolder = useContext(TvGenreContext)

  const popularShows = shows.slice(0,5)
  const popularFilms = movies.slice(0,5)

  const topMedias = [...popularFilms, ...popularShows]

  console.log("Dlugosc films to: ", movies.length)

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
          key={popularFilms.length}
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
            controls: 'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
          }}
          >
            {topMedias.map((media, i) => (
            <Carousel.Slide key={i} className='w-full h-full flex justify-center '>
              <motion.div className='relative inline-block'>

                <motion.img src={`https://image.tmdb.org/t/p/w1280/${media.backdrop_path}`} alt="" className='rounded-lg w-full h-auto select-none shadow-lg'/>
                <motion.div className="absolute inset-0 rounded-lg flex px-7 py-10 gap-2 justify-end flex-col text-white bg-linear-to-b to-gray-800/80 from-gray-500/0 cursor-pointer"
                initial={{ opacity: 0}}
                whileHover={{ opacity: 1}}
                transition={{ duration: 0.3}}>
                    <div className='text-3xl font-bold'>{media.title ?? media.name}</div>
                    <div className='flex gap-2 flex-col'>
                      <div className='flex flex-col gap-0 font-medium'> 
                        <div>{Math.round(media.vote_average * 10)}% Rating</div>
                        <div>{media.gatunki.map((g:string, i:number) => (
                          <span key={i} className=""> {i === media.gatunki.length - 1 ? g  : g+","}</span>
                          ))}
                        </div>
                      </div>
                      <motion.button className="w-20 h-9 rounded-2xl bg-red-500 cursor-pointer shadow-lg shadow-red-500/50 select-none"
                      whileHover={{scale: 1.05}}
                      >
                        Watch
                      </motion.button>
                    </div>
                </motion.div>
              </motion.div>

            </Carousel.Slide>
            ))}
          </Carousel>
        )}

      </div>

      <div className='flex flex-col min-w-full gap-4'>
        <div className='flex flex-row justify-evenly items-center gap-2 min-w-full p-5 bg-gray-500 rounded-2xl'>
          <div className='bg-gray-600 p-2 px-4 rounded-lg font-medium text-xl cursor-pointer' onClick={() => setSelectedGenre("tv")}>Shows</div>
          <div className='bg-gray-600 p-2 px-4 rounded-lg font-medium text-xl cursor-pointer' onClick={() => setSelectedGenre("movies")}>Movies</div>
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
