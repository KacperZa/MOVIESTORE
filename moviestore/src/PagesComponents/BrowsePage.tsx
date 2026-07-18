import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { useParams, useSearchParams } from "react-router-dom"
// import SkeletonImage from "../components/SkeletonImage";
import 'react-loading-skeleton/dist/skeleton.css'
import { motion, AnimatePresence } from "motion/react";



// import type { SelectValueChangeEvent } from 'primereact/select';
// import { ChevronDown } from '@primeicons/react/chevron-down';

import useFetchMedia from "../hooks/useFetchMedia";
import { useDebounce } from "use-debounce";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import FavouriteToggle from "./FavouriteToggle";
import useFetchFavouritesIds from "../hooks/useFetchFavouritesIds";
import { useUser } from "@/context/useUser";
import type { ComboboxItem } from "@mantine/core";
import Filters from "@/ui/Filters";
import MediaCard, { type FilmsWithGenres } from "@/ui/MediaCard";



function BrowsePage() {
  const [search, setSearch] = useState("")
  const [debouncedSearch] = useDebounce(search, 400)
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedFilter, setSelectedFilter] = useState<ComboboxItem | undefined>()
  const [position, setPosition] = useState()

  const [adultFilms, setAdultFilms] = useState(false)
  const [page, setPage] = useState(Number(searchParams.get('page') || 1))

  const { type } = useParams()

  const { user } = useUser()

  const { addFavourite, removeFavourite } = FavouriteToggle()

  // Refs for managing scrollHeight
  const topDiv = useRef<HTMLDivElement>(null)
  const pastScrollHeight = useRef<number>(0)
  



        
  
  // const prevScrollHeight = useRef<number>(0)
  // const containerRef = useRef<HTMLDivElement>(null)
  // prevScrollHeight.current = containerRef.current?.scrollHeight ?? 0;
  
  // fetching data API
  const { films, loading, hasMore } = useFetchMedia({ search: debouncedSearch, page, filters: selectedFilter, setPage, adultFilms})

  const { favouriteIds, setFavouriteIds } = useFetchFavouritesIds(user?._id)
  

  
  const lastMediaElementRef = useInfiniteScroll({loading: loading, pastScrollHeight: pastScrollHeight, setPage: setPage,  topDiv: topDiv, hasMore: hasMore})


  // function for changing pages
  // const handleChangePage = ( e :PaginatorPageChangeEvent) => {
  //   setSearchParams({query: search, page: `${e.page + 1}`});
  //   setPage(e.page + 1)
  //   console.log(e.page)
  // }

  const changeSearch = (e:ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearch(val)
  }

  


  // Disabling sending the data in forms
  useEffect(() => {
    const disableSubmit = (e: SubmitEvent) => {
      e.preventDefault()
      console.log('enter')
    }
    document.addEventListener('submit', disableSubmit)

    return () => document.removeEventListener('submit', disableSubmit)
  },[])



useEffect(() => {
 console.log(selectedFilter?.value) 
},[selectedFilter?.value])

  useEffect(() => {
    if (!topDiv.current) return;
    const currentScroll = topDiv.current.scrollHeight - pastScrollHeight.current;
    topDiv.current.scrollTo(0, currentScroll)
  },[films])

  useEffect(() => {
    const input = document.getElementById("input")
    const press = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault()
        const btn = document.getElementById("btn");
        btn?.click();
      }
    }
  
    input?.addEventListener("keypress", press)
      return () => input?.removeEventListener('keypress', press)

  },[])

  return (
  <>
  <div className="flex flex-col ml-5 g-4 w-full">
    {/* Search bar */}  
    <motion.div layout className="flex flex-0.5 min-w-full shrink-0 flex-row justify-evenly gap-2 items-center w-full bg-amber-300 p-2 rounded-2xl mb-2.5 ">
        <form action="" onSubmit={(e) => {e.preventDefault()}} >
          <input list="media" onChange={changeSearch} className="w-4xl h-12 px-4 py-2 rounded-lg select-none border-gray-300 bg-white" type="text" name="search" id="input" placeholder='Szukaj filmów...' />
          <button type="submit" id="btn" className="hidden">Send</button>
          {/* <datalist id="media" className="custom-dropdown-list hidden">
          {films.map((film, id) => (
            <option key={id} value={ type === "tv" ? film.name : film.title}></option>
          ))}
          </datalist> */}
        </form>
    
    </motion.div>

    <motion.div ref={topDiv} className=" mask-b-from-90% mask-alpha flex w-full h-9/10 flex-col bg-green-400 rounded-2xl p-2 overflow-auto">
      <div className="flex flex-row gap-2 w-full">

        <div className="bg-green-500 p-3 rounded-2xl w-full flex gap-2 justify-around">
    {/* // SPACE FOR FILTERS ETC */}
            <Filters type={type} search={search} selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} setAdultFilms={setAdultFilms} adultFilms={adultFilms} setPosition={setPosition} />
        </div>
      </div>
      <motion.div  className="flex h-full flex-col rounded-2xl gap-3  items-center overflow-auto">


        {/* Grid for posters  */}
        <motion.div  className="grid grid-cols-4 gap-y-5 p-3 justify-center items-center">
          <AnimatePresence>
          {loading ? (
            // <SkeletonImage cards={8}/>
            <>
              <div className=" min-w-7/10 mx-auto border-red-500">
                <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem'  }}></i>
              </div>  
            </>
          ):
          (
            films.map((film, i) => {
              if(films.length === i + 1) {
                return <MediaCard<FilmsWithGenres> key={i} lastMediaElementRef={lastMediaElementRef} media={film} type={type} favouriteIds={favouriteIds} setFavouriteIds={setFavouriteIds} addFavourite={addFavourite} removeFavourite={removeFavourite} addToHistory showGenres isRef showLightBox/>
              } else {
                return <MediaCard<FilmsWithGenres> key={i} lastMediaElementRef={lastMediaElementRef} media={film} type={type} favouriteIds={favouriteIds} setFavouriteIds={setFavouriteIds} addFavourite={addFavourite} removeFavourite={removeFavourite}  addToHistory showGenres showLightBox />

              } 
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

export default BrowsePage