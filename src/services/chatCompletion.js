import { OLLAMA_API_URL, LLAMA_CONFIG, checkOllamaStatus } from '../config/llama';
import logService from './logService';

export async function chatAI(messages, userId = 'anonymous') {
    // Log the user's message (last message in the array)
    const userMessage = messages[messages.length - 1];
    logService.logUserMessage(userId, userMessage.content);

    try {
        // Format messages for Ollama API - convert them to a text prompt
        const systemMessage = messages.find(msg => msg.role === 'system')?.content || '';
        
        // Format the conversation history
        const conversationHistory = messages
            .filter(msg => msg.role !== 'system')
            .map(msg => `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`)
            .join('\n');
            
        // Construct the final prompt with system instructions and conversation
        const prompt = `${systemMessage}\n\n${conversationHistory}\nAssistant:`;

        const response = await fetch(OLLAMA_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: LLAMA_CONFIG.model,
                prompt: prompt,
                temperature: LLAMA_CONFIG.temperature,
                top_p: LLAMA_CONFIG.top_p,
                max_tokens: LLAMA_CONFIG.max_tokens,
                stop: LLAMA_CONFIG.stop
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Ollama returns a streaming response, so we need to handle it differently
        const reader = response.body.getReader();
        let aiResponseText = '';
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            // Convert the chunk to text
            const chunk = new TextDecoder().decode(value);
            
            // Process each line in the chunk
            const lines = chunk.split('\n');
            for (const line of lines) {
                if (line.trim() === '') continue;
                
                try {
                    const data = JSON.parse(line);
                    if (data.response) {
                        aiResponseText += data.response;
                    }
                } catch (e) {
                    console.warn('Error parsing JSON from Ollama:', e);
                }
            }
        }

        if (!aiResponseText) {
            throw new Error('Invalid response format from AI');
        }

        const aiResponse = {
            role: 'assistant',
            content: aiResponseText.trim()
        };

        // Log the AI's response
        logService.logAIResponse(userId, aiResponse.content);

        return aiResponse;
    } catch (error) {
        // Check if the error is related to Ollama connection
        const isOllamaRunning = await checkOllamaStatus();
        const errorMessage = !isOllamaRunning 
            ? 'Ollama service is not running. Please start Ollama and refresh the page.'
            : error.message || 'Failed to get response from AI';
            
        // Log any errors that occur
        logService.logError(userId, error, 'Error in chatAI function');
        console.error('Error in chatAI:', error);
        throw new Error(errorMessage);
    }
}