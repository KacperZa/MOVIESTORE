import { useCallback, useContext, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { LesserThanIcon, GreaterThanIcon, FavouriteIcon, NoImageIcon } from "../components/Icons";
// import SkeletonImage from "../components/SkeletonImage";
import 'react-loading-skeleton/dist/skeleton.css'
import { motion, AnimatePresence, spring } from "motion/react";
import { MovieGenreContext } from "../context/MovieGenreContext";
import { TvGenreContext } from "../context/TvMovieGenreContext";
import { useUser } from "../context/useUser";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useDebounce } from "use-debounce";
import useFetchMedia from "./useFetchMedia";

function SpecificGenre() {
    const { type, id_genre, name_genre } = useParams()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [search, setSearch] = useState("")
  const [debouncedSearch] = useDebounce(search, 400)
  const [mediaVisibleId, setMediaVisibleId] = useState<number | null>(null)
  const [favouriteIds, setFavouriteIds] = useState<Set<number>>(new Set())

  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get('page') || 1));

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

  const { user } = useUser()

    // fetching data API
    const { films, loading, error, hasMore } = useFetchMedia({ search: debouncedSearch, page, id_genre, setPage})
    
    const observer = useRef<IntersectionObserver | null>(null)
    const lastMediaElementRef = useCallback((node: HTMLDivElement | null)  => {
      if (loading) return;
      if (observer.current) observer.current.disconnect()
        
        observer.current = new IntersectionObserver(entries =>  {
          if (entries[0].isIntersecting && hasMore){
            setPage(prevPageNumber => prevPageNumber + 1)
          }
        })
    if (node) observer.current.observe(node)
    },[loading, hasMore])


  const navigate = useNavigate()
  
  const handleFavouriteButton = async (e:React.MouseEvent<HTMLButtonElement>, movie: Films) => {
    e.preventDefault();
    e.stopPropagation();
    if(user !== null) {
      try {
        const res = await fetch(`http://localhost:5000/favourite/add/${user._id}`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            userId: user._id,
            mediaType: type,
            tmdbId: movie.id,
            adult: movie.adult,
            backdrop_path: movie.backdrop_path,
            genre_ids: movie.genre_ids,
            original_language: movie.original_language,
            original_title: movie.original_title,
            overview: movie.overview,
            popularity: movie.popularity,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            title: type === "tv" ? movie.name : movie.title,
            video: movie.video,
            vote_average: movie.vote_average,
            vote_count: movie.vote_count
          })
        })
        const data = await res.json()
        if(res.ok) {
          console.log(data)
          setFavouriteIds(prev => new Set([...prev, movie.id]))
        }

        if (data.message === 'Already in favourites'){
            try {
              const resDelete = await fetch(`http://localhost:5000/favourite/${movie.id}`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'}
              })
              const dataDelete = await resDelete.json()
              console.log(dataDelete)
    
              if (!resDelete.ok) {
                console.error(data.message)
                return
              }

              setFavouriteIds(prev => new Set([...prev].filter(id => id !== movie.id)))
              return
            } catch(err) {
              console.error(err)
            }


        }
      } catch(err) {
        console.error(err)
      }
      
    } else {
      navigate('/login')
    }
  }

  const addAsWatched = async (movie: Films) => {
    if(user !== null) {
      try {
        const res = await fetch(`http://localhost:5000/history/add/${user?._id}`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
                userId: user._id,
                mediaType: type,
                tmdbId: movie.id,
                adult: movie.adult,
                backdrop_path: movie.backdrop_path,
                genre_ids: movie.genre_ids,
                original_language: movie.original_language,
                original_title: movie.original_title,
                overview: movie.overview,
                popularity: movie.popularity,
                poster_path: movie.poster_path,
                release_date: movie.release_date,
                title: type === "tv" ? movie.name : movie.title,
                video: movie.video,
                vote_average: movie.vote_average,
                vote_count: movie.vote_count
          })
        })

          const data = await res.json()
          console.log(data)

          
        console.log(data)

        setFavouriteIds(prev => new Set([...prev, movie.id]))
      } catch (err) {
        console.error(err)
      }
    } else {
      navigate('/login')
    }
  }

  interface Films {
    adult: boolean
    backdrop_path: string
    genre_ids: number[]
    id: number
    original_language: string
    original_title?: string
    overview: string
    popularity: Float32Array
    poster_path: string
    release_date: string
    title?: string
    name?: string
    video: boolean
    vote_average: Float32Array
    vote_count: Float32Array
  }

//   interface FilmsWithGenres extends Films{
//     gatunki: string[]
//   }
//   interface Genres {
//     id: number
//     name: string
// }

  // // fetching data from api
  // useEffect(() => {
  //   if (!genreHolder || (genreHolder as Genres[]).length === 0) return;
  //   const pobierz = async () =>{

  //     const filmy = await fetch(`/api/${type}/${id_genre}?keywords=${search}`)
  //     .then(r => r.json())
  //     // const gatunki = await gatunkiRes.json();
  //     // mapping movies / shows with genres 
  //     const genreMap: Record<number, string> = {};
  //     (genreHolder as Genres[]).forEach(g => genreMap[g.id] = g.name);
    
  //     const filmyZGatunkami: FilmsWithGenres[] = (filmy as Films[]).map(film => ({
  //       ...film, 
  //       gatunki: film.genre_ids.map((id: number) => genreMap[id] ?? 'Unknown')
  //     }));
    
  //     setFilms(filmyZGatunkami)
  //   }

  //   pobierz()
  // },[genreHolder, search, id_genre, type])
  
  // Sorting by votes
  const sortedFilms = useMemo(() => 
    [...films].sort((a, b) => a.vote_average < b.vote_average ? 1 : -1),
  [films])

  // pagination 


  useEffect(() => {
    const fetchFavouriteIds = async () => {
      try {
        const res = await fetch(`http://localhost:5000/favourite/ids/${user?._id}`)
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
        
        const data = await res.json()
        setFavouriteIds(new Set(data.map((item: {tmdbId: number}) => item.tmdbId)))

      } catch(err) {
        console.error(err);
      }
    }

    fetchFavouriteIds()
  },[user?._id])
  
  return (
  <>
  <div className="flex flex-col ml-5 g-4 w-full">
    {/* Search bar */}
    <motion.div layout className="flex flex-0.5 shrink-0 flex-row justify-evenly gap-2 items-center min-w-full bg-amber-300 p-2 rounded-2xl mb-2.5 ">
        <form action="" onSubmit={(e) => {e.preventDefault()}}>
          <input onChange={changeSearch} className="w-4xl h-12 px-4 py-2 rounded-lg select-none border-gray-300 bg-white" type="text" name="search" id="input" placeholder='Szukaj filmów...' />
          <button type="submit" id="btn" className="hidden">Send</button>
        </form>
      
      {/* Switch for enabling tv data */}


      <Link to={'/login'} className="text-lg bg-amber-200 w-fit p-2 px-4 rounded-xl font-medium">Sign in</Link> {/* LOGIN */}
    </motion.div>
    <motion.div layout className="mask-b-from-80% mask-alpha flex h-9/10 flex-col bg-green-400 rounded-2xl p-2 overflow-auto">
      <div className="flex flex-row gap-2 w-full">
      {search ? <motion.div layout className="flex justify-start font-medium text-xl p-2 px-3 rounded-xl bg-green-300"> Search results for: {search}</motion.div> : null}
      {name_genre && type === "movie" ? <motion.div layout className="flex justify-start font-medium text-xl p-2 px-3 rounded-xl bg-green-300">{name_genre} movies: </motion.div> : null}
      {name_genre && type === "tv" ? <motion.div layout className="flex justify-start font-medium text-xl p-2 px-3 rounded-xl bg-green-300">{name_genre} shows: </motion.div> : null}
      </div>
      {/* Displaying the search value */}
      <motion.div  className="flex flex-8 flex-row rounded-2xl justify-center items-center ">


        {/* Grid for posters  */}
        <motion.div  className="grid grid-cols-4 gap-y-5 p-3 justify-center items-center">
          <AnimatePresence>
          {(loading) ? (
            // <SkeletonImage cards={8}/>
              <div className=" min-w-7/10 mx-auto border-red-500">
                <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem'  }}></i>
              </div>
          ):
          (
            sortedFilms.map((film, i) => {
              if(sortedFilms.length === i + 1) {
                return (
                <motion.div 
              key={i} 
              ref={lastMediaElementRef}
              initial={{ opacity: 0, scale: 1}}
              animate={{ opacity: 1}}
              whileHover={{scale: 1.02}}
              // transition={{type: spring, stiffness: 100, damping: 10, mass: 1 }}
              // exit={{ opacity: 0, x: -200}}
              className="aspect-2/3 m-0 relative w-7/10 mx-auto"
              >
                
 
                <div onClick={() => setMediaVisibleId(film.id)} className="cursor-pointer">
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
              <motion.div className={`absolute inset-0 flex px-7 py-10  gap-2 ${film.adult ? `justify-between` : `justify-end`} items-center flex-col text-white bg-linear-to-b to-gray-800/80 from-gray-500/0 rounded-xl`}
                  variants={{
                    hidden: { opacity: 0, y:0},
                    visible: { opacity: 1, y:0}
                  }}
                  transition={{ duration: 0.3}}>

                  {film.adult ? <div className="bg-red-500 px-2 py-1 rounded-lg">18+</div> : null }

                  <motion.div className="flex flex-col items-center"
                  variants={{
                    hidden: { opacity: 0, y: 10},
                    visible: { opacity: 1, y: 0, }  
                  }}
                  transition={{duration: 0.3}}
                  >
                    <div className="text-xl font-bold text-center">{ type === "tv" ? film.name : film.title}</div>
                    <div className="flex flex-row text-sm w-full gap-2 mb-2">
                      <div className="flex flex-0.75 flex-row w-1/2 text-xs justify-center items-center gap-1.5">
                          <div className=""><FavouriteIcon size="1.5em" color="#ff0" fill="#ff0"/></div>
                      {/* Rounding the votes percents */}
                          <div>{Math.round(film.vote_average * 10)}%</div>
                      </div>
                      <div className="flex-wrap w-full flex-1 ">
                      {film.gatunki.map((g:string, i:number) => (
                        <span key={i} className="text-xs"> {i === film.gatunki.length - 1 ? g  : g+","}</span>
                      ))}
                      
                      </div>
                      <div className="flex  flex-0.25 justify-center items-center">
                        <motion.button whileTap={{ scale: 1.2, rotate: -2 }}  whileHover={{ scale: 1.05}} onClick={(e) => handleFavouriteButton(e, film)}
                          className="cursor-pointer">
                          {favouriteIds.has(film.id) ? <i className="pi pi-heart-fill" style={{ color: '#F00'}}></i> :  <i className="pi pi-heart" style={{ color: '#F00'}}></i>}
                        </motion.button>
                      </div>
                      
                    </div>

                  </motion.div>
              </motion.div>
              </motion.div>
                </div>
                  <Dialog  resizable={false} header={`${type === "tv" ? film.name : film.title}`} visible={mediaVisibleId === film.id} style={{ width: '50vw'}} onHide={() =>  {if (mediaVisibleId === null) return; setMediaVisibleId(null);  }}>
                    <div className=" flex justify-center items-center flex-col gap-4">
                      <img className="rounded-l" src={`https://image.tmdb.org/t/p/w1280/${film.backdrop_path}`} alt="" />
                      <div className="flex gap-2 flex-row justify-evenly w-full ">
                        <Button label="Mark as watched" icon="pi pi-check" raised onClick={() => addAsWatched(film)} />


                      </div>
                      <p className="m-0 rounded-lg"> {film.overview}</p>
                    </div>
                  </Dialog>
              </motion.div>
            ) 
              } else {
                return (
                <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 1}}
              animate={{ opacity: 1}}
              whileHover={{scale: 1.02}}
              transition={{type: spring, stiffness: 100, damping: 10, mass: 1 }}
              // exit={{ opacity: 0, x: -200}}
              className="aspect-2/3 m-0 relative w-7/10 mx-auto"
              >
                
 
                <div onClick={() => setMediaVisibleId(film.id)} className="cursor-pointer">
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
              <motion.div className={`absolute inset-0 flex px-7 py-10  gap-2 ${film.adult ? `justify-between` : `justify-end`} items-center flex-col text-white bg-linear-to-b to-gray-800/80 from-gray-500/0 rounded-xl`}
                  variants={{
                    hidden: { opacity: 0, y:0},
                    visible: { opacity: 1, y:0}
                  }}
                  transition={{ duration: 0.3}}>

                  {film.adult ? <div className="bg-red-500 px-2 py-1 rounded-lg">18+</div> : null }

                  <motion.div className="flex flex-col items-center"
                  variants={{
                    hidden: { opacity: 0, y: 10},
                    visible: { opacity: 1, y: 0, }  
                  }}
                  transition={{duration: 0.3}}
                  >
                    <div className="text-xl font-bold text-center">{ type === "tv" ? film.name : film.title}</div>
                    <div className="flex flex-row text-sm w-full gap-2 mb-2">
                      <div className="flex flex-0.75 flex-row w-1/2 text-xs justify-center items-center gap-1.5">
                          <div className=""><FavouriteIcon size="1.5em" color="#ff0" fill="#ff0"/></div>
                      {/* Rounding the votes percents */}
                          <div>{Math.round(film.vote_average * 10)}%</div>
                      </div>
                      <div className="flex-wrap w-full flex-1 ">
                      {film.gatunki.map((g:string, i:number) => (
                        <span key={i} className="text-xs"> {i === film.gatunki.length - 1 ? g  : g+","}</span>
                      ))}
                      
                      </div>
                      <div className="flex  flex-0.25 justify-center items-center">
                        <motion.button whileTap={{ scale: 1.2, rotate: -2 }}  whileHover={{ scale: 1.05}} onClick={(e) => handleFavouriteButton(e, film)}
                          className="cursor-pointer">
                          {favouriteIds.has(film.id) ? <i className="pi pi-heart-fill" style={{ color: '#F00'}}></i> :  <i className="pi pi-heart" style={{ color: '#F00'}}></i>}
                        </motion.button>
                      </div>
                      
                    </div>

                  </motion.div>
              </motion.div>
              </motion.div>
                </div>
                  <Dialog  resizable={false} header={`${type === "tv" ? film.name : film.title}`} visible={mediaVisibleId === film.id} style={{ width: '50vw'}} onHide={() =>  {if (mediaVisibleId === null) return; setMediaVisibleId(null);  }}>
                    <div className=" flex justify-center items-center flex-col gap-4">
                      <img className="rounded-l" src={`https://image.tmdb.org/t/p/w1280/${film.backdrop_path}`} alt="" />
                      <div className="flex gap-2 flex-row justify-evenly w-full ">
                        <Button label="Mark as watched" icon="pi pi-check" raised onClick={() => addAsWatched(film)} />


                      </div>
                      <p className="m-0 rounded-lg"> {film.overview}</p>
                    </div>
                  </Dialog>
              </motion.div>
              )}
                
              })
          )
          }
          </AnimatePresence>
        </motion.div>
        {/* Changing the page */}
      </motion.div>

    </motion.div>
  </div>
</>
  )
}

export default SpecificGenre