import { MovieGenreContext } from "@/context/MovieGenreContext";
import { TvGenreContext } from "@/context/TvMovieGenreContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

interface GenreSidebarProps {
  genre: "movie" | "tv" | undefined
}

const GenreSidebar = ({genre} : GenreSidebarProps) => {

  // fetching genres 
  const movieGenres = useContext(MovieGenreContext);
  const tvGenres = useContext(TvGenreContext);

  return (
      <div className="h-full w-72 shrink-0 bg-secondary rounded-xl flex flex-col  py-3">
        <p className="font-bold text-3xl p-4">GENRES</p>
        <div className="flex flex-row w-full px-4 gap-5 justify-center items-center h-full">
          
        {genre === "movie" ?
          <div className="w-full flex flex-col h-full">
            <div className="flex gap-1 flex-col h-full">
              {/* <p className="font-semibold text-xl">MOVIES</p> */}
              <div className="w-full h-full flex flex-col justify-evenly">
                {movieGenres?.map(movieGenre => (
                  <Link key={movieGenre.id} to={`/movie/genre/${movieGenre.id}/${movieGenre.name}`} className="w-fit">
                    <p className="underline-animate w-fit cursor-pointer text-lg font-medium">{movieGenre.name}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          :
          <div className="w-full flex flex-col h-full">
            <div className="flex gap-1 flex-col h-full">
            {/* <p className="font-semibold text-xl">TV SHOWS</p> */}
              <div className="w-full h-full flex flex-col justify-evenly">
              {tvGenres?.map(tvGenre => (
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