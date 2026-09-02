
import { useMovieGenres } from "@/context/useMovieGenres";
import { useTvGenres } from "@/context/useTvGenres";

import { Link } from "react-router-dom";

interface GenreSidebarProps {
  genre: "movie" | "tv" | undefined
}

const GenreSidebar = ({genre} : GenreSidebarProps) => {

  // fetching genres 
  const {movieGenres, isPending: isPendingMovieGenres} = useMovieGenres()
  const {tvGenres, isPending: isPendingTvGenres} = useTvGenres()

  return (
      <div className="h-full w-72 shrink-0 bg-secondary rounded-xl flex flex-col  py-3">
        <p className="font-bold text-3xl p-4">GENRES</p>
        <div className="flex flex-row w-full px-4 gap-5 justify-center items-center h-full">
          
        {genre === "movie" ?
          <div className="w-full flex flex-col h-full">
            <div className="flex gap-1 flex-col h-full">
              {/* <p className="font-semibold text-xl">MOVIES</p> */}
              <div className="w-full h-full flex flex-col justify-evenly">
                {isPendingMovieGenres ? 
                  Array.from({ length: 15}).map((_, i) =>(
                  <div key={i} className="w-full h-6 bg-gray-450 animate-pulse rounded-lg" />
                  ))
                :
                movieGenres?.map(movieGenre => (
                  <Link key={movieGenre.id} to={`/movie/genre/${movieGenre.id}/${movieGenre.name}`} className="w-fit">
                    <p className="underline-animate w-fit cursor-pointer text-lg font-medium">{movieGenre.name}</p>
                  </Link>
                ))
                }
              </div>
            </div>
          </div>
          :
          <div className="w-full flex flex-col h-full">
            <div className="flex gap-1 flex-col h-full">
            {/* <p className="font-semibold text-xl">TV SHOWS</p> */}
              <div className="w-full h-full flex flex-col justify-evenly">
              {isPendingTvGenres ? 
                  Array.from({ length: 15}).map((_, i) =>(
                  <div key={i} className="w-full h-6 bg-gray-450 animate-pulse rounded-lg" />
                  ))
              :
              tvGenres?.map(tvGenre => (
                <Link key={tvGenre.id} to={`/tv/genre/${tvGenre.id}/${tvGenre.name}`} className="w-fit">
                  <p  className="underline-animate w-fit cursor-pointer text-lg font-medium">{tvGenre.name}</p>
                </Link>
              ))}
              </div>
            </div>
          </div>
        }

        </div>
      </div>
  )
}

export default GenreSidebar