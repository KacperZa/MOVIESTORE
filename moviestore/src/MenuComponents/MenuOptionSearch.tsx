import { Search, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MenuOptionSearch = () => {
    const [isVisible, setIsVisible] = useState(false)
    const [query, setQuery] = useState('')

    const ref = useRef<HTMLInputElement>(null)

    // useClickOutside({ref, callback: () => setIsVisible(false)}) 

    const navigate = useNavigate()

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault()
        if(!query.trim()) return
        navigate(`/search?query=${encodeURIComponent(query)}`)
    }
  return (
    <>
        <div className='relative flex items-center'>
            <motion.div whileTap={{scale:0.95}}>
                <Search className='cursor-pointer' size={30} onClick={(e) => {setIsVisible(true); e.stopPropagation()}}/>
            </motion.div>
            <AnimatePresence>
                {isVisible && 
                <form onSubmit={(e) => handleSubmit(e)} className='absolute top-1/2 -translate-y-1/2 right-0'>
                    <motion.input type="text" className='p-2 px-3 pr-10 bg-white text-black rounded-lg shadow-lg placeholder:text-gray focus:outline-none' placeholder='Search something...' 
                    ref={ref}
                    initial={{width: 0, opacity: 0}}
                    animate={{width: "auto", opacity: 1}}
                    exit={{width: 0, opacity: 0}}
                    key="search-input"
                    onChange={(e) => setQuery(e.target.value)}
                    />
                    <motion.div 
                    className='absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer' 
                    onClick={() => setIsVisible(false)}
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    >
                        <X color='black'/>
                    </motion.div>
                </form>}
            </AnimatePresence>
        </div>
    </>
  )
}

export default MenuOptionSearch