import mongoose, {Schema} from "mongoose"

export interface IProduct {
    name: string,
    rating: number,
    comment: string,
    userId: string,
}
