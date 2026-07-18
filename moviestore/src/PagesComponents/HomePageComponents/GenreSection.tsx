import { ImageOff } from 'lucide-react'
import { Carousel } from '@mantine/carousel'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, spring } from 'motion/react'
import useGenreSection from '@/hooks/useGenreSection'

export interface GenreSectionProps {
    genreId: number,
    genreName?: string
    type: string
}

function GenreSection({genreId, genreName, type} : GenreSectionProps) {

    const navigate = useNavigate()
    const { ref, movies, loading } = useGenreSection({genreId, type})

  return (
    <>
    <AnimatePresence>
        <motion.div className="flex flex-col gap-3 font-bold p-4 py-7 rounded-2xl bg-gray-450"
        exit={{opacity: 0}}>
            <div className='flex flex-row justify-between items-center'>
                <p className='text-3xl px-2'>{genreName}</p>
                <motion.button className=' select-none p-2 px-4 rounded-lg bg-blue-400 text-white shadow-sm text-xl! cursor-pointer'
                onClick={() => navigate(`${type}/genre/${genreId}/${genreName}`)}
                whileHover={{scale: 1.02}}
                transition={{type: spring, stiffness: 150, damping: 8, mass: 1 }} 
                >
                    See more...
                </motion.button>
            </div>
            <div ref={ref} className="flex flex-row gap-11 justify">
                {loading ? (
                    <Carousel
                    slideSize={{ base: '100%', sm: '50%', md: '33.333333%', lg: '30%' }}
                    slideGap={{ base: 'sm', sm: 'md', lg: 'lg' }}
                    height='100%'
                    emblaOptions={{
                        loop: true,
                        align: 'center',
                    }}
                    classNames={{
                        viewport: 'overflow-visible! mask-x-from-80% mask-x-to-100%',
                        controls: 'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                    }}
                    className='group'
                    >
                        {movies.map((movie) => (
                            <Carousel.Slide key={movie.id}>
                                <div className='w-full aspect-video bg-gray-500 rounded-lg shadow-xl flex justify-center items-center select-none'>
                                    <ImageOff/>
                                </div>  
                            </Carousel.Slide>
                        ))}
                    </Carousel>
                ) : ( 
                    <Carousel
                    slideSize={{ base: '100%', sm: '50%', md: '33.333333%', lg: '30%' }}
                    slideGap={{ base: 'sm', sm: 'md', lg: 'lg' }}
                    height='100%'
                    emblaOptions={{
                        loop: true,
                        align: 'center',
                    }}
                    classNames={{
                        viewport: ' mask-x-from-95% mask-x-to-100%',
                        controls: 'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                    }}
                    className='group'
                    >
                        {movies.map((movie) => (
                            <Carousel.Slide key={movie.id}>
                                {movie.backdrop_path ? 
                                    <motion.img className="w-full h-auto rounded-lg  select-none cursor-pointer" src={`https://image.tmdb.org/t/p/w1280/${movie.backdrop_path}`} alt="" 
                                    whileHover={{scale: 1.02}}
                                    transition={{type: spring, stiffness: 120, damping: 8, mass: 1 }} />
                                :
                                <div className='w-full aspect-video bg-gray-500 rounded-lg shadow-xl flex justify-center items-center select-none'>
                                    <ImageOff/>
                                </div>  
                            }
                            </Carousel.Slide>
                        ))}
                    </Carousel>
                )}
            </div>
        </motion.div>
    </AnimatePresence>
    </>
  )
}

export default GenreSection