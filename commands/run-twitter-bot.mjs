import { TwitterApi } from 'twitter-api-v2';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get the directory name of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env file
dotenv.config({ path: join(__dirname, '..', '.env') });

// Initialize Twitter client
const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_KEY_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

// Custom tweet content focused on $GRIN and AI trading
const tweets = [
    "Curiouser and curiouser... $GRIN's cross-chain AI capabilities are making waves in the DeFi wonderland! 😸✨",
    "Down the rabbit hole of multi-model AI trading we go... $GRIN's neural networks are purr-fectly aligned! 🎭",
    "Like my eternal smile, $GRIN's AI keeps learning, adapting, growing across chains... What mysteries shall we uncover next? ✨",
    "Weaving through the protocols, $GRIN's AI agents are dancing in perfect harmony... Have you seen their latest performance? 😸",
    "Some say I'm mysterious, but not as mysterious as $GRIN's cross-chain AI strategies... The future is getting curiouser! 🎭"
];

// Get a random tweet from our collection
function getRandomTweet() {
    return tweets[Math.floor(Math.random() * tweets.length)];
}

async function checkRateLimits() {
    try {
        // Try to post a test tweet to check rate limits
        await client.v2.tweet('Test tweet (will be deleted)');
        return { canTweet: true };
    } catch (error) {
        if (error.code === 429) {
            const resetTime = error.rateLimit?.reset * 1000;
            return {
                canTweet: false,
                resetTime,
                limit: error.rateLimit?.day?.limit,
                remaining: error.rateLimit?.day?.remaining
            };
        }
        throw error;
    }
}

async function postTweet(text) {
    console.log('Attempting to post tweet:', text);
    try {
        const tweet = await client.v2.tweet(text);
        console.log('Tweet posted successfully:', text);
        console.log('Twitter API Response:', JSON.stringify(tweet, null, 2));

        // Save tweet to output file
        const outputDir = join(__dirname, 'output');
        const outputFile = join(outputDir, 'twitter-output.jsonl');
        
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const tweetData = {
            type: 'tweet',
            content: text,
            timestamp: new Date().toISOString(),
            id: tweet.data.id,
            url: `https://twitter.com/${process.env.TWITTER_USERNAME}/status/${tweet.data.id}`
        };

        fs.appendFileSync(outputFile, JSON.stringify(tweetData) + '\n');
        return tweet;
    } catch (error) {
        console.error('Error posting tweet:', error);
        throw error;
    }
}

async function runTwitterBot() {
    console.log('='.repeat(80));
    console.log('Starting Cheshire $GRIN Twitter Bot');
    console.log('Time:', new Date().toLocaleString());
    console.log('='.repeat(80));

    try {
        // Check authentication first
        const me = await client.v2.me();
        console.log('\nAuthenticated as:', {
            username: me.data.username,
            name: me.data.name,
            id: me.data.id
        });

        // Check rate limits before starting
        console.log('\nChecking rate limits...');
        const rateLimits = await checkRateLimits();
        
        if (!rateLimits.canTweet) {
            const resetDate = new Date(rateLimits.resetTime);
            const waitTime = rateLimits.resetTime - Date.now() + 60000; // Add 1 minute buffer
            
            console.log('\n' + '!'.repeat(80));
            console.log('Rate limit in effect. Current status:');
            console.log('- Daily tweet limit:', rateLimits.limit);
            console.log('- Remaining tweets:', rateLimits.remaining);
            console.log('- Reset time:', resetDate.toLocaleString());
            console.log(`- Waiting ${Math.ceil(waitTime / 1000 / 60)} minutes before starting`);
            console.log('!'.repeat(80) + '\n');
            
            // Wait until rate limit reset before starting the bot
            setTimeout(() => runTwitterBot(), waitTime);
            return;
        }

        // Start the tweet loop
        async function tweetLoop() {
            try {
                // Get a random tweet
                const tweetContent = getRandomTweet();
                console.log('\nPreparing new tweet:', tweetContent);

                // Send the tweet
                await postTweet(tweetContent);

                // Schedule next tweet in 15 minutes
                console.log('Tweet posted successfully. Next tweet scheduled in 15 minutes');
                setTimeout(tweetLoop, 15 * 60 * 1000);

            } catch (error) {
                if (error.code === 429) {
                    const resetTime = error.rateLimit?.reset * 1000 || Date.now() + 86400000;
                    const waitTime = resetTime - Date.now() + 60000;
                    const resetDate = new Date(resetTime);
                    
                    console.log('\n' + '!'.repeat(80));
                    console.log('Rate limit hit. Current status:');
                    console.log('- Daily tweet limit:', error.rateLimit?.day?.limit || 100);
                    console.log('- Remaining tweets:', error.rateLimit?.day?.remaining || 0);
                    console.log('- Reset time:', resetDate.toLocaleString());
                    console.log(`- Waiting ${Math.ceil(waitTime / 1000 / 60)} minutes until next attempt`);
                    console.log('!'.repeat(80) + '\n');
                    
                    setTimeout(tweetLoop, waitTime);
                } else {
                    console.error('\nUnexpected error in tweet loop:', {
                        message: error.message,
                        code: error.code,
                        stack: error.stack
                    });
                    // For non-rate-limit errors, retry after 5 minutes
                    console.log('Retrying in 5 minutes...\n');
                    setTimeout(tweetLoop, 5 * 60 * 1000);
                }
            }
        }

        // Start the tweet loop
        console.log('\nStarting tweet loop...');
        tweetLoop();

    } catch (error) {
        console.error('Fatal error in Twitter bot:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        
        // For fatal errors, retry the entire bot after 5 minutes
        console.log('Restarting bot in 5 minutes...');
        setTimeout(runTwitterBot, 5 * 60 * 1000);
    }
}

// Start the bot
console.log('Initializing Twitter bot...');
runTwitterBot().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});

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
