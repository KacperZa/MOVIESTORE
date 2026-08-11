import { useClickOutside } from '@/hooks/useClickOutside'
import { Search } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState } from 'react'

const MenuOptionSearch = () => {
    const [isVisible, setIsVisible] = useState(false)

    const ref = useRef<HTMLInputElement>(null)
    

    useClickOutside({ref, callback: () => setIsVisible(false)}) 
  return (
    <>
        <div className='relative flex items-center'>
            <motion.div whileTap={{scale:0.95}}>
                <Search className='cursor-pointer' size={30} onClick={(e) => {setIsVisible(true); e.stopPropagation()}}/>
            </motion.div>
            <AnimatePresence>
                {isVisible && 
                <motion.input type="text" className='p-2 bg-white text-black rounded-lg shadow-lg placeholder:text-gray focus:outline-none absolute top-1/2 -translate-y-1/2 right-0' placeholder='Search something...' 
                ref={ref}
                initial={{width: 0, opacity: 0}}
                animate={{width: "auto", opacity: 1}}
                exit={{width: 0, opacity: 0}}
                key="search-input"
                />}
            </AnimatePresence>
        </div>
    </>
  )
}

export default MenuOptionSearch