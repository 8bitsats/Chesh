import { config } from "../cheshireterminal/cheshire_the_bot/config.js";
import {
    emailHandler,
} from "../cheshireterminal/cheshire_the_bot/emailHandler.js";

async function testEmailFunctionality() {
    try {
        console.log('\n=== Email Configuration ===');
        console.log('Email:', config.email.username);
        console.log('IMAP Server:', config.email.imapServer);
        console.log('IMAP Port:', config.email.imapPort);
        console.log('SMTP Server:', config.email.smtpServer);
        console.log('SMTP Port:', config.email.smtpPort);

        console.log('\n=== Testing Connections ===');
        const connectionTest = await emailHandler.testConnection();
        if (!connectionTest) {
            console.error('Connection test failed. Aborting further tests.');
            return;
        }

        console.log('\n=== Testing Email Operations ===');

        // Test 1: List unread emails
        console.log('\nTesting: List Unread Emails');
        try {
            const unreadEmails = await emailHandler.listUnreadEmails();
            console.log(`Found ${unreadEmails.length} unread emails`);
            
            if (unreadEmails.length > 0) {
                // Test 2: Get content of first unread email
                console.log('\nTesting: Get Email Content');
                const email = await emailHandler.getEmailContent(unreadEmails[0]);
                console.log('Email details:');
                console.log('- Subject:', email.subject);
                console.log('- From:', email.from);
                console.log('- Date:', email.date);
                console.log('- Preview:', email.body.substring(0, 100) + '...');

                // Test 3: Generate response using local LLama model
                console.log('\nTesting: Generate Response with LLama');
                const response = await emailHandler.generateResponse(email);
                console.log('Generated response preview:', response.substring(0, 200) + '...');

                // Test 4: Send response (optional)
                console.log('\nTesting: Send Response');
                const shouldSend = false; // Set to true to actually send the email
                if (shouldSend) {
                    await emailHandler.sendResponse(email, response);
                    console.log('Response sent successfully');
                } else {
                    console.log('Skipping send (shouldSend is false)');
                    // Save the response anyway for review
                    emailHandler.saveResponse(email, response);
                }
            } else {
                console.log('No unread emails found to test with');
            }

        } catch (error) {
            console.error('Error during email operations:', error);
            console.error('Error details:', error.message);
            if (error.stack) console.error('Stack trace:', error.stack);
        }

    } catch (error) {
        console.error('Test suite failed:', error);
        console.error('Error details:', error.message);
        if (error.stack) console.error('Stack trace:', error.stack);
    }
}

// Run the tests
console.log('Starting email handler tests...');

testEmailFunctionality().then(() => {
    console.log('\nAll tests completed.');
}).catch(error => {
    console.error('\nTest suite encountered an error:', error);
    console.error('Error details:', error.message);
    if (error.stack) console.error('Stack trace:', error.stack);
});
