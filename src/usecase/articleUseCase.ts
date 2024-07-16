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
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export default articleUseCase