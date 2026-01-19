require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function updatePin() {
  console.log("Updating Admin PIN...");
  
  // Check existing admins
  const { data: allAdmins, error: fetchError } = await supabase.from('admins').select('*');
  console.log("Current Admins found:", allAdmins?.length);
  if (allAdmins && allAdmins.length > 0) {
      console.log("First admin PIN hash:", allAdmins[0].pin_hash);
  }

  if (!allAdmins || allAdmins.length === 0) {
      console.log("No admin found. Creating one...");
      const { error } = await supabase.from('admins').insert({
          name: 'Super Admin',
          pin_hash: '0199598316',
          role: 'super_admin'
      });
      if (error) console.error('Error creating admin:', error);
      else console.log('Admin created with new PIN: 0199598316');
  } else {
      console.log("Updating ALL admins to new PIN...");
      const { error, count } = await supabase
        .from('admins')
        .update({ pin_hash: '0199598316' })
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all

      if (error) console.error('Error updating:', error);
      else console.log('Success! Admin PINs updated.');
  }
}

updatePin();
