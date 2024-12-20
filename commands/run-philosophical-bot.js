import { config } from "../cheshireterminal/cheshire_the_bot/config.js";
import { twitterBot } from "../cheshireterminal/cheshire_the_bot/twitterBot.js";

async function testLLMConnection() {
    try {
        console.log('Testing LLM connection...');
        const response = await fetch(`${config.llm.baseUrl}/models`);
        const data = await response.json();
        console.log('Available models:', data);
        return true;
    } catch (error) {
        console.error('LLM connection failed:', error.message);
        return false;
    }
}

async function startBot() {
    console.log('='.repeat(80));
    console.log('Starting Cheshire AI Twitter Bot');
    console.log('Time:', new Date().toLocaleString());
    console.log('='.repeat(80));

    // Test LLM connection
    const llmAvailable = await testLLMConnection();
    if (!llmAvailable) {
        console.log('WARNING: LLM server not available, falling back to predefined content');
        config.llm.enabled = false;
        config.bot.imageGenerationEnabled = false;
    }

    try {
        await twitterBot.start();
        console.log('Bot successfully started and will tweet every', config.bot.tweetInterval, 'milliseconds');
    } catch (error) {
        console.error('Failed to start bot:', error);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nReceived SIGINT signal');
    console.log('Shutting down Twitter bot...');
    process.exit(0);
});

// Ensure uncaught errors are logged
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Start the bot
console.log('Initializing Twitter bot...');
startBot().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
