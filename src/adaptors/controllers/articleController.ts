import { Request, Response } from "express";
import articleUseCase from "../../usecase/articleUseCase";
import Article from "../../domain/article";

class articleController {
    private articlecase: articleUseCase
    constructor(articlecase: articleUseCase) {
        this.articlecase = articlecase
    }

    async newArticle(req: Request, res: Response) {
        try {
            const userId = req.userId
            const articleInfo: Article = req.body
            const imageFile: Express.Multer.File | undefined = req.file;
            if (imageFile) {
                articleInfo.image = imageFile.path
            } else {
                articleInfo.image = ''
            }
            if (userId) {
                const addData = await this.articlecase.addArticle(userId, articleInfo)
                if (addData) {
                    res.status(200).json({ success: true })
                } else {
                    res.status(200).json({ success: false, message: 'Unable to add articles !!' })
                }
            } else {
                res.status(200).json({ success: false, message: "No user found !!" })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }
}

export default articleController