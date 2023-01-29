import {Request, Response, NextFunction} from 'express'
import jwt, {JwtPayload} from 'jsonwebtoken'
// import {APP_SECRET} from "../../../config/db"
import User from '../models/UserModel'
import Admin from '../models/AdminModel'
import { option } from '../utils/utils'
import { app_secret } from '../config/database'
import dotenv from 'dotenv'

dotenv.config()

export const userAuth = async(req:JwtPayload, res:Response, next:NextFunction)=>{
    try{
        const authorization = req.headers.authorization
        if(!authorization){
            return res.status(401).json({
                Error: 'Kindly login'
            })
        }
        const token = authorization.slice(7,authorization.length)
        let verified = jwt.verify(token, app_secret)
        if(!verified){
            return res.status(401).json({
                Error: "Unauthorised"
            })
        }
        const {_id} = verified as {[key:string]:string}
        const user = await User.findOne({_id:_id})
        if(!user){
            return res.status(401).json({
                Error: 'Invalid Credentials'
            })
        }
        req.user = verified
        next()
    }catch(err){
        return res.status(401).json({
            Error: "Unauthorised Access"
        })
    }
}

export const adminAuth = async(req:JwtPayload, res:Response, next:NextFunction)=>{
    try{
        const authorization = req.headers.authorization
        if(!authorization){
            return res.status(401).json({
                Error: 'Kindly login'
            })
        }
        const token = authorization.slice(7,authorization.length)
        let verified = jwt.verify(token,app_secret)
        if(!verified){
            return res.status(401).json({
                Error: "Unauthorised"
            })
        }
        const {_id} = verified as {[key:string]:string}
        const admin = await Admin.findOne({_id:_id})
        if(!admin){
            return res.status(401).json({
                Error: 'Invalid Credentials'
            })
        }
        req.admin = verified
        next()
    }catch(err){
        return res.status(401).json({
            Error: "Unauthorised Access"
        })
    }
}
