import express, {Request, Response, NextFunction} from 'express'
import { GeneratePassword, GenerateSalt, option,
    generateToken, adminSchema, createProductSchema, 
    updateProductSchema, loginSchema} from '../utils/utils'
import Admin from '../models/AdminModel'
import Product from '../models/ProductModel'
import bcrypt from 'bcryptjs'
import jwt, { JwtPayload } from 'jsonwebtoken'
import User from '../models/UserModel'
import Order from '../models/OrderModel'
// import Agent from '../model/agentModel'

export const CreateSuperadmin = async(req:JwtPayload, res:Response)=>{
    try{
        const { name, email, password, confirm_password} = req.body
        const validateInput = adminSchema.validate(req.body, option)
        if(validateInput.error){
            return res.status(400).json({
                Error: validateInput.error.details[0].message
            })
        }
        
        const salt = await GenerateSalt();
        const superAdminHashedPassword = await GeneratePassword(password,salt)
        const superAdmin = await Admin.findOne({email})
        if(!superAdmin){
            let allAdmin = await Admin.create({
                name,
                email,
                password: superAdminHashedPassword,
                confirm_password: superAdminHashedPassword,
                salt,
                role: "Super Admin"
            })
            const superAdminExist = await Admin.findOne({email})
            return res.status(201).json({
                message: 'Admin registered successfully',
                superAdminExist
            })
        }

        return res.status(400).json({
            message: "Admin already Exists",
            Error: "Admin already Exists"
        })
    }catch(err){
        return res.status(500).json({
            message: "Internal Server error",
            Error: "/admin/create-superadmin"
        })
    }
}

export const CreateAdmin = async(req:JwtPayload, res:Response)=>{
    try{
        const _id = req.admin
        console.log(_id)
        const { name, email, password, confirm_password} = req.body
        const validateInput = adminSchema.validate(req.body, option)
        if(validateInput.error){
            return res.status(400).json({
                Error: validateInput.error.details[0].message
            })
        }
        const salt = await GenerateSalt();
        const superAdminHashedPassword = await GeneratePassword(password,salt)
        const admin = await Admin.findOne({_id})
        if(admin?.email === email){
            return res.status(400).json({
                message: "Email already exists"
            })
        }
        if(admin?.role === 'Super Admin'){
            let allUser = await Admin.create({
                name,
                email,
                password: superAdminHashedPassword,
                confirm_password: superAdminHashedPassword,
                salt,
                role: "admin",
            })
            const superAdminExist = await Admin.findOne({email})
            // console.log(superAdminExist)
            return res.status(201).json({
                message: 'Admin created successfully',
                email: allUser?.email,
                name: allUser?.name
            })
        }

        return res.status(400).json({
            message: "Admin already Exists",
            Error: "Admin already Exists"

    })
}catch(err){
        return res.status(500).json({
            message:"Internal Server Error",
            Error: "/admin/create-admin"
        })
    }
}

export const adminLogin = async(req:Request, res:Response)=>{
    try{
        const {email, password} = req.body
        const validateInput = loginSchema.validate(req.body, option)
        if(validateInput.error){
            return res.status(400).json({
                Error: validateInput.error.details[0].message
            })
        }
        const admin = await Admin.findOne({email})
        if(!admin){
            return res.status(400).json({
                message: "User does not exist",
                Error: "User does not exist"
            })
        }
        if(admin){
            const validate = await bcrypt.compare(password, admin.password)
            if(validate){
                const token = await generateToken(`${admin._id}`)
                res.cookie(`token`, token)
                return res.status(200).json({
                    message: "Login Successful",
                    role: admin.role,
                    email:admin.email,
                    token
                })
            }
        }
        return res.status(400).json({
            message: "Invalid Credentials"
        })
    }catch(err){
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: "/users/login"
        })
    }
}

export const CreateProduct = async(req:JwtPayload, res:Response)=>{
    try{
        const adminId = req.admin.id
        const { name, image, description, price, 
            countInStock} = req.body
        const validateInput = createProductSchema.validate(req.body, option)
        if(validateInput.error){
            return res.status(400).json({
                Error: validateInput.error.details[0].message
            })
        }
        const admin = await Admin.findOne({adminId})

        if(admin?.role === "admin" || admin?.role === "Super Admin"){
                const createProduct = await Product.create({
                    name,
                    description, 
                    price,
                    countInStock,
                    image: req.file.path,
                    numReviews: 0,
                    comment: "",
                    rating: 0
                });
                return res.status(201).json({
                    message: "Product created successfully",
                    createProduct
                })
        }
        return res.status(400).json({
            message: "unauthorised access"
        })

    }catch(err){
        return res.status(500).json({
        message: "Internal Server Error",
        Error: "/admin/create-agent"
        })
    }

}
export const getAllProducts = async(req:Request,res:Response)=>{
    try{
        // const _id = req.params._id
        // const Admin = await User.findOne({_id})
        // if(Admin?.role === "admin" || Admin?.role === "Super Admin"){
        const products = await Product.find({})
        return res.status(200).json({
            message: "All Products",
            products
        })
    // }
    // return res.status(400).json({
    //     message: "unauthorised access"
    // })
    }catch(err){
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: "/admin/get-all-products"
        })
    }
}

export const getsingleProduct = async(req:Request,res:Response)=>{
    try{
        const id = req.params._id
        const product = await Product.findOne({_id:id})
        if(product){
            return res.status(200).json({
                message: "Your Product",
                product
            })
        }
        return res.status(400).json({
            message: "product not found"
        })
    }catch(err){
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: `/admin/getProduct`
        })
    }
}

export const updateProduct = async(req:JwtPayload,res:Response)=>{
    try{
        const id = req.params._id
        const {name, image, description, price, countInStock} = req.body
        const validateResult = updateProductSchema.validate(req.body,option)
        console.log(validateResult)
        if(validateResult.error){
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            })
        }
        const product = await Product.findOne({_id:id})
        if(!product){
            return res.status(400).json({
                Error: "Product does not exist"
            })
        }
        const updatedProduct = await Product.findOneAndUpdate({id},{name, description, price, countInStock, image:req.file.path}) //{new:true})
        console.log(updatedProduct)
        if(updatedProduct){
            const productNew = await Product.findOne({_id:id})
            return res.status(200).json({
                message: "Profile updated successfully",
                productNew
            })
        }
        return res.status(400).json({
            message: "Profile not updated"
        })
    }catch(err){
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: `/admin/update-product`
        })
    }
}

export const deleteProduct = async(req:Request, res:Response)=>{
    try{
        const id = req.params._id
        const product = await Product.findByIdAndDelete({_id:id})
        const products = await Product.find({})
        if(product){
            return res.status(200).json({
                message: `Product deleted`,
                products
            })
        }
    }catch(err){
        return res.status(500).json({
            message: 'Internal Server Error',
            Error: '/admin/delete-product'
        })
    }
}

export const getAllUsers = async(req:Request,res:Response)=>{
    try{
        // const _id = req.params._id
        // const Admin = await User.findOne({_id})
        // if(Admin?.role === "admin" || Admin?.role === "Super Admin"){
        const users = await User.find({})
        return res.status(200).json({
            message: "All Users",
            users
        })
    // }
    // return res.status(400).json({
    //     message: "unauthorised access"
    // })
    }catch(err){
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: "/admin/get-all-users"
        })
    }
}

export const getSingleUser = async(req:Request,res:Response)=>{
    try{
        const id = req.params._id
        const user = await User.findOne({_id:id})
        if(user){
            return res.status(200).json({
                message: "The User",
                user
            })
        }
        return res.status(400).json({
            message: "User not found"
        })
    }catch(err){
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: `/admin/get-user`
        })
    }
}

export const getAllHomeProducts = async (req:Request, res:Response)=>{
    try{
        const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};
    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ _id: -1 });
    return res.status(200).json({ products, page, pages: Math.ceil(count / pageSize) });
  }catch(err){
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: `/admin/get-products-p`
        })
    }
}

export const adminGetAllOrders = async (req:JwtPayload, res:Response) => {
    try{
        const id = req.admin._id
        const admin = await Admin.find({_id:id})
        if(!admin){
            return res.status(404).json({
                Error: `Admin not found`
            })
        }
        const orders = await Order.find({})
        if(!orders){
            return res.status(404).json({
                Error: `Orders not found`
            })
        }
        return res.status(200).json({
            message: `Successfully fetched all orders`,
            orders
        })
    }catch(err){
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: `admin/get-all-orders`
        })
    }
}

export const adminGetAllUserOrders = async (req:JwtPayload, res:Response)=>{
    try{
        const userId = req.params.id
        const adminId = req.admin._id
        const admin = await Admin.findById({_id:adminId})
        console.log(admin)
        if(admin){
        const user = await User.find({userId})
        if(!user){
            return res.status(404).json({
                Error: `User not found`
            })
        }
        const order = await Order.find({userId:userId})
        if(!order){
            res.status(404).json({
                Error: `Order not found`
            })
        }
        return res.status(200).json({
                message: `Here are the orders`,
                order
            })
        }
        return res.status(404).json({
            Error: `Admin not found`
        })
    }catch(err){
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: `users/get-single-orders`
        })
    }
}

export const adminGetSingleOrder = async(req:JwtPayload, res:Response)=>{
    try{
    const orderId = req.params.id
    const adminId = req.admin._id
    const admin = await Admin.findById({_id:adminId})
    if(!admin){
        return res.status(404).json({
            Error: `Admin not found`
        })
    }
    const order = await Order.findById({_id:orderId})
    if(!order){
        return res.status(404).json({
            Error: `Order not found`
        })
    }
    return res.status(200).json({
        Message: `Here is the order`,
        order
    })
}catch(err){
    return res.status(500).json({
        message: `Internal Server Error`,
        Error: `/admin/get-single-order`
    })
}
}