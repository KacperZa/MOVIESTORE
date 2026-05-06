import type React from "react"
import { AnimatePresence, motion, spring } from "motion/react"
import { Link } from "react-router-dom"
import { useEffect, useState, useRef, useContext } from "react"
import { GenreContext } from "../../context/GenreContext"
interface MenuOptionsProps {
  text: string
  icon: React.ReactNode
  // url: string
}

function MenuOption({ text, icon}: MenuOptionsProps) {
  const [isOpen, setIsOpen] = useState<boolean | null>(false)

  const ref = useRef<HTMLDivElement>(null);
  const genres = useContext(GenreContext);

  useEffect(() =>{
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)){
        setIsOpen(false)
      }
    };

    document.addEventListener('mousedown', handleClick);
      return ()=> document.removeEventListener('mousedown', handleClick)
  }, [])


  return (
    <>
    <div ref={ref} className="relative group w-fit" onClick={() => setIsOpen(true)}>
      <div className=" w-fit cursor-pointer">
          <motion.div 
          className="flex flex-row gap-3 bg-gray-950 w-fit p-1.5 p-px-2 rounded-xl select-none"
          initial= {{ x: 0}}
          whileHover={{ x:10}}
          transition={{type: spring, stiffness: 150, damping: 8, mass: 1 }}>
              {icon}
              <div className='text-2xl font-medium text-gray-200'>
                {text}
                </div>
          </motion.div>
      </div>
      <AnimatePresence>
      {isOpen && genres?.length !== 0 && 
        <motion.div 
        className={`flex flex-col absolute z-20 bg-blue-300 p-3 mt-2 rounded-2xl w-full translate-x-[10%]`}
        initial={{x:-100, opacity: 0}}
        animate={{x:0, opacity: 1}}
        exit={{x:-100, opacity:0}}
        transition={{duration: 0.3}}
        >
        <ul className="flex flex-col gap-1 p-2 py-1 font-medium">
            <Link to={`/browse`}>
              <li className="relative w-1/2
              after:absolute after:h-0.5 after:w-full after:bg-black after:left-0 after:bottom-0 after:scale-x-0 after:origin-right after:transition-transform after:duration-300 after:ease-in-out
              hover:after:scale-x-100 hover:after:origin-left hover:text-shadow-md/10 "> All movies</li>
            </Link> 
          {genres?.map((genres, id) => (
            <Link to={`movie/genre/${genres.id}/${genres.name}`} key={id}>
              <li className="relative w-1/2
              after:absolute after:h-0.5 after:w-full after:bg-black after:left-0 after:bottom-0 after:scale-x-0 after:origin-right after:transition-transform after:duration-300 after:ease-in-out
              hover:after:scale-x-100 hover:after:origin-left hover:text-shadow-md/10" key={id}> {genres.name}</li>
            </Link> 
          ))}
        </ul>

        </motion.div>
    } 
    </AnimatePresence>
        {/* DROPDOWN */}
      
      </div>
    </>
  )
}

export default MenuOption