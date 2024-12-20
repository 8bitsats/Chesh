import { promises as fs } from "fs";
import { join } from "path";

class ExoLabsService {
    constructor() {
        this.baseUrl = 'http://192.168.1.206:52415/v1';
        this.defaultModel = 'llama-3.2-1b';
    }

    async chat(message, options = {}) {
        try {
            const payload = {
                model: options.model || this.defaultModel,
                messages: [{ role: "user", content: message }],
                temperature: options.temperature || 0.7,
                max_tokens: options.max_tokens || 500,
                stream: false
            };

            console.log('Sending request:', JSON.stringify(payload, null, 2));

            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const responseText = await response.text();
            let responseData;
            
            try {
                responseData = JSON.parse(responseText);
            } catch (e) {
                console.log('Raw response:', responseText);
                throw new Error(`Invalid JSON response: ${responseText}`);
            }

            if (!response.ok) {
                const errorDetail = responseData.detail || JSON.stringify(responseData);
                throw new Error(`API request failed (${response.status}): ${errorDetail}`);
            }

            // Save response to log file
            await this.logResponse(message, responseData);
            
            return responseData;
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                throw new Error(`Failed to connect to Exo Labs cluster at ${this.baseUrl}. Is the server running?`);
            }
            console.error('Error communicating with Exo Labs cluster:', error);
            throw error;
        }
    }

    async logResponse(query, response) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            query,
            response,
        };

        const logPath = join(process.cwd(), 'cluster-logs.json');
        
        try {
            let logs = [];
            try {
                const existingLogs = await fs.readFile(logPath, 'utf8');
                logs = JSON.parse(existingLogs);
            } catch (error) {
                // File doesn't exist yet, start with empty array
            }

            logs.push(logEntry);
            await fs.writeFile(logPath, JSON.stringify(logs, null, 2));
        } catch (error) {
            console.error('Error logging response:', error);
        }
    }

    async getClusterStatus() {
        try {
            const response = await fetch(`${this.baseUrl}/models`);
            if (!response.ok) {
                throw new Error(`Failed to get cluster status: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                throw new Error(`Failed to connect to Exo Labs cluster at ${this.baseUrl}. Is the server running?`);
            }
            console.error('Error getting cluster status:', error);
            throw error;
        }
    }

    async getAvailableModels() {
        const status = await this.getClusterStatus();
        return status.filter(model => model.ready).map(model => model.id);
    }
}

export default new ExoLabsService();
