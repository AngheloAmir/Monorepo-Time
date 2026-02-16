
const waitForOllama = `
echo "Waiting for local Ollama instance..."
# Loop until the tags endpoint returns a 200 OK (meaning server is up)
until curl -s -f http://localhost:11434/api/tags > /dev/null; do
    sleep 2
done
echo "Ollama is ready!"
`;

export const scriptContentStart = `#!/bin/bash
echo "Starting Ollama Service..."
docker compose up -d

${waitForOllama}

# Check if llama3 exists
if ! docker exec $(docker ps -qf "name=ollama") ollama list | grep -q "llama3"; then
    echo "Default model 'llama3' not found. Pulling now (this may take a while)..."
    docker exec -it $(docker ps -qf "name=ollama") ollama pull llama3
else
    echo "Default model 'llama3' is ready."
fi

echo "Service started successfully."
`;

export const scriptContentLlama3 = `#!/bin/bash
${waitForOllama}
echo "Pulling Llama 3 (8B)..."
docker exec -it $(docker ps -qf "name=ollama") ollama pull llama3
`;

export const scriptContentPhi3 = `#!/bin/bash
${waitForOllama}
echo "Pulling Phi-3 (3.8B)..."
docker exec -it $(docker ps -qf "name=ollama") ollama pull phi3
`;
