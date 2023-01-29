import mongoose, {Schema} from "mongoose"

export interface IProduct {
    name: string,
    image: string,
    description: string,
    price: number,
    countInStock: number,
    numReviews: number,
    rating: number,
    comment: string
}

const productSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    countInStock: {
        type: Number,
        required: true
    },
    numReviews: {
        type: Number,
    },
    rating: {
        type: Number
    },
    comment: {
        type: String,
    }
},
{
    timestamps: true
})
const Product = mongoose.model<IProduct>('Product', productSchema)

export default Product