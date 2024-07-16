import mongoose, { Schema, Model } from "mongoose";
import Article from "../../domain/article";

const articleSchema: Schema<Article> = new Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image:{
        type:String,
        required:true
    },
    creationTime: {
        type: Date,
        default: Date.now
    }
});

const ArticleModel: Model<Article> = mongoose.model<Article>('article', articleSchema)
export { ArticleModel }