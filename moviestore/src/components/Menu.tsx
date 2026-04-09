import MenuOption from './MenuOption'
// import { motion } from 'motion/react'
import {HeartIcon, MagnifyingGlassIcon, SkipIcon, SettingsIcon, FavouriteIcon, HomeIcon} from './Icons'
import { motion } from 'motion/react'

interface MenuProps {
  children: React.ReactNode
}

function Menu({children}: MenuProps) {

  
  return (
  <>
    <motion.div className="flex flex-row font-inter p-6 bg-gray-200 w-full  mb-0 ">  {/* OPAKOWANIE CALEJ STRONY */}
    <div className="flex flex-col">
      {/* SIDEBAR */}
      <motion.div className="flex flex-col gap-14 h-100% bg-blue-600 p-6 rounded-2xl sticky top-6  w-1/1 "
      // initial = {{opacity:1, x: 0}}
      // whileHover={{opacity: 0, x:-400}} 
      > 
        <div className="text-5xl font-istok-web font-semibold">MOVIESTORE</div>
        <div className='flex flex-col gap-8'>
            <div className="text-4xl font-bold">Menu</div>
            <div className="flex flex-col gap-9">
              <MenuOption text={"Home"} url='/' icon={<HomeIcon/>}/>
              <MenuOption text={"Browse"} url='/browse' icon={<MagnifyingGlassIcon/>}/>
              <MenuOption text={"Coming soon"} url='/browse' icon={<SkipIcon/>}/>
              <MenuOption text={"Watchlist"} url='/browse' icon={<HeartIcon/>}/>
              {/* TODO ZMIENIC IKONE  */}
              <MenuOption text={"Watched films"} url='/browse' icon={<HeartIcon/>}/>
              <MenuOption text={"Favourite"} url='/browse' icon={<FavouriteIcon/>}/>
            </div>
          </div>
        <div className='flex flex-col gap-8'>
        <div className="text-4xl font-bold">General</div>
        <div className="flex flex-col gap-9">
              <MenuOption text={"Settings"} url='/browse' icon={<SettingsIcon/>}/>

          </div>
        </div>

      </motion.div>
    </div>
    {/* MAIN PANEL  */}
    {children}
    </motion.div>
  </>
)
}

export default Menu
