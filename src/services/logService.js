// Logging service for chat interactions
const LOG_LEVELS = {
    INFO: 'INFO',
    ERROR: 'ERROR',
    WARNING: 'WARNING'
};

class LogService {
    constructor() {
        this.logs = [];
    }

    generateLogEntry(level, userId, type, content, error = null) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            userId,
            type,
            content,
            ...(error && { error: error.message || error })
        };

        // Store log in memory
        this.logs.push(logEntry);

        // Format log entry for console
        const formattedLog = `[${timestamp}] ${level} - User: ${userId} - ${type} - ${content}${error ? ` - Error: ${error}` : ''}`;
        
        // Log to console with appropriate level
        switch(level) {
            case LOG_LEVELS.ERROR:
                console.error(formattedLog);
                break;
            case LOG_LEVELS.WARNING:
                console.warn(formattedLog);
                break;
            default:
                console.log(formattedLog);
        }

        return logEntry;
    }

    logUserMessage(userId, message) {
        return this.generateLogEntry(LOG_LEVELS.INFO, userId, 'USER_MESSAGE', message);
    }

    logAIResponse(userId, response) {
        return this.generateLogEntry(LOG_LEVELS.INFO, userId, 'AI_RESPONSE', response);
    }

    logError(userId, error, context) {
        return this.generateLogEntry(LOG_LEVELS.ERROR, userId, 'ERROR', context, error);
    }

    getLogs() {
        return this.logs;
    }

    // Optional: Method to export logs to file (can be implemented later if needed)
    exportLogs() {
        // This could be implemented to save logs to a file or send to a server
        return JSON.stringify(this.logs, null, 2);
    }
}

// Create a singleton instance
const logService = new LogService();
export default logService; 