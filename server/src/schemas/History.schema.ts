import z from 'zod'

export const HistorySchema = z.object({
    mediaType: z.string('mediaType should be a string'),
    tmdbId: z.number('tmdb should be a number'),
})

export type History = z.infer<typeof HistorySchema>