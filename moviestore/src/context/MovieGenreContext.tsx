import useFetchGenres from "@/hooks/useFetchGenres";
import { createContext } from "react";

export type MovieGenre = {
  id: number
  name: string
}

type MovieGenreContextType = {
  movieGenres: MovieGenre[] | undefined
  isPending: boolean
}

const MovieGenreContext = createContext<MovieGenreContextType | null>(null);

export const MovieGenresProvider = ({children} : {children: React.ReactNode}) => {

  const { data: movieGenres, isPending: isPendingMovieGenres, isError: isErrorMovieGenres, error: errorMovieGenres} = useFetchGenres({type:"movie"})
  if(isErrorMovieGenres) console.log('An error occured during fetching MovieGenres', errorMovieGenres?.message)


  return (
    <MovieGenreContext.Provider value={{ movieGenres, isPending: isPendingMovieGenres }}>
      {children}
    </MovieGenreContext.Provider>
  )
}

export default MovieGenreContext
