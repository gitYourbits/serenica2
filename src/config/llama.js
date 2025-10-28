// Ollama API configuration
export const OLLAMA_API_URL = 'http://localhost:11434/api/generate';

// Llama2 configuration
export const LLAMA_CONFIG = {
    model: 'llama2:latest',
    temperature: 0.7,
    top_p: 0.9,
    max_tokens: 2000,
    stop: ['</s>', 'Human:', 'Assistant:']
}; 

// Function to check if Ollama is running and the model is available
export async function checkOllamaStatus() {
    try {
        // First check if Ollama service is running
        const response = await fetch('http://localhost:11434/api/tags');
        if (!response.ok) {
            throw new Error('Ollama service is not running');
        }

        // Check if llama2 model is available
        const data = await response.json();
        const hasModel = data.models.some(model => model.name === 'llama2:latest');
        
        if (!hasModel) {
            throw new Error('Llama2 model not found in Ollama. Please run: ollama pull llama2:latest');
        }

        return true;
    } catch (error) {
        console.error('Ollama status check failed:', error);
        throw error;
    }
} 