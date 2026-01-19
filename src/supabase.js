import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://saotfjtodmtcarathyvp.supabase.co';
const supabaseKey = 'sb_publishable_OydG9-XFp4VIspNYHeucew_u3BgYClO';

export const supabase = createClient(supabaseUrl, supabaseKey);
