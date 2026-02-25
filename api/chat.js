export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt
        })
      }
    );

    const text = await response.text();
    console.log("Raw Response:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Parse Error:", e);
      return res.status(500).json({ error: text });
    }

    if (!response.ok) {
      console.error("HuggingFace Error:", data);
      return res.status(500).json({ error: data });
    }

    return res.status(200).json({
      reply: data[0]?.generated_text || "No response"
    });

  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ error: "AI request failed" });
  }
}
