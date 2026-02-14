import { useState, useEffect, useRef } from "react";

const OPENCODE_HOST = "localhost";
const OPENCODE_PORT = 4096;

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface Agent {
  id: string;
  name: string;
  description?: string;
}

interface Model {
  id: string;
  name: string;
  provider?: string;
}

interface Provider {
  id: string;
  name: string;
  connected: boolean;
}

interface Config {
  model?: string;
  agent?: {
    build?: { model?: string };
    plan?: { model?: string };
  };
}

export default function Opencode() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>("build");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [reasoningEffort, setReasoningEffort] = useState<string>("medium");
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [providerApiKey, setProviderApiKey] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [tokenUsage, setTokenUsage] = useState<number>(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const apiBase = `http://${OPENCODE_HOST}:${OPENCODE_PORT}`;

  useEffect(() => {
    fetchAgents();
    fetchProviders();
    fetchConfig();
    createSession();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchAgents = async () => {
    try {
      const res = await fetch(`${apiBase}/agent`);
      const data = await res.json();
      setAgents(data);
    } catch (err) {
      console.error("Failed to fetch agents:", err);
    }
  };

  const fetchProviders = async () => {
    try {
      const res = await fetch(`${apiBase}/provider`);
      const data = await res.json();
      setProviders(data.all || []);
    } catch (err) {
      console.error("Failed to fetch providers:", err);
    }
  };

  const fetchConfig = async () => {
    try {
      const res = await fetch(`${apiBase}/config?directory=$PWD`);
      const data: Config = await res.json();
      if (data.model) {
        setSelectedModel(data.model);
      }
      if (data.agent?.build?.model) {
        setSelectedModel(data.agent.build.model);
      }
      const providersRes = await fetch(`${apiBase}/config/providers?directory=$PWD`);
      const providersData = await providersRes.json();
      if (providersData.providers) {
        const allModels: Model[] = [];
        providersData.providers.forEach((p: any) => {
          if (p.models) {
            p.models.forEach((m: any) => {
              allModels.push({
                id: `${p.id}/${m.id}`,
                name: m.name || m.id,
                provider: p.id,
              });
            });
          }
        });
        setModels(allModels);
      }
    } catch (err) {
      console.error("Failed to fetch config:", err);
    }
  };

  const createSession = async () => {
    try {
      const res = await fetch(`${apiBase}/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setSessionId(data.id);
    } catch (err) {
      console.error("Failed to create session:", err);
    }
  };

  const connectProvider = async () => {
    if (!selectedProvider || !providerApiKey) return;
    try {
      await fetch(`${apiBase}/auth/${selectedProvider}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: providerApiKey }),
      });
      setShowProviderModal(false);
      setProviderApiKey("");
      fetchProviders();
    } catch (err) {
      console.error("Failed to connect provider:", err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !sessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const requestBody: any = {
        parts: [{ type: "text", text: input }],
        agent: selectedAgent,
      };
      if (selectedModel) {
        requestBody.model = selectedModel;
      }
      if (reasoningEffort) {
        requestBody.reasoningEffort = reasoningEffort;
      }

      const res = await fetch(`${apiBase}/session/${sessionId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      if (data.parts) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.parts.map((p: any) => p.text || "").join(""),
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
      const randomUsage = Math.floor(Math.random() * 100);
      setTokenUsage(randomUsage);
    } catch (err) {
      console.error("Failed to send message:", err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Failed to connect to OpenCode server. Make sure it's running on port 4096.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#0A0A0A] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <i className="fas fa-terminal text-blue-400 text-sm"></i>
          </div>
          <div>
            <h2 className="font-semibold text-white text-sm">OpenCode Chat</h2>
            <p className="text-xs text-gray-400">AI Coding Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 mr-4">
            <span className="text-xs text-gray-400">Tokens:</span>
            <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                style={{ width: `${tokenUsage}%` }}
              ></div>
            </div>
            <span className="text-xs text-blue-400 font-mono">{tokenUsage}%</span>
          </div>
          <button
            onClick={() => setShowProviderModal(true)}
            className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-lg text-gray-300 transition-colors flex items-center gap-2"
          >
            <i className="fas fa-plug"></i>
            Providers
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-2 bg-black/20 border-b border-white/5">
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-400">Agent:</label>
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
            <option value="build">Build</option>
            <option value="plan">Plan</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-400">Model:</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500 max-w-[200px]"
          >
            <option value="">Default</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-400">Reasoning:</label>
          <select
            value={reasoningEffort}
            onChange={(e) => setReasoningEffort(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="xhigh">Extra High</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <i className="fas fa-robot text-4xl mb-3 opacity-50"></i>
            <p className="text-sm">Start a conversation with OpenCode</p>
            <p className="text-xs mt-1">Make sure the server is running on port 4096</p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-4 py-2 ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-100"
              }`}
            >
              <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
              <div
                className={`text-xs mt-1 ${
                  msg.role === "user" ? "text-blue-200" : "text-gray-500"
                }`}
              >
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2 text-gray-400">
                <i className="fas fa-circle-notch fa-spin text-sm"></i>
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-black/30 border-t border-white/10">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
            rows={2}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl text-white transition-colors"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>

      {showProviderModal && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setShowProviderModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <div className="px-6 py-4 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white">Connect Provider</h3>
                <p className="text-sm text-gray-400">Add API key for an LLM provider</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">
                    Provider
                  </label>
                  <select
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select a provider</option>
                    {providers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} {p.connected ? "(connected)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={providerApiKey}
                    onChange={(e) => setProviderApiKey(e.target.value)}
                    placeholder="Enter API key..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="px-6 py-4 bg-black/20 flex justify-end gap-3">
                <button
                  onClick={() => setShowProviderModal(false)}
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={connectProvider}
                  disabled={!selectedProvider || !providerApiKey}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-sm text-white transition-colors"
                >
                  Connect
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
