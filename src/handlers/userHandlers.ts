import express, {Request, Response} from 'express'
import { GeneratePassword, GenerateSalt, option,
    registerSchema, loginSchema, generateToken, updateUserSchema, orderProductSchema } from '../utils/utils'
import User from '../models/UserModel'
import Product from '../models/ProductModel'
import bcrypt from 'bcryptjs'
import jwt, { JwtPayload } from 'jsonwebtoken'
import Order from '../models/OrderModel'


//=====REGISTER======//
export const Register = async(req: Request, res: Response)=>{
    try{
        const { name, email, password, confirm_password} = req.body
        const validateInput = registerSchema.validate(req.body, option)
        if(validateInput.error){
            return res.status(400).json({
                Error: validateInput.error.details[0].message
            })
        }
        
        const salt = await GenerateSalt();
        const hashedPassword = await GeneratePassword(password,salt)
        const user = await User.findOne({email})
        if(!user){
            let allUser = await User.create({
                name,
                email,
                password: hashedPassword,
                confirm_password: hashedPassword,
                salt,
                role: "user",
            })
            const userExist = await User.findOne({email})
            return res.status(201).json({
                message: 'User registered successfully',
                userExist
            })
        }

        return res.status(400).json({
            message: "User already Exists",
            Error: "User already Exists"
        })
    } catch(err){
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: "/users/singup"
        })
    }
}

//=============LOGIN==============//

export const Login = async(req:Request,res:Response)=>{
    try{
        const {email, password} = req.body
        const validateInput = loginSchema.validate(req.body, option)
        if(validateInput.error){
            return res.status(400).json({
                Error: validateInput.error.details[0].message
            })
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message: "User does not exist",
                Error: "User does not exist"
            })
        }
        if(user){
            const validate = await bcrypt.compare(password, user.password)
            if(validate){
                const token = await generateToken(`${user._id}`)
                res.cookie(`token`, token)
                return res.status(200).json({
                    message: "Login Successful",
                    role: user.role,
                    email:user.email,
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
export const getAllProducts = async(req:Request,res:Response)=>{
    try{
        const products = await Product.find({})
        return res.status(200).json({
            message: "All Products",
            products
        })
    }catch(err){
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: "/users/get-all-products"
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
            Error: `/users/get-single-product`
        })
    }
}

export const userProfile = async (req:JwtPayload, res:Response) => {
    try{
        const id = req.user
        const user = await User.findOne({_id:id})
        if(user){
            return res.status(200).json({
                message: `Here's your profile`,
                _id: user._id,
                name: user.name,
                email: user.email,
            })
        }
        return res.status(404).json({
            message: `user not found`
        })
    }catch(err){
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: `/users/user-profile`
        })
    }
}

export const updateUser = async (req:JwtPayload, res:Response) => {
    try{
        const id = req.user
        const user = await User.findOne({_id:id})
        const validateResult = updateUserSchema.validate(req.body, option)
  if(validateResult.error) {
      res.status(400).json({
        Error: validateResult.error.details[0].message
      })
    }
    if(!user){
        return res.status(404).json({
            Error: `Unauthorised user`
        })
    }
    if(user){
        const {name, email, password } = req.body
        const updatedUser = await User.findOneAndUpdate({id}, {name, email, password})
        if(updatedUser){
            const use = await User.findOne({id})
            return res.status(200).json({
                message:'User Profile updated',
                use
            })
        }
        return res.status(400).json({
            message: "Error occurred",
          });
    }
    }catch(err){
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: `/users/update-user`
        })
    }
}

// export const reviewProduct = async (req:Request, res:Response)=>{
//     try{
//             const { rating, comment } = req.body;
//             const id = req.params.id
//             const product = await Product.findById({id});
//             if (product) {
//               const alreadyReviewed = product.reviews.find(
//                 (r) => r.user.toString() === req.user._id.toString()
//               );
//               if (alreadyReviewed) {
//                 res.status(400);
//                 throw new Error("Product already Reviewed");
//               }
//               const review = {
//                 name: req.user.name,
//                 rating: Number(rating),
//                 comment,
//                 user: req.user._id,
//               };
        
//               product.reviews.push(review);
//               product.numReviews = product.reviews.length;
//               product.rating =
//                 product.reviews.reduce((acc, item) => item.rating + acc, 0) /
//                 product.reviews.length;
        
//               await product.save();
//               res.status(201).json({ message: "Reviewed Added" });
//             } else {
//               res.status(404);
//               throw new Error("Product not Found");
//             }
//           }catch(err){
//         return res.status(500).json({
//             message: `Internal Server Error`,
//             Error: `/users/review-product`
//         })
//     }
// }

export const userCreatesOrder = async(req:JwtPayload, res:Response)=>{
    try{
        const { id } = req.user;
        const {
            name,
            qty,
            image,
            price,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            city,
            country,
            totalPrice
          } = req.body;
        const validateResult = orderProductSchema.validate(req.body, option);
              if (validateResult.error) {
                return res.status(400).json({
                  Error: validateResult.error.details[0].message,
                });
              }
              //verify if user exist
              const user = (await User.findOne({ id: id }))
              if (!user) {
                return res.status(400).json({
                  message: "User not found",
                });
              }
                const order = Order.create({
                    userId: id,
                    postalCode: "",
                    name,
                    qty,
                    price,
                    shippingAddress,
                    city,
                    country,
                    image,
                    paymentMethod,
                    itemsPrice,
                    paymentStatus: "",
                    taxPrice,
                    totalPrice,
                    isPaid: false,
                    paidAt: new Date(),
                    shippingPrice,
                    isDelivered: false,
                    deliveredAt: new Date()
                })

                console.log(order)
                // const orderExist = await Order.findOne({userId})
                return res.status(201).json({
                    message: "Order created successfully",
                  order
                });
                
          
            }catch(err){
                return res.status(500).json({
                    message: `Internal Server Error`,
                    Error: `/users/create-order`
                })
            }
    }