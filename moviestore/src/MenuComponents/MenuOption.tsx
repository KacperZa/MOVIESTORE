import type React from "react"
import { motion } from "motion/react"
import { Link } from "react-router-dom"

interface MenuOptionsProps {
  text?: string
  icon: React.ReactNode
  url: string
}

function MenuOption({ text, icon, url}: MenuOptionsProps) {

  return (
    <>
    <div className="relative w-fit">
        <Link to={url} className="w-full">
            <motion.div 
            className="flex flex-row items-center gap-2  p-2 rounded-lg hover:text-accent transition-all ease-in-out duration-350"
            layout
            whileTap={{scale:0.95}}>
                {icon}
                <div className='text-lg font-medium'>
                  {text}
                  </div>
            </motion.div>
        </Link>
      </div>
    </>
  )
}

export default MenuOption