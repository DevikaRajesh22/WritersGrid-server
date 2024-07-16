import userController from "../../adaptors/controllers/userController";
import userRepository from "../repository/userRepository";
import userUseCase from "../../usecase/userUseCase";
import express from "express";
import JWTtoken from "../utils/JWTtoken";
import otpGenerate from "../utils/otpGenerate";
import sendMail from "../utils/sendMail";
import hashPassword from "../utils/hashPassword";
import authenticate from '../middleware/userAuth';

const repository = new userRepository()
const otp = new otpGenerate()
const jwt = new JWTtoken()
const mail = new sendMail()
const hashPwd = new hashPassword()

const usercase = new userUseCase(repository, jwt, otp, mail, hashPwd)
const controller = new userController(usercase)

const router = express.Router()

router.post('/verifyMail', (req, res) => { controller.verifyMail(req, res) });
router.post('/verifyOtp', (req, res) => { controller.verifyOtp(req, res) });
router.post('/resendOtp', (req, res) => { controller.resendOtp(req, res) });
router.post('/login', (req, res) => { controller.login(req, res) });
router.get('/profile',authenticate,(req,res)=>{controller.profile(req,res)});



export default router