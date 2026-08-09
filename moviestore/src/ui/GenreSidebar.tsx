import { MovieGenreContext } from "@/context/MovieGenreContext";
import { TvGenreContext } from "@/context/TvMovieGenreContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

const GenreSidebar = () => {

  // fetching genres 
  const movieGenres = useContext(MovieGenreContext);
  const tvGenres = useContext(TvGenreContext);

  return (
      <div className="h-fit w-72 shrink-0 bg-green-500 rounded-2xl flex flex-col items-center py-3">
        <p className="font-bold text-3xl">GENRES</p>
        <div className="flex flex-row w-full p-4 gap-5">

          <div className="w-1/2 flex flex-col">
            <div className="flex gap-1 flex-col">
              <p className="font-semibold text-lg">MOVIES</p>
                {movieGenres?.map((movieGenre, id) => (
                  <Link to={`/movie/genre/${movieGenre.id}/${movieGenre.name}`} className="w-fit">
                    <p key={id} className="underline-animate w-fit cursor-pointer">{movieGenre.name}</p>
                  </Link>
                ))}
            </div>
          </div>

          <div className="w-1/2 flex flex-col">
            <div className="flex gap-1 flex-col">
            <p className="font-semibold text-lg">TV SHOWS</p>
              {tvGenres?.map((tvGenre, id) => (
                <Link to={`/tv/genre/${tvGenre.id}/${tvGenre.name}`} className="w-fit">
                  <p key={id} className="underline-animate w-fit cursor-pointer">{tvGenre.name}</p>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
  )
}

export default GenreSidebar