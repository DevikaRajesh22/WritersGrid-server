import Article from "../../domain/article";
import { ArticleModel } from "../database/articleModel";
import IArticleRepository from "../../usecase/interface/IArticleRepository";

class articleRepository implements IArticleRepository{
    async addArticle(id: string, articleInfo: Article): Promise<any> {
        try{
            let newArticle=new ArticleModel({
                userId:id,
                title:articleInfo.title,
                content:articleInfo.content,
                image:articleInfo.image
            })
            const savedArticle = await newArticle.save();
            return savedArticle;
        }catch(error){
            console.log(error)
            return null
        }
    }
}

export default articleRepository