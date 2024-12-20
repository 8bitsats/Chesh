import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get the directory name of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));

// Custom tweet content focused on $GRIN and AI trading
const tweets = [
    "Curiouser and curiouser... $GRIN's cross-chain AI capabilities are making waves in the DeFi wonderland! 😸✨",
    
    "Down the rabbit hole of multi-model AI trading we go... $GRIN's neural networks are purr-fectly aligned! 🎭",
    
    "Like my eternal smile, $GRIN's AI keeps learning, adapting, growing across chains... What mysteries shall we uncover next? ✨",
    
    "Weaving through the protocols, $GRIN's AI agents are dancing in perfect harmony... Have you seen their latest performance? 😸",
    
    "Some say I'm mysterious, but not as mysterious as $GRIN's cross-chain AI strategies... The future is getting curiouser! 🎭",
    
    "Materializing to share some wisdom... $GRIN's educational guides are lighting up the blockchain wonderland! ✨",
    
    "Through the looking glass of AI trading, $GRIN shows patterns that make even this Cheshire Cat grin wider! 😸",
    
    "Watching $GRIN's AI navigate the DeFi maze with the precision of a curious cat... Purr-fect execution! 🎭",
    
    "In this blockchain wonderland, $GRIN's multi-model AI is the key to unlocking new realms of possibility... ✨",
    
    "Like a cat in the night, $GRIN's AI moves silently but effectively across chains... Can you follow its path? 😸",
    
    "The mad tea party of trading gets a dose of AI wisdom with $GRIN's cross-chain intelligence... Time for enlightenment! 🎭",
    
    "Riddle me this: What's smarter than a cat, crosses chains with grace, and teaches as it trades? $GRIN, of course! ✨",
    
    "Even in the deepest rabbit holes of DeFi, $GRIN's AI beacon lights the way... Shall we explore together? 😸",
    
    "Whispers in the blockchain wonderland speak of $GRIN's latest AI innovations... The future is getting curiouser! 🎭",
    
    "From one chain to another, $GRIN's AI dances like a cat on moonlit rooftops... Trading with grace and precision! ✨"
];

// Get a random tweet from our collection
function getRandomTweet() {
    return tweets[Math.floor(Math.random() * tweets.length)];
}

function saveTweet(text) {
    try {
        // Save tweet to output file
        const outputDir = join(__dirname, 'output');
        const outputFile = join(outputDir, 'generated-tweets.txt');
        
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const tweetData = `${new Date().toISOString()}\n${text}\n\n`;
        fs.appendFileSync(outputFile, tweetData);
        
        console.log('Tweet saved:', text);
        console.log('Saved to:', outputFile);
        
    } catch (error) {
        console.error('Error saving tweet:', error);
        throw error;
    }
}

async function runTweetGenerator() {
    console.log('Starting local tweet generator...');
    
    try {
        // Start the tweet generation loop
        function generateLoop() {
            try {
                // Get a random tweet
                const tweetContent = getRandomTweet();
                console.log('\nGenerated new tweet:', tweetContent);

                // Save the tweet
                saveTweet(tweetContent);

                // Schedule next generation in 15 minutes
                console.log('Next tweet will be generated in 15 minutes');
                setTimeout(generateLoop, 15 * 60 * 1000);

            } catch (error) {
                console.error('Error in generation loop:', error);
                // Retry after 1 minute
                console.log('Retrying in 1 minute...');
                setTimeout(generateLoop, 60 * 1000);
            }
        }

        // Start the first generation loop
        generateLoop();

    } catch (error) {
        console.error('Error in tweet generator:', error);
        
        // Retry the entire generator after 1 minute
        console.log('Restarting generator in 1 minute...');
        setTimeout(runTweetGenerator, 60 * 1000);
    }
}

// Start the generator
runTweetGenerator();

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down tweet generator...');
    process.exit();
});

// Keep the process running
process.stdin.resume();
