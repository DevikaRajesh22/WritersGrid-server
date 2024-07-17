import Article from "../../domain/article";

interface IArticleRepository {
    addArticle(id: string, articleInfo: Article): Promise<any>,
    findArticles(userId: string): Promise<Article[]>,
    findArticleById(articleId: string): Promise<any>,
    updateArticle(id: string, title: string, content: string, image: any): Promise<any>,
    deleteArticle(articleId:string):Promise<any>,
    getAllArticles():Promise<Article[]>,
}

export default IArticleRepository