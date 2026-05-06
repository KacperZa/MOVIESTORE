import type React from "react"
import { motion, spring } from "motion/react"
import { Link } from "react-router-dom"
interface MenuOptionsProps {
  text: string
  icon: React.ReactNode
  url: string
}

function MenuOption({ text, icon, url}: MenuOptionsProps) {

  return (
    <>
    <div className="relative group w-fit">
        <Link to={url} className=" w-fit">
            <motion.div 
            className="flex flex-row gap-3 bg-gray-950 w-fit p-1.5 p-px-2 rounded-xl select-none"
            initial= {{ x: 0}}
            whileHover={{ x:10}}
            transition={{type: spring, stiffness: 150, damping: 8, mass: 1 }}>
                {icon}
                <div className='text-2xl font-medium text-gray-200'>
                  {text}
                  </div>
            </motion.div>
        </Link>
      </div>
    </>
  )
}

export default MenuOption