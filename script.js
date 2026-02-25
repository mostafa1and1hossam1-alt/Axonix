async function getAIResponse(prompt){
  try {
    const res = await fetch("/chat.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    return data.reply;
  } catch(e) {
    console.error(e);
    return "⚠️ Failed to fetch AI response.";
  }
}