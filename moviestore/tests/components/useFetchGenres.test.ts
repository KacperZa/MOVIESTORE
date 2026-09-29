import { describe } from "vitest";
import { createFetchHookTests } from "../utils/createFetchHookTests";
import useFetchGenres from "@/hooks/useFetchGenres";
import type { Genre } from "@/context/MovieGenreContext";

describe('useFetchGenres', () => {
    createFetchHookTests<Parameters<typeof useFetchGenres>[0], Genre[]>({
        hookName: 'useFetchGenres',
        validParams: { type: 'tv' },
        useHook: useFetchGenres,
        expectedUrl: 'api/tv/genres'
    })
})