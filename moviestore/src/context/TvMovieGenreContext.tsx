import { createContext } from "react";

export type TvGenres = {
  id: number
  name: string
}

export const TvGenreContext = createContext<TvGenres[] | null>(null);
