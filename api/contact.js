import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ygiubaseztffinrekduh.supabase.co';
const SUPABASE_SERVICE_ROLE = 'your-service-role-key'; // KEEP SECRET
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method allowed' });
  }

  try {
    // 👇 Manually parse request body
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const rawBody = Buffer.concat(chunks).toString();
    const data = JSON.parse(rawBody);

    // 👇 Extract the fields
    const { name, email, phone, subject, message, captcha_token } = data;

    // Optional: Validate fields here if needed

    // 👇 Insert into Supabase
    const { error } = await supabase
      .from('Form Filling')
      .insert([{ name, email, phone, subject, message, captcha_token }]);

    if (error) {
      return res.status(500).json({ error: 'DB insert failed', details: error.message });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected error', details: err.message });
  }
}
