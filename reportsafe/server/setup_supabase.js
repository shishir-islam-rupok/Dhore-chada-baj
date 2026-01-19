const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function setup() {
  console.log('🚀 Starting Supabase Setup...');

  // 1. Create Evidence Bucket
  console.log('📦 Creating "evidence" bucket...');
  const { data: bucket, error: bucketError } = await supabase.storage.createBucket('evidence', {
    public: true,
    fileSizeLimit: 10485760, // 10MB
  });

  if (bucketError) {
    if (bucketError.message.includes('already exists')) {
      console.log('✅ Bucket "evidence" already exists.');
    } else {
      console.error('❌ Error creating bucket:', bucketError.message);
    }
  } else {
    console.log('✅ Bucket "evidence" created successfully.');
  }

  // 2. Check for columns in reports table
  console.log('🔍 Checking reports table columns...');
  const { data, error } = await supabase.from('reports').select('*').limit(1);
  
  if (error) {
    console.error('❌ Error fetching reports:', error.message);
  } else if (data.length >= 0) {
    const columns = data.length > 0 ? Object.keys(data[0]) : [];
    const required = ['user_id', 'status', 'evidence_url'];
    const missing = required.filter(c => !columns.includes(c));

    if (missing.length === 0) {
      console.log('✅ All required columns (user_id, status, evidence_url) are present.');
    } else {
      console.log(`⚠️ Missing columns: ${missing.join(', ')}`);
      console.log('👉 Please run the SQL script provided in the instructions to add these columns.');
    }
  }

  console.log('\n✨ Setup script finished.');
}

setup();
