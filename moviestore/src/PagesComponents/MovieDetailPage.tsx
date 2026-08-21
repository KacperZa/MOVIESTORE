import useFetchMovieDetails from '@/hooks/useFetchMovieDetails'
import { Link, useParams } from 'react-router-dom'
import useRuntime from '@/utils/calculateRuntime'
import { Clock, DollarSign, Heart, UserStar } from 'lucide-react'
import useFetchVideo, { type Video } from '@/hooks/useFetchVideo'
import { animate, inView, motion, stagger } from 'motion/react'
import useFetchFavouritesIds from '@/hooks/useFetchFavouritesIds'
import { useUser } from '@/context/useUser'
import FavouriteToggle from './FavouriteToggle'

const MovieDetailPage = () => {
    const {id} = useParams()

    const type = "movie"

    const { details } = useFetchMovieDetails({id})
    console.log(details)

    const {user} = useUser()

    const { hoursRuntime, minutesRuntime } = useRuntime(details?.runtime)

    const { favouriteIds, setFavouriteIds } = useFetchFavouritesIds(user?._id)
    const { addFavourite, removeFavourite } = FavouriteToggle()

    const videos = useFetchVideo({type: "movie", id, enabled: !!id})

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


  return (
    <div className='w-full h-full bg-card overflow-hidden overflow-y-auto scrollbar-thumb-primary scrollbar-gutter-stable pb-2'>
        {/* IMAGE  SECTION*/}
        <div className='relative w-full h-full'> 
            <img src={`https://image.tmdb.org/t/p/w1280/${details?.backdrop_path}`} className='w-full h-full object-cover aspect-video' alt={details?.title} />
            
            {/* overlay  */}
            <div className='absolute left-0 bottom-0 w-full h-full bg-linear-to-b to-black/80 from-gray-500/0 flex flex-row justify-between'>

                <div className='h-full flex flex-col flex-evenly justify-end p-7 gap-2'>
                    {details?.adult && <div className='bg-red-500 w-fit text-xl py-1 px-2 rounded-lg font-bold'>18+</div>}
                    <div className='flex flex-col justify-end text-white  gap-2'>
                        <p className='text-6xl font-extrabold'>{details?.title}</p>
                        <p className='text-3xl font-semibold italic'>{details?.tagline}</p>
                    </div>
                </div>
                <div className='h-full p-7 gap-2 flex items-end'>
                    <button className='text-white px-6 pt-3 pb-4 flex justify-center backdrop-blur-md rounded-lg cursor-pointer'>MARK AS WATCHED</button>
                    <motion.button whileTap={{ scale: 0.9, rotate: -2 }}  whileHover={{ scale: 1.1}} className='px-3 pt-1.5 pb-2 flex justify-center backdrop-blur-md rounded-lg cursor-pointer' onClick={(e) => {
                        if(!id || !type) return
                        if(favouriteIds.has(Number(id))){
                            removeFavourite({e, id: Number(id), setFavouriteIds})
                            console.log("Usuwamy")
                        } else {
                            addFavourite({e, type, id: Number(id), setFavouriteIds});
                            console.log("Dodajemy")
                        }
                    }}>
                        {details?.id  && favouriteIds.has(details?.id) ? <Heart color='#F00' fill='#F00' size={40}/> :  <Heart color='#F00' size={40}/>}
                        </motion.button>
                </div>
            </div>

        </div>

        {/* INFO SECTION  */}
        <div id='info' className='w-full h-full bg-card p-10 flex flex-col gap-5 items-center'>
            <p className='text-5xl text-primary font-bold self-center'>{details?.title}</p>    

            <div className='h-full w-2/3 rounded-lg p-5 flex flex-col'>

                <div className='flex flex-row justify-evenly flex-wrap gap-y-2 gap-1'>
                    <div className='bg-secondary rounded-2xl flex flex-row px-5 py-2 gap-2 shadow-xl'>
                        {details?.genres.map(genre => (
                            <Link to={`/movie/genre/${genre.id}/${genre.name}`} key={genre.id} className='underline-animate'>{genre.name}</Link >
                        ))}
                    </div>
                    <div className='bg-secondary rounded-2xl flex flex-row px-5 py-2 shadow-xl gap-1'>
                            <p><Clock /></p>
                            <p>{hoursRuntime}h {minutesRuntime}min</p>
                    </div>
                    <div className='bg-secondary rounded-2xl flex flex-row px-5 py-2 shadow-xl'>Release date: {details?.release_date.replaceAll("-", ".").split(" ")}</div>
                    <div className='bg-secondary rounded-2xl flex flex-row px-5 py-2 shadow-xl gap-1'>
                            <p><UserStar /></p>
                            <p>Rating: {details?.vote_average.toFixed(1)}</p>
                    </div>
                    {details?.homepage &&
                        <a href={`${details.homepage}`} target='_blank' rel="noopener noreferrer" className='bg-secondary rounded-2xl flex flex-row px-5 py-2 shadow-xl underline'>More here</a>
                    }
                </div>

                <p className='p-2 py-7 font-medium text-lg leading-[150%] text-text'>{details?.overview}</p>

                <div className='w-full flex flex-row justify-around items-center flex-wrap bg-primary py-4 rounded-2xl'>
                    <DollarSign color='white'/>
                    <div className='flex flex-row justify-evenly w-1/2'>
                        <div className='bg-secondary rounded-2xl flex flex-row px-5 py-2 shadow-xl'>Revenue: {details?.revenue}$</div>
                        <div className='bg-secondary rounded-2xl flex flex-row px-5 py-2 shadow-xl'>Budget: {details?.budget}$</div>
                    </div>
                </div>


            </div>

            <div className='w-full flex justify-center items-center pb-4 rounded-2xl'>
                <div id='trailer-container' className='flex flex-row gap-2 w-full'>  
                        {videos?.filter(v => v.type === "Trailer").map(video => {
                            const embedUrl = getEmbedUrl(video)
                            if(!embedUrl) return null
                            return (
                            <div key={video.id} className='aspect-video h-full w-full justify-center trailer-video'>
                                <iframe src={embedUrl} allowFullScreen className='w-full h-full rounded-lg' />
                            </div>
                            )
                        })}  
                </div>
            </div>

        </div>
            {/* <div className='w-full h-[40vh] grid grid-cols-12 px-12 gap-5'>
                    <div className='h-full col-span-2 bg-white rounded-lg'>
                        <div className=''>

                        </div>
                        <img src={`https://image.tmdb.org/t/p/w185/cckcYc2v0yh1tc9QjRelptcOBko.jpg`} alt="" className='' />

                    </div>
            </div> */}
    </div>
  )
}

export default MovieDetailPage