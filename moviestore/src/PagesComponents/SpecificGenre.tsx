import { useContext, useEffect, useMemo, useState, type ChangeEvent } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { LesserThanIcon, GreaterThanIcon, FavouriteIcon, NoImageIcon } from "../components/Icons";
// import SkeletonImage from "../components/SkeletonImage";
import 'react-loading-skeleton/dist/skeleton.css'
import { motion, AnimatePresence, spring } from "motion/react";
import { MovieGenreContext } from "../context/MovieGenreContext";
import { TvGenreContext } from "../context/TvMovieGenreContext";

function SpecificGenre() {
    const { type, id_genre, name_genre } = useParams()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [films, setFilms] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);

  const movieGenreHolder = useContext(MovieGenreContext) // Context with movie genre list
  const tvGenreHolder = useContext(TvGenreContext) // Context with tv shows genre list


  const genreHolder = type === 'tv' ? tvGenreHolder : movieGenreHolder
  // function for changing pages and setting the search value in url
  const changePage = (newPage : number) => {
    setSearchParams({query: search, page: String(newPage)});
  }

  const changeSearch = (e:ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearch(val)
    setSearchParams({query: val, page: '1'})
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

  // fetching data from api
  useEffect(() => {
    if (!genreHolder || (genreHolder as Genres[]).length === 0) return;
    const pobierz = async () =>{

      const filmy = await fetch(`/api/${type}/${id_genre}?keywords=${search}`)
      .then(r => r.json())
      // const gatunki = await gatunkiRes.json();
      // mapping movies / shows with genres 
      const genreMap: Record<number, string> = {};
      (genreHolder as Genres[]).forEach(g => genreMap[g.id] = g.name);
    
      const filmyZGatunkami: FilmsWithGenres[] = (filmy as Films[]).map(film => ({
        ...film, 
        gatunki: film.genre_ids.map((id: number) => genreMap[id] ?? 'Unknown')
      }));
    
      setFilms(filmyZGatunkami)
    }

    pobierz()
  },[genreHolder, search, id_genre, type])
  
  // Sorting by votes
  const sorted = useMemo(() => 
    [...films].sort((a, b) => a.vote_average < b.vote_average ? 1 : -1),
  [films])

  // pagination 
  const start = (page - 1) * itemsPerPage
  const currentMovies = sorted.slice(start, start + itemsPerPage)

  useEffect(() => {
    const input = document.getElementById("input")
    const press = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault()
        const btn = document.getElementById("btn");
        btn?.click()
      }
    }
  
    input?.addEventListener("keypress", press)
      return () => input?.removeEventListener('keypress', press)
  },[])
  
  return (
  <>
  <div className="flex flex-col ml-5 g-4">
    {/* Search bar */}
    {/* Search bar */}
    <motion.div layout className="flex flex-0.5 shrink-0 flex-row justify-evenly gap-2 items-center w-full bg-amber-300 p-2 rounded-2xl mb-2.5 ">
        <form action="" onSubmit={(e) => {e.preventDefault()}}>
          <input onChange={changeSearch} className="w-4xl h-12 px-4 py-2 rounded-lg select-none border-gray-300 bg-white" type="text" name="search" id="input" placeholder='Szukaj filmów...' />
          <button type="submit" id="btn" className="hidden">Send</button>
        </form>
      
      {/* Switch for enabling tv data */}


      <Link to={'/login'} className="text-lg bg-amber-200 w-fit p-2 px-4 rounded-xl font-medium">Sign in</Link> {/* LOGIN */}
    </motion.div>
    <motion.div layout className="flex flex-col bg-green-400 rounded-2xl p-2">
      <div className="flex flex-row gap-2">
      {search ? <motion.div layout className="flex justify-start font-medium text-xl p-2 px-3 rounded-xl bg-green-300"> Search results for: {search}</motion.div> : null}
      {name_genre && type === "movie" ? <motion.div layout className="flex justify-start font-medium text-xl p-2 px-3 rounded-xl bg-green-300">{name_genre} movies: </motion.div> : null}
      {name_genre && type === "tv" ? <motion.div layout className="flex justify-start font-medium text-xl p-2 px-3 rounded-xl bg-green-300">{name_genre} shows: </motion.div> : null}
      </div>
      {/* Displaying the search value */}
      <motion.div layout className="flex flex-8 flex-row rounded-2xl justify-center items-center ">

        {/* Changing the page */}
        {page !== 1 ? 
        <p onClick={() => page > 1 ? changePage(page - 1) : null } className="cursor-pointer"><LesserThanIcon color="black" size={60}/></p>
        : 
        <p onClick={() => page > 1 ? changePage(page - 1) : null } className=""><LesserThanIcon color="gray" size={60}/></p>
      }

        {/* Grid for posters  */}
        <motion.div layout className="grid grid-cols-4 gap-y-5 p-3 justify-center items-center">
          <AnimatePresence>
          {(currentMovies.length === 0) ? (
            // <SkeletonImage cards={8}/>
            <p>Loading...</p>
          ):
          (
            currentMovies.map((film, id) => (
              <motion.div key={id} 
              initial={{ opacity: 0, x: -200, scale: 1}}
              animate={{ opacity: 1, x: 0}}
              whileHover={{scale: 1.05}}
              transition={{type: spring, stiffness: 100, damping: 10, mass: 1 }}
              // exit={{ opacity: 0, x: -200}}
              className="aspect-2/3 m-0 relative w-7/10 mx-auto"
              >
                
                <Link to={`/movie/${film.id}`}>
                <motion.div className="" initial="hidden" whileHover="visible" transition={{ duration: 0.3, staggerChildren: 0, when: "beforeChildren"}}>
                  {/* Default image if poster image doesn't exist */}
                {film.poster_path ? 
                <img src={`https://image.tmdb.org/t/p/w500/${film.poster_path}`} alt={film.gat} className=" aspect-2/3 rounded-xl shadow-lg/20 justify-self-center select-none" />
                : 
                <div className="aspect-2/3 bg-gray-500 flex rounded-2xl justify-center items-center"> 
                  <div className="">
                  <NoImageIcon />
                  </div>
                </div>
              }
              {/* Overlay for posters  */}
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
                      {/* Rounding the votes percents */}
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
        </motion.div>
        {/* Changing the page */}
        <p onClick={() => page < 3 ? changePage(page + 1) : null } className="cursor-pointer"><GreaterThanIcon color="black" size={60}/></p>
      </motion.div>

    </motion.div>
  </div>
</>
  )
}

export default SpecificGenre