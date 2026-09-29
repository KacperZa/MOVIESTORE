import { describe } from "vitest";
import { createFetchHookTests } from "../utils/createFetchHookTests";
import type { ProvidersData } from "@/hooks/useFetchProviders";
import useFetchProviders from "@/hooks/useFetchProviders";

describe('useFetchProviders', () => {
    createFetchHookTests<Parameters<typeof useFetchProviders>[0], ProvidersData>({
        hookName: 'useFetchProviders',
        useHook: useFetchProviders,
        validParams: { id: '121', type: 'movie' },
        expectedUrl: 'http://localhost:5000/movie/providers/121',
    })
})