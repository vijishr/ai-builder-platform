/**
 * AI Model Manager
 * Orchestrates multiple AI models with auto-fallback, cost optimization, and performance tracking
 */

import { OpenAIModel } from './openai.js'
import { GeminiModel } from './gemini.js'
import { ClaudeModel } from './claude.js'

export class AIModelManager {
  constructor() {
    this.models = {
      openai: null,
      gemini: null,
      claude: null
    }
    this.stats = {
      requestsTotal: 0,
      requestsByModel: {},
      costsByModel: {},
      latencies: []
    }
    this.preferences = {
      preferredModel: 'claude', // claude, openai, gemini
      fallbackOrder: ['claude', 'openai', 'gemini'],
      autoFallback: true,
      costOptimize: false
    }
    this.initializeModels()
  }

  /**
   * Initialize all available models
   */
  initializeModels() {
    // Log detected keys for easier debugging
    console.log('[AIModelManager] Initializing models. Keys present:', {
      OPENAI: !!process.env.OPENAI_API_KEY,
      GEMINI: !!process.env.GEMINI_API_KEY,
      ANTHROPIC: !!process.env.ANTHROPIC_API_KEY
    })

    try {
      if (process.env.OPENAI_API_KEY) {
        console.log('[AIModelManager] Instantiating OpenAIModel')
        this.models.openai = new OpenAIModel()
        console.log('[AIModelManager] OpenAIModel initialized')
      }
    } catch (e) {
      console.warn('OpenAI not initialized:', e && e.message ? e.message : e)
    }

    try {
      if (process.env.GEMINI_API_KEY) {
        console.log('[AIModelManager] Instantiating GeminiModel')
        this.models.gemini = new GeminiModel()
        console.log('[AIModelManager] GeminiModel initialized')
      }
    } catch (e) {
      console.warn('Gemini not initialized:', e && e.message ? e.message : e)
    }

    try {
      if (process.env.ANTHROPIC_API_KEY) {
        console.log('[AIModelManager] Instantiating ClaudeModel')
        this.models.claude = new ClaudeModel()
        console.log('[AIModelManager] ClaudeModel initialized')
      }
    } catch (e) {
      console.warn('Claude not initialized:', e && e.message ? e.message : e)
    }
  }

  /**
   * Get available models
   */
  getAvailableModels() {
    const available = []
    if (this.models.openai) available.push('openai')
    if (this.models.gemini) available.push('gemini')
    if (this.models.claude) available.push('claude')
    return available
  }

  /**
   * Generate content with best model
   */
  async generate(prompt, options = {}) {
    const startTime = Date.now()
    const modelName = options.model || this.preferences.preferredModel
    const task = options.task || 'general' // 'code', 'analysis', 'general', 'vision'

    let result
    let usedModel

    if (this.preferences.costOptimize) {
      result = await this.generateCostOptimized(prompt, task, options)
      usedModel = result.usedModel
    } else {
      result = await this.generateWithFallback(prompt, modelName, options)
      usedModel = result.model
    }

    // Track stats
    const latency = Date.now() - startTime
    this.stats.requestsTotal++
    this.stats.requestsByModel[usedModel] = (this.stats.requestsByModel[usedModel] || 0) + 1
    this.stats.latencies.push(latency)

    return {
      ...result,
      usedModel,
      latency,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Generate code (optimized for code generation)
   */
  async generateCode(requirements, language = 'javascript', options = {}) {
    const prompt = `
Requirements:
${requirements}

Generate production-ready ${language} code with:
- Error handling
- Type hints/JSDoc
- Best practices
- No markdown formatting
`

    return await this.generate(prompt, {
      ...options,
      task: 'code',
      model: options.model || 'claude' // Claude best for code
    })
  }

  /**
   * Generate with automatic fallback
   */
  async generateWithFallback(prompt, modelName, options = {}) {
    const fallbackOrder = [modelName, ...this.preferences.fallbackOrder.filter(m => m !== modelName)]

    for (const model of fallbackOrder) {
      if (!this.models[model]) continue

      try {
        const result = await this.models[model].generate(prompt, options)
        if (result.success) {
          return { ...result, model }
        }
      } catch (error) {
        console.warn(`${model} failed:`, error.message)
        continue
      }
    }

    return {
      success: false,
      error: 'All models failed',
      model: 'none'
    }
  }

  /**
   * Cost-optimized generation (use cheaper models when possible)
   */
  async generateCostOptimized(prompt, task, options = {}) {
    // Use cheapest model that supports the task
    const taskToModel = {
      'simple': 'gemini', // Free tier
      'code': 'claude', // Best quality
      'analysis': 'openai',
      'vision': 'gemini', // Free vision
      'general': 'gemini'
    }

    const preferredModel = taskToModel[task] || 'gemini'
    const result = await this.generateWithFallback(prompt, preferredModel, options)

    return {
      ...result,
      usedModel: result.model,
      costOptimized: true
    }
  }

  /**
   * Analyze code with multiple models and compare
   */
  async analyzeCodeWithMultipleModels(code, options = {}) {
    const analyses = {}
    const available = this.getAvailableModels()

    const prompt = `
Analyze this code for security, performance, and best practices:

\`\`\`
${code}
\`\`\`

Return JSON with issues array.`

    for (const modelName of available) {
      try {
        const result = await this.models[modelName].generate(prompt)
        if (result.success) {
          analyses[modelName] = {
            success: true,
            content: result.content
          }
        }
      } catch (e) {
        analyses[modelName] = { success: false, error: e.message }
      }
    }

    return {
      modelComparison: analyses,
      bestModel: available[0] // First one typically best
    }
  }

  /**
   * Multi-model consensus (use multiple models and combine results)
   */
  async getConsensus(prompt, options = {}) {
    const available = this.getAvailableModels()
    if (available.length < 2) {
      return this.generate(prompt, options)
    }

    const results = []
    for (const modelName of available) {
      try {
        const result = await this.models[modelName].generate(prompt)
        if (result.success) {
          results.push({
            model: modelName,
            content: result.content
          })
        }
      } catch (e) {
        console.warn(`${modelName} consensus failed:`, e.message)
      }
    }

    return {
      success: results.length > 0,
      results,
      consensus: this.synthesizeConsensus(results),
      modelCount: results.length,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Synthesize results from multiple models
   */
  synthesizeConsensus(results) {
    if (results.length === 0) return ''
    if (results.length === 1) return results[0].content

    return `
Consensus Analysis (${results.length} models):

${results.map(r => `

**${r.model}:**
${r.content}
`).join('\n')}

---
SUMMARY: The above represent independent analyses from ${results.length} different AI models.
`
  }

  /**
   * Stream response from model
   */
  async *streamGenerate(prompt, options = {}) {
    const modelName = options.model || this.preferences.preferredModel
    const model = this.models[modelName]

    if (!model || !model.streamGenerate) {
      throw new Error(`Streaming not supported for ${modelName}`)
    }

    yield* model.streamGenerate(prompt, options)
  }

  /**
   * Get model comparison and recommendations
   */
  getModelComparison() {
    const comparison = {}

    for (const [name, model] of Object.entries(this.models)) {
      if (model) {
        comparison[name] = model.getInfo()
      }
    }

    return {
      availableModels: comparison,
      statistics: this.stats,
      recommendations: this.getRecommendations()
    }
  }

  /**
   * Get recommendations based on usage
   */
  getRecommendations() {
    const stats = this.stats

    return {
      recommendedForCode: 'claude',
      recommendedForSpeed: 'gemini',
      recommendedForCost: 'gemini',
      recommendedForQuality: 'claude',
      recommendedForVision: 'gemini',
      averageLatency: Math.round(
        stats.latencies.reduce((a, b) => a + b, 0) / (stats.latencies.length || 1)
      ),
      totalRequests: stats.requestsTotal
    }
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      requestsTotal: 0,
      requestsByModel: {},
      costsByModel: {},
      latencies: []
    }
  }
}

// Export singleton instance
export default new AIModelManager()
