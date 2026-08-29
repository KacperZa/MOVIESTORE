import { createContext } from "react";

  export type MovieGenres = {
    id: number
    name: string
  }

export const MovieGenreContext = createContext<MovieGenres[] | null>(null);
