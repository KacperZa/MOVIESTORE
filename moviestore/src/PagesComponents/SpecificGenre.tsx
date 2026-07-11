import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"

import 'react-loading-skeleton/dist/skeleton.css'
import { motion, AnimatePresence, spring } from "motion/react";
import { useUser } from "../context/useUser";

import { useDebounce } from "use-debounce";
import useFetchMedia from "../hooks/useFetchMedia";
import Filters from "./Filters";
import type { FilmsWithGenres } from "./MediaCard";
import MediaCard from "./MediaCard";
import FavouriteToggle from "./FavouriteToggle";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import useFetchFavouritesIds from "../hooks/useFetchFavouritesIds";

// shadcn ui 



function SpecificGenre() {
    const { type, id_genre, name_genre } = useParams()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [search, setSearch] = useState("")
  const [debouncedSearch] = useDebounce(search, 400)
  const [mediaVisibleId, setMediaVisibleId] = useState<number | null>(null)

  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get('page') || 1));

  const [selectedFilter, setSelectedFilter] = useState<FilterItem | undefined>()
  const [position, setPosition] = useState()
  const [adultFilms, setAdultFilms] = useState(false)

  // Refs for managing scrollHeight
  const topDiv = useRef<HTMLDivElement>(null)
  const pastScrollHeight = useRef<number>(0)


  const changeSearch = (e:ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearch(val)
    setSearchParams({query: val, page: '1'})
  }

  const { user } = useUser()

    
  const { addFavourite, removeFavourite } = FavouriteToggle()

  const { favouriteIds, setFavouriteIds } = useFetchFavouritesIds(user?._id)

  
  
  // fetching data from backend
  const { films, loading, error, hasMore } = useFetchMedia({ search: debouncedSearch, page, filters: selectedFilter, setPage, adultFilms, id_genre})
  
  
  const lastMediaElementRef = useInfiniteScroll({loading: loading, pastScrollHeight: pastScrollHeight, setPage: setPage,  topDiv: topDiv, hasMore: hasMore})

  

    useEffect(() => {
      if (!topDiv.current) return;
      const currentScroll = topDiv.current.scrollHeight - pastScrollHeight.current;
      topDiv.current.scrollTo(0, currentScroll)
    },[films])

  
  // Sorting by votes
  const sortedFilms = useMemo(() => 
    [...films].sort((a, b) => a.vote_average < b.vote_average ? 1 : -1),
  [films])
 

  
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

        <div className="bg-green-500 p-3 rounded-2xl w-full flex gap-2 justify-around">
          {/* // SPACE FOR FILTERS ETC */}
          <Filters type={type} name_genre={name_genre} search={search} selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} setAdultFilms={setAdultFilms} setPosition={setPosition} adultFilms={adultFilms}/>
        </div>
      </div>
      {/* Displaying the search value */}
      <motion.div  className="flex flex-8 flex-row rounded-2xl justify-center items-center ">


        {/* Grid for posters  */}
        <motion.div  className="grid grid-cols-4 gap-y-5 p-3 justify-center items-center">
          <AnimatePresence>
          {loading ? (
            // <SkeletonImage cards={8}/>
              <div className=" min-w-7/10 mx-auto border-red-500">
                <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem'  }}></i>
              </div>
          ):
          (
            sortedFilms.map((film, i) => {
              if(films.length === i + 1) {
                return <MediaCard<FilmsWithGenres> key={i} lastMediaElementRef={lastMediaElementRef} setMediaVisibleId={setMediaVisibleId} media={film} type={type} favouriteIds={favouriteIds} setFavouriteIds={setFavouriteIds} addFavourite={addFavourite} removeFavourite={removeFavourite} addToHistory showGenres isRef/>
              } else {
                return <MediaCard<FilmsWithGenres> key={i} lastMediaElementRef={lastMediaElementRef} setMediaVisibleId={setMediaVisibleId} media={film} type={type} favouriteIds={favouriteIds} setFavouriteIds={setFavouriteIds} addFavourite={addFavourite} removeFavourite={removeFavourite} addToHistory showGenres/>
              } })
          )
          }
          </AnimatePresence>
        </motion.div>
      </motion.div>

    </motion.div>
  </div>
</>
  )
}

export default SpecificGenre