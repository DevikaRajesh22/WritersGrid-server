import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import userRoute from '../routes/userRoute';
import http from 'http'

export const createServer=()=>{
    try{
        const app = express()
        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))
        app.use(cookieParser())
        app.use(
            cors({
                origin: ['http://localhost:5173'],
                methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
                credentials: true,
                optionsSuccessStatus: 200
            })
        )
        app.use('/api/user', userRoute)
        const server = http.createServer(app)
        return server
    }catch(error){
        console.log(error)
    }
}