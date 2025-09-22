export default function handler(req, res) {
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!openaiKey) {
    return res.status(500).json({ ok: false, error: 'Missing OPENAI_API_KEY' });
  }

  return res.status(200).json({ ok: true, openaiKeySet: true });
}
