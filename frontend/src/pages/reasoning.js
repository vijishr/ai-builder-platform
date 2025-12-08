import { useState } from 'react'
import { useRouter } from 'next/router'
import api from '../services/api'

export default function ReasoningAgent() {
  const router = useRouter()
  const [objective, setObjective] = useState('')
  const [context, setContext] = useState('')
  const [plan, setPlan] = useState(null)
  const [execution, setExecution] = useState(null)
  const [reasoning, setReasoning] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('plan')
  const [autoExecute, setAutoExecute] = useState(true)

  const handleGeneratePlan = async () => {
    if (!objective.trim()) {
      alert('Please enter an objective')
      return
    }

    try {
      setLoading(true)
      const contextObj = context
        ? context.split('\n').reduce((acc, line) => {
            const [key, value] = line.split(':')
            if (key && value) acc[key.trim()] = value.trim()
            return acc
          }, {})
        : {}

      if (autoExecute) {
        // End-to-end reasoning
        const response = await api.post('/reasoning/reason', {
          objective,
          context: contextObj,
          autoExecute: true,
          maxSteps: 10
        })

        setPlan(response.data.data.plan)
        setExecution(response.data.data.execution)
        setReasoning(response.data.data.reasoningChain)
        setActiveTab('execution')
      } else {
        // Just generate plan
        const response = await api.post('/reasoning/plan', {
          objective,
          context: contextObj
        })

        setPlan(response.data.data)
        setReasoning(response.data.data.reasoning)
        setActiveTab('plan')
      }
    } catch (error) {
      alert('Error generating plan: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleExecutePlan = async () => {
    if (!plan) return

    try {
      setLoading(true)
      const response = await api.post('/reasoning/execute', {
        plan,
        maxSteps: 10
      })

      setExecution(response.data.data)
      setActiveTab('execution')
    } catch (error) {
      alert('Error executing plan: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-6 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ← Back
          </button>

          <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-purple-600">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">🧠 Advanced Reasoning Agent</h1>
            <p className="text-gray-600">Multi-step reasoning with database search and tool integration</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Objective</h2>

              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="Describe what you want the AI to accomplish..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
                disabled={loading}
              />

              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Context (optional)</h3>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="key: value&#10;key2: value2"
                  className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none text-xs"
                  disabled={loading}
                />
              </div>

              <div className="mt-4 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="autoExecute"
                  checked={autoExecute}
                  onChange={(e) => setAutoExecute(e.target.checked)}
                  disabled={loading}
                  className="w-4 h-4"
                />
                <label htmlFor="autoExecute" className="text-sm text-gray-700">
                  Auto-execute plan
                </label>
              </div>

              <button
                onClick={handleGeneratePlan}
                disabled={loading || !objective.trim()}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 font-semibold transition-all"
              >
                {loading ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Reasoning...
                  </>
                ) : (
                  '🚀 Start Reasoning'
                )}
              </button>

              {plan && !autoExecute && (
                <button
                  onClick={handleExecutePlan}
                  disabled={loading}
                  className="w-full mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 text-sm font-semibold transition-colors"
                >
                  ▶ Execute Plan
                </button>
              )}
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {!plan ? (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">🤔</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Enter an objective to begin</h3>
                <p className="text-gray-600">
                  The reasoning agent will break down your task into actionable steps and execute them intelligently.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Tabs */}
                <div className="flex gap-2 border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('plan')}
                    className={`px-4 py-3 font-semibold transition-colors ${
                      activeTab === 'plan'
                        ? 'border-b-2 border-purple-600 text-purple-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    📋 Plan ({plan.steps?.length || 0} steps)
                  </button>
                  <button
                    onClick={() => setActiveTab('execution')}
                    className={`px-4 py-3 font-semibold transition-colors ${
                      activeTab === 'execution'
                        ? 'border-b-2 border-purple-600 text-purple-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    ⚙️ Execution {execution && '✓'}
                  </button>
                  <button
                    onClick={() => setActiveTab('reasoning')}
                    className={`px-4 py-3 font-semibold transition-colors ${
                      activeTab === 'reasoning'
                        ? 'border-b-2 border-purple-600 text-purple-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    🧬 Reasoning ({reasoning.length})
                  </button>
                </div>

                {/* Plan Tab */}
                {activeTab === 'plan' && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Execution Plan</h3>

                    <div className="space-y-3">
                      {plan.steps?.map((step, idx) => (
                        <div key={idx} className="border-l-4 border-purple-400 pl-4 py-2 bg-purple-50 rounded">
                          <div className="font-semibold text-gray-900">
                            Step {step.number}: {step.action}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Type: <span className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-semibold">{step.type}</span>
                          </div>
                          {step.parameters && (
                            <div className="text-xs text-gray-600 mt-2 font-mono">
                              {JSON.stringify(step.parameters, null, 2).split('\n').slice(0, 3).join('\n')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {plan.estimatedTime && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                        ⏱️ Estimated time: {plan.estimatedTime}
                      </div>
                    )}
                  </div>
                )}

                {/* Execution Tab */}
                {activeTab === 'execution' && execution && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Execution Results</h3>

                    <div className="space-y-4">
                      {execution.executedSteps?.map((step, idx) => (
                        <div key={idx} className="border rounded-lg p-4 bg-gradient-to-r from-green-50 to-blue-50">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-semibold text-gray-900">Step {step.stepNumber}: {step.action}</div>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                              ✓ {step.status}
                            </span>
                          </div>
                          {step.result && (
                            <div className="text-sm text-gray-700 font-mono bg-white p-2 rounded mt-2 max-h-32 overflow-y-auto">
                              <pre>{JSON.stringify(step.result, null, 2)}</pre>
                            </div>
                          )}
                          <div className="text-xs text-gray-500 mt-2">{step.timestamp}</div>
                        </div>
                      ))}
                    </div>

                    {execution.finalResult && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-l-4 border-orange-400">
                        <h4 className="font-semibold text-gray-900 mb-2">Final Result</h4>
                        <div className="text-sm text-gray-700">
                          <p className="mb-2">{execution.finalResult.summary}</p>
                          {execution.finalResult.keyInsights?.length > 0 && (
                            <div>
                              <p className="font-semibold mb-1">Key Insights:</p>
                              <ul className="list-disc list-inside">
                                {execution.finalResult.keyInsights.map((insight, i) => (
                                  <li key={i} className="text-gray-600">{insight}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Reasoning Tab */}
                {activeTab === 'reasoning' && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Reasoning Chain</h3>

                    <div className="space-y-3">
                      {reasoning.map((step, idx) => (
                        <div key={idx} className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="font-semibold text-gray-900 text-sm">
                            Step {step.step}: {step.type.replace(/_/g, ' ').toUpperCase()}
                          </div>
                          <div className="text-xs text-gray-600 mt-1 max-h-20 overflow-y-auto">
                            <pre className="font-mono text-xs">{JSON.stringify(step.content, null, 2)}</pre>
                          </div>
                          <div className="text-xs text-gray-500 mt-2">{step.timestamp}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Errors */}
                {execution?.errors?.length > 0 && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <h4 className="font-semibold text-red-900 mb-2">Errors</h4>
                    <ul className="space-y-1">
                      {execution.errors.map((err, i) => (
                        <li key={i} className="text-sm text-red-700">
                          Step {err.step}: {err.error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
