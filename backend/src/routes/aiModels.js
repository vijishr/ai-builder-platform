/**
 * AI Agent Routes
 * Endpoints for multi-model AI capabilities
 */

import express from 'express'
import smartAgent from '../services/smartAgent.js'
import aiModelManager from '../services/aiModels/manager.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

/**
 * GET /api/v1/ai/models
 * Get all available AI models and their capabilities
 */
router.get('/models', verifyToken, (req, res) => {
  const comparison = aiModelManager.getModelComparison()
  res.json({
    success: true,
    data: comparison
  })
})

/**
 * POST /api/v1/ai/generate
 * Generate content with specified model or auto-select
 */
router.post('/generate', verifyToken, async (req, res) => {
  try {
    const { prompt, model, task, options = {} } = req.body

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: 'prompt is required'
      })
    }

    const result = await aiModelManager.generate(prompt, {
      model,
      task,
      ...options
    })

    res.json({
      success: result.success,
      data: result
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

/**
 * POST /api/v1/ai/generate-code
 * Generate code with multi-model support
 */
router.post('/generate-code', verifyToken, async (req, res) => {
  try {
    const { requirements, language = 'javascript', model } = req.body

    if (!requirements) {
      return res.status(400).json({
        success: false,
        message: 'requirements is required'
      })
    }

    const result = await aiModelManager.generateCode(requirements, language, {
      model
    })

    res.json({
      success: result.success,
      data: result
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

/**
 * POST /api/v1/ai/compare-models
 * Compare results from multiple AI models
 */
router.post('/compare-models', verifyToken, async (req, res) => {
  try {
    const { prompt, models } = req.body

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: 'prompt is required'
      })
    }

    const comparison = await smartAgent.compareModels(prompt, { models })

    res.json({
      success: true,
      data: {
        prompt,
        comparison,
        availableModels: aiModelManager.getAvailableModels()
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

/**
 * POST /api/v1/ai/consensus
 * Get consensus analysis from multiple models
 */
router.post('/consensus', verifyToken, async (req, res) => {
  try {
    const { prompt } = req.body

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: 'prompt is required'
      })
    }

    const result = await aiModelManager.getConsensus(prompt)

    res.json({
      success: result.success,
      data: result
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

/**
 * POST /api/v1/ai/solve
 * Solve complex problem with planning and multi-step execution
 */
router.post('/solve', verifyToken, async (req, res) => {
  try {
    const { objective, context = {}, taskType, model } = req.body

    if (!objective) {
      return res.status(400).json({
        success: false,
        message: 'objective is required'
      })
    }

    const result = await smartAgent.solve(objective, context, {
      taskType,
      model
    })

    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

/**
 * POST /api/v1/ai/chat
 * Multi-turn conversation with memory
 */
router.post('/chat', verifyToken, async (req, res) => {
  try {
    const { message, model } = req.body

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'message is required'
      })
    }

    const result = await smartAgent.chat(message, { model })

    res.json({
      success: result.success,
      data: result
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

/**
 * GET /api/v1/ai/status
 * Get agent status and capabilities
 */
router.get('/status', verifyToken, (req, res) => {
  const status = smartAgent.getStatus()
  res.json({
    success: true,
    data: status
  })
})

/**
 * POST /api/v1/ai/stream
 * Stream response from AI model (Server-Sent Events)
 */
router.post('/stream', verifyToken, async (req, res) => {
  try {
    const { prompt, model } = req.body

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: 'prompt is required'
      })
    }

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    try {
      for await (const chunk of smartAgent.stream(prompt, { model })) {
        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`)
      }
      res.write('data: [DONE]\n\n')
      res.end()
    } catch (streamError) {
      res.write(`data: ${JSON.stringify({ error: streamError.message })}\n\n`)
      res.end()
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

/**
 * DELETE /api/v1/ai/memory
 * Clear agent conversation memory
 */
router.delete('/memory', verifyToken, (req, res) => {
  smartAgent.clearMemory()
  res.json({
    success: true,
    message: 'Memory cleared'
  })
})

export default router
