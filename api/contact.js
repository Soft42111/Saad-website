// This runs on your server — safe to use Service Role Key
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ygiubaseztffinrekduh.supabase.co';
const SUPABASE_SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnaXViYXNlenRmZmlucmVrZHVoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjQxMDc0NCwiZXhwIjoyMDY3OTg2NzQ0fQ.TLnuxuHXCqz2CdlogDLdxQBZlbm6JGqmOqySf6TNE3o'; // KEEP SECRET
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { name, email, phone, subject, message } = req.body;

  const { error } = await supabase
    .from('Form Filling')
    .insert([{ name, email, phone, subject, message }]);

  if (error) {
    return res.status(500).json({ error: 'DB insert failed', details: error.message });
  }

  return res.status(200).json({ success: true });
}
