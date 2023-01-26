import mongoose,{Schema} from "mongoose";


export interface IOrder{
    _id: string;
    userId:string
    name: string;
    qty: number,
    price: number,
    product: {},
    shippingAddress: string,
    city: string,
    postalCode: string,
    country: string,
    image:string
    paymentMethod: string,
    paymentResult: string,
    taxPrice: number,
    totalPrice: number,
    isPaid: boolean,
    paidAt: Date,
    isDelivered: boolean,
    deliveredAt: Date
}
const orderSchema = new Schema({
    userId:{type:String, required: true},
    name: {type:String, required: [true, `Please input your name`]},
    qty: {type:String, required: [true, `Please choose a quantity`]},
    price: {type:String},
    product: {type:String},
    shippingAddress: {type:String, required: true},
    city: {type:String, required: true},
    postalCode: {type:String},
    country: {type:String, required: true},
    image: {type:String},
    paymentMethod: {type:String, required: true},
    paymentResult: {type:String},
    taxPrice: {type:String},
    totalPrice: {type:String},
    isPaid: {type:String},
    paidAt: {type:String},
    isDelivered: {type:String},
    deliveredAt: {type:String}
},
{
    timestamps:true
}
)
const Order = mongoose.model<IOrder>('order',orderSchema)
export default Order