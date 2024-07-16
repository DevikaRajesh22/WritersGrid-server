import mongoose from "mongoose";

interface Article{
    _id?:string,
    userId: mongoose.Schema.Types.ObjectId,
    title:string,
    content:string,
    image:string,
    creationTime:Date
}

export default Article