const chatContainer = document.getElementById('chat');
const chatForm = document.getElementById('chatForm');
const questionInput = document.getElementById('question');
const sendButton = document.getElementById('sendButton');

let isLoading = false;

// Function to add a message to the chat
function addMessage(type, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'message-wrapper';

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = type === 'user' ? 'U' : '🤖';

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.innerHTML = formatMessage(content);

    messageWrapper.appendChild(avatar);
    messageWrapper.appendChild(messageContent);
    messageDiv.appendChild(messageWrapper);

    chatContainer.appendChild(messageDiv);
    scrollToBottom();

    return messageDiv;
}

// Function to add loading animation
function addLoadingMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai';
    messageDiv.id = 'loadingMessage';

    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'message-wrapper';

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = '🤖';

    const loading = document.createElement('div');
    loading.className = 'loading-message';
    loading.innerHTML = `
        <span class="loading-text">Thinking</span>
        <div class="loading-dots">
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
        </div>
    `;

    messageWrapper.appendChild(avatar);
    messageWrapper.appendChild(loading);
    messageDiv.appendChild(messageWrapper);

    chatContainer.appendChild(messageDiv);
    scrollToBottom();

    return messageDiv;
}

// Function to remove loading message
function removeLoadingMessage() {
    const loadingMsg = document.getElementById('loadingMessage');
    if (loadingMsg) {
        loadingMsg.remove();
    }
}

// Function to format message text
function formatMessage(text) {
    // Convert line breaks to <br>
    text = text.replace(/\n/g, '<br>');
    
    // Convert bold text **text** to <strong>
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert italic text *text* to <em>
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    return text;
}

// Function to show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    chatContainer.appendChild(errorDiv);
    scrollToBottom();
    
    // Remove error after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Function to scroll to bottom
function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Function to remove welcome card
function removeWelcomeCard() {
    const welcomeCard = document.querySelector('.welcome-card');
    if (welcomeCard) {
        welcomeCard.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            welcomeCard.remove();
        }, 300);
    }
}

// Main function to ask AI
async function askAI(question) {
    if (isLoading || !question.trim()) return;

    isLoading = true;
    sendButton.disabled = true;

    // Remove welcome card on first message
    removeWelcomeCard();

    // Add user message
    addMessage('user', question);

    // Clear input
    questionInput.value = '';

    // Add loading message
    addLoadingMessage();

    try {
        const response = await fetch('http://localhost:5000/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        // Remove loading message
        removeLoadingMessage();

        // Add AI response
        if (data.answer) {
            addMessage('ai', data.answer);
        } else {
            throw new Error('No answer received from server');
        }

    } catch (error) {
        console.error('Error:', error);
        removeLoadingMessage();
        
        let errorMessage = '❌ Sorry, I encountered an error. ';
        
        if (error.message.includes('fetch')) {
            errorMessage += 'Please make sure the server is running on http://localhost:5000';
        } else {
            errorMessage += error.message;
        }
        
        showError(errorMessage);
    } finally {
        isLoading = false;
        sendButton.disabled = false;
        questionInput.focus();
    }
}

// Function to set question from example chips
function askQuestion(question) {
    questionInput.value = question;
    questionInput.focus();
    // Optionally, you can auto-submit:
    // chatForm.dispatchEvent(new Event('submit'));
}

// Event listener for form submission
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const question = questionInput.value.trim();
    if (question) {
        askAI(question);
    }
});

// Allow Enter to send, Shift+Enter for new line
questionInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatForm.dispatchEvent(new Event('submit'));
    }
});

// Focus input on load
window.addEventListener('load', () => {
    questionInput.focus();
});

// Add CSS animation for fadeOut
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.95);
        }
    }
`;
document.head.appendChild(style);