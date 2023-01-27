import express, {Request, Response} from 'express'
import { adminAuth } from '../middleware/auth'
import { upload } from '../utils/multer'
import {CreateSuperadmin, CreateAdmin, 
    getAllProducts, CreateProduct, 
    getsingleProduct, adminLogin, 
    getAllUsers, getSingleUser,updateProduct, deleteProduct} from '../handlers/adminHandlers'

const router = express.Router()

router.post('/superadmin', CreateSuperadmin)
router.post('/create-admin', adminAuth, CreateAdmin)
router.post('/admin-login', adminLogin)
router.post('/create-product', adminAuth, upload.single('image'), CreateProduct)
router.get('/get-all-products', adminAuth, getAllProducts)
router.get('/getProduct/:_id', adminAuth, getsingleProduct)
router.patch('/update-product/:_id', adminAuth, upload.single('image'), updateProduct)
router.delete('/delete-product/:_id', adminAuth, deleteProduct)
router.get('/get-all-users', adminAuth, getAllUsers)
router.get('/get-user/:_id', adminAuth, getSingleUser)


export default router