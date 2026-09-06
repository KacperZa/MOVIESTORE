import { useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"

import 'react-loading-skeleton/dist/skeleton.css'
import { motion, AnimatePresence } from "motion/react";
import { useUser } from "../context/useUser";

import useFetchMedia from "../hooks/useFetchMedia";
import FavouriteToggle from "./FavouriteToggle";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import Filters, { type FilterItem } from "@/ui/Filters";
import MediaCard, { type FilmsWithGenres } from "@/ui/MediaCard";
import GenreSidebar from "@/ui/GenreSidebar";
import useFetchIds from "../hooks/useFetchIds";
import MediaCardSkeleton from "@/ui/MediaCardSkeleton";
import FiltersMobile from "@/ui/FiltersMobile";

function SpecificGenre() {
  const { type, id_genre, name_genre } = useParams()

  const safeType = type === "movie" || type === "tv" ? type : undefined

  const [searchParams,] = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get('page') || 1));

  const [selectedFilter, setSelectedFilter] = useState<FilterItem | undefined>()
  const [adultFilms, setAdultFilms] = useState(false)
  const [isVisibleSidebar, setIsVisibleSidebar] = useState(false)
  const [isVisibleFilters, setIsVisibleFilters] = useState(false)


  const { user } = useUser()
    
  const { addFavourite, removeFavourite } = FavouriteToggle()

  // fetching data from backend
  const { isError: isErrorIds, data: favouriteIds, error: errorFavouriteIds } = useFetchIds({userId: user?._id, type: "favourite"})
  if(isErrorIds) console.log('An Error occured during fetching favouriteIds', errorFavouriteIds?.message)
  
  const { films, fetchNextPage,  isPending, isError, error, hasNextPage } = useFetchMedia({ id_genre, page, filters: selectedFilter, setPage, adultFilms})
  if(isError) console.log('An Error occured during fetching Media data', error?.message)

  const lastMediaElementRef = useInfiniteScroll({loading: isPending, fetch: fetchNextPage, hasMore: hasNextPage})

  
  return (
  <>
    <motion.div className=" flex w-full h-full flex-row bg-card rounded-t-2xl p-2 gap-2">
      {/* Genres Sidebar */}
      <AnimatePresence>
      {isVisibleSidebar && 
        <GenreSidebar genre={safeType} setIsVisibleSidebar={setIsVisibleSidebar}/>
      } 
      </AnimatePresence>

      <div className="h-full flex-1 overflow-auto w-full scrollbar-thumb-primary scrollbar-gutter-stable scroll-smooth">
        <div className="flex flex-row gap-2 w-full">

          <div className="bg-secondary py-3 rounded-2xl w-full flex justify-around">
            {/* // SPACE FOR FILTERS ETC */}
            <Filters setIsVisibleFilters={setIsVisibleFilters} setIsVisibleSidebar={setIsVisibleSidebar} type={type} name_genre={name_genre} setSelectedFilter={setSelectedFilter} setAdultFilms={setAdultFilms} adultFilms={adultFilms}/>
          </div>
          <AnimatePresence>
            {/* Filters for mobile  */}
            {isVisibleFilters &&
            <FiltersMobile setIsVisibleFilters={setIsVisibleFilters}  setAdultFilms={setAdultFilms} adultFilms={adultFilms} setSelectedFilter={setSelectedFilter}/>
            }
          </AnimatePresence>

        </div>
        <motion.div  className="flex flex-8 flex-row rounded-2xl justify-center items-center w-full h-full ">


          {/* Grid for posters  */}
          <motion.div  className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-2 gap-y-5 p-3 w-full h-full justify-center items-center ">
            <AnimatePresence>
            {isPending ? 
              // <SkeletonImage cards={8}/>
                <MediaCardSkeleton count={8}/>
            :
            (
              films.map((film, i) => {
                if(films.length === i + 1) {
                  return <MediaCard<FilmsWithGenres> key={film.id} lastMediaElementRef={lastMediaElementRef}  media={film} type={type} favouriteIds={favouriteIds ?? new Set()} addFavourite={addFavourite} removeFavourite={removeFavourite} showGenres isRef/>
                } else {
                  return <MediaCard<FilmsWithGenres> key={film.id} lastMediaElementRef={lastMediaElementRef}  media={film} type={type} favouriteIds={favouriteIds ?? new Set()} addFavourite={addFavourite} removeFavourite={removeFavourite} showGenres/>
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

export default SpecificGenre