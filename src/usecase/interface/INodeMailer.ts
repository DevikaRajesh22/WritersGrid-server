interface INodeMailer {
    sendOtp(name: string, email: string, verificationCode: string): void;
    forgotSendOtp(email: string, verificationCode: string): void;
}

export default INodeMailer;