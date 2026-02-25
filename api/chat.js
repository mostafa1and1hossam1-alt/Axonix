export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();

    // 🔥 اطبع الخطأ لو فيه
    if (!response.ok) {
      console.error("OpenAI Error:", data);
      return res.status(500).json({ error: data });
    }

    return res.status(200).json({
      reply: data.choices?.[0]?.message?.content || "No response"
    });

  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ error: "AI request failed" });
  }
}
