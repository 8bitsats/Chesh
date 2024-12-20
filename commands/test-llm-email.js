import {
    emailHandler,
} from "../cheshireterminal/cheshire_the_bot/emailHandler.js";

async function testLLMEmail() {
    try {
        // Test email data
        const testEmail = {
            subject: "Test Subject",
            from: "test@example.com",
            body: "Hello, this is a test email to verify the local LLM integration. Please respond with a brief acknowledgment."
        };

        console.log('Generating response using local LLM...');
        const response = await emailHandler.generateResponse(testEmail);
        console.log('\nGenerated Response:', response);

        // Save the response for review
        emailHandler.saveResponse(testEmail, response);
        
        // Uncomment the following lines to actually send the email
        // console.log('\nSending test email...');
        // await emailHandler.sendResponse(testEmail, response);
        // console.log('Test email sent successfully!');

    } catch (error) {
        console.error('Error during test:', error);
    }
}

console.log('Starting LLM email test...');
testLLMEmail().then(() => {
    console.log('\nTest completed.');
}).catch(error => {
    console.error('\nTest failed:', error);
});
