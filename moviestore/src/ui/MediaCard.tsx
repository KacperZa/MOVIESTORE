import { motion, spring } from 'motion/react'
import React from 'react'
import { NoImageIcon } from "./Icons";
import { Star } from "lucide-react";
import { Heart } from 'lucide-react';
import { useDisclosure } from '@mantine/hooks';
import LightBox from './LightBox';
import type { FavouriteProps } from '@/PagesComponents/FavouriteToggle';


export interface Films {
    adult: boolean
    backdrop_path: string
    genre_ids: number[]
    id: number
    original_language: string
    original_title?: string
    overview: string
    popularity: number
    poster_path: string
    release_date: string
    title?: string
    name?: string
    video: boolean
    vote_average: number
    vote_count: number
}

export interface FilmsWithGenres extends Films{
    gatunki: string[]
  }

interface MediaCardProps<T extends FilmsWithGenres> {
    lastMediaElementRef?: (node: HTMLDivElement | null) => void
    setFavouriteIds: React.Dispatch<React.SetStateAction<Set<number>>>
    favouriteIds: Set<number>
    media: T
    type: string | undefined
    addFavourite: (props: FavouriteProps) => void
    removeFavourite: (props: FavouriteProps) => void
    isRef?: boolean
    addToHistory?: boolean
    showGenres?: boolean
    showLightBox?: boolean
}


function MediaCard<T extends FilmsWithGenres>({showGenres, lastMediaElementRef, media, type, favouriteIds, addFavourite, removeFavourite, isRef, setFavouriteIds, showLightBox} : MediaCardProps<T>) {
    const [opened, { open, close }] = useDisclosure(false)


  return (
    <>
        <motion.div
            ref={isRef ? lastMediaElementRef : null}   
            initial={{ opacity: 0, scale: 1}}
            animate={{ opacity: 1, x: 0}}
            whileHover={{scale: 1.02}}
            transition={{type: spring, stiffness: 100, damping: 10, mass: 1 }}
            className="aspect-2/3 m-0 relative w-7/10 mx-auto"
            onClick={open}
            >
            <div  className="cursor-pointer">
            <motion.div className="" initial="hidden" whileHover="visible" transition={{ duration: 0.3, staggerChildren: 0, when: "beforeChildren"}}>
                {/* Default image if poster image doesn't exist */}
            {media.poster_path ? 
            <img src={`https://image.tmdb.org/t/p/w500/${media.poster_path}`} className=" aspect-2/3 rounded-xl shadow-lg/20 justify-self-center select-none" loading='lazy'/>
            : 
            <div className="aspect-2/3 bg-gray-500 flex rounded-2xl justify-center items-center"> 
                <div className="">
                <NoImageIcon />
                </div>
            </div>
            }
            {/* Overlay for posters  */}
            <motion.div className={`absolute inset-0 flex px-7 py-10  gap-2 ${media.adult ? `justify-between` : `justify-end`} items-center flex-col text-white bg-linear-to-b to-gray-800/80 from-gray-500/0 rounded-xl`}
                variants={{
                hidden: { opacity: 0, y:0},
                visible: { opacity: 1, y:0}
                }}
                transition={{ duration: 0.3}}>

                {media.adult ? <div className="bg-red-500 px-2 py-1 rounded-lg">18+</div> : null }

                <motion.div className="flex flex-col items-center"
                variants={{
                hidden: { opacity: 0, y: 10},
                visible: { opacity: 1, y: 0, }  
                }}
                transition={{duration: 0.3}}
                >
                <div className="text-xl font-bold text-center">{ type === "tv" ? media.name : media.title}</div>
                <div className="flex flex-row text-sm w-full gap-2 mb-2">
                    <div className="flex flex-0.75 flex-row w-1/2 text-xs justify-center items-center gap-1.5">
                        <div className=""><Star color='transparent' fill='#FF0'/></div>
                    {/* Rounding the votes percents */}
                        <div>{Math.round(media.vote_average * 10)}%</div>
                    </div>
                    <div className="flex-wrap w-full flex-1 ">
                        
                    { showGenres && media.gatunki ? media.gatunki?.map((g:string, i:number) => (
                    <span key={i} className="text-xs"> {i === media.gatunki.length - 1 ? g  : g+","}</span>
                    )) : null }
                    
                    </div>
                    <div className="flex  flex-0.25 justify-center items-center">
                    <motion.button whileTap={{ scale: 1.2, rotate: -2 }}  whileHover={{ scale: 1.05}} onClick={(e) => {
                        if(favouriteIds.has(media.id)){
                            removeFavourite({e, media, setFavouriteIds})
                            console.log("Usuwamy")
                        } else {
                            addFavourite({e, type, media, setFavouriteIds});
                            console.log("Dodajemy")
                        }
                    }}
                        className="cursor-pointer">
                        {favouriteIds.has(media.id) ? <Heart color='#F00' fill='#F00' /> :  <Heart color='#F00' />}
                    </motion.button>
                    </div>
                    
                </div>

                </motion.div>
            </motion.div>
            </motion.div>
            </div>
            {showLightBox ? 
            <LightBox opened={opened} close={close} type={type} media={media}/>
            :
            null
            }
        </motion.div>

          
    </>
  )}

export default MediaCard