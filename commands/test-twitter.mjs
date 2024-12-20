import Database from "better-sqlite3";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { SqliteDatabaseAdapter } from "@ai16z/adapter-sqlite";
import { TwitterClientInterface } from "@ai16z/client-twitter";
import { AgentRuntime } from "@ai16z/eliza";

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Check required environment variables
const requiredEnvVars = [
    'TWITTER_USERNAME',
    'TWITTER_PASSWORD',
    'TWITTER_EMAIL',
    'TWITTER_2FA_SECRET',
    'OPENAI_API_KEY',
    'RPC_URL'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars.join(', '));
    process.exit(1);
}

// Load the AI Artist character
const characterPath = path.join(__dirname, '..', 'characters', 'ai-artist.character.json');
const aiArtistCharacter = JSON.parse(fs.readFileSync(characterPath, 'utf8'));

async function main() {
    console.log("Starting AI Artist Twitter Bot...");

    // Initialize the database adapter
    const db = new SqliteDatabaseAdapter(new Database("./db.sqlite"));

    // Create the runtime with our AI Artist character
    const runtime = new AgentRuntime({
        databaseAdapter: db,
        token: process.env.OPENAI_API_KEY,
        modelProvider: aiArtistCharacter.modelProvider,
        character: aiArtistCharacter,
        plugins: [],
        evaluators: [],
        providers: [],
        actions: [],
        services: [],
        managers: []
    });

    // Add settings that will be needed by the Twitter client
    runtime.addSetting('TWITTER_USERNAME', process.env.TWITTER_USERNAME);
    runtime.addSetting('TWITTER_PASSWORD', process.env.TWITTER_PASSWORD);
    runtime.addSetting('TWITTER_EMAIL', process.env.TWITTER_EMAIL);
    runtime.addSetting('TWITTER_2FA_SECRET', process.env.TWITTER_2FA_SECRET);
    runtime.addSetting('OPENAI_API_KEY', process.env.OPENAI_API_KEY);
    runtime.addSetting('RPC_URL', process.env.RPC_URL);

    try {
        // Start the Twitter client
        console.log("Initializing Twitter client...");
        const client = await TwitterClientInterface.start(runtime);
        console.log("Twitter client started successfully!");
        
        // Keep the script running
        console.log("\nAI Artist bot is now running!");
        console.log("- Using LM Studio for text generation");
        console.log("- Using DALL-E 3 for image generation");
        console.log("- Tweets will be generated every 1.5-3 hours");
        console.log("- 30% chance of including AI-generated artwork");
        console.log("\nPress Ctrl+C to stop.");

        process.on('SIGINT', async () => {
            console.log("\nShutting down...");
            await TwitterClientInterface.stop(runtime);
            process.exit();
        });
    } catch (error) {
        console.error("Error starting Twitter client:", error);
        process.exit(1);
    }
}

main().catch(error => {
    console.error("Fatal error:", error);
    process.exit(1);
});
