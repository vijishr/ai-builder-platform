/**
 * OpenAI GPT Integration
 * Supports: GPT-4, GPT-3.5-turbo, Code Generation
 */

import axios from 'axios'

export class OpenAIModel {
  constructor(apiKey = process.env.OPENAI_API_KEY) {
    this.apiKey = apiKey
    this.baseUrl = 'https://api.openai.com/v1'
    this.model = 'gpt-4'
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    })
  }

  /**
   * Generate text/code with GPT-4
   */
  async generate(prompt, options = {}) {
    try {
      if (!this.apiKey) {
        throw new Error('OPENAI_API_KEY not configured')
      }

      const response = await this.client.post('/chat/completions', {
        model: options.model || this.model,
        messages: Array.isArray(prompt)
          ? prompt
          : [{ role: 'user', content: prompt }],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2000,
        top_p: options.topP || 1,
        frequency_penalty: options.frequencyPenalty || 0,
        presence_penalty: options.presencePenalty || 0
      })

      return {
        success: true,
        model: 'openai-gpt4',
        content: response.data.choices[0].message.content,
        usage: {
          promptTokens: response.data.usage.prompt_tokens,
          completionTokens: response.data.usage.completion_tokens,
          totalTokens: response.data.usage.total_tokens
        },
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        model: 'openai-gpt4',
        error: error.message,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Generate code with advanced reasoning
   */
  async generateCode(requirements, language = 'javascript') {
    const prompt = `
You are an expert ${language} developer. Generate production-ready code.

Requirements:
${requirements}

Return ONLY valid ${language} code with:
- Clear comments
- Error handling
- Type hints/JSDoc
- Best practices

DO NOT include markdown formatting or explanations.
`

    return await this.generate(prompt, {
      temperature: 0.3,
      model: 'gpt-4'
    })
  }

  /**
   * Analyze code for issues
   */
  async analyzeCode(code) {
    const prompt = `
Analyze this code for security, performance, and best practices issues:

\`\`\`
${code}
\`\`\`

Return JSON with:
{
  "issues": [{"type": "security|performance|best-practice", "severity": "high|medium|low", "description": "...", "fix": "..."}],
  "score": 0-100
}
`

    const result = await this.generate(prompt)
    if (result.success) {
      try {
        const json = JSON.parse(result.content)
        return { success: true, analysis: json }
      } catch (e) {
        return { success: true, analysis: { raw: result.content } }
      }
    }
    return result
  }

  /**
   * Stream response (for real-time)
   */
  async *streamGenerate(prompt, options = {}) {
    try {
      if (!this.apiKey) {
        throw new Error('OPENAI_API_KEY not configured')
      }

      const response = await this.client.post('/chat/completions', {
        model: options.model || this.model,
        messages: Array.isArray(prompt)
          ? prompt
          : [{ role: 'user', content: prompt }],
        stream: true,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2000
      }, {
        responseType: 'stream'
      })

      for await (const chunk of response.data) {
        const line = chunk.toString()
        if (line.startsWith('data: ')) {
          try {
            const json = JSON.parse(line.slice(6))
            const content = json.choices[0]?.delta?.content || ''
            if (content) yield content
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    } catch (error) {
      throw new Error(`Stream error: ${error.message}`)
    }
  }

  /**
   * Get model info
   */
  getInfo() {
    return {
      name: 'OpenAI GPT-4',
      provider: 'openai',
      capabilities: ['text-generation', 'code-generation', 'analysis', 'streaming'],
      model: this.model,
      costsPerMillion: 30, // $30 per 1M tokens
      speed: 'fast',
      quality: 'excellent'
    }
  }
}
