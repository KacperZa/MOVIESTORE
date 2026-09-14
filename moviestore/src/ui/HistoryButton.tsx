import { useUser } from '@/context/useUser'
import useAddHistory from '@/hooks/HistoryHooks/useAddHistory'
import usePatchHistory, { type HistoryMap } from '@/hooks/HistoryHooks/usePatchHistory'
import useRemoveHistory from '@/hooks/HistoryHooks/useRemoveHistory'
import { Check, ChevronDown, Clock, Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface HistoryButtonProps {
    type: string
    id: number
    historyMap: Map<number, HistoryMap>
}

const HistoryButton = ({historyMap, id, type} : HistoryButtonProps) => {
    const [isVisible, setIsVisible] = useState(false)

    const { mutate: mutateAddHistory } = useAddHistory()
    const { mutate: mutateRemoveHistory } = useRemoveHistory()
    const { mutate: mutatePatchHistory } = usePatchHistory()

    const { user } = useUser()

    const navigate = useNavigate()

    const status = historyMap.get(id)

    // Variants for add to watch history list 

    const plusVariants = {
        add: {
            rotate: 0,
        },
        remove: {
            rotate: 45,
            transition: {
                duration: 0.2
            }
        }       
    }

  return (
        <motion.div 
        className={`${historyMap.has(id) ? 'bg-red-950 border-red-700' : 'bg-green-950 border-green-700'} relative text-white pl-3 border-4 flex flex-row justify-between rounded-lg items-center gap-1 w-60`}
        whileTap={{ scale: 0.98}}  
        whileHover={{ scale: 1.03}}
        transition={{
            duration: 0.2,
            ease: "easeInOut"
        }}
        >
            <button className='flex flex-row justify-center items-center pt-1.5 pb-2 pr-1 cursor-pointer select-none flex-1 min-w-0 ' 
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                if(!id || !type) return
                if (user === null) {navigate('/login'); return}
     
                if(historyMap.has(id)){
                    mutateRemoveHistory({ id, userId: user?._id })
                    console.log("Usuwamy z WATCHED")
                } else {
                    mutateAddHistory({ type, id, status: "pending", userId: user?._id});
                    console.log("Dodajemy DO WATCHED")
                }
                }}
            >
                <motion.div variants={plusVariants} initial={historyMap.has(id) ? "remove": "add"} animate={historyMap.has(id) ? "remove": "add"} className='flex'>
                    <Plus size={35} color={historyMap.has(id) ? 'red' : 'green'}/>

                </motion.div>
                <p className='text-sm lg:text-lg px-1'>
                    {historyMap.has(id) ? 'In watchlist' : 'Add to watchlist'}
                </p>
            </button>

            <div className={`border-l-3 ${!historyMap.has(id) ? 'border-green-700 hover:bg-green-900' : 'border-red-700 hover:bg-red-900'} self-stretch flex items-center px-0.5 justify-center  rounded-r-sm cursor-pointer`}
            onClick={() => setIsVisible(prev => !prev)}
            >
                <ChevronDown size={20}/>
            </div>
            <AnimatePresence>
            {/* Saving media as watched  */}
            {isVisible &&
            <motion.button 
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            exit={{ opacity: 0}}
            transition={{
                duration: 0.2,
                ease: 'easeInOut'
            }}
            className={`absolute -top-full left-0 h-full bg-blue-900 border-blue-500 w-full p-2 rounded-t-lg border-4 flex items-center justify-center cursor-pointer select-none hover:bg-blue-950`}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                if(!id || !type) return
                if (user === null) {navigate('/login'); return}
                
                // Checking if media is in watchlist to avoid 404 error
                if(historyMap.has(id)) {
                    // Checking the status
                    if(status === "watched") {
                        mutatePatchHistory({ type, id, status: "pending", userId: user?._id})
                    } else {
                        mutatePatchHistory({ type, id, status: "watched", userId: user?._id})
                    }
                } else {
                    mutateAddHistory({ type, id, status: "pending", userId: user?._id})
                }

                }}
            >
                {status === "watched" ? <Check size={30}/> : <Clock size={30}/>}
                <div className='text-lg px-2'>
                    {status === "watched" ? 'Mark as pending': 'Mark as watched'}
                    
                </div>
            </motion.button>
            }
            </AnimatePresence>

        </motion.div>
  )
}

export default HistoryButton