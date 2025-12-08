/**
 * Google Gemini Integration
 * Supports: Gemini Pro, Vision, Code Generation
 */

import axios from 'axios'

export class GeminiModel {
  constructor(apiKey = process.env.GEMINI_API_KEY) {
    this.apiKey = apiKey
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta'
    this.model = 'gemini-pro'
    this.visionModel = 'gemini-pro-vision'
  }

  /**
   * Generate text with Gemini Pro
   */
  async generate(prompt, options = {}) {
    try {
      if (!this.apiKey) {
        throw new Error('GEMINI_API_KEY not configured')
      }

      const response = await axios.post(
        `${this.baseUrl}/models/gemini-pro:generateContent`,
        {
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            temperature: options.temperature || 0.7,
            maxOutputTokens: options.maxTokens || 2000,
            topP: options.topP || 1,
            topK: options.topK || 1
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_UNSPECIFIED',
              threshold: 'BLOCK_NONE'
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': this.apiKey
          }
        }
      )

      const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text || ''

      return {
        success: true,
        model: 'gemini-pro',
        content,
        usageMetadata: response.data.usageMetadata || {},
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        model: 'gemini-pro',
        error: error.message,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Analyze image with Gemini Vision
   */
  async analyzeImage(imageBase64, prompt = 'Analyze this image') {
    try {
      if (!this.apiKey) {
        throw new Error('GEMINI_API_KEY not configured')
      }

      const response = await axios.post(
        `${this.baseUrl}/models/gemini-pro-vision:generateContent`,
        {
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: 'image/jpeg',
                    data: imageBase64
                  }
                },
                { text: prompt }
              ]
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': this.apiKey
          }
        }
      )

      const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text || ''

      return {
        success: true,
        model: 'gemini-pro-vision',
        content,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        model: 'gemini-pro-vision',
        error: error.message,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Generate code with Gemini
   */
  async generateCode(requirements, language = 'javascript') {
    const prompt = `
You are an expert ${language} developer. Generate production-ready code.

Requirements:
${requirements}

Requirements:
- Generate only valid ${language} code
- Include error handling
- Add JSDoc comments
- Follow best practices
- No markdown formatting

Generate ONLY the code, no explanations.
`

    const result = await this.generate(prompt, {
      temperature: 0.3
    })

    return result
  }

  /**
   * Multi-turn conversation
   */
  async chat(messages, options = {}) {
    try {
      if (!this.apiKey) {
        throw new Error('GEMINI_API_KEY not configured')
      }

      const contents = messages.map(msg => ({
        role: msg.role || 'user',
        parts: [{ text: msg.content }]
      }))

      const response = await axios.post(
        `${this.baseUrl}/models/gemini-pro:generateContent`,
        {
          contents,
          generationConfig: {
            temperature: options.temperature || 0.7,
            maxOutputTokens: options.maxTokens || 2000
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': this.apiKey
          }
        }
      )

      const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text || ''

      return {
        success: true,
        model: 'gemini-pro',
        content,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        model: 'gemini-pro',
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
      name: 'Google Gemini Pro',
      provider: 'google',
      capabilities: ['text-generation', 'vision-analysis', 'code-generation', 'multi-turn'],
      models: ['gemini-pro', 'gemini-pro-vision'],
      costsPerMillion: 0, // Free tier available
      speed: 'very-fast',
      quality: 'excellent'
    }
  }
}
