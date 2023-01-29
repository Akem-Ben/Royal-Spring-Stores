import multer from 'multer'
import dotenv from 'dotenv'
import {CloudinaryStorage} from 'multer-storage-cloudinary'
import {cloudinary_name, cloudinary_key, cloudinary_secret} from '../config/database'

dotenv.config();

const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: cloudinary_name,
    api_key:cloudinary_key,
    api_secret: cloudinary_secret
})
const storage = new CloudinaryStorage ({
    cloudinary,
    params: async(res,file)=>{
        return {
            folder: `ROYALSPRINGSTORES`
        }
    }
})

export const upload = multer({storage:storage})

