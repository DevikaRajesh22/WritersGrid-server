interface ICloudinary {
    saveToCloudinary(file: string): Promise<string>,
    uploadVideo(file: string): Promise<string>,
}

export default ICloudinary