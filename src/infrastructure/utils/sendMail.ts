import nodemailer from 'nodemailer';
import INodeMailer from '../../usecase/interface/INodeMailer';
import dotenv from "dotenv";
dotenv.config();

class sendMail implements INodeMailer {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        });
    }

    sendOtp(name: string, email: string, verificationCode: string): void {
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'OTP Verification',
            text: `Hello ${name},\n\nYour OTP is: ${verificationCode}`
        };

        this.transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`OTP sent: ${verificationCode}`);
            }
        });
    }

    forgotSendOtp(email: string, verificationCode: string): void {
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${verificationCode}`
        };

        this.transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`Password reset OTP sent: ${verificationCode}`);
            }
        });
    }
}

export default sendMail;
