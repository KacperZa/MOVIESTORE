const MovieDetailsSkeleton = () => {
  return (
    <>
    {/* IMAGE  SECTION*/}
            <div className='relative w-full h-full'> 
                {/* Image skeleton  */}
                <div className='w-full h-full object-cover aspect-video bg-gray-500' />
                
                {/* Overlay */}
                <div className='absolute left-0 bottom-0 w-full h-full flex flex-row justify-between'>

                    <div className='h-full flex flex-col flex-evenly justify-end p-7 gap-2'>
                        <div 
                        className='flex flex-col justify-end text-white gap-2'
                        >
                            {/* Title skeleton */}
                            <div className='w-200 h-20 bg-gray-450 rounded-lg animate-pulse'/>
                            {/* Tagline skeleton  */}
                            <div className=' w-100 h-10 bg-gray-450 rounded-lg animate-pulse'/>

                        </div>
                    </div>
                    <div className='h-full p-7 gap-2 flex items-end'>
                        {/* Add to watch history skeleton  */}
                        <div className= 'w-50 h-15 bg-gray-450 rounded-lg animate-pulse' />
                        {/* Add to favourites skeleton */}
                        <div className='w-15 h-15 bg-gray-450 rounded-lg animate-pulse' />
                    </div>
                </div>

            </div>
            <div id='info' className='w-full  bg-card p-10 flex flex-col gap-5 items-center'>
                {/* Title skeleton */}
                <div className='w-150 h-15 bg-gray-450 rounded-lg animate-pulse' /> 

                <div className='h-full w-2/3 rounded-lg p-5 flex flex-col gap-5'>

                    <div className='flex flex-row justify-evenly flex-wrap gap-y-2 gap-1'>
                        {/* Pills skeleton  */}
                        {Array.from({ length: 7}).map((_,i) => (
                            <div key={i} className='bg-gray-450 rounded-2xl w-30 h-10 animate-pulse' />
                        ))
                        }
                    </div>
                    {/* Overview skeleton  */}
                    <p className='w-full h-50 bg-gray-450 rounded-lg animate-pulse' />

                    {/* Finances sector skeleton  */}
                    <div className='w-full flex flex-row justify-around items-center h-20 bg-gray-450 rounded-lg'>
                        {/* Icon skeleton  */}
                        <div className='w-10 h-10 bg-gray-500 rounded-lg animate-pulse'/>
                        {/* Data skeleton  */}
                        <div className='flex flex-row justify-evenly w-1/2'>
                            <div className='w-50 h-10 bg-gray-500 rounded-lg animate-pulse' />
                            <div className='w-50 h-10 bg-gray-500 rounded-lg animate-pulse' />
                        </div>
                    </div>


                </div>
                {/* Videos skeleton  */}
                <div className='w-full flex justify-center items-center pb-4 rounded-2xl'>
                    <div className='flex flex-row gap-2 w-full'>  
                        {Array.from({length: 3}).map((_, i) => (
                            <div key={i} className='aspect-video w-full h-full rounded-lg bg-gray-450 animate-pulse' />
                        ))
                        }
                    </div>
                </div>

            </div>
    </>
  )
}

export default MovieDetailsSkeleton