import { twitterBot } from "../cheshireterminal/cheshire_the_bot/twitterBot.js";

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const tweetTypes = ['gm', 'market', 'meme', 'educational', 'default'];

async function runTwitterWarfare() {
    console.log('🐱 Initializing Cheshire Cat Twitter Warfare...');
    console.log('🎨 Image generation enabled with FLUX.1-dev model');

    try {
        // Initial tweet on startup
        await sendTweet();

        // Set up intervals
        setInterval(sendTweet, FIFTEEN_MINUTES);
        setInterval(handleMentions, FIFTEEN_MINUTES);

        console.log('🎭 Memetic warfare activated! Tweeting with AI-generated images every 15 minutes...');
    } catch (error) {
        console.error('Error initializing Twitter warfare:', error);
        process.exit(1);
    }
}

async function sendTweet() {
    try {
        // Randomly select tweet type
        const tweetType = tweetTypes[Math.floor(Math.random() * tweetTypes.length)];
        
        console.log(`\n🤖 Generating ${tweetType} tweet...`);
        const content = await twitterBot.generateTweetContent(tweetType);
        
        console.log('📝 Tweet content:', content);
        console.log('🎨 Generating accompanying image...');
        
        await twitterBot.tweet(content);
        c onsole.log('✨ Tweet and image posted successfully!');
    } catch (error) {
        console.error('Error in tweet cycle:', error);
    }
}

async function handleMentions() {
    try {
        console.log('\n👀 Checking for mentions...');
        await twitterBot.respondToMentions();
        console.log('✅ Mention responses completed');
    } catch (error) {
        console.error('Error handling mentions:', error);
    }
}

// Graceful shutdown handler
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down Twitter warfare gracefully...');
    process.exit(0);
});

// Start the warfare
console.log('🚀 Starting enhanced memetic warfare with AI image generation...');
runTwitterWarfare().catch(error => {
    console.error('Fatal error in Twitter warfare:', error);
    process.exit(1);
});
