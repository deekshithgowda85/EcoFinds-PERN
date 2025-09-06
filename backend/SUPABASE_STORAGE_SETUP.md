# Supabase Storage Setup Guide for EcoFinds Backend

## Overview

This guide will help you configure Supabase Storage for image uploads in your EcoFinds backend. Supabase Storage provides a scalable file storage solution with automatic CDN and image optimization.

## Step 1: Get Supabase API Keys

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `qjezuaonznjgrdrjumuo`
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL**: `https://qjezuaonznjgrdrjumuo.supabase.co`
   - **anon public key**: For frontend use
   - **service_role key**: For backend use (keep this secret!)

## Step 2: Update Environment Variables

Update your `.env` file with the actual Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://qjezuaonznjgrdrjumuo.supabase.co
SUPABASE_ANON_KEY=your-actual-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key-here
SUPABASE_STORAGE_BUCKET=images
```

**Important**:

- Use the `service_role` key for backend operations (not the anon key)
- Never commit the service_role key to version control
- The service_role key bypasses Row Level Security (RLS)

## Step 3: Create Storage Bucket

The storage bucket will be automatically created when you start your server, but you can also create it manually:

1. Go to **Storage** in your Supabase dashboard
2. Click **Create a new bucket**
3. Name it `images`
4. Make it **Public** (for easy access to uploaded images)
5. Set appropriate file size limits (current default: 5MB)

## Step 4: Configure Storage Policies (Optional)

For production, you might want to set up Row Level Security policies:

```sql
-- Allow public read access to all files
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Allow users to update/delete their own files
CREATE POLICY "Users can update own files" ON storage.objects
FOR UPDATE USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Step 5: Test the Integration

1. Start your backend server:

   ```bash
   npm run dev
   ```

2. The console should show:

   ```
   Storage bucket already exists: images
   Server is running on port 5000
   ```

3. Test image upload using a tool like Postman:

   - **POST** to `http://localhost:5000/api/products/products`
   - **Form-data** with:
     - `name`: "Test Product"
     - `price`: "99.99"
     - `description`: "Test Description"
     - `image`: (select an image file)

4. Check the response - the image URL should start with:
   ```
   https://qjezuaonznjgrdrjumuo.supabase.co/storage/v1/object/public/images/...
   ```

## Features Included

✅ **Automatic Upload**: Images uploaded to Supabase Storage
✅ **Public URLs**: Automatic public URLs for frontend display
✅ **File Organization**: Images organized in folders (`products/`, `electronics/`)
✅ **Old Image Cleanup**: Old images deleted when updating products
✅ **Error Handling**: Comprehensive error handling for all operations
✅ **File Validation**: File type and size validation
✅ **Unique Filenames**: Timestamp + random string naming
✅ **Bucket Auto-Creation**: Storage bucket created automatically if needed

## File Structure in Supabase Storage

```
images/
├── products/
│   ├── 1672846123456-987654321.jpg
│   └── 1672846789012-123456789.png
└── electronics/
    ├── 1672847123456-555444333.jpg
    └── 1672847456789-111222333.png
```

## API Endpoints

### Products

- **GET** `/api/products/products` - Get all products
- **POST** `/api/products/products` - Create product with image
- **GET** `/api/products/products/:id` - Get single product
- **PUT** `/api/products/products/:id` - Update product (with optional new image)
- **DELETE** `/api/products/products/:id` - Delete product and its image

### Electronics

- **GET** `/api/products/electronics` - Get all electronics
- **POST** `/api/products/electronics` - Create electronics with image
- **GET** `/api/products/electronics/:id` - Get single electronics item
- **PUT** `/api/products/electronics/:id` - Update electronics (with optional new image)
- **DELETE** `/api/products/electronics/:id` - Delete electronics and its image

## Image Upload Format

When uploading images, use `multipart/form-data` with the field name `image`:

```javascript
const formData = new FormData();
formData.append("name", "Product Name");
formData.append("price", "99.99");
formData.append("description", "Product Description");
formData.append("image", imageFile); // File object

fetch("/api/products/products", {
  method: "POST",
  body: formData,
});
```

## Supported Image Formats

- **JPEG** (.jpg, .jpeg)
- **PNG** (.png)
- **GIF** (.gif)
- **WebP** (.webp)

**File Size Limit**: 5MB per image

## Benefits of Supabase Storage

✅ **Integrated**: Works seamlessly with your existing Supabase PostgreSQL database
✅ **CDN**: Global content delivery network for fast image loading
✅ **Scalable**: No storage limitations, pay as you use
✅ **Secure**: Row Level Security policies for fine-grained access control
✅ **Image Optimization**: Automatic image optimization and transformation
✅ **Cost Effective**: Generous free tier, reasonable pricing

## Troubleshooting

### Common Issues:

1. **"Invalid JWT" Error**

   - Check your `SUPABASE_SERVICE_ROLE_KEY` in .env
   - Ensure you're using the service_role key, not the anon key

2. **"Bucket not found" Error**

   - Ensure the bucket name in .env matches the one in Supabase
   - Check if the bucket was created successfully

3. **"File too large" Error**

   - Check the file size (current limit: 5MB)
   - Adjust the multer fileSize limit if needed

4. **"Permission denied" Error**

   - Check your storage policies in Supabase dashboard
   - Ensure the bucket is set to public for read access

5. **"Network error" Error**
   - Verify your SUPABASE_URL is correct
   - Check your internet connection

## Environment Variables Reference

```env
# Required
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional (with defaults)
SUPABASE_ANON_KEY=your-anon-key  # Not used in backend, but good to have
SUPABASE_STORAGE_BUCKET=images   # Default bucket name
```

## Security Best Practices

1. **Never expose service_role key** in frontend code
2. **Use environment variables** for all sensitive data
3. **Set up proper RLS policies** for production
4. **Validate file types** on both client and server
5. **Implement file size limits** to prevent abuse
6. **Monitor storage usage** in Supabase dashboard

## Next Steps

After setup is complete:

1. Test all CRUD operations with image uploads
2. Set up proper error handling in your frontend
3. Implement image compression for better performance
4. Consider implementing image thumbnails for optimized loading
5. Set up monitoring and logging for production use
