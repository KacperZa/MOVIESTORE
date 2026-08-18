import { motion } from 'motion/react'
import React from 'react'

interface SwitchProps {
    value: boolean
    setValue: React.Dispatch<React.SetStateAction<boolean>>
    sliderColor?: string
    sliderColorChange?: string
    backgroundColor?: string
    backgroundColorChange?: string
}

function Switch({value, setValue, sliderColor = "bg-gray-400", sliderColorChange = "bg-white", backgroundColor = "bg-gray-200", backgroundColorChange = "bg-black"}: SwitchProps) {

    const handleSwitch = () => {
        setValue((prev: boolean) => !prev)
    }
    
  return (
    <>
        <motion.button className={`flex ${value ? `justify-end ${backgroundColorChange}` : `justify-start ${backgroundColor}`} w-12 h-6 cursor-pointer p-1 px-2 rounded-xl font-medium`} onClick={handleSwitch}>
            <motion.div layout className={`h-full w-1/2 rounded-2xl  ${value ? `${sliderColorChange}`: `${sliderColor}`}`}></motion.div>
        </motion.button>
    </>
  )
}

export default Switch