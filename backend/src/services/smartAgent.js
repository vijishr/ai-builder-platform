/**
 * AI Agent with Multi-Model Support
 * Advanced features: Planning, tool use, multi-step reasoning, model selection
 */

import aiModelManager from './aiModels/manager.js'

export class SmartAIAgent {
  constructor(tools = {}, database = null) {
    this.manager = aiModelManager
    this.tools = tools
    this.database = database
    this.memoryBuffer = []
    this.conversationHistory = []
  }

  /**
   * Auto-select best model for task
   */
  selectBestModel(taskType) {
    const mapping = {
      'code_generation': 'claude',
      'code_analysis': 'claude',
      'content_writing': 'openai',
      'research': 'claude',
      'image_analysis': 'gemini',
      'quick_response': 'gemini',
      'cost_sensitive': 'gemini',
      'high_quality': 'claude'
    }
    return mapping[taskType] || this.manager.preferences.preferredModel
  }

  /**
   * Intelligent problem solving with planning
   */
  async solve(objective, context = {}, options = {}) {
    const taskType = options.taskType || 'general'
    const model = options.model || this.selectBestModel(taskType)

    // Step 1: Plan
    const plan = await this.createPlan(objective, context, model)

    // Step 2: Execute steps
    const execution = await this.executePlan(plan, model)

    // Step 3: Synthesize
    const result = await this.synthesizeResult(execution, model)

    return {
      objective,
      plan,
      execution,
      result,
      usedModel: model,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Create execution plan
   */
  async createPlan(objective, context, model) {
    const prompt = `
Objective: ${objective}

Context: ${JSON.stringify(context, null, 2)}

Create a step-by-step plan to achieve this objective.

Return JSON format:
{
  "steps": [
    {"number": 1, "action": "...", "tools": ["..."], "expectedOutput": "..."}
  ],
  "estimatedComplexity": "low|medium|high",
  "requiredTools": ["..."]
}
`

    const response = await this.manager.generate(prompt, { model })

    try {
      const json = JSON.parse(response.content)
      return json
    } catch (e) {
      return {
        steps: [
          { number: 1, action: response.content, tools: [], expectedOutput: 'Result' }
        ],
        estimatedComplexity: 'medium',
        requiredTools: []
      }
    }
  }

  /**
   * Execute plan with tool integration
   */
  async executePlan(plan, model) {
    const execution = {
      steps: [],
      startTime: Date.now(),
      status: 'executing'
    }

    for (const step of plan.steps || []) {
      try {
        const stepResult = await this.executeStep(step, model)
        execution.steps.push(stepResult)
      } catch (error) {
        execution.steps.push({
          stepNumber: step.number,
          status: 'failed',
          error: error.message
        })
      }
    }

    execution.status = 'completed'
    execution.endTime = Date.now()
    execution.duration = execution.endTime - execution.startTime

    return execution
  }

  /**
   * Execute single step
   */
  async executeStep(step, model) {
    const prompt = `
Execute this step:
Action: ${step.action}
Tools available: ${step.tools?.join(', ') || 'none'}

Provide the result.
`

    const response = await this.manager.generate(prompt, { model })

    return {
      stepNumber: step.number,
      action: step.action,
      status: response.success ? 'completed' : 'failed',
      output: response.content || response.error,
      model
    }
  }

  /**
   * Synthesize final result
   */
  async synthesizeResult(execution, model) {
    const allOutput = execution.steps
      .map(s => `Step ${s.stepNumber}: ${s.output}`)
      .join('\n\n')

    const prompt = `
Based on these execution steps:

${allOutput}

Provide a clear, concise summary of the results and key findings.
`

    const response = await this.manager.generate(prompt, { model })

    return {
      summary: response.content,
      success: response.success,
      stepCount: execution.steps.length
    }
  }

  /**
   * Code generation with reasoning
   */
  async generateCodeWithReasoning(requirements, language = 'javascript') {
    // Use Claude for code generation (best quality)
    return await this.manager.generateCode(requirements, language, { model: 'claude' })
  }

  /**
   * Compare multiple models on same task
   */
  async compareModels(prompt, options = {}) {
    const models = options.models || this.manager.getAvailableModels()
    const comparison = {}

    for (const modelName of models) {
      const result = await this.manager.generate(prompt, { model: modelName })
      comparison[modelName] = {
        success: result.success,
        content: result.content,
        latency: result.latency
      }
    }

    return comparison
  }

  /**
   * Get consensus from multiple models
   */
  async getConsensus(prompt) {
    return await this.manager.getConsensus(prompt)
  }

  /**
   * Stream response for real-time updates
   */
  async *stream(prompt, options = {}) {
    const model = options.model || this.manager.preferences.preferredModel
    if (!this.manager.models[model]?.streamGenerate) {
      throw new Error(`Streaming not available for ${model}`)
    }
    yield* this.manager.models[model].streamGenerate(prompt, options)
  }

  /**
   * Multi-turn conversation with memory
   */
  async chat(userMessage, options = {}) {
    // Add to history
    this.conversationHistory.push({
      role: 'user',
      content: userMessage
    })

    // Keep last 10 messages for context
    const recentHistory = this.conversationHistory.slice(-10)

    const model = options.model || this.manager.preferences.preferredModel

    const response = await this.manager.generate(recentHistory, {
      model,
      temperature: options.temperature || 0.7
    })

    // Add response to history
    if (response.success) {
      this.conversationHistory.push({
        role: 'assistant',
        content: response.content,
        model
      })
    }

    return response
  }

  /**
   * Clear conversation memory
   */
  clearMemory() {
    this.conversationHistory = []
    this.memoryBuffer = []
  }

  /**
   * Get agent status and capabilities
   */
  getStatus() {
    return {
      models: {
        available: this.manager.getAvailableModels(),
        preferred: this.manager.preferences.preferredModel,
        comparison: this.manager.getModelComparison()
      },
      memory: {
        conversationHistoryLength: this.conversationHistory.length,
        memoryBufferLength: this.memoryBuffer.length
      },
      tools: Object.keys(this.tools),
      statistics: this.manager.stats
    }
  }
}

export default new SmartAIAgent()
