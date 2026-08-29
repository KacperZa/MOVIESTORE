import { useEffect, useRef, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import 'react-loading-skeleton/dist/skeleton.css'
import { motion, AnimatePresence } from "motion/react";

import useFetchMedia from "../hooks/useFetchMedia";
import { useDebounce } from "use-debounce";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import FavouriteToggle from "./FavouriteToggle";
import useFetchFavouritesIds from "../hooks/useFetchFavouritesIds";
import { useUser } from "@/context/useUser";
import Filters, { type FilterItem } from "@/ui/Filters";
import MediaCard, { type FilmsWithGenres } from "@/ui/MediaCard";
import GenreSidebar from "@/ui/GenreSidebar";



function BrowsePage() {
  const [search] = useState("")
  const [debouncedSearch] = useDebounce(search, 400)
  const [searchParams,] = useSearchParams();

  const [selectedFilter, setSelectedFilter] = useState<FilterItem | undefined>()

  const [adultFilms, setAdultFilms] = useState(false)
  const [page, setPage] = useState(Number(searchParams.get('page') || 1))

  const { type } = useParams()
  const safeType = type === "movie" || type === "tv" ? type : undefined

  const { user } = useUser()

  const { addFavourite, removeFavourite } = FavouriteToggle()

  // Refs for managing scrollHeight
  const topDiv = useRef<HTMLDivElement>(null)
  const pastScrollHeight = useRef<number>(0)
  
  // fetching data from backend
  const { films, fetchNextPage, isPending, isError, error, hasNextPage } = useFetchMedia({ search: debouncedSearch, page, filters: selectedFilter, setPage, adultFilms})
  if(isError) console.log('An error occured during fetching Media', error?.message)
  
  const lastMediaElementRef = useInfiniteScroll({loading: isPending, fetch: fetchNextPage, hasMore: hasNextPage})

  return (
  <>

    <motion.div className=" flex w-full h-full flex-row bg-card rounded-2xl p-2  scrollbar-thumb-primary scrollbar-gutter-stable gap-2">

      <GenreSidebar genre={safeType}/>

      <div className="h-full flex-1 overflow-auto">
        <div className="flex flex-row gap-2 w-full">

          <div className="bg-secondary py-3 rounded-2xl w-full flex justify-around">
            {/* // SPACE FOR FILTERS ETC */}
            <Filters type={type} search={search} setSelectedFilter={setSelectedFilter} setAdultFilms={setAdultFilms}  adultFilms={adultFilms}/>

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
              films.map((film, i) => {
                if(films.length === i + 1) {
                  return <MediaCard<FilmsWithGenres> key={film.id} lastMediaElementRef={lastMediaElementRef}  media={film} type={type} favouriteIds={favouriteIds} setFavouriteIds={setFavouriteIds} addFavourite={addFavourite} removeFavourite={removeFavourite} showGenres isRef/>
                } else {
                  return <MediaCard<FilmsWithGenres> key={film.id} lastMediaElementRef={lastMediaElementRef}  media={film} type={type} favouriteIds={favouriteIds} setFavouriteIds={setFavouriteIds} addFavourite={addFavourite} removeFavourite={removeFavourite}  showGenres/>
                } })
            )
            }
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
</>
  )
}

export default BrowsePage