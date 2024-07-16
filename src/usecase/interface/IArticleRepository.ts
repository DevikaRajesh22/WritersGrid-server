import Article from "../../domain/article";

interface IArticleRepository{
    addArticle(id:string,articleInfo:Article):Promise<any>,
}

export default IArticleRepository