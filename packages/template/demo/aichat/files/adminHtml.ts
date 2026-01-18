// Admin Panel HTML for AI Chat Configuration

export const adminHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - AI Chat Configuration</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <header class="header">
        <div class="header-content">
            <div class="logo">🍊 FreshFruit Admin</div>
            <nav>
                <ul class="nav-links">
                    <li><a href="/">View Store</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <div class="admin-container">
        <div class="admin-header">
            <h1>AI Chat Configuration</h1>
            <p>Configure your AI provider and embed FAQ knowledge for customer support</p>
        </div>

        <!-- AI Provider Configuration -->
        <div class="admin-card">
            <h2>🔑 AI Provider Settings</h2>
            <form id="configForm">
                <div class="form-group">
                    <label for="apiKey">API Key</label>
                    <input type="password" class="form-input" id="apiKey" placeholder="sk-..." autocomplete="off">
                </div>
                <div class="form-group">
                    <label for="providerUrl">Chat Completions URL</label>
                    <input type="text" class="form-input" id="providerUrl" placeholder="https://api.openai.com/v1/chat/completions">
                </div>
                <div class="form-group">
                    <label for="embeddingsUrl">Embeddings URL</label>
                    <input type="text" class="form-input" id="embeddingsUrl" placeholder="https://api.openai.com/v1/embeddings">
                </div>
                <div class="form-group">
                    <label for="model">Chat Model</label>
                    <input type="text" class="form-input" id="model" placeholder="gpt-3.5-turbo">
                </div>
                <div class="form-group">
                    <label for="embeddingsModel">Embeddings Model</label>
                    <input type="text" class="form-input" id="embeddingsModel" placeholder="text-embedding-3-small">
                </div>
                <button type="submit" class="btn">💾 Save Configuration</button>
            </form>
        </div>

        <!-- Knowledge Base Embedding -->
        <div class="admin-card">
            <h2>📚 Knowledge Base</h2>
            <p style="color: var(--text-muted); margin-bottom: 1.5rem;">
                Enter your FAQ content below. Each paragraph will be embedded and used to answer customer questions.
            </p>
            <form id="embedForm">
                <div class="form-group">
                    <label for="faqContent">FAQ Content</label>
                    <textarea class="form-input" id="faqContent" placeholder="Enter your FAQ content here...

Example:
Q: What are your delivery hours?
A: We deliver from 8 AM to 8 PM, Monday through Saturday.

Q: How do I return a product?
A: You can return any product within 24 hours of delivery if you're not satisfied. Contact our support team.

Q: Do you offer organic certification?
A: Yes, all our products are certified organic by USDA."></textarea>
                </div>
                <button type="submit" class="btn" id="embedBtn">🔮 Embed Knowledge</button>
            </form>
            <div class="status-bar">
                <div class="status-item">
                    <div class="value" id="embeddingCount">0</div>
                    <div class="label">Embeddings</div>
                </div>
                <div class="status-item">
                    <div class="value" id="lastUpdated">Never</div>
                    <div class="label">Last Updated</div>
                </div>
                <div class="status-item">
                    <div class="value" id="configStatus">❌</div>
                    <div class="label">API Configured</div>
                </div>
            </div>
        </div>

        <!-- Clear Data -->
        <div class="admin-card">
            <h2>🗑️ Data Management</h2>
            <p style="color: var(--text-muted); margin-bottom: 1.5rem;">
                Clear all embeddings to start fresh or to re-embed with new content.
            </p>
            <button class="btn btn-secondary" id="clearBtn">Clear All Embeddings</button>
        </div>
    </div>

    <div class="toast" id="toast"></div>

    <script>
        // Toast notification
        function showToast(message, duration = 3000) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), duration);
        }

        // Load configuration on page load
        async function loadConfig() {
            try {
                const response = await fetch('/api/config');
                const data = await response.json();
                
                if (data.config) {
                    document.getElementById('apiKey').value = data.config.apiKey || '';
                    document.getElementById('providerUrl').value = data.config.providerUrl || 'https://api.openai.com/v1/chat/completions';
                    document.getElementById('embeddingsUrl').value = data.config.embeddingsUrl || 'https://api.openai.com/v1/embeddings';
                    document.getElementById('model').value = data.config.model || 'gpt-3.5-turbo';
                    document.getElementById('embeddingsModel').value = data.config.embeddingsModel || 'text-embedding-3-small';
                }
                
                document.getElementById('embeddingCount').textContent = data.embeddingCount || 0;
                document.getElementById('lastUpdated').textContent = data.lastUpdated || 'Never';
                document.getElementById('configStatus').textContent = data.config?.apiKey ? '✅' : '❌';
            } catch (error) {
                console.error('Failed to load config:', error);
            }
        }

        // Save configuration
        document.getElementById('configForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const config = {
                apiKey: document.getElementById('apiKey').value,
                providerUrl: document.getElementById('providerUrl').value,
                embeddingsUrl: document.getElementById('embeddingsUrl').value,
                model: document.getElementById('model').value,
                embeddingsModel: document.getElementById('embeddingsModel').value
            };

            try {
                const response = await fetch('/api/config', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(config)
                });
                
                if (response.ok) {
                    showToast('✅ Configuration saved successfully!');
                    document.getElementById('configStatus').textContent = config.apiKey ? '✅' : '❌';
                } else {
                    showToast('❌ Failed to save configuration');
                }
            } catch (error) {
                showToast('❌ Error saving configuration');
            }
        });

        // Embed knowledge
        document.getElementById('embedForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const content = document.getElementById('faqContent').value.trim();
            if (!content) {
                showToast('⚠️ Please enter some content to embed');
                return;
            }

            const embedBtn = document.getElementById('embedBtn');
            embedBtn.disabled = true;
            embedBtn.textContent = '⏳ Embedding...';

            try {
                const response = await fetch('/api/embed', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    showToast('✅ ' + (data.message || 'Content embedded successfully!'));
                    document.getElementById('embeddingCount').textContent = data.count || 0;
                    document.getElementById('lastUpdated').textContent = new Date().toLocaleString();
                    document.getElementById('faqContent').value = '';
                } else {
                    showToast('❌ ' + (data.error || 'Failed to embed content'));
                }
            } catch (error) {
                showToast('❌ Error embedding content');
            } finally {
                embedBtn.disabled = false;
                embedBtn.textContent = '🔮 Embed Knowledge';
            }
        });

        // Clear embeddings
        document.getElementById('clearBtn').addEventListener('click', async () => {
            if (!confirm('Are you sure you want to clear all embeddings?')) return;

            try {
                const response = await fetch('/api/embed', {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    showToast('✅ All embeddings cleared');
                    document.getElementById('embeddingCount').textContent = '0';
                } else {
                    showToast('❌ Failed to clear embeddings');
                }
            } catch (error) {
                showToast('❌ Error clearing embeddings');
            }
        });

        // Load config on page load
        loadConfig();
    </script>
</body>
</html>
`;
