import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lnlcydgnbafwwjvpppgy.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxubGN5ZGduYmFmd3dqdnBwcGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3NDAwMTksImV4cCI6MjA1ODMxNjAxOX0.0_kPDO9h3J7L1lydaw_gOCPni5t1JpjLGA6gk4Z8BIk';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Check if bucket exists and create it if it doesn't
async function ensureBucketExists(bucketName: string): Promise<boolean> {
  // First check if bucket exists
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
  
  if (!bucketExists) {
    try {
      // Create the bucket if it doesn't exist
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: true // Make bucket public
      });
      
      if (error) {
        console.error('Error creating bucket:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error creating bucket:', error);
      return false;
    }
  }
  
  return true;
}

// Function to upload a file to Supabase storage
export async function uploadDesignFile(
  file: File,
  bucket: string = 'designs',
  folder: string = 'uploads'
): Promise<string | null> {
  try {
    // Ensure the bucket exists
    const bucketExists = await ensureBucketExists(bucket);
    if (!bucketExists) {
      console.error('Failed to create or confirm bucket');
      // Fallback: If we can't upload to Supabase, return a temporary local URL
      return URL.createObjectURL(file);
    }
    
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading file:', error);
      // Fallback: If we can't upload to Supabase, return a temporary local URL
      return URL.createObjectURL(file);
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in upload function:', error);
    // Fallback: If we can't upload to Supabase, return a temporary local URL
    return URL.createObjectURL(file);
  }
}
