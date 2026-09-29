import { describe } from "vitest";
import { createFetchHookTests } from "../utils/createFetchHookTests";
import type { TvDetails } from "@/hooks/useFetchTvDetails";
import useFetchTvDetails from "@/hooks/useFetchTvDetails";

describe('useFetchTvDetails', () => {
    createFetchHookTests<Parameters<typeof useFetchTvDetails>[0], TvDetails>({
        hookName: 'useFetchTvDetails',
        useHook: useFetchTvDetails,
        validParams: { id: '121' },
        expectedUrl: 'http://localhost:5000/details/tv/121',
    })
})