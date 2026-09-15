import { model, Schema, Types } from 'mongoose'

export interface IHistory {
    userId: Types.ObjectId
    mediaType: string
    tmdbId: number
    status: "watched" | "pending"
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
    status: {
        type: String ,
        enum: ['watched', 'pending'],
        default: 'pending'
    }
})

export default model<IHistory>('History', historySchema)