// CSS Styles for AI Chat Demo - Fruit Shop & Admin Panel

export const stylesCSS = `/* === CSS Variables === */
:root {
    --primary: #22c55e;
    --primary-dark: #16a34a;
    --secondary: #f97316;
    --bg-dark: #0f172a;
    --bg-card: rgba(255, 255, 255, 0.05);
    --text-light: #f8fafc;
    --text-muted: #94a3b8;
    --border-color: rgba(255, 255, 255, 0.1);
    --shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    --glass: rgba(255, 255, 255, 0.1);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
    color: var(--text-light);
    min-height: 100vh;
    line-height: 1.6;
}

/* === Header === */
.header {
    background: var(--glass);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border-color);
    padding: 1rem 2rem;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
}

.header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.nav-links {
    display: flex;
    gap: 2rem;
    list-style: none;
}

.nav-links a {
    color: var(--text-muted);
    text-decoration: none;
    transition: color 0.3s;
}

.nav-links a:hover {
    color: var(--primary);
}

/* === Hero Section === */
.hero {
    padding: 8rem 2rem 4rem;
    text-align: center;
    max-width: 900px;
    margin: 0 auto;
}

.hero h1 {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #fff, var(--primary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.hero p {
    font-size: 1.25rem;
    color: var(--text-muted);
    margin-bottom: 2rem;
}

.cta-button {
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    color: white;
    padding: 1rem 2.5rem;
    border: none;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
}

.cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(34, 197, 94, 0.3);
}

/* === Products Grid === */
.products {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
}

.products h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
}

.product-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;
}

.product-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow);
}

.product-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
}

.product-info {
    padding: 1.5rem;
}

.product-info h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
}

.product-info p {
    color: var(--text-muted);
    font-size: 0.9rem;
    margin-bottom: 1rem;
}

.product-price {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary);
}

/* === Chatbox Widget === */
.chat-widget {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
}

.chat-toggle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 5px 30px rgba(34, 197, 94, 0.4);
    transition: transform 0.3s;
}

.chat-toggle:hover {
    transform: scale(1.1);
}

.chat-toggle svg {
    width: 28px;
    height: 28px;
    fill: white;
}

.chat-window {
    position: absolute;
    bottom: 80px;
    right: 0;
    width: 380px;
    height: 500px;
    background: var(--bg-dark);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    box-shadow: var(--shadow);
    display: none;
    flex-direction: column;
    overflow: hidden;
    animation: slideUp 0.3s ease;
}

.chat-window.open {
    display: flex;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.chat-header {
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.chat-header-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
}

.chat-header-info h4 {
    font-size: 1rem;
    font-weight: 600;
}

.chat-header-info span {
    font-size: 0.75rem;
    opacity: 0.8;
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.message {
    max-width: 80%;
    padding: 0.75rem 1rem;
    border-radius: 18px;
    font-size: 0.9rem;
    line-height: 1.4;
}

.message.bot {
    background: var(--glass);
    border: 1px solid var(--border-color);
    align-self: flex-start;
    border-bottom-left-radius: 4px;
}

.message.user {
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    align-self: flex-end;
    border-bottom-right-radius: 4px;
}

.typing-indicator {
    display: flex;
    gap: 4px;
    padding: 0.75rem 1rem;
    background: var(--glass);
    border: 1px solid var(--border-color);
    border-radius: 18px;
    align-self: flex-start;
    border-bottom-left-radius: 4px;
}

.typing-indicator span {
    width: 8px;
    height: 8px;
    background: var(--text-muted);
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
}

.chat-input-container {
    padding: 1rem;
    border-top: 1px solid var(--border-color);
    display: flex;
    gap: 0.5rem;
}

.chat-input {
    flex: 1;
    background: var(--glass);
    border: 1px solid var(--border-color);
    border-radius: 25px;
    padding: 0.75rem 1rem;
    color: var(--text-light);
    font-size: 0.9rem;
    outline: none;
}

.chat-input::placeholder {
    color: var(--text-muted);
}

.chat-send {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
}

.chat-send:hover {
    transform: scale(1.05);
}

.chat-send svg {
    width: 20px;
    height: 20px;
    fill: white;
}

/* === Admin Panel Styles === */
.admin-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 6rem 2rem 4rem;
}

.admin-header {
    text-align: center;
    margin-bottom: 3rem;
}

.admin-header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
}

.admin-header p {
    color: var(--text-muted);
}

.admin-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 2rem;
    margin-bottom: 2rem;
}

.admin-card h2 {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    font-size: 0.9rem;
    color: var(--text-muted);
    margin-bottom: 0.5rem;
}

.form-input {
    width: 100%;
    background: var(--glass);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    padding: 0.875rem 1rem;
    color: var(--text-light);
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.3s;
}

.form-input:focus {
    border-color: var(--primary);
}

.form-input::placeholder {
    color: var(--text-muted);
}

textarea.form-input {
    min-height: 200px;
    resize: vertical;
    font-family: inherit;
}

.btn {
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    color: white;
    padding: 0.875rem 2rem;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(34, 197, 94, 0.3);
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.btn-secondary {
    background: var(--glass);
    border: 1px solid var(--border-color);
}

.status-bar {
    background: var(--glass);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.5rem;
}

.status-item {
    text-align: center;
}

.status-item .value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary);
}

.status-item .label {
    font-size: 0.8rem;
    color: var(--text-muted);
}

.toast {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--primary);
    color: white;
    padding: 1rem 2rem;
    border-radius: 10px;
    box-shadow: var(--shadow);
    opacity: 0;
    transition: opacity 0.3s;
    z-index: 2000;
}

.toast.show {
    opacity: 1;
}

/* === Responsive === */
@media (max-width: 768px) {
    .hero h1 {
        font-size: 2.5rem;
    }
    
    .chat-window {
        width: calc(100vw - 40px);
        height: 60vh;
    }
    
    .nav-links {
        display: none;
    }
}
`;
