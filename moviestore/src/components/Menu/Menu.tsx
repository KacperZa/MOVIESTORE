import MenuOption from './MenuOption'
// import { motion } from 'motion/react'
import { HeartIcon, MagnifyingGlassIcon, SkipIcon, SettingsIcon, FavouriteIcon, HomeIcon} from '../Icons'
import { motion } from 'motion/react'
import MenuOptionBrowse from './MenuOptionBrowse'
import { Outlet } from 'react-router-dom'
import MenuOptionLogout from './MenuOptionLogout'
import { useUser } from '../../context/useUser'


function Menu() {

  const {user} = useUser()

  return (
  <>
    <motion.div className="flex flex-row font-inter p-6 bg-gray-200 min-w-screen max-h-screen mb-0 overflow-hidden">  {/* OPAKOWANIE CALEJ STRONY */}
    <div className="flex flex-col max-h-screen justify-between">
      {/* SIDEBAR */}
      <motion.div className="flex flex-col gap-13 max-h-screen bg-blue-400 p-6 py-11 rounded-2xl w-90 top-6 overflow-y-auto"
      // initial = {{opacity:1, x: 0}}
      // whileHover={{opacity: 0, x:-400}} 
      > 
        <div className="text-5xl font-istok-web font-semibold select-none">MOVIESTORE</div>
        <div className='flex flex-col gap-8 '>
            <div className="text-4xl font-bold">Menu</div>
            <div className="flex flex-col gap-9">
              <MenuOption text={"Home"} url='/' icon={<HomeIcon/>}/>
              <MenuOptionBrowse text={"Browse"} icon={<MagnifyingGlassIcon/>}/>
              <MenuOption text={"Coming soon"} url='/browse' icon={<SkipIcon/>}/>
              <MenuOption text={"Watchlist"} url={user !== null ? `/browse` : `/login`} icon={<HeartIcon/>}/>
              {/* TODO ZMIENIC IKONE  */}
              <MenuOption text={"Watched films"} url={user !== null ? `/watch-history` : `/login`} icon={<HeartIcon/>}/>
              <MenuOption text={"Favourite"} url={user !== null ? `/favourites` : `/login`} icon={<FavouriteIcon/>}/>
            </div>
          </div>
        <div className='flex flex-col gap-8'>
        <div className="text-4xl font-bold ">General</div>
        <div className="flex flex-col gap-9">
              <MenuOption text={"Profile"} url={user !== null ? `/profile` : `/login`} icon={<SettingsIcon/>}/>
              <MenuOptionLogout/>
          </div>
        </div>

      </motion.div>
    </div>
    {/* MAIN PANEL  */}
      <Outlet/>
    </motion.div>
  </>
)
}

export default Menu
