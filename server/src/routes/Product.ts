import express, {Request, Response} from 'express'
import { getAllHomeProducts } from '../handlers/adminHandlers'
import { adminAuth } from '../middleware/auth'
import { upload } from '../utils/multer'

const router = express.Router()

router.get('/', getAllHomeProducts )

export default router