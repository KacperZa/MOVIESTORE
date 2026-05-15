import { createContext } from "react";

  type TvGenres = {
    id: number
    name: string
  }

export const TvGenreContext = createContext<TvGenres[] | null>(null);
