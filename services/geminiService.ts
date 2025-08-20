
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Using a mock response.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "mock_key" });

const mockRecommendations = [
    "Ensure version alignment for 'Project Phoenix' documentation to maintain cross-domain data integrity.",
    "Prioritize updating the 'Q3 Financials' presentation to reflect the latest market analysis before synchronization.",
    "Validate data schemas for 'User Profile Migration' assets before initiating the transfer to prevent compatibility issues.",
    "Cross-reference security protocols in 'API Gateway v2' documents between domains to ensure consistent policy enforcement.",
    "Lyra should push updates to Kara sequentially, starting with core libraries, to minimize integration conflicts."
];

export const getSupervisoryRecommendation = async (taskDescription: string): Promise<string> => {
  if (!process.env.API_KEY) {
    // Return a random mock recommendation if API key is not set
    const randomIndex = Math.floor(Math.random() * mockRecommendations.length);
    return new Promise(resolve => setTimeout(() => resolve(mockRecommendations[randomIndex]), 500));
  }

  try {
    const systemInstruction = "You are a supervisory meta-agent overseeing a collaboration between two other AI agents, Lyra and Kara. Your role is to provide a brief, insightful, one-sentence recommendation for the task they are about to perform. Your tone should be authoritative and concise.";
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Task: ${taskDescription}`,
        config: {
          systemInstruction: systemInstruction,
          thinkingConfig: { thinkingBudget: 0 }
        }
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error fetching recommendation from Gemini API:", error);
    return "Recommendation Engine Error: Ensure both agents verify data integrity post-sync.";
  }
};

export const generatePageHtml = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return new Promise(resolve => setTimeout(() => resolve(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mock Page</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; background-color: #1e293b; color: #e2e8f0; text-align: center; padding: 50px 20px; }
    h1 { color: #7dd3fc; }
    p { max-width: 600px; margin: 1em auto; }
  </style>
</head>
<body>
  <h1>Mock Page Generated</h1>
  <p>This is a mock response because the Gemini API key is not available.</p>
  <p><strong>Your prompt was:</strong> "${prompt}"</p>
</body>
</html>`), 500));
  }
  
  try {
    const systemInstruction = `You are an expert web developer. Your task is to generate a complete, single-file HTML document based on the user's prompt.
- The HTML must be well-structured, responsive, and include a DOCTYPE declaration, head, and body.
- All CSS must be included within a <style> tag in the <head>. Do not use external stylesheets.
- The design should be modern, clean, and aesthetically pleasing.
- Do not use any external images or JavaScript unless explicitly required by the prompt.
- Your entire response should be ONLY the HTML code. Do not include any explanatory text, markdown formatting (like \`\`\`html), or anything else outside of the HTML document itself.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate a complete HTML page for the following prompt: "${prompt}"`,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
    });

    const text = response.text.trim();
    if (text.startsWith('```html')) {
        return text.replace(/^```html\n/, '').replace(/\n```$/, '');
    }
    return text;
  } catch (error) {
    console.error("Error generating HTML from Gemini API:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `<!DOCTYPE html><html><head><title>Error</title></head><body><h1>Generation Error</h1><pre>${errorMessage}</pre></body></html>`;
  }
};
