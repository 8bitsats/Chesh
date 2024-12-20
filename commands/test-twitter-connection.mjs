import { TwitterApi } from 'twitter-api-v2';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory name of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env file
dotenv.config({ path: join(__dirname, '..', '.env') });

async function testConnection() {
    console.log('='.repeat(80));
    console.log('Twitter API Connection Test');
    console.log('Time:', new Date().toLocaleString());
    console.log('='.repeat(80));
    
    try {
        // Verify environment variables
        console.log('\nChecking environment variables...');
        const requiredVars = [
            'TWITTER_API_KEY',
            'TWITTER_API_KEY_SECRET',
            'TWITTER_ACCESS_TOKEN',
            'TWITTER_ACCESS_TOKEN_SECRET'
        ];
        
        for (const varName of requiredVars) {
            if (!process.env[varName]) {
                throw new Error(`Missing required environment variable: ${varName}`);
            }
            console.log(`✓ ${varName} is set`);
        }

        // Initialize Twitter client
        console.log('\nInitializing Twitter client...');
        const client = new TwitterApi({
            appKey: process.env.TWITTER_API_KEY,
            appSecret: process.env.TWITTER_API_KEY_SECRET,
            accessToken: process.env.TWITTER_ACCESS_TOKEN,
            accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
        });

        // Test authentication
        console.log('\nTesting authentication...');
        const me = await client.v2.me();
        console.log('Successfully authenticated as:', {
            username: me.data.username,
            name: me.data.name,
            id: me.data.id
        });
        
        // Check rate limits
        console.log('\nChecking rate limits...');
        try {
            // Try to post a test tweet to check rate limits
            await client.v2.tweet('Test tweet (will be deleted)').catch(async error => {
                if (error.code === 429) {
                    console.log('\nRate limit status:', {
                        userLimit: error.rateLimit?.day?.limit || 'unknown',
                        userRemaining: error.rateLimit?.day?.remaining || 'unknown',
                        resetTime: error.rateLimit?.reset ? 
                            new Date(error.rateLimit.reset * 1000).toLocaleString() : 
                            'unknown'
                    });
                }
                throw error;
            });
        } catch (error) {
            if (error.code === 429) {
                console.log('✓ Rate limit information retrieved');
            } else {
                throw error;
            }
        }

        console.log('\nConnection test completed successfully');

    } catch (error) {
        console.error('\nError during connection test:', {
            name: error.name,
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        process.exit(1);
    }
}

// Run the test
console.log('Starting Twitter API connection test...');
testConnection().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
