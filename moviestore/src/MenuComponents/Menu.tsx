import MenuOption from './MenuOption'
import { motion } from 'motion/react'
import { Outlet, useNavigate } from 'react-router-dom'
import MenuOptionLogout from './MenuOptionLogout'
import { useUser } from '../context/useUser'
import { Clapperboard, Heart, House, Monitor, Star } from 'lucide-react'
import MenuOptionProfile from './MenuOptionProfile'


function Menu() {

  const {user} = useUser()
  const navigate = useNavigate()

  return (
  <>
    <motion.div className="flex flex-col font-inter bg-gray-200 max-w-screen h-screen w-full overflow-hidden gap-1 p-1">  {/* OPAKOWANIE CALEJ STRONY */}
      {/* MENU */}
      <motion.div className="group/item flex h-[10dvh] w-full flex-row gap-7 bg-blue-400 p-4 justify-between rounded-xl justify- items-center scrollbar-thumb-blue-300 scrollbar-gutter-stable "
      layout> 
        <div className="text-4xl font-istok-web font-semibold select-none cursor-pointer" onClick={() => navigate('/')}>MOVIESTORE</div>
        <div className='flex flex-row gap-5 items-center'>
              <MenuOption text={"Home"} url='/' icon={<House size={30} />}/>
              <MenuOption text={"Movies"} url='/browse/movie' icon={<Clapperboard  size={30}/>}/>
              <MenuOption text={"TV Series"} url='/browse/tv' icon={<Monitor size={30}/>}/>

              {/* <MenuOption text={"Favourite"} url={user !== null ? `/favourites` : `/login`} icon={<Heart  size={30}/>}/> */}
        </div>
        <div className='flex flex-row gap-8 h-fit'>
          <div className="flex flex-row gap-5 w-full">
              <MenuOptionProfile />
              <MenuOptionLogout />
          </div>
        </div>

      </motion.div>
    {/* MAIN PANEL  */}
      <div className=' flex h-[90dvh]'>
        <Outlet/>
      </div>
    </motion.div>
  </>
)
}

export default Menu
