import Joi from 'joi'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const registerSchema = Joi.object().keys({
    name: Joi.string().required(),
    email:Joi.string().email().required(),
    password:Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    confirm_password:Joi.any()
    .equal(Joi.ref('password')).required()
    .label('Confirm Password')
    .messages({"any.only":"{{label}} does not match"})//ref('password'),
})

export const loginSchema = Joi.object().keys({
    email:Joi.string().email().required(),
    password:Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
})

export const updateUserSchema = Joi.object().keys({
    name: Joi.string(),
    email: Joi.string(),
    password: Joi.string()
})

export const adminSchema = Joi.object().keys({
    name: Joi.string().required(),
    email:Joi.string().email().required(),
    password:Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    confirm_password:Joi.any()
    .equal(Joi.ref('password')).required()
    .label('Confirm Password')
    .messages({"any.only":"{{label}} does not match"})
})

export const updatePropertySchema = Joi.object().keys({
    name:Joi.string(),
    description:Joi.string(),
    address:Joi.string(),
    category:Joi.string(),
    price:Joi.number(),
    propertySize:Joi.string(),
    condition:Joi.string(),
    image:Joi.string()
})
export const createProductSchema = Joi.object().keys({
    name: Joi.string(),
    image: Joi.string(),
    description: Joi.string(),
    price: Joi.number(),
    countInStock: Joi.number()
})
export const orderProductSchema = Joi.object().keys({
    productName: Joi.string(),
    qty: Joi.number(),
    image: Joi.string(),
    price: Joi.number(),
    shippingAddress: Joi.string(),
    paymentMethod: Joi.string(),
    itemsPrice: Joi.number(),
    taxPrice: Joi.number(),
    shippingPrice: Joi.number(),
    totalPrice: Joi.number(),
    city: Joi.string(),
    country: Joi.string()
})

export const updateProductSchema = Joi.object().keys({
    name: Joi.string(),
    image: Joi.string(),
    description: Joi.string(),
    price: Joi.number(),
    countInStock: Joi.number()
})

export const option = {
    abortEarly: false,
    errors: {
        wrap: {
            label: "",
        }
    }
}

export const GenerateSalt = async()=>{
    return await bcrypt.genSalt()
}

export const GeneratePassword = async(password:string,salt:string)=>{
    return await bcrypt.hash(password, salt)
}

export const generateToken = async(_id:string)=>{
    if(process.env.APP_SECRET){
        return jwt.sign({_id}, process.env.APP_SECRET, {expiresIn: '1d'})
    }
}