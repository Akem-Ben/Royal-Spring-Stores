import express, {Request, Response} from 'express'
import { auth } from '../middleware/auth'
import { upload } from '../Utils/multer'

const router = express.Router()
export default router