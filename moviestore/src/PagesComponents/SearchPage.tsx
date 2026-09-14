import { useState } from "react"
import { useSearchParams } from "react-router-dom"

import 'react-loading-skeleton/dist/skeleton.css'
import { motion, AnimatePresence } from "motion/react";
import { useUser } from "../context/useUser";

import useFetchMedia from "../hooks/useFetchMedia";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import MediaCard, { type FilmsWithGenres } from "@/ui/MediaCard";
import useFetchIds from "@/hooks/useFetchIds";
import useAddFavourite from "@/hooks/FavouriteHooks/useAddFavourite";
import useRemoveFavourite from "@/hooks/FavouriteHooks/useRemoveFavourite";

function SpecificGenre() {
    const [searchParams] = useSearchParams();
    const [page, setPage] = useState(Number(searchParams.get('page') || 1));


    const search = searchParams.get("query") ?? ''

    const { user } = useUser()
        
    const { mutate: addFavourite } = useAddFavourite()
    const { mutate: removeFavourite } = useRemoveFavourite()

    const { isError: isErrorIds, data: favouriteIds } = useFetchIds({userId: user?._id, type: "favourite"})
    if(isErrorIds) console.log('An Error occured during fetching favouriteIds')

    
    // fetching data from backend
    const { films, fetchNextPage, isPending, isError, error, hasNextPage } = useFetchMedia({ search , page, setPage})
    if(isError) console.log('An error occured during fetching Media', error?.message)
    
    const lastMediaElementRef = useInfiniteScroll({loading: isPending, fetch: fetchNextPage, hasMore: hasNextPage})
    
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
                {isPending ? (
                // <SkeletonImage cards={8}/>
                    <div className=" min-w-7/10 mx-auto border-red-500">
                    <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem'  }}></i>
                    </div>
                ):
                (
                films.map((film, i) => {
                    if(films.length === i + 1) {
                    return <MediaCard<FilmsWithGenres> key={film.id} lastMediaElementRef={lastMediaElementRef}  media={film} favouriteIds={favouriteIds ?? new Set()}  addFavourite={addFavourite} removeFavourite={removeFavourite} userId={user?._id} showGenres isRef/>
                    } else {
                    return <MediaCard<FilmsWithGenres> key={film.id} lastMediaElementRef={lastMediaElementRef}  media={film} favouriteIds={favouriteIds ?? new Set()}  addFavourite={addFavourite} removeFavourite={removeFavourite} userId={user?._id} showGenres/>
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