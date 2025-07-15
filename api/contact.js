// File: /api/contact.js

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ygiubaseztffinrekduh.supabase.co';
const SUPABASE_SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnaXViYXNlenRmZmlucmVrZHVoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjQxMDc0NCwiZXhwIjoyMDY3OTg2NzQ0fQ.TLnuxuHXCqz2CdlogDLdxQBZlbm6JGqmOqySf6TNE3o'; // 🔒 Never expose this in client-side JS!
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

// Helper to read raw request body
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', (err) => reject(err));
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  try {
    const body = await getRawBody(req); // 👈 Parse manually
    const { name, email, phone, subject, message } = body;

    const { error } = await supabase
      .from('Form Filling')
      .insert([{ name, email, phone, subject, message }]);

    if (error) {
      return res.status(500).json({ error: 'DB insert failed', details: error.message });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to parse body or insert', details: err.message });
  }
}
