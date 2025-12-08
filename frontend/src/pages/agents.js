import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../services/api';

export default function Agents() {
  const router = useRouter();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewAgent, setShowNewAgent] = useState(false);
  const [newAgentData, setNewAgentData] = useState({
    name: '',
    description: '',
    type: 'content'
  });
  const [running, setRunning] = useState(null);
  const [runDetail, setRunDetail] = useState(null);
  const [creatingAgent, setCreatingAgent] = useState(false);
  const [deletingAgent, setDeletingAgent] = useState(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/ai/agents', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      const data = await response.json();
      setAgents(data.data || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'starting':
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleAutoRun = async (agentId) => {
    try {
      setRunning(agentId);
      setRunDetail({ status: 'starting', logs: ['Initializing agent run...'] });

      const res = await api.post(`/ai/agents/${agentId}/auto-run`, { 
        prompt: 'Auto-run initiated from UI'
      });
      const run = res.data.data;
      setRunDetail(run);

      const runId = run.id;
      const token = localStorage.getItem('accessToken');

      // Use SSE for live logs
      const eventSource = new EventSource(
        `/api/v1/ai/agents/${agentId}/runs/${runId}/stream`,
        { withCredentials: false }
      );

      // Add auth header via fallback polling if SSE doesn't support headers
      const headers = new Headers();
      headers.set('Authorization', `Bearer ${token}`);
      const sseUrl = `http://localhost:5000/api/v1/ai/agents/${agentId}/runs/${runId}/stream`;

      const eventSourceWithAuth = new EventSource(sseUrl);

      eventSourceWithAuth.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          if (message.type === 'logs') {
            setRunDetail(prev => ({
              ...prev,
              logs: [...(prev?.logs || []), ...message.data]
            }));
          } else if (message.type === 'status') {
            setRunDetail(prev => ({
              ...prev,
              status: message.data
            }));
          } else if (message.type === 'end') {
            setRunDetail(message.data);
            setRunning(null);
            eventSourceWithAuth.close();
          }
        } catch (e) {
          console.error('SSE parse error:', e);
        }
      };

      eventSourceWithAuth.onerror = (error) => {
        console.error('SSE error:', error);
        eventSourceWithAuth.close();
        setRunning(null);
        
        // Fallback to polling if SSE fails
        console.log('Falling back to polling...');
        const interval = setInterval(async () => {
          try {
            const poll = await api.get(`/ai/agents/${agentId}/runs/${runId}`);
            const payload = poll.data.data;
            setRunDetail(payload);

            if (['completed', 'failed', 'error'].includes(payload.status)) {
              clearInterval(interval);
              setRunning(null);
            }
          } catch (e) {
            clearInterval(interval);
            setRunning(null);
          }
        }, 2000);
      };

    } catch (error) {
      console.error('Auto Run error:', error);
      setRunDetail(prev => prev ? { ...prev, logs: [...(prev.logs || []), `Error: ${error.response?.data?.message || error.message}`] } : null);
      setRunning(null);
    }
  };

  const handleConfigureAgent = (agentId) => {
    alert(`Configure agent ${agentId} - feature coming soon`);
  };

  const handleDeleteAgent = async (agentId) => {
    if (!window.confirm('Are you sure you want to delete this agent?')) {
      return;
    }

    try {
      setDeletingAgent(agentId);
      const response = await api.delete(`/ai/agents/${agentId}`);
      
      if (response.data.success) {
        setAgents(agents.filter(a => a.id !== agentId));
      } else {
        alert('Failed to delete agent');
      }
    } catch (error) {
      alert('Error deleting agent: ' + (error.response?.data?.message || error.message));
    } finally {
      setDeletingAgent(null);
    }
  };

  const handleCreateAgent = async () => {
    if (!newAgentData.name.trim()) {
      alert('Please enter agent name');
      return;
    }

    try {
      setCreatingAgent(true);
      const response = await api.post('/ai/agents', newAgentData);

      if (response.data.success) {
        setNewAgentData({ name: '', description: '', type: 'content' });
        setShowNewAgent(false);
        fetchAgents();
      } else {
        alert('Failed to create agent');
      }
    } catch (error) {
      alert('Error creating agent: ' + (error.response?.data?.message || error.message));
    } finally {
      setCreatingAgent(false);
    }
  };

  const agentTypes = [
    { id: 'content', name: 'Content Generator', icon: '📝', description: 'Generate blog posts, articles, and content' },
    { id: 'code', name: 'Code Generator', icon: '💻', description: 'Generate and optimize code' },
    { id: 'design', name: 'Design Assistant', icon: '🎨', description: 'Help with design decisions' },
    { id: 'marketing', name: 'Marketing Expert', icon: '📢', description: 'Create marketing campaigns' },
    { id: 'seo', name: 'SEO Optimizer', icon: '🔍', description: 'Optimize content for SEO' },
    { id: 'social', name: 'Social Media Manager', icon: '📱', description: 'Manage social media content' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">AI Agents</h1>
              <p className="text-gray-600 mt-2">Create and manage AI agents to automate your workflow</p>
            </div>
            <button
              onClick={() => setShowNewAgent(!showNewAgent)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              + New Agent
            </button>
          </div>

          {showNewAgent && (
            <div className="bg-indigo-50 rounded-lg p-6 mb-8 border-2 border-indigo-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Agent</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Agent Name</label>
                  <input
                    type="text"
                    value={newAgentData.name}
                    onChange={(e) => setNewAgentData({ ...newAgentData, name: e.target.value })}
                    placeholder="My AI Agent"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors"
                    disabled={creatingAgent}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newAgentData.description}
                    onChange={(e) => setNewAgentData({ ...newAgentData, description: e.target.value })}
                    placeholder="Describe what this agent does..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none transition-colors"
                    rows="3"
                    disabled={creatingAgent}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Agent Type</label>
                  <select
                    value={newAgentData.type}
                    onChange={(e) => setNewAgentData({ ...newAgentData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors"
                    disabled={creatingAgent}
                  >
                    {agentTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCreateAgent}
                    disabled={creatingAgent}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 font-semibold transition-colors"
                  >
                    {creatingAgent ? 'Creating...' : 'Create Agent'}
                  </button>
                  <button
                    onClick={() => setShowNewAgent(false)}
                    disabled={creatingAgent}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:bg-gray-200 font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Agent Types Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Agent Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentTypes.map(type => (
              <div key={type.id} className="bg-white rounded-lg p-6 border-2 border-gray-200 hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer">
                <div className="text-4xl mb-3">{type.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{type.name}</h3>
                <p className="text-gray-600 text-sm">{type.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Agents List */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Agents</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3"></div>
              </div>
              <p className="text-gray-500">Loading agents...</p>
            </div>
          ) : agents.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">No agents created yet</p>
              <button
                onClick={() => setShowNewAgent(true)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors"
              >
                Create your first agent
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {agents.map((agent) => (
                <div key={agent.id} className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6 border-2 border-indigo-200 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                      {agent.type}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 min-h-10">{agent.description || 'No description provided'}</p>
                  
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => handleAutoRun(agent.id)}
                      disabled={running === agent.id}
                      className="w-full px-3 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm rounded-lg hover:from-indigo-700 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-400 font-semibold transition-all flex items-center justify-center"
                    >
                      {running === agent.id ? (
                        <>
                          <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></span>
                          Running...
                        </>
                      ) : (
                        '▶ Auto Run'
                      )}
                    </button>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleConfigureAgent(agent.id)}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                      >
                        ⚙ Configure
                      </button>
                      <button 
                        onClick={() => handleDeleteAgent(agent.id)}
                        disabled={deletingAgent === agent.id}
                        className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:bg-gray-400 font-semibold transition-colors"
                      >
                        {deletingAgent === agent.id ? 'Deleting...' : '🗑 Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Run details panel - Fixed position */}
      {runDetail && (
        <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl border-2 border-indigo-300 w-96 max-w-sm z-50">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <strong>Agent Run #{runDetail.id}</strong>
              <p className="text-xs text-indigo-100">Status: {runDetail.status}</p>
            </div>
            <button 
              onClick={() => setRunDetail(null)}
              className="text-white hover:bg-indigo-700 rounded p-1 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="p-4 border-b">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(runDetail.status)}`}>
                {runDetail.status.toUpperCase()}
              </span>
              {['starting', 'in-progress'].includes(runDetail.status) && (
                <span className="inline-block animate-pulse">⏳ In Progress</span>
              )}
            </div>

            <div className="text-xs text-gray-700 bg-gray-50 p-3 rounded h-40 overflow-y-auto border border-gray-200 font-mono">
              {runDetail.logs && runDetail.logs.length > 0 ? (
                runDetail.logs.map((l, i) => (
                  <div key={i} className="mb-1 text-gray-800">
                    {l}
                  </div>
                ))
              ) : (
                <div className="text-gray-400 italic">No logs yet...</div>
              )}
            </div>
          </div>

          {runDetail.testResult && (
            <div className="p-4 border-b bg-blue-50">
              <p className="text-xs font-semibold text-gray-700 mb-2">Test Results:</p>
              <p className="text-xs text-gray-600">{runDetail.testResult.summary}</p>
            </div>
          )}

          <div className="p-4 flex gap-2">
            <button 
              onClick={() => setRunDetail(null)}
              className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-semibold transition-colors"
            >
              Close
            </button>
            {runDetail.status === 'completed' && (
              <button 
                onClick={() => alert('Download feature coming soon')}
                className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold transition-colors"
              >
                ⬇ Download
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
