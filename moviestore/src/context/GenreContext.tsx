import { createContext } from "react";

  type Genres = {
    id: number
    name: string
  }

export const GenreContext = createContext<Genres[] | null>(null);
