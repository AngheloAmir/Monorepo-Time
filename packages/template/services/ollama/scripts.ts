
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

# Check if model exists
if docker exec $(docker ps -qf "name=ollama") ollama list | grep -q "qwen2.5:7b"; then
    echo "Default model 'qwen2.5:7b' is ready."
else
    echo "Default model 'qwen2.5:7b' not found locally."
    echo "Pulling from registry (this may take a while, please wait)..."
    docker exec -it $(docker ps -qf "name=ollama") ollama pull qwen2.5:7b
fi

echo "Service started successfully."
`;

export const scriptContentQwen = `#!/bin/bash
${waitForOllama}
echo "Pulling Qwen 2.5 (7B)..."
docker exec -it $(docker ps -qf "name=ollama") ollama pull qwen2.5:7b
`;

export const scriptContentPhi3 = `#!/bin/bash
${waitForOllama}
echo "Pulling Phi-3 (3.8B)..."
docker exec -it $(docker ps -qf "name=ollama") ollama pull phi3
`;
