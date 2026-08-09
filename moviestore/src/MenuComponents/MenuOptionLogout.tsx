import { motion } from "motion/react"
import { useUser } from "../context/useUser"
import { useNavigate } from "react-router-dom"
import { LogIn, LogOut } from "lucide-react"


function MenuOptionLogout() {

    const { user, setUser } = useUser()

    const navigate = useNavigate()

    const handleLogout = () =>{
        setUser(null)
        navigate('/')
    }
    
    const handleLogin = () => {
      navigate('/login')
    }

  return (
    <>
    <div className="relative w-full">

         <button onClick={user !== null ? handleLogout : handleLogin } className=" cursor-pointer w-full">
            <motion.div 
            className="flex flex-row items-center gap-3  p-2 rounded-lg hover:bg-blue-500 over:scale-105 transition-all ease-in-out duration-350">
                {user !== null ? 
                <LogOut data-test size={30}  data-testid="logout-icon" /> 
                : 
                <LogIn size={40} color="white" data-testid="login-icon"/>}
                <div className='text-lg font-medium'>
                  {user !== null ? 'Logout' : 'Login' }
                  </div>
            </motion.div>
        </button>
        
  
      </div>
    </>
  )
}

export default MenuOptionLogout