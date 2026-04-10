import Skeleton from "react-loading-skeleton"

const SkeletonImage = ({cards} : {cards: number}) => {
  return (
    Array(cards).fill(0)
    .map((_, i) => (    
    <div className='w-full h-full p-10' key={i}>
        <Skeleton height={420}  className=""width={400} baseColor="#2f2f2f" highlightColor="#444" borderRadius={5}/>
    </div>)

  )
)
}

export default SkeletonImage