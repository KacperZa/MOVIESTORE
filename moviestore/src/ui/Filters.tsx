import React, { type SetStateAction } from 'react'

// mantine ui
import { Select } from '@mantine/core';
export interface FilterItem {
  value: string
  label: string
}

interface FiltersProps {
  search?: string
  type: string | undefined
  setSelectedFilter: React.Dispatch<React.SetStateAction<FilterItem | undefined>>
  setAdultFilms: React.Dispatch<React.SetStateAction<boolean>>
  adultFilms: boolean
  name_genre?: string
  setIsVisibleSidebar: React.Dispatch<SetStateAction<boolean>>
  setIsVisibleFilters: React.Dispatch<SetStateAction<boolean>>
}

import { motion } from 'motion/react';
import Switch from './Switch';
import { FilterIcon } from 'lucide-react';

function Filters({search, type, setSelectedFilter, setAdultFilms, adultFilms, name_genre, setIsVisibleSidebar, setIsVisibleFilters} : FiltersProps) {


  const selectData = [
    { group: 'Popularity', items: [
      { value: 'popularity.asc', label: 'Ascending', icon: 'clock-arrow-down' },
      { value: 'popularity.desc', label: 'Descending', icon: 'clock-arrow-up' },
    ]},
    // { group: 'Title', items: [
    //   { value: 'title.asc', label: 'Ascending', icon: 'arrow-down-a-z' },
    //   { value: 'title.desc', label: 'Descending', icon: 'arrow-up-a-z' },
    // ]},
    { group: 'Vote average', items: [
      { value: 'vote_average.asc', label: 'Ascending', icon: 'arrow-down-1-0' },
      { value: 'vote_average.desc', label: 'Descending', icon: 'arrow-up-1-0' },
    ]},
    { group: 'Release date', items: [
      { value: 'primary_release_date.asc', label: 'Ascending', icon: 'calendar-arrow-down' },
      { value: 'primary_release_date.desc', label: 'Descending', icon: 'calendar-arrow-up' },
    ]},
  ]

  return (
    <>
      <motion.button 
      className=" flex justify-start items-center font-medium lg:text-lg py-2 px-2.5 rounded-xl bg-accent border-4 border-primary text-white cursor-pointer" 
      onClick={() => setIsVisibleSidebar(true)}
      whileTap={{ scale: 0.9, rotate: -2 }}  whileHover={{ scale: 1.05}}
      >
        Show sidebar
      </motion.button>

        {/* Filters for phones */}
        <motion.div 
        className='flex xl:hidden px-2 py-2 bg-accent  justify-center items-center rounded-lg border-4 border-primary cursor-pointer'
        onClick={() => {setIsVisibleFilters(true); console.log('Filters are visible')}}
        whileTap={{ scale: 0.9, rotate: -2 }}  whileHover={{ scale: 1.05}}>
          <FilterIcon />
        </motion.div>

      {!name_genre && <motion.div className=" flex justify-start items-center font-medium lg:text-lg py-2 px-2.5 rounded-xl bg-primary text-white">All {type === 'tv' ? 'TV shows: ' : 'movies: '}</motion.div>}
      {name_genre && type === "movie" ? <motion.div className="flex justify-start items-center font-bold lg:text-xl py-2 px-2.5 rounded-xl bg-primary text-white">{name_genre} movies: </motion.div> : null}
      {name_genre && type === "tv" ? <motion.div className="flex justify-start font-bold lg:text-xl p-2 px-2.5 rounded-xl bg-primary text-white">{name_genre} shows: </motion.div> : null}
      
      {search ? <motion.div  className="flex justify-start text- font-medium text-lg p-1 px-2 rounded-xl bg-primary text-white items-center">Search results for: {search}</motion.div> : 
        <>
      {/* Filters for bigger screens  */}
      <div className="hidden xl:flex h-full  justify-center items-center">
        <Select
          data={selectData}
        placeholder='Sort by...'
          onChange={(_value, option) => setSelectedFilter(option)}
          classNames={{
            input: '!border-2 !text-lg !py-5',
            dropdown: '!shadow-xl',
          }}
          allowDeselect={false}
          clearable
        />
      </div>


        
      <div className="hidden xl:flex gap-2 flex-row items-center bg-primary text-white  rounded-xl p-2">
        <p className="font-medium text-lg px-2">Enable adult films</p>
        {/* <Switch className='cursor-pointer' color="rgba(150, 27, 27, 1)" onChange={(e) => setAdultFilms(e.currentTarget.checked)}/> */}
        <Switch value={adultFilms} setValue={setAdultFilms} />
        
          {/* <Switch id="switch-focus-mode" className={'flex items-center cursor-pointer'} onCheckedChange={setAdultFilms}></Switch> */}
      </div>
        </>
        
        }
    </>
  )
}

export default Filters