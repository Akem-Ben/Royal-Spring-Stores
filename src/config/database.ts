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