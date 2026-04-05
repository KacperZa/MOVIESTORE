import type React from "react"
import { motion } from "motion/react"

interface MenuProps {
    text: string
    icon: React.ReactNode
}

function MenuOption({text, icon}: MenuProps) {
  return (
    <>
    <motion.div 
    className="flex flex-row gap-3 bg-gray-300 w-fit p-1.5 p-px-2 rounded-xl"
    initial= {{ x: 0}}
    whileHover={{ x:10}}
    >
        {icon}
        <div className='text-2xl font-medium'>{text}</div>
    </motion.div>
    </>
  )
}

export default MenuOption