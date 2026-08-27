import z from 'zod'

export const deliveryParamSchema = z.object({
    genreId: z.string('genreId prop must be a string!')
})