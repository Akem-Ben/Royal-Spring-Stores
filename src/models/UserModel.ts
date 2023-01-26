import mongoose, {Schema} from 'mongoose'
import bcrypt from 'bcrypt'

export interface IUser {
    _id: string,
    name: string,
    email: string,
    password: string,
    salt: string,
    role: boolean
}

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, `Please input your name`]
    },
    email: {
        type: String,
        require: [true, `Please input your email`],
        unique: true
    },
    password: {
        type: String,
        require: [true, `Please input your password`]
    },
    salt: {
        type: String
    },
    role: {
        type: Boolean
    },
},
{
    timestamps: true
})

const User = mongoose.model<IUser>('Users', userSchema)

export default User