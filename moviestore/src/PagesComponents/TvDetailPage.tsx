import { Link, useParams } from 'react-router-dom'
import { Star, UserStar } from 'lucide-react'
import useFetchVideo, { type Video } from '@/hooks/useFetchVideo'
import useFetchTvDetails from '@/hooks/useFetchTvDetails'
import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation, useInView } from 'motion/react'

const MovieDetailPage = () => {
    const [selectedSeason, setSelectedSeason] = useState<number | null>(null)
    const {id} = useParams()

    const { details } = useFetchTvDetails({id})
    console.log(details)

    const ref = useRef(null)
    const isInView = useInView(ref, { once: true})

    const mainControls = useAnimation()

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


    const infoItemVariants = {
        hidden: {
            opacity: 0, x: -50
        },
        visible: {
            opacity: 1, x: 0,
            transition: {
                duration: 0.5
            }
        }
    }

    const infoContainerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.2
            }
        }
    }

    const imagesVariants = {
        hidden: {
            filter: "blur(10px)"
        },
        visible: {
            filter: "blur(0px)",
            transition: {
                duration: 0.5
            }
        }
    }

    const currentSeason = details?.seasons.find(s => s.season_number === selectedSeason)

    useEffect(() => {
        if (isInView) {
            mainControls.start("visible")
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isInView])

    useEffect(() => {
        if(details?.seasons?.length && selectedSeason === null) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedSeason(details.seasons[0].season_number)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[details])
    


  return (
    <div className='w-full h-full bg-card overflow-hidden overflow-y-auto scrollbar-thumb-primary scrollbar-gutter-stable'>
        {/* IMAGE SECTION*/}
        <div className='relative w-full h-full'> 
            <img src={`https://image.tmdb.org/t/p/original/${details?.backdrop_path}`} className='w-full h-full object-cover aspect-video' alt={details?.name} />
            <div className='absolute left-0 bottom-0 w-full h-full bg-linear-to-b to-black/80 from-gray-500/0'>
                <div className='h-full w-full flex flex-col justify-end text-white p-7 gap-2'>
                    <p className='text-6xl font-extrabold'>{details?.name}</p>
                    <p className='text-3xl font-semibold italic'>{details?.tagline}</p>
                </div>
            </div>
        </div>

        {/* INFO SECTION  */}
        <div id='info' className='w-full h-full bg-card p-10 flex flex-col gap-5 items-center'>
            <p className='text-5xl text-primary font-bold self-center'>{details?.name}</p>    

            <div className='h-full w-2/3 rounded-lg p-5 flex flex-col gap-2'>

                <div className='flex flex-row justify-evenly flex-wrap gap-y-2 gap-1'>
                    <div className='bg-secondary rounded-2xl flex flex-row px-5 py-2 gap-2 shadow-xl'>
                        {details?.genres.map(genre => (
                            <Link to={`/movie/genre/${genre.id}/${genre.name}`} key={genre.id} className='underline-animate'>{genre.name}</Link >
                        ))}
                    </div>
                    {/* <div className='bg-secondary rounded-2xl flex flex-row px-5 py-2 shadow-xl gap-1'>
                            <p><Clock /></p>
                            <p>{hoursRuntime}h {minutesRuntime}min</p>
                    </div> */}

                    {/* <div className='bg-secondary rounded-2xl flex flex-row px-5 py-2 shadow-xl'>Release date: {details?.release_date.replaceAll("-", ".").split(" ")}</div> */}
                    <div className='bg-secondary rounded-2xl flex flex-row px-5 py-2 shadow-xl'>Number of episodes: {details?.number_of_episodes}</div>
                    <div className='bg-secondary rounded-2xl flex flex-row px-5 py-2 shadow-xl'>Number of seasons: {details?.number_of_seasons}</div>

                    <div className='bg-secondary rounded-2xl flex flex-row px-5 py-2 shadow-xl gap-1'>
                        <p><UserStar /></p>
                        <p>Rating: {details?.vote_average.toFixed(1)}</p>
                    </div>

                    {details?.homepage &&
                        <a href={`${details.homepage}`} target='_blank' rel="noopener noreferrer" className='bg-secondary rounded-2xl flex flex-row px-5 py-2 shadow-xl underline'>More here</a>
                    }


                    {/* <div className='bg-secondary rounded-2xl flex flex-row px-3'>
                        {details.}
                    </div> */}
                </div>

                <p className='p-2 py-7 font-medium text-lg leading-[150%] text-text'>{details?.overview}</p>

                <div className='w-full  flex justify-center items-center pb-4 rounded-2xl'>
                    <div className='flex flex-row gap-2 w-full'>  
                            {videos?.filter(v => v.type === "Trailer").map(video => {
                                const embedUrl = getEmbedUrl(video)
                                if(!embedUrl) return null
                                return (
                                <div className='aspect-video h-full w-full justify-center'>
                                    <iframe src={embedUrl} allowFullScreen className='w-full h-full rounded-lg' />
                                </div>
                                )
                            })}  
                    </div>
                </div>
            {/* SEASON SECTION */}
            <div className='w-full border-4 border-primary rounded-2xl p-5 flex flex-col gap-3'>
                <p className='text-4xl text-text font-semibold'>Seasons</p>
                <div className='w-full flex flex-row justify-center gap-5'> 
                    {details?.seasons.map(season => (
                        <p key={season.id} className={`underline-animate cursor-pointer select-none spacing tracking-[+1%] ${selectedSeason === season.season_number && 'font-bold'}`} onClick={() => setSelectedSeason(season.season_number)}>{season.name}</p>
                    ))}
                </div>
                <div className='w-full flex flex-row-reverse justify-between p-2 gap-2' ref={ref}>
                    <motion.img src={`https://image.tmdb.org/t/p/w780/${currentSeason?.poster_path}`} variants={imagesVariants} initial="hidden" animate={mainControls} id='season-img' loading='lazy' className='w-1/2 aspect-auto rounded-lg'/>
                    <motion.div className='flex flex-col gap-3 p-2' variants={infoContainerVariants} initial="hidden" animate={mainControls}>
                        <motion.p variants={infoItemVariants} className='text-xl font-semibold' id='season-name'>{currentSeason?.name}</motion.p>
                        <motion.p variants={infoItemVariants} className='leading-[200%] text-lg pr-5 tracking-[-1%]' id='season-overview'>{currentSeason?.overview || "No overview available for this season."}</motion.p>
                        <motion.p variants={infoItemVariants} className='flex flex-row gap-2' id='season-rating'>
                        {currentSeason?.vote_average  ?

                            <>Rating: {currentSeason?.vote_average} <span><Star  color='yellow'/></span> </>
                            : 
                            'Not rated yet.' }
                        </motion.p>

                        <motion.p variants={infoItemVariants} className='text-xs'id='season-airdate'>{currentSeason?.air_date}</motion.p>
                    </motion.div>                    
                </div>                
            </div>

            </div>


        </div>
    </div>
  )
}

export default MovieDetailPage