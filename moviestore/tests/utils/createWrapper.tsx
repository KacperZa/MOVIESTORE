import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


export const createTestQueryClient = () => {
    return new QueryClient({
    defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
    },
});
}

function createWrapper( client :  QueryClient = createTestQueryClient()) {
    return ({ children} : { children: React.ReactNode }) => {
        return (
        <QueryClientProvider client={client}>
            {children}
        </QueryClientProvider>
        )
    }
}

export { createWrapper }