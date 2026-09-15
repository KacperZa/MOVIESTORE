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
    const { ref, data: movies, isPending, isError, error } = useGenreSection({genreId, type})
    if (isError) console.log('An Error occured during fetching genre sections', error?.message)

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

    const slideContainerVariants = {
        hidden: {},
        visible: {
        transition: {
            staggerChildren: 0.4
        }
        }
    }
  return (
    <>
    <AnimatePresence>
        <motion.div className="flex flex-col gap-3 font-bold p-4 py-7 rounded-2xl bg-card"
        exit={{opacity: 0}}>
            <div className='flex flex-row justify-between items-center'>
                <p className='text-3xl px-2'>{genreName}</p>
                <motion.button className=' select-none p-2 px-4 rounded-lg border-4 border-primary bg-accent  shadow-sm text-xl! cursor-pointer'
                onClick={() => navigate(`${type}/genre/${genreId}/${genreName}`)}
                whileHover={{scale: 1.02}}
                whileTap={{ scale: 0.98}}
                >
                    See more...
                </motion.button>
            </div>
            <div ref={ref} className="flex flex-row gap-11 justify">
                {isPending ? 
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
                        {movies?.map((movie) => (
                            <Carousel.Slide key={movie.id}>
                                <div className='w-full h-auto aspect-video bg-gray-500 animate-pulse rounded-lg shadow-xl flex justify-center items-center select-none'>
                                    <ImageOff size={50}/>
                                </div>  
                            </Carousel.Slide>
                        ))}
                    </Carousel>
                 : ( 
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
                        {movies && movies.map((movie) => (
                            <Carousel.Slide key={movie.id} className='w-full h-full'>
                                {movie.backdrop_path ? 
                                <>
                                <motion.div className='relative inline-block cursor-pointer'
                                variants={slideContainerVariants} 
                                initial="hidden"
                                whileHover="visible"
                                onClick={() => navigate(`/detail/${type}/${movie.id}`)}
                                >
                                    <motion.img className="w-full h-auto rounded-lg select-none cursor-pointer " src={`https://image.tmdb.org/t/p/w1280/${movie.backdrop_path}`} alt={movie.name ?? movie.title} 
                                    transition={{type: spring, stiffness: 120, damping: 8, mass: 1 }} />
                                    <motion.div 
                                    className='absolute inset-0 text-white bg-linear-to-b to-gray-800/80 from-gray-500/0 rounded-lg flex justify-start items-end p-4'
                                    variants={slideOverlayVariants}
                                    initial="hidden"
                                    whileHover="visible">
                                        <div className='flex flex-col'>
                                            <motion.p 
                                            className='text-2xl'
                                            variants={slideItemVariants}>
                                                {movie.name ?? movie.title}
                                            </motion.p>
                                            <div className='flex flex-col'>
                                                <motion.p 
                                                className='font-medium'
                                                variants={slideItemVariants}>
                                                    {Math.round(movie.vote_average * 10)}% Rating
                                                </motion.p>
                                                <motion.div
                                                variants={slideItemVariants}>
                                                {(movie.gatunki ?? [])
                                                .map((g, i, arr: string[]) => (
                                                    <span key={i} className="font-semibold text-xs"> {i === arr.length - 1 ? g  : g+","}</span>
                                                    )
                                                )}
                                                </motion.div>
                                            </div>
                                        </div>
                                    </motion.div>

                                </motion.div>
                                </>
                                    
                                :
                                <div className='w-full aspect-video bg-gray-500 rounded-lg shadow-xl flex justify-center items-center select-none'>
                                    <ImageOff size={50}/>
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