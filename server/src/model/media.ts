import { Schema, Types, model } from "mongoose"

export interface IMedia {
    userId: Types.ObjectId
    mediaType: string
    tmdbId: number
    addedAt: Date
}

const mediaSchema = new Schema<IMedia>({
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
    addedAt: {
        type: Date,
        default: Date.now
    }
})

export default model<IMedia>('Media', mediaSchema)