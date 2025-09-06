const { createClient } = require('@supabase/supabase-js');
const multer = require('multer');
const path = require('path');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role for backend operations
const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'images';

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase configuration. Please check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Upload file to Supabase Storage
const uploadToSupabase = async (file, folder = 'products') => {
    try {
        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        const fileName = `${folder}/${timestamp}-${randomString}${fileExtension}`;

        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                metadata: {
                    originalName: file.originalname,
                    uploadedAt: new Date().toISOString()
                }
            });

        if (error) {
            console.error('Supabase upload error:', error);
            throw error;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);

        console.log('File uploaded successfully to Supabase:', urlData.publicUrl);

        return {
            url: urlData.publicUrl,
            fileName: fileName,
            originalName: file.originalname,
            path: data.path
        };

    } catch (error) {
        console.error('Supabase upload error:', error);
        throw error;
    }
};

// Delete file from Supabase Storage
const deleteFromSupabase = async (fileName) => {
    try {
        const { error } = await supabase.storage
            .from(bucketName)
            .remove([fileName]);

        if (error) {
            console.error('Supabase delete error:', error);
            throw error;
        }

        console.log('File deleted successfully from Supabase:', fileName);
        return true;
    } catch (error) {
        console.error('Supabase delete error:', error);
        throw error;
    }
};

// Extract filename from Supabase URL
const extractFileNameFromUrl = (url) => {
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
};

// Multer configuration for memory storage (required for Supabase)
const multerConfig = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        // Accept images only
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WebP) are allowed!'));
        }
    }
});

// Initialize storage bucket if it doesn't exist
const initializeStorage = async () => {
    try {
        // Check if bucket exists
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        
        if (listError) {
            console.error('Error listing buckets:', listError);
            return;
        }

        const bucketExists = buckets.some(bucket => bucket.name === bucketName);
        
        if (!bucketExists) {
            // Create bucket
            const { data, error } = await supabase.storage.createBucket(bucketName, {
                public: true,
                allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
                fileSizeLimit: 5242880 // 5MB
            });

            if (error) {
                console.error('Error creating storage bucket:', error);
            } else {
                console.log('Storage bucket created successfully:', bucketName);
            }
        } else {
            console.log('Storage bucket already exists:', bucketName);
        }
    } catch (error) {
        console.error('Error initializing storage:', error);
    }
};

module.exports = {
    supabase,
    uploadToSupabase,
    deleteFromSupabase,
    extractFileNameFromUrl,
    multerConfig,
    upload: multerConfig.single('image'),
    initializeStorage
};
