import React, { useEffect, useState } from 'react'

// shadcn ui

// lucide-react 
import {
  BrushCleaning
} from "lucide-react";

import { DynamicIcon } from 'lucide-react/dynamic';
import type { IconName } from 'lucide-react/dynamic';

import {
  ClockArrowDown,
  ClockArrowUp,
  ArrowDownAZ,
  ArrowUpAZ,
  ArrowDown10,
  ArrowUp10,
  CalendarArrowDown,
  CalendarArrowUp,
  type LucideIcon,
} from 'lucide-react'

import { Select } from '@mantine/core';
import type { ComboboxItem } from '@mantine/core';




export interface FilterItem {
    enumValue: string
    groupLabel: string
    icon: IconName
}

interface FiltersProps {
    search: string
    selectedFilter: ComboboxItem | undefined
    type: string | undefined
    setPosition:  React.Dispatch<React.SetStateAction<undefined>>
    setSelectedFilter: React.Dispatch<React.SetStateAction<ComboboxItem<string> | undefined>>
    setAdultFilms: React.Dispatch<React.SetStateAction<boolean>>
    adultFilms: boolean
    name_genre?: string
}

import { motion } from 'motion/react';
import Switch from './Switch';

function Filters({search, selectedFilter, type, setPosition, setSelectedFilter, setAdultFilms, adultFilms, name_genre} : FiltersProps) {
  const [value, setValue] = useState<ComboboxItem | null>();

  const iconMap: Record<string, LucideIcon> = {
    'clock-arrow-down': ClockArrowDown,
    'clock-arrow-up': ClockArrowUp,
    'arrow-down-a-z': ArrowDownAZ,
    'arrow-up-a-z': ArrowUpAZ,
    'arrow-down-1-0': ArrowDown10,
    'arrow-up-1-0': ArrowUp10,
    'calendar-arrow-down': CalendarArrowDown,
    'calendar-arrow-up': CalendarArrowUp,
  }

  const groupedFilters: FilterItem[] = [
    { enumValue: 'popularity.asc', groupLabel: 'Popularity', icon: 'clock-arrow-down' },
    {  enumValue: 'popularity.desc', groupLabel: 'Popularity', icon: 'clock-arrow-up' },
    {  enumValue: 'title.asc', groupLabel: 'Title', icon: 'arrow-down-a-z' },
    {  enumValue: 'title.desc', groupLabel: 'Title', icon: 'arrow-up-a-z' },
    {  enumValue: 'vote_average.asc', groupLabel: 'Vote average', icon: 'arrow-down-1-0' },
    {  enumValue: 'vote_average.desc', groupLabel: 'Vote average', icon: 'arrow-up-1-0' },
    {  enumValue: 'primary_release_date.asc', groupLabel: 'Release date', icon: 'calendar-arrow-down' },
    {  enumValue: 'primary_release_date.desc', groupLabel: 'Release date', icon: 'calendar-arrow-up' },
  ]

  useEffect(() => {
    console.log(value)
    console.log(selectedFilter)
  },[value, selectedFilter])

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
      {!name_genre && <motion.div layout className=" flex justify-start items-center font-medium text-lg  px-3 rounded-xl bg-green-300">All {type === 'tv' ? 'TV shows: ' : 'movies: '}</motion.div>}
      {name_genre && type === "movie" ? <motion.div layout className="flex justify-start font-bold text-xl p-2 px-3 rounded-xl bg-green-300">{name_genre} movies: </motion.div> : null}
      {name_genre && type === "tv" ? <motion.div layout className="flex justify-start font-bold text-xl p-2 px-3 rounded-xl bg-green-300">{name_genre} shows: </motion.div> : null}
      
        {search ? <motion.div  className="flex justify-start text- font-medium text-lg p-1 px-2 rounded-xl bg-green-300">Search results for: {search}</motion.div> : 
        <>
        {/* {selectedFilter ? <motion.div layout className=" flex justify-start items-center font-medium text-xl p-2 px-3  rounded-xl bg-green-300">Filtering {selectedFilter?.label} by {selectedFilter?.groupLabel}</motion.div> : null} */}
      <div className="h-full flex justify-center items-center">
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
        
      <div className="flex gap-2 flex-row items-center bg-green-300  rounded-xl p-2">
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