import { Clapperboard, House, Monitor } from 'lucide-react'
import { motion } from 'motion/react'
import { type Dispatch, type SetStateAction } from 'react'
import { Link } from 'react-router-dom'

interface DropdownMenuProps {
    setIsVisible: Dispatch<SetStateAction<boolean>>
}

const DropdownMenu = ({setIsVisible} : DropdownMenuProps) => {
  return (
    <motion.div 
    className='absolute top-full left-0 w-full py-7 bg-card px-5 z-40 border-6 border-background rounded-b-2xl flex justify-center flex-col items-center text-2xl font-semibold overflow-hidden'
    initial={{height: 0, opacity: 0}}
    animate={{height: 'auto', opacity: 1}}
    exit={{height: 0, opacity: 0}}
    transition={{
        ease: "easeInOut",
        duration: 0.3
    }}>
        <div className='py-3 px-6 flex flex-row gap-2 w-fit'>
        <House size={30} />
        <Link to={'/'} onClick={()  => setIsVisible(prev => !prev)}>Home</Link>
        </div>
        <div className='py-3 px-6 flex flex-row gap-2 w-fit'>
        <Clapperboard size={30}/>
        <Link to={'/browse/movie'} onClick={()  => setIsVisible(prev => !prev)}>Movies</Link>
        </div>
        <div className='py-3 px-6 flex flex-row gap-2 w-fit'>
        <Monitor size={30}/>
        <Link to={'/browse/tv'} onClick={()  => setIsVisible(prev => !prev)}>Tv Shows</Link>
        </div>
    </motion.div>
  )
}

export default DropdownMenu