import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { name } = req.body;

    if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: "Name is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key not configured" });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);

        // Use Gemini with image generation capability
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp-image-generation",
            generationConfig: {
                responseModalities: ["Text", "Image"]
            }
        });

        const prompt = `Generate a product image of a dart holder organizer:
    - Black circular base designed like a mini dartboard with classic dartboard pattern
    - Has 3 darts with yellow/green striped flights standing upright on the holder
    - White text on the front edge reads exactly: "${name}"
    - Clean white/off-white studio background
    - Professional product photography style
    - The text should be the same font and size as shown on similar dart holders
    - High quality commercial product shot`;

        const response = await model.generateContent(prompt);
        const result = response.response;

        // Extract image from response
        let imageData = null;
        for (const part of result.candidates[0].content.parts) {
            if (part.inlineData) {
                imageData = part.inlineData.data;
                break;
            }
        }

        if (!imageData) {
            return res.status(500).json({ error: "No image generated" });
        }

        return res.status(200).json({
            success: true,
            image: `data:image/png;base64,${imageData}`
        });

    } catch (error) {
        console.error("Gemini API error:", error);
        return res.status(500).json({
            error: "Failed to generate image",
            details: error.message
        });
    }
}
