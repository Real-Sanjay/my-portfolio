document.addEventListener('DOMContentLoaded', function() {
    // Wait time for external scripts to load
    setTimeout(() => {
        initializeChatbot();
    }, 1000);
});

function initializeChatbot() {
    // Chatbot UI elements
    const chatbotBtn = document.getElementById('chatbotBtn');
    const chatbotModal = document.getElementById('chatbotModal');
    const closeChatbot = document.querySelector('.close-chatbot');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');

    // Gemini API Configuration
    const API_KEY = 'Your api key';
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    
    // Information about me
    const ABOUT_ME = `
  give your own about me  
    `;

    // Toggle chatbot modal
    chatbotBtn.addEventListener('click', function() {
        chatbotModal.classList.toggle('active');
    });

    closeChatbot.addEventListener('click', function() {
        chatbotModal.classList.remove('active');
    });

    // Send message function
    function sendMessage() {
        const message = chatbotInput.value.trim(); // Removes whitespace from the beginning and end of the input
        if (message === '') return;

        // Add user message to chat
        addMessage(message, 'chatbot-query');
        chatbotInput.value = '';

        // Shows typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'chatbot-message chatbot-response';
        typingIndicator.textContent = '...';
        typingIndicator.id = 'typingIndicator';
        chatbotMessages.appendChild(typingIndicator);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

        // Call Gemini API
        sendToGemini(message)
            .then(response => {
                // Remove typing indicator
                const indicator = document.getElementById('typingIndicator');
                if (indicator) indicator.remove();
                
                // Add response to chat
                addMessage(response, 'chatbot-response');
            })
            .catch(error => {
                console.error('Error:', error);
                const indicator = document.getElementById('typingIndicator');
                if (indicator) indicator.remove();
                addMessage("Sorry, I'm having trouble connecting to my knowledge base. Please try again later.", 'chatbot-response');
            });
    }

    // Send message on button click or Enter key
    sendMessageBtn.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Add message to chat 
    function addMessage(text, className) {
        const messageElement = document.createElement('div');
        messageElement.className = `chatbot-message ${className}`;
        messageElement.textContent = text;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Send message to Gemini API
    async function sendToGemini(message, retries = 3, delay = 1000) {
        try {
            const prompt = `${ABOUT_ME}\n\nUser: ${message}\nAssistant:`; // The prompt is the message that the user sends to the assistant
            
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-goog-api-key': API_KEY
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            const data = await response.json();
            
            if (data.candidates && data.candidates[0].content.parts[0].text) {
                return data.candidates[0].content.parts[0].text;
            } else if (data.error) {
                if (data.error.code === 429 && retries > 0) {
                    // If rate limited, wait and retry
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return sendToGemini(message, retries - 1, delay * 2);
                }
                console.error('API Error:', data.error);
                return "Sorry, the assistant is currently overloaded. Please try again later.";
            } else {
                console.error('Unexpected API response:', data);
                return "Sorry, I couldn't process that request.";
            }
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            return "Sorry, I'm having trouble connecting to the service.";
        }
    }
}