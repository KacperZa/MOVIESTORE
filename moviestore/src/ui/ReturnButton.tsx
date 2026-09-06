import { Undo2 } from 'lucide-react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'


const ReturnButton = () => {
    const navigate = useNavigate()
    
  return (
    <motion.button 
    className="py-3 px-6 bg-card rounded-lg cursor-pointer" 
    whileTap={{ scale: 0.9, rotate: -2 }}
    whileHover={{ scale: 1.1}}
    onClick={() => navigate(-1)}>
        <Undo2 size={30}/>
    </motion.button>
  )
}

export default ReturnButton