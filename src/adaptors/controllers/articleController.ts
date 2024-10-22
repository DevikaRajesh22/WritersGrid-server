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

    async getArticles(req: Request, res: Response) {
        try {
            const userId = req.userId
            if (userId) {
                const getArticle = await this.articlecase.getArticles(userId)
                if (getArticle) {
                    res.status(200).json({ success: true, data: getArticle })
                } else {
                    res.status(200).json({ success: false, message: 'Articles not found !!' })
                }
            } else {
                res.status(200).json({ success: false, message: 'User not found !!' })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }

    async findArticle(req: Request, res: Response) {
        try {
            const articleId = req.query.articleId as string
            const findArticle = await this.articlecase.findArticle(articleId)
            if (findArticle?.success) {
                res.status(200).json({ success: true, data: findArticle.article })
            } else if (!findArticle?.success) {
                res.status(200).json({ success: false })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }

    async editArticle(req: Request, res: Response) {
        try {
            const { id, title, content } = req.body
            const imageFile: Express.Multer.File | undefined = req.file;
            let image
            if (imageFile) {
                image = imageFile.path
            } else {
                image = ''
            }
            const updateData = await this.articlecase.updateArticle(id, title, content, image)
            if (updateData) {
                res.status(200).json({ success: true })
            } else {
                res.status(401).json({ success: false, message: 'Not updated!' })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }

    async deleteArticle(req: Request, res: Response) {
        try {
            const articleId = req.query.articleId as string
            if (articleId) {
                const deleted = await this.articlecase.deleteArticle(articleId)
                if (deleted?.success) {
                    res.status(200).json({ success: true })
                } else if (!deleted?.success) {
                    res.status(200).json({ success: false })
                }
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }

    async getAllArticles(req: Request, res: Response) {
        try {
            const articles = await this.articlecase.getAllArticles()
            if (articles) {
                res.status(200).json({ success: true, data: articles })
            } else {
                res.status(200).json({ success: false, message: 'No articles found !!' })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }
}

export default articleController