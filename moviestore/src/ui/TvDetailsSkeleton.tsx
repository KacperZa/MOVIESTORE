const TvDetailsSkeleton = () => {
  return (
    <>
        <>
        <div className='relative w-full h-full'> 
            <div className='w-full h-full object-cover aspect-video bg-gray-500' />
            <div className='absolute left-0 bottom-0 w-full h-full bg-linear-to-b to-black/80 from-gray-500/0 flex flex-row justify-between'>
                 {/* TEXT */}
                <div 
                className='h-full flex flex-col justify-end text-white p-7 gap-2'
                >
                            {/* Title skeleton */}
                            <div className='w-200 h-20 bg-gray-450 rounded-lg animate-pulse'/>
                            {/* Tagline skeleton  */}
                            <div className=' w-100 h-10 bg-gray-450 rounded-lg animate-pulse'/>
                </div>
                {/* BUTTONS  */}
                <div className='h-full p-7 gap-2 flex items-end'>
                        {/* Add to watch history skeleton  */}
                        <div className= 'w-50 h-15 bg-gray-450 rounded-lg animate-pulse' />
                        {/* Add to favourites skeleton */}
                        <div className='w-15 h-15 bg-gray-450 rounded-lg animate-pulse' />
                </div>
            </div>
        </div>

        {/* INFO SECTION   */}
        <div id='info' className='w-full bg-card p-10 flex flex-col gap-5 items-center'>
            {/* Title skeleton  */}
                <div className='w-150 h-15 bg-gray-450 rounded-lg animate-pulse' />  

            <div className='h-full w-2/3 rounded-lg p-5 flex flex-col gap-2'>

                <div className='flex flex-row justify-evenly flex-wrap gap-y-2 gap-1'>
                        {/* Pills skeleton  */}
                        {Array.from({ length: 7}).map((_,i) => (
                            <div key={i} className='bg-gray-450 rounded-2xl w-30 h-10 animate-pulse' />
                        ))
                        }
                </div>

                    {/* Overview skeleton  */}
                    <p className='w-full h-50 bg-gray-450 rounded-lg animate-pulse' />

                <div className='w-full  flex justify-center items-center pb-4 rounded-2xl'>
                    <div className='flex flex-row gap-2 w-full'>  
                        {Array.from({length: 3}).map((_, i) => (
                            <div key={i} className='aspect-video w-full h-full rounded-lg bg-gray-450 animate-pulse' />
                        ))
                        }  
                    </div>
                </div>
            {/* SEASON SECTION */}
            <div className='w-full border-4 border-primary rounded-2xl p-5 flex flex-col gap-3'>
                {/* Season name skeleton */}
                <p className='h-13 w-50 rounded-lg bg-gray-450 animate-pulse' />
                <div className='w-full flex flex-row justify-center gap-5'> 
                    {/* Season pills skeletons  */}
                    {Array.from({length: 5}).map((_,i) => (
                        <div key={i} className='w-30 h-7 bg-gray-450 animate-pulse rounded-lg'/>
                    ))}
                </div>
                <div className='w-full h-full flex flex-row-reverse justify-between p-2 gap-2'>
                    {/* Current season image skeleton  */}
                    <div className='w-1/2 bg-gray-450 aspect-2/3 h-full rounded-lg'/>

                    <div className='flex flex-col w-1/2 gap-3 p-2'>
                        {/* Current season name skeleton  */}
                        <p className='h-10 w-40 bg-gray-450 rounded-lg animate-pulse' />
                        {/* Current season overview skeleton  */}
                        <p className='w-full h-100 bg-gray-450 rounded-lg' />
                        {/* Current season rating skeleton */}
                        <p className='h-8 w-30 bg-gray-450 rounded-lg animate-pulse'/>
                        {/* Current season air date skeleton  */}
                        <p className='w-20 h-5 bg-gray-450 rounded-lg animate-pulse'/>
                    </div>                    
                </div>                
            </div>

            </div>


        </div>
        </>
    </>
  )
}

export default TvDetailsSkeleton