import { v2 as cloudinary } from 'cloudinary';
import ICloudinary from '../../usecase/interface/ICloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

class Cloudinary implements ICloudinary {
    async saveToCloudinary(file: string): Promise<string> {
        const result = await cloudinary.uploader.upload(file)
        file = result.secure_url
        return file
    }
    async uploadVideo(file: string): Promise<string> {
        const result = await cloudinary.uploader.upload(file, { resource_type: 'video' });
        return result.secure_url;
    }
}
export default Cloudinary