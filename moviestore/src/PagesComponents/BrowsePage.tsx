import { useContext, useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { LesserThanIcon, GreaterThanIcon, FavouriteIcon } from "../components/Icons";
// import SkeletonImage from "../components/SkeletonImage";
import 'react-loading-skeleton/dist/skeleton.css'
import { motion, AnimatePresence } from "motion/react";
import { GenreContext } from "../img/context/GenreContext";

function BrowsePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [films, setFilms] = useState<any[]>([])
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);

  const genreHolder = useContext(GenreContext)

  // function for changing pages
  const changePage = (newPage : number) => {
    setSearchParams({ page: String(newPage)});
  }
  const itemsPerPage = 8;
  interface Films {
    adult: boolean
    backdrop_path: string
    genre_ids: number[]
    original_language: string
    original_title: string
    overview: string
    popularity: Float32Array
    poster_path: string
    release_date: string
    title: string
    video: boolean
    vote_average: Float32Array
    vote_count: Float32Array
  }

  interface FilmsWithGenres extends Films{
    gatunki: string[]
  }
  interface Genres {
    id: number
    name: string
  }

  // fetching data from backend
  useEffect(() => {
    if (!genreHolder || (genreHolder as Genres[]).length === 0) return;
    const pobierz = async () =>{

      const filmy = await fetch('/api')
      .then(r => r.json())
      // const gatunki = await gatunkiRes.json();
    
      const genreMap: Record<number, string> = {};
      (genreHolder as Genres[]).forEach(g => genreMap[g.id] = g.name);
    
      const filmyZGatunkami: FilmsWithGenres[] = (filmy as Films[]).map(film => ({
        ...film, 
        gatunki: film.genre_ids.map((id: number) => genreMap[id] ?? 'Unknown')
      }));
    
      setFilms(filmyZGatunkami)
    }

    pobierz()
  },[genreHolder])

  // pagination 
  const start = (page - 1) * itemsPerPage
  const currentMovies = films.slice(start, start + itemsPerPage)

  return (
  <>
  <div className="flex flex-row ml-5 rounded-2xl bg-green-400 justify-center items-center p-2">
    <p onClick={() => page > 1 ? changePage(page - 1) : null } className="cursor-pointer"><LesserThanIcon color="black" size={60}/></p>
    <div className="grid grid-cols-4 gap-y-7 gap-6 p-10 justify-center items-center">
      <AnimatePresence>
      {(currentMovies.length === 0) ? (
        // <SkeletonImage cards={8}/>
        <p>Loading...</p>
      ):
      (
        currentMovies.map((film, id) => (
          <motion.div key={id} 
          initial={{ opacity: 0, x: -200 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -200}}
          >
            
            <Link to={`/movie/${film.id}`}>
            <motion.div className="relative w-7/10 mx-auto " initial="hidden" whileHover="visible" transition={{ duration: 0.3, staggerChildren: 0, when: "beforeChildren"}}>
              <img src={`https://image.tmdb.org/t/p/w500/${film.poster_path}`} alt={film.gat} className="h-auto w-full rounded-xl shadow-lg/20 justify-self-center select-none" />

          <motion.div className="absolute inset-0 flex px-7 py-10  gap-2 justify-end items-center flex-col text-white bg-linear-to-b to-gray-800/80 from-gray-500/0 rounded-xl"
              variants={{
                hidden: { opacity: 0, y:0},
                visible: { opacity: 1, y:0}
              }}
              transition={{ duration: 0.3}}>

              <motion.div className="flex flex-col items-center"
              variants={{
                hidden: { opacity: 0, y: 10},
                visible: { opacity: 1, y: 0, }
              }}
              transition={{duration: 0.3}}
              >
                <div className="text-xl font-bold text-center">{film.title}</div>
                <div className="flex flex-row text-sm w-full gap-1">
                  <div className="flex  flex-1 flex-row w-1/2 text-xs justify-center items-center gap-1.5">
                      <div className=""><FavouriteIcon size="1.5em" color="#ff0" fill="#ff0"/></div>
                      <div>{Math.round(film.vote_average * 10)}%</div>
                  </div>
                  <div className="w-1/2 flex-wrap ">
                  {film.gatunki.map((g:string, i:number) => (
                    <span key={i} className="text-xs"> {i === film.gatunki.length - 1 ? g  : g+","}</span>
                  ))}
                  
                   </div>
                   
                </div>
              </motion.div>
          </motion.div>
          </motion.div>
            </Link>
          </motion.div>
        ))
      )
      }
      </AnimatePresence>
    </div>
    <p onClick={() => page < 3 ? changePage(page + 1) : null } className="cursor-pointer"><GreaterThanIcon color="black" size={60}/></p>
  </div>
</>
  )
}

export default BrowsePage