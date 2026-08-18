import { AnimatePresence, motion } from "motion/react"
import {  Link, useNavigate } from "react-router-dom"
import { Settings } from "lucide-react"
import { useRef, useState } from "react"
import { useUser } from "@/context/useUser"
import { useClickOutside } from "@/hooks/useClickOutside"
import ThemeSwitch from "@/ui/ThemeSwitch"



function MenuOptionProfile() {
  const [isVisible, setIsVisible ] = useState(false)
  const navigate = useNavigate()

  
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if(user !== null) {
      setIsVisible(prev => !prev)
      e.stopPropagation()
    } else {
      navigate('/login')
    }
  }

  const {user} = useUser()  
  const ref = useRef<HTMLDivElement>(null)

  useClickOutside({ref, callback: () => setIsVisible(false)})

  return (
    <>
    <div className="relative w-full" ref={ref}>
        <div className="w-full cursor-pointer" onClick={handleClick} >
            <motion.div 
            className="group flex flex-row items-center gap-3 p-2 rounded-lg hover:text-accent transition-all ease-in-out duration-350"
            layout>
                <Settings size={30} className="group-hover:rotate-180" />
                <div className='text-lg font-medium'>
                  Profile
                  </div>
            </motion.div>
        </div>
        <AnimatePresence>
          {isVisible &&
            <motion.div className="absolute overflow-hidden shadow-2xl/30 z-30 w-48"
            initial={{height: 0, opacity: 0}}
            animate={{height: "auto", opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={{
              duration: 0.2
            }}>
              <div className="flex flex-col gap-2 px-3 py-1.5 mt-2 rounded-lg w-full bg-background">
                <Link to={'/profile'} className="px-3 py-1.5" onClick={() => setIsVisible(false)}>Profile</Link>
                <hr  className="border-b border-card"/>
                <Link to={'/watch-history'} className="px-3 py-1.5" onClick={() => setIsVisible(false)}>Watched Films</Link >
                <Link to={'/favourites'} className="px-3 py-1.5" onClick={() => setIsVisible(false)}>Favourites</Link >
                <ThemeSwitch />
                  
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </div>
    </>
  )
}

export default MenuOptionProfile


