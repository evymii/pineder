import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

export class CloudinaryService {
  /**
   * Upload image to Cloudinary
   * @param file - File buffer or base64 string
   * @param folder - Folder path in Cloudinary (e.g., 'avatars', 'posts')
   * @param options - Additional upload options
   */
  static async uploadImage(
    file: Buffer | string,
    folder: string = "avatars",
    options: any = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      const uploadOptions = {
        folder,
        resource_type: "image",
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
          { quality: "auto", fetch_format: "auto" },
        ],
        ...options,
      };

      let uploadResult;

      if (Buffer.isBuffer(file)) {
        // Upload buffer using upload_stream
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
              if (error) {
                reject(error);
              } else if (result) {
                resolve({
                  public_id: result.public_id,
                  secure_url: result.secure_url,
                  width: result.width,
                  height: result.height,
                  format: result.format,
                  resource_type: result.resource_type,
                });
              } else {
                reject(new Error("Upload failed"));
              }
            }
          );

          uploadStream.end(file);
        });
      } else {
        // Upload base64 string
        uploadResult = await cloudinary.uploader.upload(file, uploadOptions);

        return {
          public_id: uploadResult.public_id,
          secure_url: uploadResult.secure_url,
          width: uploadResult.width,
          height: uploadResult.height,
          format: uploadResult.format,
          resource_type: uploadResult.resource_type,
        };
      }
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error("Failed to upload image to Cloudinary");
    }
  }

  /**
   * Delete image from Cloudinary
   * @param publicId - Public ID of the image to delete
   */
  static async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Cloudinary delete error:", error);
      throw new Error("Failed to delete image from Cloudinary");
    }
  }

  /**
   * Update user avatar
   * @param file - New avatar file
   * @param oldPublicId - Old avatar public ID to delete (optional)
   */
  static async updateAvatar(
    file: Buffer | string,
    oldPublicId?: string
  ): Promise<CloudinaryUploadResult> {
    try {
      // Delete old avatar if provided
      if (oldPublicId) {
        await this.deleteImage(oldPublicId);
      }

      // Upload new avatar
      return await this.uploadImage(file, "avatars");
    } catch (error) {
      console.error("Avatar update error:", error);
      throw new Error("Failed to update avatar");
    }
  }
}

export default CloudinaryService;
