const chatMessages = document.getElementById('chatMessages');
const questionInput = document.getElementById('questionInput');
const typingIndicator = document.getElementById('typingIndicator');

async function askQuestion() {
    const question = questionInput.value.trim();
    
    if (!question) {
        alert('Please enter a question!');
        return;
    }

    // Add user message to chat
    addMessage(question, 'user');
    questionInput.value = '';
    
    // Show typing indicator
    typingIndicator.style.display = 'block';
    
    try {
        const response = await fetch('http://localhost:3000/api/chatbot/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question })
        });
        
        const data = await response.json();
        
        // Hide typing indicator
        typingIndicator.style.display = 'none';
        
        if (response.ok) {
            addMessage(data.answer, 'ai');
        } else {
            addMessage('Sorry, I encountered an error: ' + data.error, 'ai');
        }
    } catch (error) {
        typingIndicator.style.display = 'none';
        addMessage('Sorry, I could not connect to the server. Please make sure the backend is running.', 'ai');
        console.error('Error:', error);
    }
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}