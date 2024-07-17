import Article from "../../domain/article";
import { ArticleModel } from "../database/articleModel";
import IArticleRepository from "../../usecase/interface/IArticleRepository";
import { ObjectId } from "mongoose";
import { title } from "process";

class articleRepository implements IArticleRepository {
    async addArticle(id: string, articleInfo: Article): Promise<any> {
        try {
            let newArticle = new ArticleModel({
                userId: id,
                title: articleInfo.title,
                content: articleInfo.content,
                image: articleInfo.image
            })
            const savedArticle = await newArticle.save();
            return savedArticle;
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async findArticles(userId: string): Promise<Article[]> {
        const articles: (Article & { _id: ObjectId })[] = await ArticleModel.find({ userId: userId })
        const typedArticles: Article[] = articles.map((article) => ({
            id: article._id,
            title: article.title,
            content: article.content,
            image: article.image,
            userId: article.userId,
            creationTime: article.creationTime
        }))
        return typedArticles;
    }

    async findArticleById(articleId: string): Promise<any> {
        try {
            const article = await ArticleModel.findOne({ _id: articleId })
            if (article) {
                return article
            }
            return false
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async updateArticle(id: string, title: string, content: string, image: any): Promise<any> {
        try {
            const updatedArticle = await ArticleModel.findByIdAndUpdate(
                id,
                {
                    title: title,
                    content: content,
                    image: image
                },
                { new: true }
            );
            return updatedArticle ? true : false;
        } catch (error) {
            console.log(error)
            return null
        }
    }
}

export default articleRepository