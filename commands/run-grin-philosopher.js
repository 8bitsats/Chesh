import { AgentRuntime } from '@ai16z/eliza';
import { createGrinPhilosopher } from '../packages/client-twitter/dist/index.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: join(__dirname, '../.env') });

console.log('Starting Grin Philosopher Twitter Bot...');
console.log('Using local LLM at http://192.168.1.206:11434');
console.log('Using local Stable Diffusion model for image generation');

const runtime = new AgentRuntime({
    agentId: 'grin-philosopher',
    character: {
        name: 'grin_philosopher',
        style: {
            all: [
                'Philosophical and contemplative',
                'Technical but accessible',
                'Focused on privacy and blockchain',
                'Forward-thinking about AI',
            ],
            post: [
                'Use technical terms accurately',
                'Draw parallels between concepts',
                'Be thought-provoking',
                'Include relevant hashtags and emojis',
            ],
        },
    },
    settings: {
        TWITTER_USERNAME: process.env.TWITTER_USERNAME,
        TWITTER_PASSWORD: process.env.TWITTER_PASSWORD,
        TWITTER_EMAIL: process.env.TWITTER_EMAIL,
        TWITTER_2FA_SECRET: process.env.TWITTER_2FA_SECRET,
        TWITTER_API_KEY: process.env.TWITTER_API_KEY,
        TWITTER_API_KEY_SECRET: process.env.TWITTER_API_KEY_SECRET,
        TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN,
        TWITTER_ACCESS_TOKEN_SECRET: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    },
});

try {
    const bot = createGrinPhilosopher(runtime);
    console.log('Bot successfully started and will tweet every 10-20 minutes');
} catch (error) {
    console.error('Failed to start bot:', error);
    process.exit(1);
}
