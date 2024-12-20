import { aiAgent } from "../cheshireterminal/cheshire_the_bot/aiAgent.js";

async function testAiAgent() {
    console.log('='.repeat(80));
    console.log('Testing Cheshire AI Agent');
    console.log('Time:', new Date().toLocaleString());
    console.log('='.repeat(80));

    try {
        // Test text generation
        console.log('\nTesting text generation...');
        const textPrompt = "Explain the importance of privacy in Solana's blockchain technology";
        const generatedText = await aiAgent.generateText(textPrompt);
        console.log('Generated text:', generatedText);

        // Test code generation
        console.log('\nTesting code generation...');
        const codePrompt = "Create a Solana program in Rust that implements a privacy-focused token with support for shielded transfers";
        const generatedCode = await aiAgent.generateCode(codePrompt);
        console.log('Generated code:', generatedCode);

        // Test image generation (with error handling)
        console.log('\nTesting image generation...');
        try {
            const imagePrompt = "A futuristic visualization of Solana's blockchain privacy technology";
            const imageResult = await aiAgent.generateImage(imagePrompt);
            console.log('Image generated:', imageResult);

            // Test image analysis if image generation succeeded
            if (imageResult && imageResult.filepath) {
                console.log('\nTesting image analysis...');
                const imageAnalysis = await aiAgent.analyzeImage(imageResult.filepath, "Analyze this technological visualization");
                console.log('Image analysis:', imageAnalysis);
            }
        } catch (imageError) {
            console.log('Image generation/analysis skipped:', imageError.message);
        }

        // Test smart contract analysis
        console.log('\nTesting smart contract analysis...');
        const sampleContract = `
            use anchor_lang::prelude::*;
            use anchor_spl::token::{self, Token};

            declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

            #[program]
            pub mod privacy_token {
                use super::*;

                pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
                    let vault = &mut ctx.accounts.vault;
                    vault.authority = ctx.accounts.authority.key();
                    Ok(())
                }

                pub fn shielded_transfer(ctx: Context<ShieldedTransfer>, amount: u64) -> Result<()> {
                    // Transfer implementation
                    Ok(())
                }
            }

            #[derive(Accounts)]
            pub struct Initialize<'info> {
                #[account(init, payer = authority, space = 8 + 32)]
                pub vault: Account<'info, Vault>,
                #[account(mut)]
                pub authority: Signer<'info>,
                pub system_program: Program<'info, System>,
            }

            #[account]
            pub struct Vault {
                pub authority: Pubkey,
            }
        `;
        const contractAnalysis = await aiAgent.analyzeSmartContract(sampleContract);
        console.log('Contract analysis:', contractAnalysis);

        // Test smart contract generation
        console.log('\nTesting smart contract generation...');
        const contractSpec = "Create a Solana program in Rust that implements a privacy-focused token using PDAs for shielded state and zk-proofs for private transfers";
        const generatedContract = await aiAgent.generateSmartContract(contractSpec);
        console.log('Generated contract:', generatedContract);

        // Test data retrieval
        console.log('\nTesting data retrieval...');
        const recentContent = await aiAgent.getGeneratedContent(null, 5);
        console.log('Recent generated content:', recentContent);

        const recentAnalyses = await aiAgent.getAnalysisResults(null, 5);
        console.log('Recent analyses:', recentAnalyses);

        const recentImages = await aiAgent.getGeneratedImages(5);
        console.log('Recent generated images:', recentImages);

        console.log('\nAll tests completed successfully!');
    } catch (error) {
        console.error('Error during testing:', error);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nReceived SIGINT signal');
    console.log('Shutting down AI agent...');
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

// Run the tests
console.log('Starting AI agent tests...');
testAiAgent().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
