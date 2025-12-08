'use client';

import React, { useState, useEffect } from 'react';
import { Send, Zap, Brain, Code, BookOpen, Trash2, Copy, Download, History, Save, X, Plus, Edit2, Star, BarChart3 } from 'lucide-react';

export default function EnhancedDashboard() {
  const [selectedModel, setSelectedModel] = useState('gemini');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showSavedPrompts, setShowSavedPrompts] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [promptName, setPromptName] = useState('');
  const [stats, setStats] = useState({
    totalRequests: 0,
    apiCallsUsed: 45,
    tokensUsed: 1234,
    costEstimate: '$2.45'
  });

  // Load saved data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('chatHistory');
    const savedPrompts_ = localStorage.getItem('savedPrompts');
    if (saved) {
      try {
        setChatHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load chat history:', e);
      }
    }
    if (savedPrompts_) {
      try {
        setSavedPrompts(JSON.parse(savedPrompts_));
      } catch (e) {
        console.error('Failed to load saved prompts:', e);
      }
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Save prompts to localStorage
  useEffect(() => {
    localStorage.setItem('savedPrompts', JSON.stringify(savedPrompts));
  }, [savedPrompts]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    const userPrompt = prompt;
    
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('http://localhost:5000/api/v1/ai-models/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt: userPrompt,
          model: selectedModel
        })
      });

      const data = await res.json();
      const content = data.data?.content || data.error || 'No response received';
      
      setResponse(content);
      
      // Add to chat history
      const newEntry = {
        id: Date.now(),
        model: selectedModel,
        prompt: userPrompt,
        response: content,
        timestamp: new Date().toLocaleString(),
        rating: 0
      };
      setChatHistory([newEntry, ...chatHistory]);
      setPrompt('');
    } catch (err) {
      setResponse(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrompt = () => {
    if (!prompt.trim() || !promptName.trim()) return;
    
    const newSavedPrompt = {
      id: Date.now(),
      name: promptName,
      text: prompt,
      model: selectedModel,
      createdAt: new Date().toLocaleString(),
      uses: 0
    };
    
    setSavedPrompts([newSavedPrompt, ...savedPrompts]);
    setPromptName('');
    setShowSavePrompt(false);
  };

  const loadSavedPrompt = (savedPrompt) => {
    setPrompt(savedPrompt.text);
    setSelectedModel(savedPrompt.model);
    setShowSavedPrompts(false);
    
    // Update uses count
    setSavedPrompts(savedPrompts.map(sp => 
      sp.id === savedPrompt.id ? { ...sp, uses: sp.uses + 1 } : sp
    ));
  };

  const loadHistoryPrompt = (historyItem) => {
    setPrompt(historyItem.prompt);
    setSelectedModel(historyItem.model);
    setResponse(historyItem.response);
    setShowHistory(false);
  };

  const deleteChatEntry = (id) => {
    setChatHistory(chatHistory.filter(item => item.id !== id));
  };

  const deleteSavedPrompt = (id) => {
    setSavedPrompts(savedPrompts.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all chat history?')) {
      setChatHistory([]);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const downloadChat = () => {
    const content = chatHistory.map(item => 
      `[${item.timestamp}]\nModel: ${item.model}\nPrompt: ${item.prompt}\nResponse: ${item.response}\n\n`
    ).join('---\n\n');
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `chat-history-${Date.now()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Brain className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Assistant
            </h1>
          </div>
          <p className="text-slate-400">Multi-model AI experience with chat history and saved prompts</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Chat Section - Takes 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-6">
            {/* Model Selector */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
              <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Select AI Model
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'gemini', name: 'Gemini', icon: '✨' },
                  { id: 'openai', name: 'GPT-4', icon: '🤖' },
                  { id: 'claude', name: 'Claude', icon: '🧠' }
                ].map(model => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`p-3 rounded-lg transition-all font-medium text-sm ${
                      selectedModel === model.id
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 border border-purple-400 shadow-lg shadow-purple-500/50'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="block text-lg mb-1">{model.icon}</span>
                    {model.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Input */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
              <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Your Prompt
              </h3>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here... Ask anything!"
                className="w-full h-32 bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white/10 resize-none transition-all"
              />
              <div className="flex gap-3 mt-4 flex-wrap">
                <button
                  onClick={handleGenerate}
                  disabled={loading || !prompt.trim()}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                    loading || !prompt.trim()
                      ? 'bg-slate-600 cursor-not-allowed opacity-50'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Generating...' : 'Generate'}
                </button>
                <button
                  onClick={() => setShowSavePrompt(true)}
                  disabled={!prompt.trim()}
                  className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Response Display */}
            {response && (
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Response
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(response)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-all"
                      title="Copy response"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 max-h-64 overflow-y-auto text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                  {response}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Stats & Quick Actions */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
              <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Usage Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Total Requests</span>
                  <span className="font-bold text-blue-400">{chatHistory.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">API Calls</span>
                  <span className="font-bold text-purple-400">{stats.apiCallsUsed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Tokens Used</span>
                  <span className="font-bold text-cyan-400">{stats.tokensUsed}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-white/10">
                  <span className="text-slate-400 text-sm">Est. Cost</span>
                  <span className="font-bold text-green-400">{stats.costEstimate}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all space-y-3">
              <h3 className="text-sm font-semibold text-slate-300 mb-4">Quick Actions</h3>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left text-sm"
              >
                <History className="w-4 h-4" />
                Chat History ({chatHistory.length})
              </button>
              <button
                onClick={() => setShowSavedPrompts(!showSavedPrompts)}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left text-sm"
              >
                <BookOpen className="w-4 h-4" />
                Saved Prompts ({savedPrompts.length})
              </button>
              <button
                onClick={downloadChat}
                disabled={chatHistory.length === 0}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left text-sm disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Download Chat
              </button>
              <button
                onClick={clearHistory}
                disabled={chatHistory.length === 0}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/50 transition-all text-left text-sm text-red-400 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                Clear History
              </button>
            </div>
          </div>
        </div>

        {/* Chat History Modal */}
        {showHistory && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-white/20 rounded-xl w-full max-w-2xl max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Chat History
                </h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="divide-y divide-white/10">
                {chatHistory.length === 0 ? (
                  <div className="p-6 text-center text-slate-400">No chat history yet</div>
                ) : (
                  chatHistory.map(item => (
                    <div key={item.id} className="p-4 hover:bg-white/5 transition-all cursor-pointer group">
                      <div className="flex justify-between items-start gap-4">
                        <div
                          onClick={() => loadHistoryPrompt(item)}
                          className="flex-1 min-w-0"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">
                              {item.model}
                            </span>
                            <span className="text-xs text-slate-400">{item.timestamp}</span>
                          </div>
                          <p className="text-sm text-slate-300 line-clamp-2 font-medium">{item.prompt}</p>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.response}</p>
                        </div>
                        <button
                          onClick={() => deleteChatEntry(item.id)}
                          className="p-1 hover:bg-red-500/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Saved Prompts Modal */}
        {showSavedPrompts && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-white/20 rounded-xl w-full max-w-2xl max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Saved Prompts
                </h2>
                <button
                  onClick={() => setShowSavedPrompts(false)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="divide-y divide-white/10">
                {savedPrompts.length === 0 ? (
                  <div className="p-6 text-center text-slate-400">No saved prompts yet</div>
                ) : (
                  savedPrompts.map(item => (
                    <div key={item.id} className="p-4 hover:bg-white/5 transition-all group">
                      <div className="flex justify-between items-start gap-4">
                        <div
                          onClick={() => loadSavedPrompt(item)}
                          className="flex-1 min-w-0 cursor-pointer"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-sm text-white">{item.name}</h4>
                            <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
                              {item.model}
                            </span>
                          </div>
                          <p className="text-sm text-slate-400 line-clamp-2">{item.text}</p>
                          <p className="text-xs text-slate-500 mt-2">Used {item.uses} times • {item.createdAt}</p>
                        </div>
                        <button
                          onClick={() => deleteSavedPrompt(item.id)}
                          className="p-1 hover:bg-red-500/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Save Prompt Modal */}
        {showSavePrompt && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-white/20 rounded-xl w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-lg font-bold">Save Prompt</h2>
                <button
                  onClick={() => setShowSavePrompt(false)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Prompt Name
                  </label>
                  <input
                    type="text"
                    value={promptName}
                    onChange={(e) => setPromptName(e.target.value)}
                    placeholder="e.g., Code Review, Blog Post Outline..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSavePrompt}
                    disabled={!promptName.trim()}
                    className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowSavePrompt(false)}
                    className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
