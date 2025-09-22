export default async function handler(req, res) {
  try {
    const { message } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    // Grab key from environment (hidden in Vercel)
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API key missing in Vercel env" });
    }

    // Pick provider: OpenRouter if present, else OpenAI
    const url = process.env.OPENROUTER_API_KEY
      ? "https://openrouter.ai/api/v1/chat/completions"
      : "https://api.openai.com/v1/chat/completions";

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await resp.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
