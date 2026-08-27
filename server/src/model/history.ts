import { model, Schema, Types } from 'mongoose'

export interface IHistory {
    userId: Types.ObjectId
    mediaType: string
    tmdbId: number
    adult: boolean
    backdrop_path: string
    genre_ids: number[]
    original_language: string
    original_title: string
    overview: string
    popularity: number
    poster_path: string
    release_date: string
    title: string
    video: boolean
    vote_average: number
    vote_count: number
}

const historySchema = new Schema<IHistory>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },   
    mediaType: {
        type: String
    },
    tmdbId: {
        type: Number
    },
    adult: {
        type: Boolean,
    },
    backdrop_path: {
        type: String
    },
    genre_ids: {
        type: [Number]
    },
    original_language: {
        type: String 
    },
    original_title: {
        type: String
    },
    overview: {
        type: String
    },
    popularity: {
        type: Number
    },
    poster_path: {
        type: String
    },
    release_date: {
        type: String
    },
    title: {
        type: String
    },
    video: {
        type: Boolean
    },
    vote_average: {
        type: Number
    },
    vote_count: {
        type: Number
    }
    
})

export default model<IHistory>('History', historySchema)