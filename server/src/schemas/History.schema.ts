import z from 'zod'

export const HistorySchema = z.object({
    // userId:
    mediaType: z.string('mediaType should be a string'),
    tmdbId: z.number('tmdb should be a number'),
    adult: z.boolean('adult should be a boolean'),
    backdrop_path: z.string('backdrop_path should be a string'),
    genre_ids: z.array(z.string('genre_ids should be a string array'),),
    original_language: z.string('original_language should be a string'),
    original_title: z.string('original_title should be a string'),
    overview: z.string('overview should be a string'),
    popularity: z.number('popularity should be a number'),
    poster_path: z.string('poster_path should be a string'),
    release_date: z.string('release_date should be a string'),
    title: z.string('title should be a string'),
    video: z.boolean('video should be a boolean'),
    vote_average: z.number('vote_average should be a number'),
    vote_count: z.string('vote_count should be a string')
})

export type History = z.infer<typeof HistorySchema>