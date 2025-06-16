import fetch from "node-fetch";
import 'dotenv/config'

export async function handler(event) {
  // eslint-disable-next-line no-undef
  const apiKey = process.env.VITE_API_KEY;
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const { contentOne, contentTwo } = JSON.parse(event.body);

  const prompt = `
    Compare "Text 1" and "Text 2" below and:

    1. Write a brief, human-friendly summary of the changes (1–2 sentences max).
    2. Classify the significance of the changes as one of:
      - "minor" (e.g., typos, formatting)
      - "major" (e.g., changes in meaning, tone or context)
      - "critical" (e.g., legal, safety, or factual implications)

    Text 1:
    """${contentOne}"""

    Text 2:
    """${contentTwo}"""

    Output ONLY valid JSON (no extra text) in this structure:
    {
      "summary": "Concise change description",
      "significance": "minor" | "major" | "critical"
    }
    `.trim();

  try {
    const response = await fetch(
      "https://api.aimlapi.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemma-3-4b-it",
          messages: [
            {
              role: "system",
              content: "You are an AI assistant who knows everything.",
            },
            { role: "user", content: prompt },
          ],
        }),
      }
    );

    const result = await response.json();
    const rawContent = result.choices[0].message.content.trim();

    const cleaned = rawContent
      .replace(/^```json\s*/i, "")
      .replace(/```$/, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return {
      statusCode: 200,
      body: JSON.stringify(parsed),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Text comparison failed",
        detail: error.message,
      }),
    };
  }
}
