import { describe } from "vitest";
import { createFetchHookTests } from "../utils/createFetchHookTests";
import type { MovieDetails } from "@/hooks/useFetchMovieDetails";
import useFetchMovieDetails from "@/hooks/useFetchMovieDetails";

describe('useFetchMovieDetails', () => {
    createFetchHookTests<Parameters<typeof useFetchMovieDetails>[0], MovieDetails>({
        hookName: 'useFetchMovieDetails',
        useHook: useFetchMovieDetails,
        validParams: { id: '121' },
        expectedUrl: 'http://localhost:5000/details/movie/121',
    })
})