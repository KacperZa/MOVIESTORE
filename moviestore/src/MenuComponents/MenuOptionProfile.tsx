import { AnimatePresence, motion } from "motion/react"
import {  Link, useNavigate } from "react-router-dom"
import { Settings } from "lucide-react"
import { useState } from "react"
import { useUser } from "@/context/useUser"



function MenuOptionProfile() {
  const [isVisible, setIsVisible ] = useState(false)
  const navigate = useNavigate()



  const handleClick = () => {
    if(user !== null) {
      setIsVisible(prev => !prev)
    } else {
      navigate('/login')
    }
  }

  const {user} = useUser()

  return (
    <>
    <div className="relative w-full">
        <button className="w-full cursor-pointer" onClick={handleClick}>
            <motion.div 
            className="flex flex-row items-center gap-3 p-2 rounded-lg hover:bg-blue-500 transition-all ease-in-out duration-350"
            layout>
                <Settings size={30} />
                <div className='text-lg font-medium'>
                  Profile
                  </div>
            </motion.div>
        </button>
        <AnimatePresence>
          {isVisible &&
            <motion.div className="absolute overflow-hidden shadow-2xl/30 z-30 w-48"
            initial={{height: 0, opacity: 0}}
            animate={{height: "auto", opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={{
              duration: 0.2
            }}>
              <div className="flex flex-col gap-2 px-3 py-1.5 mt-2 rounded-lg w-full bg-blue-300">
                <Link to={'/profile'} className="px-3 py-1.5">Profile</Link>
                <hr />
                <Link to={'/watch-history'} className="px-3 py-1.5">Watched Films</Link >
                <Link to={'/browse/tv'} className="px-3 py-1.5">Favourites</Link >
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </div>
    </>
  )
}

export default MenuOptionProfile