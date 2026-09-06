import { Link, useParams } from 'react-router-dom'
import { Heart, Plus, Star, UserStar } from 'lucide-react'
import useFetchVideo, { type Video } from '@/hooks/useFetchVideo'
import useFetchTvDetails from '@/hooks/useFetchTvDetails'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import FavouriteToggle from './FavouriteToggle'
import { useUser } from '@/context/useUser'
import useFetchIds from '@/hooks/useFetchIds'
import HistoryToggle from './HistoryToggle'
import TvDetailsSkeleton from '@/ui/TvDetailsSkeleton'

const MovieDetailPage = () => {
    const [selectedSeason, setSelectedSeason] = useState<number | null>(null)
    const {id} = useParams()
    const type = "tv"

    const { isError, isPending, data: details, error } = useFetchTvDetails({id})
    if(isError) console.log('An Error occured during fetching favouriteIds', error?.message)


    const { user } = useUser()

    const { isError: isErrorFavouriteIds, data: favouriteData, error: errorFavouriteIds } = useFetchIds({userId: user?._id, type: "favourite"})
    if(isErrorFavouriteIds) console.log('An Error occured during fetching favouriteIds', errorFavouriteIds?.message)

    const { isError: isErrorHistoryIds, data: historyData, error: errorHistoryIds } = useFetchIds({userId: user?._id, type: "history"})
    if(isErrorHistoryIds) console.log('An Error occured during fetching HistoryIds', errorHistoryIds?.message)

    const favouriteIds = favouriteData ?? new Set()
    const historyIds = historyData ?? new Set()

    const { addFavourite, removeFavourite } = FavouriteToggle()
    const { addHistory, removeHistory } = HistoryToggle()
    
    console.log(details)

    const ref = useRef(null)
    // const isInView = useInView(ref, { once: true})

    // const mainControls = useAnimation()

    const videos = useFetchVideo({type: "tv", id, enabled: !!id})

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
                    <motion.button 
                    className={`${historyIds.has(Number(id)) ? 'bg-red-950' : 'bg-green-950'} text-white px-3 pt-1.5 pb-2 flex justify-center backdrop-blur-md rounded-lg cursor-pointer items-center gap-1`}
                    onClick={(e) => {
                        // console.log("HISTORY IDS:", historyIds)
                        // console.log("historyIds.has:", historyIds.has(Number(id)))
                        if(!id || !type) return
                        if(historyIds.has(Number(id))){
                            removeHistory({e, id: Number(id)})
                            console.log("Usuwamy z WATCHED")
                        } else {
                            addHistory({e, type, id: Number(id)});
                            console.log("Dodajemy DO WATCHED")
                        }
                    }}>
                        <motion.div variants={plusVariants} initial={historyIds.has(Number(id)) ? "remove": "add"} animate={historyIds.has(Number(id)) ? "remove": "add"}>
                            <Plus size={40} color={historyIds.has(Number(id)) ? 'red' : 'green'}/>
                        </motion.div>
                        <p className='text-sm md:text lg:text-lg'>
                            {historyIds.has(Number(id)) ? 'In watch history' : 'Add to history'}
                        </p>
                        {/* MARK AS WATCHED */}
                    </motion.button>
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

        {/* INFO SECTION  */}
        <div id='info' className='w-full h-full bg-card px-3 pt-8 pb-5 lg:p-10 flex flex-col gap-2 md:gap-5 items-center'>
            <p className='text-4xl md:text-5xl text-primary font-bold self-center'>{details?.name}</p>    

            <div className='h-fit w-full md:w-4/5 xl:w-2/3 rounded-lg py-2 xl:p-5 flex flex-col'>

                <div className='flex flex-row justify-evenly flex-wrap gap-y-2 gap-1'>
                    <div className='bg-secondary rounded-2xl text-sm md:text-base flex flex-row px-5 py-2 gap-2 shadow-xl'>
                        {details?.genres.map(genre => (
                            <Link to={`/movie/genre/${genre.id}/${genre.name}`} key={genre.id} className='underline-animate'>{genre.name}</Link >
                        ))}
                    </div>
                    {/* <div className='bg-secondary rounded-2xl flex flex-row px-5 py-2 shadow-xl'>Release date: {details?.release_date.replaceAll("-", ".").split(" ")}</div> */}
                    <div className='bg-secondary rounded-2xl text-sm md:text-base flex flex-row px-5 py-2 shadow-xl'>Number of episodes: {details?.number_of_episodes}</div>
                    <div className='bg-secondary rounded-2xl text-sm md:text-base flex flex-row px-5 py-2 shadow-xl'>Number of seasons: {details?.number_of_seasons}</div>

                    <div className='bg-secondary rounded-2xl text-sm md:text-base flex flex-row px-5 py-2 shadow-xl gap-1 items-center'>
                        <p><UserStar /></p>
                        <p>Rating: {details?.vote_average.toFixed(1)}</p>
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
                    <motion.img 
                    src={`https://image.tmdb.org/t/p/w780/${currentSeason?.poster_path}`}
                    // variants={imagesVariants}
                    // initial="hidden" 
                    // animate={mainControls}
                    id='season-img' 
                    loading='lazy' 
                    className='w-full md:w-1/2 aspect-auto rounded-lg'/>
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

            </div>


        </div>
        </>

        }
    </div>
  )
}

export default MovieDetailPage