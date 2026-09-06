
const MediaCardSkeleton = ({ count } : { count: number }) => {
  return (
    <>
        {Array.from({ length: count}).map((_, i) => (
            <div key={i} className=' aspect-2/3 h-[92%] w-7/10 bg-gray-450 mx-auto rounded-xl animate-pulse'/>
        ))}
    </>
  )
}

export default MediaCardSkeleton