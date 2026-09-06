import type { SetStateAction } from 'react'
import ReactDOM from 'react-dom'
import Switch from './Switch'
import { Select } from '@mantine/core'
import type React from 'react'
import type { FilterItem } from './Filters'
import { motion } from 'motion/react'

interface FiltersMobileProps {
    setIsVisibleFilters: React.Dispatch<SetStateAction<boolean>>
    setAdultFilms: React.Dispatch<React.SetStateAction<boolean>>
    adultFilms: boolean
    setSelectedFilter: React.Dispatch<React.SetStateAction<FilterItem | undefined>>
}

const FiltersMobile = ({setIsVisibleFilters, adultFilms, setAdultFilms, setSelectedFilter} : FiltersMobileProps) => {

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

    // Creating react portal
    const portalRoot = document.getElementById('portal')
    if(!portalRoot) return null

  return ReactDOM.createPortal(
    <motion.div 
    className='z-100 min-w-screen max-w-screen w-screen h-screen min-h-screen bg-black/50 fixed top-0 left-0 flex justify-center items-center backdrop-blur-xs' 
    onClick={() => setIsVisibleFilters(false)}
    initial={{opacity: 0 }}
    animate={{opacity: 1}}
    exit={{opacity: 0}}
    transition={{
        duration: 0.3
    }}>
        <motion.div 
        className='w-2/3 bg-accent rounded-2xl border-5 border-primary flex flex-col p-5 gap-5' 
        onClick={(e) => e.stopPropagation()}
        initial={{y: -50}}
        animate={{y: 0}}
        exit={{y: -50}}
        transition={{
            duration: 0.3
        }}>
            <p className='text-text font-bold text-2xl'>Filters</p>
            <div className='flex gap-6 flex-col'>
                <div className='flex flex-row gap-2 items-center'>
                    <p className='text-md font-medium'>Enable adult films</p>
                    <Switch value={adultFilms} setValue={setAdultFilms} />
                </div>

                <div className='flex flex-col gap-2'>
                    <p className='text-md font-medium'>Set sorting order by:</p>
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
            </div>


        </motion.div>
    </motion.div>, portalRoot
  )
}

export default FiltersMobile