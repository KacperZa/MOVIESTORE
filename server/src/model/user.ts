import { model, Schema } from 'mongoose'

export interface IUser {
    username: string
    email: string
    age: number
    creationDate?: Date
    password: string
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    creationDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    password:{  
        type: String,
        required: true
    }
    
})

export default model<IUser>('User', userSchema)