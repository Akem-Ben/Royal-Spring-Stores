import mongoose, {Schema} from 'mongoose'
import bcrypt from 'bcrypt'

export interface IAdmin {
    _id: string,
    name: string,
    email: string,
    password: string,
    salt: string,
    role: string
}

const adminSchema = new Schema({
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
        type: String
    },
},
{
    timestamps: true
})

const Admin = mongoose.model<IAdmin>('Admin', adminSchema)

export default Admin