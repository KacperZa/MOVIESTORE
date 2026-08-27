import z from 'zod'

export const deliveryQuerySchema = z.object({
    filters: z.string('filters prop must be a string!').default('popularity.desc'),
    keywords: z.string('keywords prop must be a string or null or undefined!').nullish().default(''),
    adult: z.string('adult prop must be a string or null or undefined!').default('false'),
    page: z.string('page prop must be a string').default('1')
})

export type Query = z.infer<typeof deliveryQuerySchema>