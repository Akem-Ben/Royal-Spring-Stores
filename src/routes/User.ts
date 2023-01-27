import express, {Request, Response} from 'express'
import { userAuth } from '../middleware/auth'
import {Register, Login, getAllProducts,
    getsingleProduct, userProfile, updateUser, userCreatesOrder } from '../handlers/userHandlers'
// import { upload } from '../Utils/multer'

const router = express.Router()
// import { upload } from '../Utils/multer'

router.post('/signup', Register)
router.post('/login', Login)
router.get('/get-all-products', userAuth, getAllProducts)
router.get('/get-single-product/:_id', userAuth, getsingleProduct)
router.get('/user-profile', userAuth, userProfile)
router.patch('/update-profile', userAuth, updateUser)
router.post('/create-order', userAuth, userCreatesOrder )
// router.get('/get-all-users', getAllUsers)
// router.get('/get-user/:_id', getUser)
// router.patch('/update-user/:_id', auth, upload.single('coverImage'), updateUser)
// router.delete('/delete-user/:_id', deleteUser)

export default router