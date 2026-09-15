import useFetchMovieDetails from '@/hooks/useFetchMovieDetails'
import { Link, useParams } from 'react-router-dom'
import useRuntime from '@/utils/calculateRuntime'
import { Clock, DollarSign, Heart, Plus, UserStar } from 'lucide-react'
import useFetchVideo, { type Video } from '@/hooks/useFetchVideo'
import { animate, inView, motion, stagger } from 'motion/react'
import { useUser } from '@/context/useUser'
import useFetchIds from '@/hooks/useFetchFavouriteIds'
import MovieDetailsSkeleton from '@/ui/MovieDetailsSkeleton'
import useAddFavourite from '@/hooks/FavouriteHooks/useAddFavourite'
import useRemoveFavourite from '@/hooks/FavouriteHooks/useRemoveFavourite'
import useFetchProviders from '@/hooks/useFetchProviders'

const MovieDetailPage = () => {
    const [currentProviderType, setCurrentProviderType] = useState<"flatrate" | "rent" | "buy" | null>(null)

    const { id } = useParams()

    console.log('MOVIES ID: ', id)

    const type = "movie"

    const { isError, isPending: isPendingDetails, data: details, error } = useFetchMovieDetails({id})

    if(isError) console.log('An error occured during fetching movie details', error?.message)

    console.log(details)

    const {user} = useUser()

    const { hoursRuntime, minutesRuntime } = useRuntime(details?.runtime)

    const { isError: isErrorFavouriteIds, data: favouriteData, error: errorFavouriteIds } = useFetchIds({userId: user?._id, type: "favourite"})
    if(isErrorFavouriteIds) console.log('An Error occured during fetching favouriteIds', errorFavouriteIds?.message)

    const { isError: isErrorHistoryIds, data: historyData, error: errorHistoryIds } = useFetchIds({userId: user?._id, type: "history"})
    if(isErrorHistoryIds) console.log('An Error occured during fetching HistoryIds', errorHistoryIds?.message)

    const { isError: isErrorProviders, data: providersData, error: errorProviders, isPending: isPendingProviders} = useFetchProviders({id, type:"movie"})
    if(isErrorProviders) console.log('An error occured during fetching providers', errorProviders?.message)


    console.log('Providers: ', providersData, 'pending:', isPendingProviders, 'error:', errorProviders)

    // Setting default value depending on the existing data
    const defaultType = (providersData?.flatrate?.length ?? 0) > 0 ? 'flatrate' 
        : (providersData?.rent?.length ?? 0) > 0 ? 'rent' 
        : (providersData?.buy?.length ?? 0) > 0 ? 'buy'
        : null

    const displayType = currentProviderType ?? defaultType

    const favouriteIds = favouriteData ?? new Set()
    const historyIds = historyData ?? new Set()

    const { data: videos, isError: isErrorVideos, error: errorVideos } = useFetchVideo({type: "movie", id, enabled: !!id})

    if(isErrorVideos) console.log('An error occured during fetching videos: ', errorVideos?.message)

    
    const handleProviderClick = (type: "flatrate" | "rent" | "buy") => {
        setCurrentProviderType(type)
    }


    const getEmbedUrl = (video: Video) => {
        switch(video.site) {
            case "YouTube":
                return `https://www.youtube.com/embed/${video.key}`
            case "Vimeo": 
                return `https://player.vimeo.com/video/${video.key}`
            default:
                return null
        }
    }

    // Scroll animation for videos 
    inView('#trailer-container', () => {
        const trailer = document.querySelectorAll('.trailer-video')

        animate(
            trailer,
            { opacity: 1, filter: 'blur(0px)'},
            {duration: 0.5, delay: stagger(0.1)}
        )
        return () => {
            animate(trailer,
                {opacity: 0, filter: 'blur(10px)'}
            )
        }
    })

    // Variants for 

    const heroPageItemVariants = {
        hidden: {
            opacity: 0,
            x: -50,
            filter: 'blur(10px)',
        },
        visible: {
            opacity: 1,
            x: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 0.7
            }
        }
    }

    const heroPageContainerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.2
            }
        }
    }

    // Variants for add to watch history list 

    const plusVariants = {
        add: {
            rotate: 0
        },
        remove: {
            rotate: 45,
            transition: {
                duration: 0.2
            }
        }       
    }


    console.log('user._id in component:', user?._id)

  
return (
    <div className='w-full h-full bg-card overflow-hidden overflow-y-auto scrollbar-thumb-primary scrollbar-gutter-stable pb-2'>
        {isPendingDetails ?
        <>
        <MovieDetailsSkeleton />
        </>    
        :
        <>
        {/* IMAGE  SECTION*/}
            <div className='relative w-full h-full'> 
                <img src={`https://image.tmdb.org/t/p/w1280/${details?.backdrop_path}`} className='w-full h-full object-cover aspect-video' alt={details?.title} />
                
                {/* overlay  */}
                <div className='absolute left-0 bottom-0 w-full h-full bg-linear-to-b to-black/80 from-gray-500/0 flex flex-row justify-between'>

                    <div className='h-full flex flex-col flex-evenly justify-end p-7 gap-2'>
                        {details?.adult && <div className='bg-red-500 w-fit text-xl py-1 px-2 rounded-lg font-bold'>18+</div>}
                        <motion.div 
                        className='flex flex-col justify-end text-white gap-2'
                        variants={heroPageContainerVariants}
                        initial="hidden"
                        animate="visible"
                        >
                            <motion.p 
                            className='text-4xl md:text-6xl font-extrabold'
                            variants={heroPageItemVariants}>
                                {details?.title}
                            </motion.p>
                            <motion.p 
                            className='text-lg md:text-3xl font-semibold italic'
                            variants={heroPageItemVariants}>
                                {details?.tagline}
                            </motion.p>
                        </motion.div>
                    </div>
                    {/* Buttons  */}
                    <motion.div  className='h-full p-7 gap-2 flex items-end '>
                        <HistoryButton type={type} id={Number(id)} historyMap={historyIds}/>

                        <motion.button whileTap={{ scale: 0.9, rotate: -2 }}  whileHover={{ scale: 1.1}} 
                        className='px-3 pt-1.5 pb-2 flex justify-center backdrop-blur-md rounded-lg cursor-pointer' 
                        onClick={(e) => {
                            // console.log("favouriteIds.has:", favouriteIds.has(Number(id)))
                            if(!id || !type) return
                            if(favouriteIds.has(Number(id))){
                                removeFavourite({e, id: Number(id)})
                                console.log("Usuwamy ")
                            } else {
                                addFavourite({e, type, id: Number(id)});
                                console.log("Dodajemy ")
                            }
                        }}>
                            {details?.id  && favouriteIds.has(details?.id) ? <Heart color='#F00' fill='#F00' size={40}/> :  <Heart color='#F00' size={40}/>}
                            </motion.button>
                    </motion.div>
                </div>

            </div>
            <div id='info' className='w-full h-fit bg-card p-5 flex flex-col gap-5 items-center'>
                <p className='text-5xl text-primary font-bold self-center'>{details?.title}</p>    

                <div className='h-fit w-full md:w-4/5 lg:w-2/3 rounded-lg p-5 flex flex-col'>

                    <div className='flex flex-row justify-evenly flex-wrap gap-y-2 gap-1'>
                        <div className='bg-secondary rounded-2xl flex flex-row px-5 py-2 gap-2 shadow-xl'>
                            {details?.genres && details.genres.length > 0 ? details?.genres.map(genre => (
                                <Link to={`/movie/genre/${genre.id}/${genre.name}`} key={genre.id} className='underline-animate'>{genre.name}</Link>
                            ))
                            :
                            <p>No genres provided</p>
                            }
                        </div>
                        <div className='bg-secondary rounded-2xl flex flex-row px-5 py-2 shadow-xl gap-1'>
                                <p><Clock /></p>
                                <p>{hoursRuntime}h {minutesRuntime}min</p>
                        </div>

                        <div className='bg-secondary rounded-2xl flex flex-row px-5 py-2 shadow-xl'>
                        {details?.release_date ? 
                            <>Release date: {details?.release_date.replaceAll("-", ".").split(" ")}</>
                            :
                            <p> No release date provided</p>
                        }
                        </div> 

                        <div className='bg-secondary rounded-2xl flex flex-row px-5 py-2 shadow-xl gap-1'>
                        {details?.vote_average ?
                        <>
                            <p><UserStar /></p>
                            <p>Rating: {details?.vote_average.toFixed(1)}</p>
                        </>
                        :
                        <p>Not rated yet</p>
                        }
                        </div>
                        
                        {details?.homepage &&
                            <a href={`${details.homepage}`} target='_blank' rel="noopener noreferrer" className='bg-secondary rounded-2xl flex flex-row px-5 py-2 shadow-xl underline'>More here</a>
                        }
                    </div>

                    <p className='p-2 py-7 font-medium text-lg leading-[150%] text-text'>{details?.overview}</p>

                    <div className='w-full flex flex-col md:flex-row justify-around items-center flex-wrap bg-primary py-4 rounded-2xl gap-2'>
                        <DollarSign color='white'/>
                        <div className='flex flex-col md:flex-row justify-evenly w-1/2 gap-2'>
                            <div className='bg-secondary rounded-2xl flex flex-row px-5 py-2 shadow-xl'>
                                {details?.revenue ?
                                <>Revenue: {details?.revenue}$</>
                                :
                                <p>No revenue data provided</p>
                            }
                            </div>
                            <div className='bg-secondary rounded-2xl flex flex-row px-5 py-2 shadow-xl'>
                                {details?.budget ?
                                <>Budget: {details?.budget}$</>
                                :
                                <p>No budget data provided</p>
                            }
                            </div>
                        </div>
                    </div>


                </div>


                {/* Videos  */}
                    {videos && Object.keys(videos).length > 0 ? 
                        <div className='w-full flex justify-center items-center pb-4 rounded-2xl'>
                                <div id='trailer-container' className='flex flex-col xl:flex-row gap-2 w-full items-center justify-center'>  
                                        {videos?.filter(v => v.type === "Trailer").map(video => {
                                            const embedUrl = getEmbedUrl(video)
                                            if(!embedUrl) return null
                                            return (
                                            <div key={video.id} className='aspect-video h-full md:w-4/5 w-full justify-center trailer-video'>
                                                <iframe src={embedUrl} allowFullScreen className='w-full h-full rounded-lg' />
                                            </div>
                                            )
                                        })}  
                                </div>
                        </div>
                    :
                    <p className='text-2xl font-semibold '> No trailers provided for this movie</p>
                    }

                {providersData && Object.keys(providersData).length > 0 ? 
                    <>
                    {/* Providers section */}
                    <div className='w-2/3 p-5 flex flex-col justify-center'>
                        <p className='text-3xl font-bold tracking-wide text-center p-2 py-5'>PROVIDERS</p>
                        <div className='w-full flex flex-row justify-evenly py-5 text-xl font-bold text-text bg-secondary rounded-l rounded-lg'>
                            {providersData?.buy && <p className={`cursor-pointer rounded-lg p-2 transition-all duration-200 ease ${displayType === 'buy' ? 'bg-accent' : 'hover:bg-primary/50'}`} onClick={() => handleProviderClick('buy')}> BUY </p>}
                            {providersData?.flatrate && <p className={`cursor-pointer rounded-lg p-2 transition-all duration-200 ease ${displayType === 'flatrate' ? 'bg-accent' : 'hover:bg-primary/50'}`} onClick={() => handleProviderClick('flatrate')}> FLATRATE </p>}
                            {providersData?.rent && <p className={`cursor-pointer rounded-lg p-2 transition-all duration-200 ease ${displayType === 'rent' ? 'bg-accent' :'hover:bg-primary/50'}`} onClick={() => handleProviderClick('rent')}> RENT </p>}
                        </div>
                        <div className='w-full flex flex-row gap-2 justify-evenly p-2 py-10 flex-wrap gap-y-3'>
                            {displayType && providersData?.[displayType]?.map(provider => (
                                <div className='flex items-center flex-col'>
                                    <img src={`https://image.tmdb.org/t/p/w92/${provider.logo_path}`} alt={provider.provider_name} className='rounded-lg' />
                                    <p className='py-2 text-lg'>{provider.provider_name}</p>
                                </div>
                            ))}
                        </div>

                    </div>
                </>
                :
                <div className='text-2xl font-semibold py-5'> No current providers for this movie</div>
                }

            </div>
        </>
        }
    </div>
    )
  }

export default MovieDetailPage

