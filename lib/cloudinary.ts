import { v2 as cloudinary } from 'cloudinary';

// Define the Cloudinary upload result type
export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  asset_id?: string;
  version_id?: string;
  version?: number;
  signature?: string;
  width?: number;
  height?: number;
  format?: string;
  resource_type?: string;
  created_at?: string;
  bytes?: number;
  type?: string;
  url?: string;
  [key: string]: any;
}

// Configure Cloudinary
try {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
    secure: true
  });

  // Log config status
  console.log('Cloudinary Configuration Status:', {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? 'Set' : 'Not set',
    apiKey: process.env.CLOUDINARY_API_KEY ? 'Set (masked)' : 'Not set',
    apiSecret: process.env.CLOUDINARY_API_SECRET ? 'Set (masked)' : 'Not set'
  });
} catch (error) {
  console.error('Error initializing Cloudinary:', error);
}

/**
 * Upload an image to Cloudinary
 * @param imageBuffer The image buffer to upload
 * @param folderName The folder to upload to (e.g., 'artworks' or 'profile')
 * @returns The Cloudinary upload result with public_id and secure_url
 */
export async function uploadImage(
  imageBuffer: Buffer, 
  folderName: string = 'uploads'
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    // Create upload stream to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(error);
        }
        resolve(result as CloudinaryUploadResult);
      }
    );

    // Convert buffer to stream and pipe to uploadStream
    const Readable = require('stream').Readable;
    const readableStream = new Readable();
    readableStream.push(imageBuffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
}

export default cloudinary; 