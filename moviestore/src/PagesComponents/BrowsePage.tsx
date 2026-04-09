import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

function BrowsePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [backendData, setBackendData] = useState<any[]>([])
  useEffect(() => {
    fetch("/api").then(
      response => response.json()
    ).then(
      data =>{
        console.log(data)
        setBackendData(data)
      }
    )
  },[])

  return (
    <div className="grid grid-cols-4 gap-y-7 p-10 ml-5 rounded-2xl bg-green-600">

      {/* 1523145 */}
      {(typeof backendData === 'undefined') ? (
        <p> Loading...</p>
      ):
      (
        backendData.map((user, id) => (
          <div className="bg">
            <Link to={`/film/${user.id}`} key={id}>
              <img src={`https://image.tmdb.org/t/p/w500/${user.poster_path}`} alt="" className="h-auto w-8/10 rounded-xl shadow-lg/20" />
            </Link>
          </div>
        ))
      )
    }
    </div>
  )
}

export default BrowsePage