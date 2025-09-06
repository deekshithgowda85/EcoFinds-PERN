const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'images';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testUpload() {
    try {
        console.log('Testing image upload to Supabase...');
        
        // Create a minimal PNG file buffer (1x1 pixel transparent PNG)
        const pngBuffer = Buffer.from([
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
            0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
            0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
            0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
            0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
            0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
        ]);
        
        // Generate unique filename
        const timestamp = Date.now();
        const fileName = `test/upload-test-${timestamp}.png`;
        
        console.log('Uploading test image:', fileName);
        
        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(fileName, pngBuffer, {
                contentType: 'image/png',
                metadata: {
                    originalName: 'test-upload.png',
                    uploadedAt: new Date().toISOString()
                }
            });

        if (error) {
            console.error('❌ Upload failed:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            return;
        }

        console.log('✅ Upload successful!');
        console.log('Upload data:', data);

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);

        console.log('✅ Public URL:', urlData.publicUrl);

        // Clean up - delete the test file
        const { error: deleteError } = await supabase.storage
            .from(bucketName)
            .remove([fileName]);

        if (deleteError) {
            console.warn('⚠️ Could not delete test file:', deleteError);
        } else {
            console.log('✅ Test file cleaned up');
        }

    } catch (error) {
        console.error('❌ Test upload failed:', error);
        console.error('Error stack:', error.stack);
    }
}

testUpload();
