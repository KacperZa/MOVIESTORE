import type React from "react"
import { motion, spring } from "motion/react"
import { useUser } from "../../context/useUser"
interface MenuOptionsProps {
  icon: React.ReactNode
}

function MenuOption({ icon}: MenuOptionsProps) {

    const { setUser} = useUser()

    const handleLogout = () =>{
        setUser(null)
    }

  return (
    <>
    <div className="relative group w-fit">
        <button onClick={handleLogout} className=" w-fit cursor-pointer">
            <motion.div 
            className="flex flex-row gap-3 bg-gray-950 w-fit p-1.5 p-px-2 rounded-xl select-none"
            initial= {{ x: 0}}
            whileHover={{ x:10}}
            transition={{type: spring, stiffness: 150, damping: 8, mass: 1 }}>
                {icon}
                <div className='text-2xl font-medium text-gray-200'>
                  Logout
                  </div>
            </motion.div>
        </button>
      </div>
    </>
  )
}

export default MenuOption