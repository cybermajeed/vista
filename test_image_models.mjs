import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

for (const model of ['gemini-3.1-flash-image', 'gemini-3-pro-image', 'gemini-3.1-flash-lite-image']) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "ping" }] }]
      })
    });
    console.log(model, "status:", res.status);
    if (!res.ok) {
      const err = await res.json();
      console.log("->", err.error?.message?.slice(0, 100));
    }
  } catch (e) {
    console.log(model, "error:", e.message);
  }
}
