import articleController from "../../adaptors/controllers/articleController";
import articleRepository from "../repository/articleRepository";
import userRepository from "../repository/userRepository";
import articleUseCase from "../../usecase/articleUseCase";
import express from "express";
import authenticate from '../middleware/userAuth';
import { uploadFile } from "../middleware/multer";
import Cloudinary from "../utils/cloudinary";

const repository = new articleRepository()
const userrepository=new userRepository()
const cloud=new Cloudinary()
const articlecase = new articleUseCase(repository,userrepository,cloud)
const controller = new articleController(articlecase)

const router = express.Router()

router.post('/newArticle', authenticate, uploadFile.single('image'), (req, res) => { controller.newArticle(req,res) })
router.get('/getArticles',authenticate,(req,res)=>{controller.getArticles(req,res)})
router.get('/findArticleById',(req,res)=>{controller.findArticle(req,res)})

export default router