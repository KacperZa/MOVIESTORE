import { useEffect, useRef, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"

import 'react-loading-skeleton/dist/skeleton.css'
import { motion, AnimatePresence } from "motion/react";
import { useUser } from "../context/useUser";

import { useDebounce } from "use-debounce";
import useFetchMedia from "../hooks/useFetchMedia";
import FavouriteToggle from "./FavouriteToggle";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import useFetchFavouritesIds from "../hooks/useFetchFavouritesIds";
import MediaCard, { type FilmsWithGenres } from "@/ui/MediaCard";

function SpecificGenre() {
    const [searchParams] = useSearchParams();
    const [page, setPage] = useState(Number(searchParams.get('page') || 1));


    // Refs for managing scrollHeight
    const topDiv = useRef<HTMLDivElement>(null)
    const pastScrollHeight = useRef<number>(0)

    const search = searchParams.get("query") ?? ''

    const { user } = useUser()
        
    const { addFavourite, removeFavourite } = FavouriteToggle()
    const { favouriteIds, setFavouriteIds } = useFetchFavouritesIds(user?._id)

    
    // fetching data from backend
    const { films, loading, hasMore } = useFetchMedia({ search , page, setPage})
    
    
    const lastMediaElementRef = useInfiniteScroll({loading: loading, pastScrollHeight: pastScrollHeight, setPage: setPage,  topDiv: topDiv, hasMore: hasMore})


    useEffect(() => {
        if (!topDiv.current) return;
        const currentScroll = topDiv.current.scrollHeight - pastScrollHeight.current;
        topDiv.current.scrollTo(0, currentScroll)
    },[films])
    
    return (
    <>
        <motion.div className=" flex w-full h-full flex-row bg-card rounded-2xl p-2   gap-2">
        {/* Genres Sidebar */}
        <div className="h-full flex-1 overflow-auto scrollbar-thumb-secondary scrollbar-gutter-stable scroll-smooth">
            <div className="flex flex-row gap-2 w-full">

            {/* Displaying the search value */}
            <div className="bg-secondary py-3 rounded-2xl w-full flex justify-around">
                <motion.div className="flex justify-start font-medium text-lg p-2 rounded-xl bg-primary text-white items-center">Search results for: {search}</motion.div>
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
                    return <MediaCard<FilmsWithGenres> key={i} lastMediaElementRef={lastMediaElementRef}  media={film} favouriteIds={favouriteIds} setFavouriteIds={setFavouriteIds} addFavourite={addFavourite} removeFavourite={removeFavourite} addToHistory showGenres showLightBox isRef/>
                    } else {
                    return <MediaCard<FilmsWithGenres> key={i} lastMediaElementRef={lastMediaElementRef}  media={film} favouriteIds={favouriteIds} setFavouriteIds={setFavouriteIds} addFavourite={addFavourite} removeFavourite={removeFavourite} addToHistory showGenres showLightBox/>
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