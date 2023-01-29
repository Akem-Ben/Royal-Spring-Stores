import express from 'express'
import logger from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
import cookieParser from 'cookie-parser'
import {connectDatabase} from './config/database'
import UserRoutes from './routes/User'
import ProductRoutes from './routes/Product'
import AdminRoutes from './routes/Admin'
import cors from 'cors'

const app = express()

dotenv.config()

connectDatabase()


//Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(logger('dev'))
app.use(cors())
app.use(express.static(path.join(process.cwd(),'./public')))

//Routes
app.use('/users', UserRoutes)
app.use('/product', ProductRoutes)
app.use('/admin', AdminRoutes)

app.listen(process.env.PORT,()=>{
console.log(`App paying attention on port ${process.env.PORT}`)
})

export default app