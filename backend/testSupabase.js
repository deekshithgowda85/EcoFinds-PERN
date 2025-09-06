const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'images';

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Service Key (first 20 chars):', supabaseServiceKey ? supabaseServiceKey.substring(0, 20) + '...' : 'NOT SET');
console.log('Bucket:', bucketName);

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testSupabase() {
    try {
        // Test 1: List buckets
        console.log('\n=== Test 1: List Storage Buckets ===');
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        
        if (listError) {
            console.error('❌ Error listing buckets:', listError);
            return;
        }
        
        console.log('✅ Available buckets:', buckets.map(b => b.name));
        
        const bucketExists = buckets.some(bucket => bucket.name === bucketName);
        console.log(`✅ Bucket "${bucketName}" exists:`, bucketExists);
        
        // Test 2: Create bucket if it doesn't exist
        if (!bucketExists) {
            console.log('\n=== Test 2: Create Storage Bucket ===');
            const { data, error } = await supabase.storage.createBucket(bucketName, {
                public: true,
                allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
                fileSizeLimit: 5242880 // 5MB
            });

            if (error) {
                console.error('❌ Error creating bucket:', error);
                return;
            } else {
                console.log('✅ Bucket created successfully:', bucketName);
            }
        }
        
        // Test 3: Try to list files in bucket
        console.log('\n=== Test 3: List Files in Bucket ===');
        const { data: files, error: filesError } = await supabase.storage
            .from(bucketName)
            .list('', { limit: 10 });
            
        if (filesError) {
            console.error('❌ Error listing files:', filesError);
        } else {
            console.log('✅ Files in bucket:', files.length);
        }
        
        console.log('\n✅ Supabase connection test completed successfully!');
        
    } catch (error) {
        console.error('❌ Supabase test failed:', error);
    }
}

testSupabase();
