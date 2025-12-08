/**
 * Anthropic Claude Integration
 * Supports: Claude 3 (Opus, Sonnet, Haiku), Vision, Long Context
 */

import axios from 'axios'

export class ClaudeModel {
  constructor(apiKey = process.env.ANTHROPIC_API_KEY) {
    this.apiKey = apiKey
    this.baseUrl = 'https://api.anthropic.com/v1'
    this.model = 'claude-3-opus-20240229'
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      }
    })
  }

  /**
   * Generate text with Claude
   */
  async generate(prompt, options = {}) {
    try {
      if (!this.apiKey) {
        throw new Error('ANTHROPIC_API_KEY not configured')
      }

      const messages = Array.isArray(prompt)
        ? prompt
        : [{ role: 'user', content: prompt }]

      const response = await this.client.post('/messages', {
        model: options.model || this.model,
        max_tokens: options.maxTokens || 2000,
        messages,
        system: options.system || 'You are a helpful AI assistant.',
        temperature: options.temperature || 0.7
      })

      const content = response.data.content[0].text

      return {
        success: true,
        model: options.model || this.model,
        content,
        usage: {
          inputTokens: response.data.usage.input_tokens,
          outputTokens: response.data.usage.output_tokens
        },
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        model: options.model || this.model,
        error: error.message,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Analyze image with Claude Vision
   */
  async analyzeImage(imageBase64, mimeType = 'image/jpeg', prompt = 'Analyze this image') {
    try {
      if (!this.apiKey) {
        throw new Error('ANTHROPIC_API_KEY not configured')
      }

      const response = await this.client.post('/messages', {
        model: this.model,
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mimeType,
                  data: imageBase64
                }
              },
              {
                type: 'text',
                text: prompt
              }
            ]
          }
        ]
      })

      const content = response.data.content[0].text

      return {
        success: true,
        model: this.model,
        content,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        model: this.model,
        error: error.message,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Generate code with advanced reasoning
   */
  async generateCode(requirements, language = 'javascript', reasoning = true) {
    const systemPrompt = `You are an expert ${language} developer. Generate production-ready code.

${reasoning ? `Use the following approach:
1. Understand requirements
2. Plan the solution
3. Generate code with best practices
4. Add error handling
5. Include documentation` : ''}

Return ONLY valid ${language} code with comments, no markdown.`

    const prompt = `
Generate ${language} code for:
${requirements}

Requirements:
- Error handling
- Type hints/JSDoc
- Best practices
- Clear variable names
- No markdown formatting
`

    return await this.generate(prompt, {
      temperature: 0.3,
      system: systemPrompt
    })
  }

  /**
   * Extended thinking for complex problems (Claude Opus only)
   */
  async thinkAndGenerate(prompt, maxThinkingTokens = 5000) {
    try {
      if (!this.apiKey) {
        throw new Error('ANTHROPIC_API_KEY not configured')
      }

      const response = await this.client.post('/messages', {
        model: 'claude-3-opus-20240229',
        max_tokens: 8000,
        thinking: {
          type: 'enabled',
          budget_tokens: maxThinkingTokens
        },
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })

      const thinking = response.data.content
        .filter(c => c.type === 'thinking')
        .map(c => c.thinking)
        .join('\n')

      const content = response.data.content
        .filter(c => c.type === 'text')
        .map(c => c.text)
        .join('\n')

      return {
        success: true,
        model: 'claude-3-opus',
        thinking: thinking || null,
        content,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        model: 'claude-3-opus',
        error: error.message,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Long context analysis (100k tokens)
   */
  async analyzeLongContent(content, question, contextTokens = 50000) {
    try {
      if (!this.apiKey) {
        throw new Error('ANTHROPIC_API_KEY not configured')
      }

      const response = await this.client.post('/messages', {
        model: this.model,
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: `
Context to analyze (up to ${contextTokens} tokens):
${content}

Question:
${question}

Provide detailed analysis based on the context.
`
          }
        ]
      })

      const analysis = response.data.content[0].text

      return {
        success: true,
        model: this.model,
        analysis,
        tokensUsed: response.data.usage,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        model: this.model,
        error: error.message,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Get model info
   */
  getInfo() {
    return {
      name: 'Anthropic Claude 3',
      provider: 'anthropic',
      capabilities: ['text-generation', 'vision-analysis', 'code-generation', 'extended-thinking', 'long-context'],
      models: {
        'claude-3-opus': { quality: 'best', speed: 'slower', costPerMToken: 15 },
        'claude-3-sonnet': { quality: 'good', speed: 'fast', costPerMToken: 3 },
        'claude-3-haiku': { quality: 'good', speed: 'fastest', costPerMToken: 0.8 }
      },
      contextWindow: 200000,
      speed: 'fast',
      quality: 'excellent'
    }
  }
}
