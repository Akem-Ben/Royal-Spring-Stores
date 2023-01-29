import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export const connectDatabase = async () =>{
    try{
        const connection = await mongoose.connect(`mongodb://localhost:27017/royal_spring_stores`,()=>{
            console.log(`MongoDB connected`)
        })
    }catch(err){
        console.log(err)
    }
}

export const app_secret = process.env.APP_SECRET!
export const cloudinary_name = process.env.CLOUDINARY_CLOUD_NAME!
export const cloudinary_key = process.env.CLOUDINARY_API_KEY!
export const cloudinary_secret = process.env.CLOUDINARY_API_SECRET!