import z from 'zod'

export const favouriteSchema = z.object({
    mediaType: z.string('mediaType should be a string'),
    tmdbId: z.number('tmdbId should be a number'),
})

export type Favourite = z.infer<typeof favouriteSchema>