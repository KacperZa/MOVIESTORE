import { Carousel } from '@mantine/carousel'
import { motion } from 'motion/react'

const GenreSectionSkeleton = ({count}: {count: number}) => {
  return (
    <>
        {Array.from({ length: count}).map((_, i) => (
        <div key={i} className="flex flex-col gap-3 font-bold p-4 py-7 rounded-2xl bg-card">
            <div className='flex flex-row justify-between items-center'>
                <div className='text-3xl px-2 w-50 h-full rounded-lg animate-pulse bg-gray-450'></div>
                <motion.div className=' w-36 h-12 rounded-lg bg-gray-450 cursor-pointer animate-pulse'
                whileHover={{scale: 1.02}}
                transition={{type: "spring", stiffness: 150, damping: 8, mass: 1 }} />
            </div>
            <div className=" w-full flex-row gap-11 justify">
                    <Carousel
                    slideSize={{ base: '100%', sm: '50%', md: '33.333333%', lg: '30%' }}
                    slideGap={{ base: 'sm', sm: 'md', lg: 'lg' }}
                    emblaOptions={{
                        loop: true,
                        align: 'center',
                    }}
                    classNames={{
                        viewport: 'overflow-visible! mask-x-from-80% mask-x-to-100%',
                        controls: 'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                    }}
                    className='group'
                    >
                        {Array.from({ length: 10}).map((_, i) => (
                            <Carousel.Slide key={i}>
                                <div className='w-full h-auto aspect-video bg-gray-450 animate-pulse rounded-lg shadow-xl flex justify-center items-center select-none' /> 
                            </Carousel.Slide>
                        ))}
                    </Carousel>
            </div>
        </div>
        ))
        }
    </>
  )
}

export default GenreSectionSkeleton