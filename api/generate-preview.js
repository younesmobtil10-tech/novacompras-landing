import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

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

        // Read the base image
        const imagePath = path.join(process.cwd(), "dardos", "images", "base-personalization.png");
        const imageData = fs.readFileSync(imagePath);
        const base64Image = imageData.toString("base64");

        // Use Gemini with image editing capability
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp-image-generation",
            generationConfig: {
                responseModalities: ["Text", "Image"]
            }
        });

        const prompt = `Edit this image. Keep everything exactly the same (the dart holder, darts, background, lighting, all details). ONLY change the text "Dardos de Papá" on the front edge of the dart holder to read "${name}" instead. The new text must use the exact same font style, size, color (white) and position as the original text. Do not change anything else in the image - keep the exact same product, darts, background, everything.`;

        const response = await model.generateContent([
            prompt,
            {
                inlineData: {
                    mimeType: "image/png",
                    data: base64Image
                }
            }
        ]);

        const result = response.response;

        // Extract image from response
        let imageDataResult = null;
        for (const part of result.candidates[0].content.parts) {
            if (part.inlineData) {
                imageDataResult = part.inlineData.data;
                break;
            }
        }

        if (!imageDataResult) {
            return res.status(500).json({ error: "No image generated" });
        }

        return res.status(200).json({
            success: true,
            image: `data:image/png;base64,${imageDataResult}`
        });

    } catch (error) {
        console.error("Gemini API error:", error);
        return res.status(500).json({
            error: "Failed to generate image",
            details: error.message
        });
    }
}
