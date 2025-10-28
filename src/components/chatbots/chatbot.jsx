import React, { useState, useEffect, useRef } from "react";
import { chatAI } from "../../services/chatCompletion";
import { checkOllamaStatus } from "../../config/llama";
import styles from "../../assets/styles/chatbots/chatbot.module.css";
import { toast } from 'react-toastify';

function Chatbot({ headline, servicePrompt }) {
    const [thoughtValue, setThoughtValue] = useState("");
    const [messages, setMessages] = useState([
        {
            role: "system",
            content: servicePrompt,
        },
    ]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [ollamaStatus, setOllamaStatus] = useState(null);
    const messagesEndRef = useRef(null);

    // Check Ollama status on component mount
    useEffect(() => {
        async function checkStatus() {
            try {
                const isRunning = await checkOllamaStatus();
                setOllamaStatus(isRunning);
                if (!isRunning) {
                    setError("Ollama service is not running. Please start Ollama and refresh the page.");
                    toast.error("Ollama service is not running. Please start Ollama and refresh the page.", {
                        position: "bottom-right",
                        autoClose: false,
                    });
                }
            } catch (err) {
                console.error("Error checking Ollama status:", err);
                setOllamaStatus(false);
            }
        }
        
        checkStatus();
    }, []);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            const messagesContainer = messagesEndRef.current.closest(`.${styles.messagesContainer}`);
            if (messagesContainer) {
                messagesContainer.scrollTo({
                    top: messagesContainer.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }
    };

    async function sendNewMessage(e) {
        e.preventDefault();

        if (!thoughtValue.trim()) {
            setError("Message cannot be empty");
            return;
        }

        if (ollamaStatus === false) {
            setError("Ollama service is not running. Please start Ollama and refresh the page.");
            toast.error("Ollama service is not running. Please start Ollama and refresh the page.", {
                position: "bottom-right",
                autoClose: false,
            });
            return;
        }

        try {
            const newMessage = {
                role: "user",
                content: thoughtValue.trim(),
            };

            setMessages((prevList) => [...prevList, newMessage]);
            setThoughtValue("");
            setError(null);
            setLoading(true);
            
            const response = await chatAI([...messages, newMessage]);
            
            if (response && response.content) {
                setMessages((prevMsgs) => [...prevMsgs, response]);
            } else {
                throw new Error("Failed to get a response from the AI");
            }
        } catch (error) {
            console.error("Chat error:", error);
            setError(error.message || "An error occurred while sending your message");
            toast.error(error.message || "An error occurred while sending your message", {
                position: "bottom-right",
                autoClose: 5000,
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className={styles.chatArea}>
            <h1 className={styles.ChatHeadline}>{headline}</h1>

            <div className={styles.messagesContainer}>
                {ollamaStatus === false && (
                    <div className={styles.ollamaWarning}>
                        <p>⚠️ Ollama service is not running. Please start Ollama and refresh the page.</p>
                        <p className={styles.ollamaHelp}>
                            To install Ollama, visit <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer">ollama.ai</a>
                        </p>
                        <p className={styles.ollamaHelp}>
                            After installation, run: <code>ollama pull llama2</code>
                        </p>
                    </div>
                )}
                {messages
                .filter((message) => message.role !== "system")
                .map((message, index) => (
                    <p
                        key={index}
                        className={`${styles.message} ${
                            message.role === "user"
                                ? styles.userMessage
                                : styles.aiMessage
                        }`}
                    >
                        {message.content}
                    </p>
                ))}
                {loading && (
                    <p className={`${styles.message} ${styles.aiMessage} ${styles.typingIndicator}`}>
                        AI Therapist is typing<span className={styles.dots}>...</span>
                    </p>
                )}
                <div ref={messagesEndRef} />
            </div>

            {error && <p className={styles.errorMessage}>{error}</p>}

            <form
                className={styles.messageInput}
                onSubmit={sendNewMessage}
            >
                <input
                    type="text"
                    placeholder="Enter Your Thoughts Here"
                    value={thoughtValue}
                    onChange={(e) => setThoughtValue(e.currentTarget.value)}
                    disabled={loading || ollamaStatus === false}
                />
                <input 
                    type="submit" 
                    value="Send" 
                    disabled={loading || ollamaStatus === false} 
                />
            </form>
        </section>
    );
}

export default Chatbot;
