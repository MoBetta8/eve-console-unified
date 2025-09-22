export default function handler(req, res) {
  const key = process.env.OPENROUTER_API_KEY;

  if (!key) {
    return res.status(500).json({ ok: false, error: "Missing OPENROUTER_API_KEY" });
  }

  return res.status(200).json({ ok: true, routerKeySet: true });
}
