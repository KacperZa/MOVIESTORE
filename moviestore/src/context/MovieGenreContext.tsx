import { createContext } from "react";

  type MovieGenres = {
    id: number
    name: string
  }

export const MovieGenreContext = createContext<MovieGenres[] | null>(null);
