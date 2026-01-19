const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://saotfjtodmtcarathyvp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhb3RmanRvZG10Y2FyYXRoeXZwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI0MjQ0NiwiZXhwIjoyMDgzODE4NDQ2fQ.OZmvsCfpOflQ6QfjuV11CVSYwIiAB-R2WFXRWKn2LI4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setup() {
  console.log('🚀 Starting Robust Supabase Setup...');

  try {
    // 1. Create Evidence Bucket
    console.log('📦 Creating "evidence" bucket...');
    const { data: bucket, error: bucketError } = await supabase.storage.createBucket('evidence', {
      public: true
    });

    if (bucketError) {
      console.log('Bucket Status:', bucketError.message);
    } else {
      console.log('✅ Bucket "evidence" created successfully.');
    }

    // 2. Check columns
    console.log('🔍 Checking reports table columns...');
    const { data: cols, error: colError } = await supabase.from('reports').select('*').limit(1);
    
    if (colError) {
      console.error('❌ Table Error:', colError.message);
    } else {
      const existing = cols.length > 0 ? Object.keys(cols[0]) : [];
      console.log('Existing columns:', existing.join(', '));
    }

  } catch (err) {
    console.error('💥 Fatal Error:', err.message);
  }

  console.log('✨ Done.');
}

setup();
