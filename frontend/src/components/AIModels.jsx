/**
 * Multi-Model AI Interface Component
 * Allows users to choose and compare AI models
 */

import React, { useState, useEffect } from 'react'
import { FiCopy, FiRefresh, FiCheck } from 'react-icons/fi'
import api from '../../services/api'

export default function AIModels() {
  const [models, setModels] = useState([])
  const [selectedModels, setSelectedModels] = useState(['claude'])
  const [prompt, setPrompt] = useState('')
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(false)
  const [comparing, setComparing] = useState(false)
  const [copied, setCopied] = useState(null)

  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    try {
      const response = await api.get('/ai-models/models')
      if (response.data.success) {
        setModels(response.data.data.availableModels)
      }
    } catch (error) {
      console.error('Error fetching models:', error)
    }
  }

  const handleGenerateWithModel = async (modelName) => {
    if (!prompt.trim()) {
      alert('Please enter a prompt')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/ai-models/generate', {
        prompt,
        model: modelName
      })

      if (response.data.success) {
        setResults(prev => ({
          ...prev,
          [modelName]: response.data.data
        }))
      }
    } catch (error) {
      console.error('Error generating with', modelName, error)
    }
    setLoading(false)
  }

  const handleCompareModels = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt')
      return
    }

    setComparing(true)
    try {
      const response = await api.post('/ai-models/compare-models', {
        prompt,
        models: selectedModels
      })

      if (response.data.success) {
        setResults(response.data.data.comparison)
      }
    } catch (error) {
      console.error('Error comparing models:', error)
    }
    setComparing(false)
  }

  const handleConsensus = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt')
      return
    }

    setComparing(true)
    try {
      const response = await api.post('/ai-models/consensus', {
        prompt
      })

      if (response.data.success) {
        setResults({
          consensus: response.data.data
        })
      }
    } catch (error) {
      console.error('Error getting consensus:', error)
    }
    setComparing(false)
  }

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">🤖 Multi-Model AI Comparison</h2>
        <p className="text-gray-400">Compare ChatGPT, Gemini, Claude, and more</p>
      </div>

      {/* Prompt Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Your Prompt
        </label>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          className="w-full h-24 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Model Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Select Models to Compare
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.entries(models).map(([name, info]) => (
            <label
              key={name}
              className="flex items-center p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition"
            >
              <input
                type="checkbox"
                checked={selectedModels.includes(name)}
                onChange={e => {
                  if (e.target.checked) {
                    setSelectedModels([...selectedModels, name])
                  } else {
                    setSelectedModels(selectedModels.filter(m => m !== name))
                  }
                }}
                className="mr-3"
              />
              <div>
                <div className="font-medium text-white">{info.name}</div>
                <div className="text-xs text-gray-400">{info.speed} • Quality: {info.quality}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={handleCompareModels}
          disabled={comparing || loading || selectedModels.length === 0}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition"
        >
          <FiRefresh className={comparing ? 'animate-spin' : ''} />
          Compare Models
        </button>

        <button
          onClick={handleConsensus}
          disabled={comparing || loading}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition"
        >
          <FiCheck />
          Get Consensus
        </button>

        <button
          onClick={fetchModels}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition"
        >
          Refresh Models
        </button>
      </div>

      {/* Results */}
      <div className="space-y-6">
        {Object.entries(results).map(([modelName, result]) => (
          <div
            key={modelName}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {models[modelName]?.name || modelName}
                </h3>
                <p className="text-sm text-gray-400">
                  {result.latency && `Latency: ${result.latency}ms`}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(result.content, modelName)}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 transition"
              >
                {copied === modelName ? <FiCheck className="text-green-500" /> : <FiCopy />}
              </button>
            </div>

            <div className="bg-gray-900 rounded p-4 text-gray-100 whitespace-pre-wrap max-h-96 overflow-y-auto">
              {result.content || result.error || 'No response yet'}
            </div>

            {result.usage && (
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-gray-400">
                <div>Prompt: {result.usage.promptTokens || 'N/A'}</div>
                <div>Output: {result.usage.completionTokens || 'N/A'}</div>
                <div>Total: {result.usage.totalTokens || 'N/A'}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Model Info */}
      {models && Object.keys(models).length > 0 && (
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Model Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(models).map(([name, info]) => (
              <div key={name} className="bg-gray-700 rounded p-4">
                <div className="font-medium text-white">{info.name}</div>
                <div className="text-sm text-gray-400 mt-2">
                  <div>Capabilities: {info.capabilities?.join(', ') || 'N/A'}</div>
                  <div>Speed: {info.speed}</div>
                  <div>Quality: {info.quality}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
