import { supabase } from '../config/supabase';

class SupabaseStorageService {
  constructor() {
    this.bucketName = 'images';
  }

  // Upload file to Supabase Storage
  async uploadFile(file, folder = 'products') {
    try {
      // Validate file
      this.validateFile(file);

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.name.split('.').pop();
      const fileName = `${folder}/${timestamp}-${randomString}.${fileExtension}`;

      // Upload file
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(fileName);

      return {
        url: urlData.publicUrl,
        fileName: fileName,
        originalName: file.name,
        path: data.path
      };

    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  // Delete file from Supabase Storage
  async deleteFile(fileName) {
    try {
      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([fileName]);

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(files, folder = 'products') {
    try {
      const uploadPromises = Array.from(files).map(file => 
        this.uploadFile(file, folder)
      );
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Multiple upload error:', error);
      throw error;
    }
  }

  // Validate file before upload
  validateFile(file, maxSize = 5 * 1024 * 1024) { // 5MB default
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
    }
    
    if (file.size > maxSize) {
      throw new Error(`File size too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`);
    }
    
    return true;
  }

  // Extract filename from Supabase URL
  extractFileNameFromUrl(url) {
    try {
      // Supabase public URL format: https://[project-ref].supabase.co/storage/v1/object/public/[bucket]/[path]
      const urlParts = url.split('/storage/v1/object/public/');
      if (urlParts.length === 2) {
        const pathParts = urlParts[1].split('/');
        if (pathParts.length > 1) {
          // Remove bucket name and return the rest as filename
          pathParts.shift(); // Remove bucket name
          return pathParts.join('/');
        }
      }
      return null;
    } catch (error) {
      console.error('Error extracting filename from URL:', error);
      return null;
    }
  }

  // Get download URL for a file
  async getDownloadUrl(fileName) {
    try {
      const { data } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw error;
    }
  }

  // List files in a folder
  async listFiles(folder = '', limit = 100) {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .list(folder, {
          limit: limit,
          offset: 0
        });

      if (error) {
        console.error('Error listing files:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('List files error:', error);
      throw error;
    }
  }
}

export default new SupabaseStorageService();
