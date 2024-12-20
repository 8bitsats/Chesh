import {
    codeAnalyzer,
} from "../cheshireterminal/cheshire_the_bot/codeAnalyzer.js";

// Test code analysis
const sampleCode = `
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
`;

async function runTests() {
    try {
        // Test 0: Check Available Models
        console.log('\n=== Checking Available Models ===');
        try {
            const models = await codeAnalyzer.getAvailableModels();
            console.log('Available models:', models);
        } catch (error) {
            console.error('Failed to get models:', error.message);
        }

        // Test 1: Code Analysis
        console.log('\n=== Testing Code Analysis ===');
        try {
            const codeAnalysis = await codeAnalyzer.analyzeCode(sampleCode);
            console.log('Analysis successful. Result:', codeAnalysis);
        } catch (error) {
            console.error('Code analysis failed:', error.message);
        }

        // Test 2: Code Completion
        console.log('\n=== Testing Code Completion ===');
        try {
            const completedCode = await codeAnalyzer.generateCode(
                "Add two numbers and return the result",
                "def add_numbers(a, b):\n    ",
                "\n    return result"
            );
            console.log('Completion successful. Result:', completedCode);
        } catch (error) {
            console.error('Code completion failed:', error.message);
        }

        // Test 3: Chat-based Code Generation
        console.log('\n=== Testing Chat-based Code Generation ===');
        try {
            const chatPrompt = "Write a Python function that implements binary search algorithm. Include comments explaining the code.";
            const generatedCode = await codeAnalyzer.generateCodeWithChat(chatPrompt);
            console.log('Generation successful. Result:', generatedCode);
        } catch (error) {
            console.error('Chat-based generation failed:', error.message);
        }

    } catch (error) {
        console.error('Test suite failed:', error.message);
    }
}

// Run the tests
console.log('Starting AI capability tests with local LM Studio...');
runTests().then(() => {
    console.log('\nAll tests completed.');
}).catch(error => {
    console.error('\nTest suite encountered an error:', error.message);
});
