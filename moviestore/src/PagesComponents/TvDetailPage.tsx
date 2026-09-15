import { Link, useParams } from 'react-router-dom'
import { Heart, Star, UserStar } from 'lucide-react'
import useFetchVideo, { type Video } from '@/hooks/useFetchVideo'
import useFetchTvDetails from '@/hooks/useFetchTvDetails'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useUser } from '@/context/useUser'
import useFetchIds from '@/hooks/useFetchFavouriteIds'
import TvDetailsSkeleton from '@/ui/TvDetailsSkeleton'
import HistoryButton from '@/ui/HistoryButton'
import useFetchHistoryData from '@/hooks/useFetchHistoryData'
import useAddFavourite from '@/hooks/FavouriteHooks/useAddFavourite'
import useRemoveFavourite from '@/hooks/FavouriteHooks/useRemoveFavourite'
import useFetchProviders from '@/hooks/useFetchProviders'
import SeasonImg from '@/ui/SeasonImg'

const MovieDetailPage = () => {
    const [selectedSeason, setSelectedSeason] = useState<number | null>(null)
    const [currentProviderType, setCurrentProviderType] = useState<"flatrate" | "rent" | "buy" | null>(null)

    const {id} = useParams()
    const type = "tv"

    const { isError, isPending, data: details, error } = useFetchTvDetails({id})
    if(isError) console.log('An Error occured during fetching favouriteIds', error?.message)


    const { user } = useUser()

    // Fetching media ids that are marked as favourite and error handling
    const { isError: isErrorFavouriteIds, data: favouriteData, error: errorFavouriteIds } = useFetchIds({userId: user?._id, type: "favourite"})
    if(isErrorFavouriteIds) console.log('An Error occured during fetching favouriteIds', errorFavouriteIds?.message)

    // Fetching media that are in watchlist and error handling
    const { isError: isErrorHistoryIds, data: historyData, error: errorHistoryIds } = useFetchHistoryData({userId: user?._id})
    if(isErrorHistoryIds) console.log('An Error occured during fetching HistoryIds', errorHistoryIds?.message)

    const { isError: isErrorProviders, data: providersData, error: errorProviders} = useFetchProviders({id, type:"tv"})
    if(isErrorProviders) console.log('An error occured during fetching providers', errorProviders?.message)

    // Setting default value depending on the existing data
    const defaultType = (providersData?.flatrate?.length ?? 0) > 0 ? 'flatrate' 
        : (providersData?.rent?.length ?? 0) > 0 ? 'rent' 
        : (providersData?.buy?.length ?? 0) > 0 ? 'buy'
        : null

    const displayType = currentProviderType ?? defaultType

    const favouriteIds = favouriteData ?? new Set()
    const historyIds = historyData ?? new Map()

    const { mutate: addFavourite } = useAddFavourite()
    const { mutate: removeFavourite } = useRemoveFavourite()
    
    console.log(details)

    const ref = useRef(null)
    // const isInView = useInView(ref, { once: true})

    // const mainControls = useAnimation()

    const { data: videos } = useFetchVideo({type: "tv", id, enabled: !!id})

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

    // Variants for seasons container

    // const infoItemVariants = {
    //     hidden: {
    //         opacity: 0, x: -50
    //     },
    //     visible: {
    //         opacity: 1, x: 0,
    //         transition: {
    //             duration: 0.5
    //         }
    //     }
    // }

    // const infoContainerVariants = {
    //     hidden: {},
    //     visible: {
    //         transition: {
    //             staggerChildren: 0.2,
    //             delayChildren: 0.2
    //         }
    //     }
    // }

    // const imagesVariants = {
    //     hidden: {
    //         filter: "blur(10px)"
    //     },
    //     visible: {
    //         filter: "blur(0px)",
    //         transition: {
    //             duration: 0.5
    //         }
    //     }
    // }

    // ---------- //

    // Hero Page Variants
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

    const currentSeason = details?.seasons.find(s => s.season_number === selectedSeason)

    // useEffect(() => {
    //     if (isInView) {
    //         mainControls.start("visible")
    //     }
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // },[isInView])

    useEffect(() => {
        if(details?.seasons?.length && selectedSeason === null) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedSeason(details.seasons[0].season_number)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[details])
    


  return (
    <div className='w-full h-full bg-card overflow-hidden overflow-y-auto scrollbar-thumb-primary scrollbar-gutter-stable'>

        {isPending 
        ?
            <TvDetailsSkeleton />
        :
        <>
        {/* IMAGE SECTION*/}
        <div className='relative w-full h-full'> 
            <img src={`https://image.tmdb.org/t/p/original/${details?.backdrop_path}`} className='w-full h-full object-cover aspect-video' alt={details?.name} />
            <div className='absolute left-0 bottom-0 w-full h-full bg-linear-to-b to-black/80 from-gray-500/0 flex flex-row justify-between'>
                {/* TEXT  */}
                <motion.div 
                className='h-full flex flex-col justify-end text-white pr-1 py-4 px-4 sm:pr-0 sm:p-7 gap-2'
                variants={heroPageContainerVariants}
                initial="hidden"
                animate="visible"
                >
                    <motion.p 
                    className='text-4xl md:text-6xl font-extrabold'
                    variants={heroPageItemVariants}
                    >
                        {details?.name}
                    </motion.p>
                    <motion.p 
                    className='text-lg md:text-3xl font-semibold italic'
                    variants={heroPageItemVariants}
                    >
                        {details?.tagline}
                    </motion.p>
                </motion.div>
                {/* BUTTONS  */}
                <motion.div layout className='h-full py-4 px-4 md:p-7 gap-2 flex flex-col-reverse sm:flex-row items-end'>
                        <HistoryButton type={type} id={Number(id)} historyMap={historyIds}/>

                    <motion.button whileTap={{ scale: 0.9, rotate: -2 }}  whileHover={{ scale: 1.1}} 
                    className='px-3 pt-1.5 pb-2 flex justify-center backdrop-blur-md rounded-lg cursor-pointer' 
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        if(!id || !type) return

                        if(favouriteIds.has(Number(id))){
                            removeFavourite({ id: Number(id), userId: user?._id, type})
                            console.log("Usuwamy ")
                        } else {
                            addFavourite({userId: user?._id, type, id: Number(id)});
                            console.log("Dodajemy ")
                        }
                    }}>
                        {details?.id  && favouriteIds.has(details?.id) ? <Heart color='#F00' fill='#F00' size={40}/> :  <Heart color='#F00' size={40}/>}
                        </motion.button>
                </motion.div>
            </div>
        </div>

        {/* INFO SECTION  */}
        <div id='info' className='w-full h-full bg-card px-3 pt-8 pb-5 lg:p-10 flex flex-col gap-2 md:gap-5 items-center'>
            <p className='text-4xl md:text-5xl text-primary font-bold self-center'>{details?.name}</p>    

            <div className='h-fit w-full md:w-4/5 xl:w-2/3 rounded-lg py-2 xl:p-5 flex flex-col'>

                <div className='flex flex-row justify-evenly flex-wrap gap-y-2 gap-1'>
                    {details?.genres && 
                        <div className='bg-secondary rounded-2xl text-sm md:text-base flex flex-row px-5 py-2 gap-2 shadow-xl'>
                            {details?.genres.map(genre => (
                                <Link to={`/movie/genre/${genre.id}/${genre.name}`} key={genre.id} className='underline-animate'>{genre.name}</Link >
                            ))}
                        </div>
                    }
                    {/* <div className='bg-secondary rounded-2xl flex flex-row px-5 py-2 shadow-xl'>Release date: {details?.release_date.replaceAll("-", ".").split(" ")}</div> */}
                    {details?.number_of_episodes && <div className='bg-secondary rounded-2xl text-sm md:text-base flex flex-row px-5 py-2 shadow-xl'>Number of episodes: {details?.number_of_episodes}</div>}
                    {details?.number_of_seasons &&<div className='bg-secondary rounded-2xl text-sm md:text-base flex flex-row px-5 py-2 shadow-xl'>Number of seasons: {details?.number_of_seasons}</div>}

                    <div className='bg-secondary rounded-2xl text-sm md:text-base flex flex-row px-5 py-2 shadow-xl gap-1 items-center'>
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
                        <a href={`${details.homepage}`} target='_blank' rel="noopener noreferrer" className='bg-secondary text-sm md:text-base rounded-2xl flex flex-row px-5 py-2 shadow-xl underline items-center'>More here</a>
                    }


                    {/* <div className='bg-secondary rounded-2xl flex flex-row px-3'>
                        {details.}
                    </div> */}
                </div>

                <p className='p-2 py-7 font-medium lg:text-lg leading-[150%] text-text'>{details?.overview}</p>

                <div className='w-full  flex justify-center items-center pb-4 rounded-2xl'>
                    <div className='flex flex-col xl:flex-row gap-2 w-full items-center'>  
                            {videos?.filter(v => v.type === "Trailer").map(video => {
                                const embedUrl = getEmbedUrl(video)
                                if(!embedUrl) return null
                                return (
                                <div key={video.id} className='aspect-video h-full w-full justify-center'>
                                    <iframe src={embedUrl} allowFullScreen className='w-full h-full rounded-lg' />
                                </div>
                                )
                            })}  
                    </div>
                </div>
            {/* SEASON SECTION */}
            <div className='w-full border-4 border-primary rounded-2xl p-5 flex flex-col gap-3'>
                <p className='text-3xl md:text-4xl text-text font-semibold'>Seasons</p>
                <div className='w-full flex flex-row justify-center gap-5 flex-wrap'> 
                    {details?.seasons.map(season => (
                        <p key={season.id} className={`underline-animate cursor-pointer select-none spacing tracking-[+1%] ${selectedSeason === season.season_number && 'font-bold'}`} onClick={() => setSelectedSeason(season.season_number)}>{season.name}</p>
                    ))}
                </div>
                <div className='w-full flex flex-col-reverse md:flex-row-reverse justify-between p-2 gap-2' ref={ref}>

                    <SeasonImg posterPath={currentSeason?.poster_path}/>

                    <motion.div 
                    className='flex flex-col gap-3 p-2' 
                    // variants={infoContainerVariants} 
                    // initial="hidden" 
                    // animate={mainControls}
                    >
                        <motion.p 
                        // variants={infoItemVariants} 
                        className='text-xl font-semibold' 
                        id='season-name'>
                            {currentSeason?.name}
                        </motion.p>
                        <motion.p 
                        // variants={infoItemVariants} 
                        className='leading-[200%] md:text-lg md:pr-5 tracking-[-1%]' 
                        id='season-overview'>
                            {currentSeason?.overview || "No overview available for this season."}
                        </motion.p>
                        <motion.p 
                        // variants={infoItemVariants} 
                        className='flex flex-row gap-2 md:text-base text-sm' 
                        id='season-rating'
                        >
                        {currentSeason?.vote_average  ?

                            <>Rating: {currentSeason?.vote_average} <span><Star  color='yellow'/></span> </>
                            : 
                            'Not rated yet.' }
                        </motion.p>

                        <motion.p 
                        // variants={infoItemVariants} 
                        className='text-xs' 
                        id='season-airdate'
                        >
                            {currentSeason?.air_date}
                        </motion.p>
                    </motion.div>                    
                </div>                
            </div>

                {providersData && Object.keys(providersData).length > 0 ? 
                    <>
                    {/* Providers section */}
                    <div className='w-full p-5 flex flex-col justify-center'>
                        <p className='text-3xl font-bold tracking-wide text-center p-2 py-5'>PROVIDERS</p>
                        <div className='w-full flex flex-row justify-evenly py-5 text-xl font-bold text-text bg-secondary rounded-l rounded-lg'>
                            {providersData?.buy && <p className={`cursor-pointer rounded-lg p-2 transition-all duration-200 ease ${displayType === 'buy' ? 'bg-accent' : 'hover:bg-primary/50'}`} onClick={() => handleProviderClick('buy')}> BUY </p>}
                            {providersData?.flatrate && <p className={`cursor-pointer rounded-lg p-2 transition-all duration-200 ease ${displayType === 'flatrate' ? 'bg-accent' : 'hover:bg-primary/50'}`} onClick={() => handleProviderClick('flatrate')}> FLATRATE </p>}
                            {providersData?.rent && <p className={`cursor-pointer rounded-lg p-2 transition-all duration-200 ease ${displayType === 'rent' ? 'bg-accent' : 'hover:bg-primary/50'}`} onClick={() => handleProviderClick('rent')}> RENT </p>}
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
                <div className='text-2xl font-semibold py-5 w-full text-center'> No current providers for this movie</div>
                }

            </div>


        </div>
        </>

        }
    </div>
  )
}

export default MovieDetailPage