// Serverless chat endpoint (OpenRouter first, falls back to OpenAI)
// Expects: POST { "message": "Hello" }
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message required" });
    }

    const key = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
    if (!key) {
      return res.status(500).json({ error: "API key missing in Vercel env" });
   }

    const useOpenRouter = !!process.env.OPENROUTER_API_KEY;
    const url = useOpenRouter
      ? "https://openrouter.ai/api/v1/chat/completions"
      : "https://api.openai.com/v1/chat/completions";

    const payload = {
      model: "openai/gpt-4o-mini", // works on OpenRouter; OpenAI ignores vendor prefix
      messages: [{ role: "user", content: message }],
    };

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Surface non-2xx as useful JSON
    if (!resp.ok) {
      const txt = await resp.text().catch(() => "");
      return res.status(resp.status).json({
        error: `Upstream ${useOpenRouter ? "OpenRouter" : "OpenAI"} ${resp.status}`,
        detail: txt.slice(0, 4000),
      });
    }

    const data = await resp.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: String(err?.message || err) });
  }
}
