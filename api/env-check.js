export default function handler(req, res) {
  const routerKey = process.env.OPENROUTER_API_KEY;
  if (!routerKey) {
    return res.status(500).json({ ok: false, error: 'Missing OPENROUTER_API_KEY' });
  }
  return res.status(200).json({ ok: true, routerKeySet: true });
}
