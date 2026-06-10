import { motion, spring } from "motion/react"
import { useUser } from "../../context/useUser"
import { Link, useNavigate } from "react-router-dom"
import { LoginIcon, LogoutIcon } from "../Icons"


function MenuOption() {

    const { user, setUser} = useUser()

    const navigate = useNavigate()

    const handleLogout = () =>{
        setUser(null)
        navigate('/')
    }

  return (
    <>
    <div className="relative group w-fit">

        {user !== null ? <button onClick={handleLogout} className=" w-fit cursor-pointer">
            <motion.div 
            className="flex flex-row gap-3 bg-gray-950 w-fit p-1.5 p-px-2 rounded-xl select-none"
            initial= {{ x: 0}}
            whileHover={{ x:10}}
            transition={{type: spring, stiffness: 150, damping: 8, mass: 1 }}>
                <LogoutIcon />
                <div className='text-2xl font-medium text-gray-200'>
                  Logout
                  </div>
            </motion.div>
        </button>
        :
        <Link to={'/login'} className=" w-fit cursor-pointer">
            <motion.div 
            className="flex flex-row gap-3 bg-gray-950 w-fit p-1.5 p-px-2 rounded-xl select-none"
            initial= {{ x: 0}}
            whileHover={{ x:10}}
            transition={{type: spring, stiffness: 150, damping: 8, mass: 1 }}>
                <LoginIcon />
                <div className='text-2xl font-medium text-gray-200'>
                  Login
                  </div>
            </motion.div>
        </Link>
        }
      </div>
    </>
  )
}

export default MenuOption