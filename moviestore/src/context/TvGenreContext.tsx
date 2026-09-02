import useFetchGenres from "@/hooks/useFetchGenres";
import { createContext } from "react";

export type TvGenre = {
  id: number
  name: string
}

type TvGenresContextType = {
  tvGenres: TvGenre[] | undefined
  isPending: boolean
}

const TvGenreContext = createContext<TvGenresContextType | null>(null);

export const TvGenreProvider = ({children} : {children: React.ReactNode}) => {

  const { data: tvGenres, isPending: isPendingTvGenres, isError: isErrorTVGenres, error: errorTvGenres} = useFetchGenres({type:"tv"})
  if(isErrorTVGenres) console.log('An error occured during fetching tvGenres', errorTvGenres?.message)

    return (
      <TvGenreContext.Provider value={{ tvGenres: tvGenres, isPending: isPendingTvGenres }}>
        {children}
      </TvGenreContext.Provider>
    )
}

export default TvGenreContext
