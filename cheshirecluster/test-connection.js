import exoService from "./exo-service.js";

// Helper function to add delay between requests
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function testExoLabsConnection() {
    try {
        console.log('Testing connection to Exo Labs cluster...\n');
        
        // Test cluster status and get available models
        console.log('Checking cluster status...');
        const models = await exoService.getAvailableModels();
        console.log('Available models:', models);

        // Wait a bit before making the chat request
        await delay(1000);

        // Try with dummy model first
        console.log('\nTesting chat completion with dummy model...');
        try {
            const response = await exoService.chat(
                'What is the meaning of exo? Please provide a brief explanation.',
                {
                    model: 'dummy',
                    temperature: 0.7,
                    max_tokens: 100
                }
            );
            
            console.log('\nChat Response:');
            if (response.choices && response.choices.length > 0) {
                console.log('Message:', response.choices[0].message?.content || 'No content');
            } else {
                console.log('Raw response:', JSON.stringify(response, null, 2));
            }

            // Log success details
            console.log('\nRequest succeeded!');
            console.log('Model used:', 'dummy');
            console.log('Response status:', response.status || 'N/A');
            console.log('Total tokens:', response.usage?.total_tokens || 'N/A');

        } catch (error) {
            console.error('Chat test failed:', error.message);
            console.error('Full error:', error);
            
            // Try with a different model if dummy fails
            if (models.includes('llama-3.2-1b')) {
                console.log('\nTrying with llama-3.2-1b instead...');
                try {
                    const response = await exoService.chat(
                        'What is the meaning of exo? Please provide a brief explanation.',
                        {
                            model: 'llama-3.2-1b',
                            temperature: 0.7,
                            max_tokens: 100
                        }
                    );
                    
                    console.log('\nChat Response (Llama):');
                    if (response.choices && response.choices.length > 0) {
                        console.log('Message:', response.choices[0].message?.content || 'No content');
                    } else {
                        console.log('Raw response:', JSON.stringify(response, null, 2));
                    }
                } catch (llamaError) {
                    console.error('Llama test failed:', llamaError.message);
                }
            }
        }

        console.log('\nConnection test completed!');
    } catch (error) {
        console.error('Test failed:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
}

testExoLabsConnection();
