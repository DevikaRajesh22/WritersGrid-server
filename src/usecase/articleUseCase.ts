import Article from "../domain/article";
import IArticleRepository from "./interface/IArticleRepository";
import IUserRepository from "./interface/IUserRepository";
import Cloudinary from "../infrastructure/utils/cloudinary";

class articleUseCase {
    private iArticleRepository: IArticleRepository
    private iUserRepository: IUserRepository
    private cloudinary: Cloudinary

    constructor(
        iArticleRepository: IArticleRepository,
        iUserRepository: IUserRepository,
        Cloudinary: Cloudinary
    ) {
        this.iArticleRepository = iArticleRepository
        this.iUserRepository = iUserRepository
        this.cloudinary = Cloudinary
    }

    async addArticle(id: string, articleInfo: Article) {
        try {
            let userExists = await this.iUserRepository.findUserById(id)
            if (userExists) {
                let uploadImage = await this.cloudinary.saveToCloudinary(articleInfo.image)
                articleInfo.image = uploadImage
                let res = await this.iArticleRepository.addArticle(id, articleInfo)
                return res
            } else {
                return null
            }
        } catch (error) {
            console.log(error)
        }
    }

    async getArticles(userId: string) {
        try {
            let userExists = await this.iUserRepository.findUserById(userId)
            if (userExists) {
                const articles = await this.iArticleRepository.findArticles(userId)
                if (articles) {
                    return articles
                }
                return null
            } else {
                return null
            }
        } catch (error) {
            console.log(error)
        }
    }

    async findArticle(articleId: string) {
        try {
            let article = await this.iArticleRepository.findArticleById(articleId)
            if (article) {
                return { success: true, article }
            } else if (!article) {
                return { success: false }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async updateArticle(id: string, title: string, content: string, image: any) {
        try {
            let uploadImage = await this.cloudinary.saveToCloudinary(image)
            image = uploadImage
            let res = await this.iArticleRepository.updateArticle(id, title, content, image)
            return res
        } catch (error) {
            console.log(error)
        }
    }
}

export default articleUseCase