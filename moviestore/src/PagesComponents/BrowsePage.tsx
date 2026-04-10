import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { LesserThanIcon, GreaterThanIcon } from "../components/Icons";
// import SkeletonImage from "../components/SkeletonImage";
import 'react-loading-skeleton/dist/skeleton.css'
function BrowsePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [backendData, setBackendData] = useState<any[]>([])
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const [isloading, setIsLoading] = useState(true)

  // function for changing pages
  const changePage = (newPage : number) => {
    setSearchParams({ page: String(newPage)});
  }
  const itemsPerPage = 8;

  // fetching data from backend
  useEffect(() => {
    fetch("/api").then(
      response => response.json()
    ).then(
      data =>{
        setBackendData(data)
        setIsLoading(false)
      }
    )
  },[])

  // pagination 
  const start = (page - 1) * itemsPerPage
  const currentMovies = backendData.slice(start, start + itemsPerPage)

  return (
  <>
  <div className="flex flex-row ml-5 rounded-2xl bg-green-400 justify-center items-center p-2">
    <p onClick={() => page > 1 ? changePage(page - 1) : null } className="cursor-pointer"><LesserThanIcon color="black" size={60}/></p>
    <div className="grid grid-cols-4 gap-y-7 p-10  justify-center items-center">
      {(isloading) ? (
        // <SkeletonImage cards={8}/>
        <p>Loading...</p>
      ):
      (
        currentMovies.map((user, id) => (
          <div key={id}>
            <Link to={`/film/${user.id}`} key={id}>
              <img src={`https://image.tmdb.org/t/p/w500/${user.poster_path}`} alt="" className="h-auto w-7/10 rounded-xl shadow-lg/20 justify-self-center select-none" />
            </Link>
          </div>
        ))
      )
      }
    </div>
    <p onClick={() => page < 3 ? changePage(page + 1) : null } className="cursor-pointer"><GreaterThanIcon color="black" size={60}/></p>
  </div>
</>
  )
}

export default BrowsePage