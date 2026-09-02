import { useContext } from "react"
import MovieGenreContext from "./MovieGenreContext"

export const useMovieGenres = () => {
    const ctx = useContext(MovieGenreContext)
    if (!ctx) throw new Error ('useMovieGenres must be used within MovieGenresProvider')
    return ctx
}