import { useEffect, useRef, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"

import 'react-loading-skeleton/dist/skeleton.css'
import { motion, AnimatePresence } from "motion/react";
import { useUser } from "../context/useUser";

import useFetchMedia from "../hooks/useFetchMedia";
import FavouriteToggle from "./FavouriteToggle";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import useFetchFavouritesIds from "../hooks/useFetchFavouritesIds";
import Filters, { type FilterItem } from "@/ui/Filters";
import MediaCard, { type FilmsWithGenres } from "@/ui/MediaCard";
import GenreSidebar from "@/ui/GenreSidebar";

function SpecificGenre() {
  const { type, id_genre, name_genre } = useParams()

  const [searchParams,] = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get('page') || 1));

  const [selectedFilter, setSelectedFilter] = useState<FilterItem | undefined>()
  const [adultFilms, setAdultFilms] = useState(false)

  // Refs for managing scrollHeight
  const topDiv = useRef<HTMLDivElement>(null)
  const pastScrollHeight = useRef<number>(0)


  const { user } = useUser()
    
  const { addFavourite, removeFavourite } = FavouriteToggle()
  const { favouriteIds, setFavouriteIds } = useFetchFavouritesIds(user?._id)

  
  // fetching data from backend
  const { films, loading, hasMore } = useFetchMedia({ page, filters: selectedFilter, setPage, adultFilms, id_genre})
  
  
  const lastMediaElementRef = useInfiniteScroll({loading: loading, pastScrollHeight: pastScrollHeight, setPage: setPage,  topDiv: topDiv, hasMore: hasMore})


  useEffect(() => {
    if (!topDiv.current) return;
    const currentScroll = topDiv.current.scrollHeight - pastScrollHeight.current;
    topDiv.current.scrollTo(0, currentScroll)
  },[films])
  
  return (
  <>
    <motion.div className=" flex w-full min-h-full flex-row bg-card rounded-2xl p-2 gap-2">
      {/* Genres Sidebar */}
      <GenreSidebar />

      <div className="h-full flex-1 overflow-auto scrollbar-thumb-secondary scrollbar-gutter-stable scroll-smooth">
        <div className="flex flex-row gap-2 w-full">

          <div className="bg-secondary py-3 rounded-2xl w-full flex justify-around">
            {/* // SPACE FOR FILTERS ETC */}
            <Filters type={type} name_genre={name_genre} setSelectedFilter={setSelectedFilter} setAdultFilms={setAdultFilms} adultFilms={adultFilms}/>

          </div>
        </div>
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
                  return <MediaCard<FilmsWithGenres> key={i} lastMediaElementRef={lastMediaElementRef}  media={film} type={type} favouriteIds={favouriteIds} setFavouriteIds={setFavouriteIds} addFavourite={addFavourite} removeFavourite={removeFavourite} addToHistory showGenres showLightBox isRef/>
                } else {
                  return <MediaCard<FilmsWithGenres> key={i} lastMediaElementRef={lastMediaElementRef}  media={film} type={type} favouriteIds={favouriteIds} setFavouriteIds={setFavouriteIds} addFavourite={addFavourite} removeFavourite={removeFavourite} addToHistory showGenres showLightBox/>
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