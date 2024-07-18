interface INodeMailer {
    sendOtp(name: string, email: string, verificationCode: string): void;
    forgotSendOtp(name:string,email: string, verificationCode: string): void;
}

export default INodeMailer;