import type React from "react"
import { motion } from "motion/react"
import { Link } from "react-router-dom"

interface MenuOptionsProps {
    text: string
    icon: React.ReactNode
    url: string
}

function MenuOption({text, icon, url}: MenuOptionsProps) {
  return (
    <>
    <Link to={url}>
      <motion.div 
      className="flex flex-row gap-3 bg-gray-950 w-fit p-1.5 p-px-2 rounded-xl"
      initial= {{ x: 0}}
      whileHover={{ x:10}}
      >
          {icon}
          <div className='text-2xl font-medium text-gray-200'>
            {text}
            </div>
      </motion.div>
    </Link>
    </>
  )
}

export default MenuOption