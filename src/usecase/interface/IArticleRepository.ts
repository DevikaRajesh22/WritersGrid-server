import Article from "../../domain/article";

interface IArticleRepository {
    addArticle(id: string, articleInfo: Article): Promise<any>,
    findArticles(userId: string): Promise<Article[]>,
    findArticleById(articleId: string): Promise<any>,
}

export default IArticleRepository