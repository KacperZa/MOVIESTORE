import { useContext } from "react"
import TvGenreContext from "./TvGenreContext"

export const useTvGenres = () => {
    const ctx = useContext(TvGenreContext)
    if (!ctx) throw new Error ('useTvGenres must be used within MovieGenresProvider')
    return ctx
}