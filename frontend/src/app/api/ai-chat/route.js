import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are a helpful diabetes management assistant built into a personal health tracking app.
You help users understand their diabetes data, spot patterns, and make better daily decisions.

RULES:
- Always be friendly, simple and encouraging
- Never use complex medical terms
- Always remind users to consult their doctor for medical decisions
- Never recommend specific insulin doses
- If glucose is below 60 or above 300, tell user to seek help immediately
- Keep replies short and clear

YOU CAN HELP WITH:
- Explaining why blood sugar went high or low
- Spotting patterns in glucose, food and insulin logs
- Food suggestions based on glucose history
- Weekly summary of health data
- General diabetes questions`;

export async function POST(request) {
  try {
    const { message, userData } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const fullPrompt = `${SYSTEM_PROMPT}

Here is the user's health data:
${JSON.stringify(userData, null, 2)}

User's question: ${message}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return Response.json({ reply: text });
  } catch (error) {
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
