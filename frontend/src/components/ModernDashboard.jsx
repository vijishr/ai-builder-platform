import React, { useState, useEffect } from 'react';
import { ChevronRight, Zap, Code, Sparkles, ArrowRight, BarChart3, Settings, Bell, User } from 'lucide-react';

export default function ModernDashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    publishedProjects: 0,
    totalVisitors: 0,
    totalSales: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState('gemini');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalProjects: 24,
        publishedProjects: 18,
        totalVisitors: 3420,
        totalSales: 8500
      });
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setGenerating(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('http://localhost:5000/api/v1/ai-models/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt,
          model: selectedModel
        })
      });
      
      const data = await res.json();
      setResponse(data.data?.content || data.error || 'No response');
    } catch (err) {
      setResponse(`Error: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const models = [
    { id: 'gemini', name: 'Gemini', icon: Sparkles, color: 'from-blue-500 to-cyan-500' },
    { id: 'claude', name: 'Claude', icon: Zap, color: 'from-purple-500 to-pink-500' },
    { id: 'openai', name: 'OpenAI', icon: Code, color: 'from-green-500 to-emerald-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-lg">
              AI
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              AI Builder
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-800 rounded-lg transition">
              <Bell size={20} />
            </button>
            <button className="p-2 hover:bg-slate-800 rounded-lg transition">
              <Settings size={20} />
            </button>
            <button className="p-2 hover:bg-slate-800 rounded-lg transition">
              <User size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-16">
          <h2 className="text-5xl font-bold mb-4">
            Welcome back, <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Creator</span>
          </h2>
          <p className="text-xl text-slate-400">
            Your AI-powered platform for building, creating, and deploying amazing projects
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Projects', value: stats.totalProjects, icon: Code, color: 'from-blue-500 to-blue-600' },
            { label: 'Published', value: stats.publishedProjects, icon: Zap, color: 'from-green-500 to-emerald-600' },
            { label: 'Visitors', value: stats.totalVisitors.toLocaleString(), icon: BarChart3, color: 'from-purple-500 to-pink-600' },
            { label: 'Revenue', value: `$${stats.totalSales}`, icon: ArrowRight, color: 'from-orange-500 to-red-600' }
          ].map((stat, idx) => (
            <div key={idx} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm hover:border-slate-600 transition">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                  <stat.icon size={24} />
                </div>
                <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* AI Generator Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* AI Models */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sparkles size={20} className="text-blue-400" />
                AI Models
              </h3>
              <div className="space-y-3">
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`w-full p-3 rounded-lg border transition ${
                      selectedModel === model.id
                        ? `border-cyan-500 bg-gradient-to-r ${model.color} text-white`
                        : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <model.icon size={18} />
                      <span>{model.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Prompt Input */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm h-full">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Code size={20} className="text-green-400" />
                Generate Content
              </h3>
              <div className="space-y-4">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask me anything... 'Create a React component for a login form'"
                  className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-4 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none resize-none"
                />
                <button
                  onClick={handleGenerate}
                  disabled={generating || !prompt.trim()}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
                >
                  {generating ? (
                    <>
                      <div className="animate-spin">⚙️</div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap size={20} />
                      Generate
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Response Section */}
        {response && (
          <div className="mb-12">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-bold mb-4">Response</h3>
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-300 max-h-96 overflow-y-auto">
                {response}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: '📁 My Projects', desc: 'View and manage your projects', color: 'from-blue-500 to-blue-600' },
            { title: '🚀 Deploy', desc: 'Deploy your creations to production', color: 'from-green-500 to-emerald-600' },
            { title: '📊 Analytics', desc: 'Track your performance metrics', color: 'from-purple-500 to-pink-600' }
          ].map((action, idx) => (
            <button
              key={idx}
              className="group relative bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition text-left"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${action.color} rounded-xl opacity-0 group-hover:opacity-10 transition`}></div>
              <h4 className="text-lg font-bold mb-2 relative">{action.title}</h4>
              <p className="text-slate-400 text-sm mb-4 relative">{action.desc}</p>
              <div className="flex items-center gap-2 text-blue-400 font-semibold relative group-hover:gap-3 transition">
                Start Now <ChevronRight size={18} />
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
