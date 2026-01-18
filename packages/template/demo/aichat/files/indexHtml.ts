// Landing page HTML - Fruit Shop with AI Chatbox

export const indexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FreshFruit - Premium Organic Fruits</title>
    <meta name="description" content="Fresh organic fruits delivered to your doorstep. Premium quality, farm-to-table freshness.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="header-content">
            <div class="logo">🍊 FreshFruit</div>
            <nav>
                <ul class="nav-links">
                    <li><a href="#products">Products</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
        <h1>Fresh Organic Fruits Delivered Daily</h1>
        <p>Experience the finest selection of farm-fresh fruits, handpicked and delivered straight to your doorstep. Taste the difference of truly organic produce.</p>
        <button class="cta-button">Shop Now</button>
    </section>

    <!-- Products Section -->
    <section class="products" id="products">
        <h2>Our Fresh Selection</h2>
        <div class="products-grid">
            <div class="product-card">
                <div class="product-image">🍎</div>
                <div class="product-info">
                    <h3>Organic Apples</h3>
                    <p>Crisp and sweet, straight from our partner orchards</p>
                    <span class="product-price">$4.99/lb</span>
                </div>
            </div>
            <div class="product-card">
                <div class="product-image">🍊</div>
                <div class="product-info">
                    <h3>Valencia Oranges</h3>
                    <p>Juicy and vitamin-packed, perfect for fresh juice</p>
                    <span class="product-price">$5.49/lb</span>
                </div>
            </div>
            <div class="product-card">
                <div class="product-image">🍇</div>
                <div class="product-info">
                    <h3>Premium Grapes</h3>
                    <p>Seedless and bursting with natural sweetness</p>
                    <span class="product-price">$6.99/lb</span>
                </div>
            </div>
            <div class="product-card">
                <div class="product-image">🥭</div>
                <div class="product-info">
                    <h3>Alphonso Mangoes</h3>
                    <p>The king of fruits, rich and aromatic</p>
                    <span class="product-price">$8.99/lb</span>
                </div>
            </div>
            <div class="product-card">
                <div class="product-image">🍓</div>
                <div class="product-info">
                    <h3>Fresh Strawberries</h3>
                    <p>Hand-picked at peak ripeness for maximum flavor</p>
                    <span class="product-price">$7.49/lb</span>
                </div>
            </div>
            <div class="product-card">
                <div class="product-image">🍌</div>
                <div class="product-info">
                    <h3>Organic Bananas</h3>
                    <p>Naturally ripened, perfect for smoothies</p>
                    <span class="product-price">$2.99/lb</span>
                </div>
            </div>
        </div>
    </section>

    <!-- Chat Widget -->
    <div class="chat-widget">
        <div class="chat-window" id="chatWindow">
            <div class="chat-header">
                <div class="chat-header-avatar">🍊</div>
                <div class="chat-header-info">
                    <h4>FreshFruit Support</h4>
                    <span>We typically reply instantly</span>
                </div>
            </div>
            <div class="chat-messages" id="chatMessages">
                <div class="message bot">
                    Hi! 👋 Welcome to FreshFruit! How can I help you today? I can answer questions about our products, delivery, or anything else!
                </div>
            </div>
            <div class="chat-input-container">
                <input type="text" class="chat-input" id="chatInput" placeholder="Type your message..." autocomplete="off">
                <button class="chat-send" id="chatSend">
                    <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
            </div>
        </div>
        <button class="chat-toggle" id="chatToggle">
            <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
        </button>
    </div>

    <script>
        // Chat Widget Functionality
        const chatToggle = document.getElementById('chatToggle');
        const chatWindow = document.getElementById('chatWindow');
        const chatInput = document.getElementById('chatInput');
        const chatSend = document.getElementById('chatSend');
        const chatMessages = document.getElementById('chatMessages');

        // Toggle chat window
        chatToggle.addEventListener('click', () => {
            chatWindow.classList.toggle('open');
            if (chatWindow.classList.contains('open')) {
                chatInput.focus();
            }
        });

        // Send message function
        async function sendMessage() {
            const message = chatInput.value.trim();
            if (!message) return;

            // Add user message
            addMessage(message, 'user');
            chatInput.value = '';

            // Show typing indicator
            const typingEl = showTyping();

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message })
                });

                const data = await response.json();
                typingEl.remove();

                if (data.reply) {
                    addMessage(data.reply, 'bot');
                } else {
                    addMessage('Sorry, I encountered an error. Please try again.', 'bot');
                }
            } catch (error) {
                typingEl.remove();
                addMessage('Sorry, I\\'m having trouble connecting. Please try again later.', 'bot');
            }
        }

        // Add message to chat
        function addMessage(text, type) {
            const messageEl = document.createElement('div');
            messageEl.className = 'message ' + type;
            messageEl.textContent = text;
            chatMessages.appendChild(messageEl);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Show typing indicator
        function showTyping() {
            const typingEl = document.createElement('div');
            typingEl.className = 'typing-indicator';
            typingEl.innerHTML = '<span></span><span></span><span></span>';
            chatMessages.appendChild(typingEl);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            return typingEl;
        }

        // Event listeners
        chatSend.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    </script>
</body>
</html>
`;
