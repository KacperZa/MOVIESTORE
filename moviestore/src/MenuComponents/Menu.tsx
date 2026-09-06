import MenuOption from './MenuOption'
import { AnimatePresence, motion } from 'motion/react'
import { Outlet, useNavigate } from 'react-router-dom'
import MenuOptionLogout from './MenuOptionLogout'
import { Clapperboard, House, MenuIcon, Monitor } from 'lucide-react'
import MenuOptionProfile from './MenuOptionProfile'
import MenuOptionSearch from './MenuOptionSearch'
import { useState } from 'react'
import DropdownMenu from './DropdownMenu'


function Menu() {
  const [isVisible, setIsVisible] = useState(false)

  const navigate = useNavigate()


  // Hamburger menu for smaller screens
  const hambugerMenuIconVariants = {
    hidden: {},
    visible: {
      rotate: 90
    }
  }

  return (
  <>
    <motion.div className="flex flex-col font-inter bg-background max-w-screen h-screen w-full overflow-hidden gap-1 text-text">  {/* OPAKOWANIE CALEJ STRONY */}
      {/* MENU */}
      <motion.div className="relative group/item flex flex-none flex-row gap-2 bg-background lg:px-6 lg:py-3 py-5 px-5 md:px-10  justify-between rounded-xl items-center scrollbar-thumb-blue-300 scrollbar-gutter-stable"
      layout> 
        <div className="text-4xl font-istok-web font-semibold select-none cursor-pointer" onClick={() => navigate('/')}>MOVIESTORE</div>
        <motion.div variants={hambugerMenuIconVariants} initial="hidden" animate={isVisible ? "visible" : "hidden"} className='flex lg:hidden px-10' onClick={() => {setIsVisible(prev => !prev); console.log('Dropdown menu activated')}}> <MenuIcon size={30}/></motion.div>

        <AnimatePresence>
        {isVisible && 
          <DropdownMenu setIsVisible={setIsVisible}/>
        }
        </AnimatePresence>

        <div className='hidden lg:flex'>
          <div className='flex flex-row gap-5 items-center'>
                <MenuOption text={"Home"} url='/' icon={<House size={30} />}/>
                <MenuOption text={"Movies"} url='/browse/movie' icon={<Clapperboard  size={30}/>}/>
                <MenuOption text={"TV Series"} url='/browse/tv' icon={<Monitor size={30}/>}/>
          </div>
        </div>

        <div className='hidden lg:flex'>
          <div className="flex flex-row gap-5 w-full">
              <MenuOptionSearch />
              <MenuOptionProfile />
              <MenuOptionLogout />
          </div>
        </div>

      </motion.div>
    {/* MAIN PANEL  */}
      <div className='flex-1 min-h-0'>
        <Outlet/>
      </div>
    </motion.div>
  </>
)
}

export default Menu
