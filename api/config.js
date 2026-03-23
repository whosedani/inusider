import { createHash } from 'crypto';

export default async function handler(req, res) {
  const { KV_REST_API_URL, KV_REST_API_TOKEN, ADMIN_HASH } = process.env;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();

  const key = 'inusider:config';

  if (req.method === 'GET') {
    try {
      const r = await fetch(`${KV_REST_API_URL}/get/${key}`, {
        headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` }
      });
      const data = await r.json();
      if (data.result) {
        return res.status(200).json(JSON.parse(data.result));
      }
      return res.status(200).json({ ca: '', twitter: '', community: '', buy: '' });
    } catch {
      return res.status(200).json({ ca: '', twitter: '', community: '', buy: '' });
    }
  }

  if (req.method === 'POST') {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const password = auth.slice(7);
    const hash = createHash('sha256').update(password).digest('hex');

    if (hash !== ADMIN_HASH) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const { ca, twitter, community, buy } = req.body;
      const value = JSON.stringify({ ca, twitter, community, buy });
      await fetch(`${KV_REST_API_URL}/set/${key}/${encodeURIComponent(value)}`, {
        headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` }
      });
      return res.status(200).json({ ok: true });
    } catch {
      return res.status(500).json({ error: 'Failed to update config' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
