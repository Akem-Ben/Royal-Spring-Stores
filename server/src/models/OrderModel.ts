import mongoose,{Schema} from "mongoose";


export interface IOrder{
    _id: string;
    userId:string
    productName: string;
    qty: number,
    price: number,
    // product: [string],
    shippingAddress: string,
    city: string,
    postalCode: string,
    country: string,
    image:string
    paymentMethod: string,
    paymentStatus: string,
    itemsPrice: number,
    taxPrice: number,
    totalPrice: number,
    isPaid: boolean,
    paidAt: Date,
    shippingPrice: number,
    isDelivered: boolean,
    deliveredAt: Date
}
const orderSchema = new Schema({
    userId:{type:String},
    productName: {type:String, required: [true, `Please input your name`]},
    qty: {type:String, required: [true, `Please choose a quantity`]},
    price: {type:String},
    shippingPrice: {type: Number, required: true},
    // product: {type:[String], default: []},
    shippingAddress: {type:String, required: true},
    city: {type:String, required: true},
    itemsPrice: {type:String},
    postalCode: {type:String},
    country: {type:String, required: true},
    image: {type:String},
    paymentMethod: {type:String, required: true},
    paymentStatus: {type:String},
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