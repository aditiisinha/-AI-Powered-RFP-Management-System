const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Just to get the client, we don't need a specific model to list models actually, wait, the SDK might not expose listModels on the client directly in all versions.
        // Actually the SDK logic is usually separate. Let's check if I can list models via the SDK or if I have to try a known working model.
        // The error said "Call ListModels". In the Node SDK, it's usually on the class or manager.
        // Let's try to just output what we can.

        // Actually, searching the docs or common usage, it is often:
        // const scripts = ... 
        // Wait, the error comes from the API response so the API endpoint exists.

        // Let's try 'gemini-1.5-flash' again ensuring no typos, or 'gemini-1.0-pro'.
        // Use a script that tries multiple common model names.

        const modelsToTry = ["gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro", "gemini-1.5-pro"];

        for (const modelName of modelsToTry) {
            console.log(`Checking model: ${modelName}...`);
            try {
                const m = genAI.getGenerativeModel({ model: modelName });
                const result = await m.generateContent("Hello");
                console.log(`✅ Model ${modelName} works! Response: ${result.response.text()}`);
                return; // Exit after finding one
            } catch (e) {
                console.log(`❌ Model ${modelName} failed: ${e.message}`);
            }
        }
    } catch (error) {
        console.error('Fatal error:', error);
    }
}

listModels();
