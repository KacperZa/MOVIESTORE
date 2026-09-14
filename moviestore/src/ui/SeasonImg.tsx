import { ImageOff } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'

const SeasonImg = ({ posterPath } : { posterPath?: string }) => {
    const [imgError, setImgError] = useState(false)
  return (
            !posterPath || imgError ?
            <div className='w-full md:w-1/2 aspect-auto rounded-lg flex justify-center items-center'>
                <ImageOff size={100}/>
            </div>
            :
                <motion.img 
                src={`https://image.tmdb.org/t/p/w780/${posterPath}`}
                onError={() => setImgError(true)}
                // variants={imagesVariants}
                // initial="hidden" 
                // animate={mainControls}
                id='season-img' 
                loading='lazy' 
                className='w-full md:w-1/2 aspect-auto rounded-lg'/>
  )
}

export default SeasonImg