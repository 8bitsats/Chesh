import { config } from "../cheshireterminal/cheshire_the_bot/config.js";
import {
    emailHandler,
} from "../cheshireterminal/cheshire_the_bot/emailHandler.js";

async function startEmailBot() {
    console.log('\n=== Cheshire Email Bot ===');
    console.log('Email:', config.email.username);
    console.log('IMAP Server:', config.email.imapServer);
    console.log('SMTP Server:', config.email.smtpServer);

    // Initial connection test
    try {
        const connectionTest = await emailHandler.testConnection();
        if (!connectionTest) {
            console.error('Connection test failed. Please check credentials and try again.');
            process.exit(1);
        }
        console.log('Connection test successful');
    } catch (error) {
        console.error('Connection test failed:', error);
        process.exit(1);
    }

    // Start monitoring loop
    console.log('\nStarting email monitoring...');
    console.log(`Check interval: ${config.email.checkInterval / 1000} seconds`);

    async function checkEmails() {http://192.168.1.206:11434
        try {
            await emailHandler.processUnreadEmails();
        } catch (error) {
            console.error('Error processing emails:', error);
        }
    }

    // Initial check
    await checkEmails();

    // Set up interval for continuous monitoring
    setInterval(checkEmails, config.email.checkInterval);

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
        console.log('\nShutting down email bot...');
        try {
            await emailHandler.disconnect();
            console.log('Disconnected from email servers');
            process.exit(0);
        } catch (error) {
            console.error('Error during shutdown:', error);
            process.exit(1);
        }
    });
}

// Start the bot
console.log('Starting Cheshire Email Bot...');
startEmailBot().catch(error => {
    console.error('Failed to start email bot:', error);
    process.exit(1);
});
