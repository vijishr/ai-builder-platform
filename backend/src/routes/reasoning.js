import express from 'express'
import { ReasoningEngine, ToolRegistry, SearchTool, DatabaseTool, AnalyzerTool, GeneratorTool } from '../services/reasoningEngine.js'
import { DatabaseSearchTool } from '../services/databaseSearchTool.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// Initialize reasoning engine and tools
const toolRegistry = new ToolRegistry()
const reasoningEngine = new ReasoningEngine()

// Register available tools
toolRegistry.register('search', SearchTool)
toolRegistry.register('database', DatabaseTool)
toolRegistry.register('analyze', AnalyzerTool)
toolRegistry.register('generate', GeneratorTool)

// Initialize database search tool
const searchTool = new DatabaseSearchTool(null)
toolRegistry.register('databaseSearch', { execute: (params) => searchTool.execute(params) })

/**
 * @route POST /api/v1/reasoning/plan
 * @desc Generate a multi-step reasoning plan for an objective
 * @access Private
 */
router.post('/plan', auth.verifyToken, async (req, res) => {
  try {
    const { objective, context = {} } = req.body

    if (!objective) {
      return res.status(400).json({
        success: false,
        message: 'Objective is required'
      })
    }

    const plan = await reasoningEngine.generatePlan(objective, context)

    res.json({
      success: true,
      message: 'Reasoning plan generated',
      data: plan
    })
  } catch (error) {
    console.error('Plan generation error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to generate plan',
      error: error.message
    })
  }
})

/**
 * @route POST /api/v1/reasoning/execute
 * @desc Execute a reasoning plan step by step
 * @access Private
 */
router.post('/execute', auth.verifyToken, async (req, res) => {
  try {
    const { plan, maxSteps = 10 } = req.body

    if (!plan || !plan.objective) {
      return res.status(400).json({
        success: false,
        message: 'Valid plan is required'
      })
    }

    const results = await reasoningEngine.executePlan(plan, maxSteps)

    res.json({
      success: true,
      message: 'Plan executed successfully',
      data: results
    })
  } catch (error) {
    console.error('Plan execution error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to execute plan',
      error: error.message
    })
  }
})

/**
 * @route POST /api/v1/reasoning/reason
 * @desc End-to-end: Plan and execute in one call
 * @access Private
 */
router.post('/reason', auth.verifyToken, async (req, res) => {
  try {
    const { objective, context = {}, autoExecute = true, maxSteps = 10 } = req.body

    if (!objective) {
      return res.status(400).json({
        success: false,
        message: 'Objective is required'
      })
    }

    // Generate plan
    const plan = await reasoningEngine.generatePlan(objective, context)

    let executionResults = null
    if (autoExecute) {
      // Execute plan
      executionResults = await reasoningEngine.executePlan(plan, maxSteps)
    }

    res.json({
      success: true,
      message: 'Reasoning completed',
      data: {
        plan,
        execution: executionResults,
        reasoningChain: reasoningEngine.getReasoningChain()
      }
    })
  } catch (error) {
    console.error('Reasoning error:', error)
    res.status(500).json({
      success: false,
      message: 'Reasoning failed',
      error: error.message
    })
  }
})

/**
 * @route POST /api/v1/reasoning/search
 * @desc Advanced database search with filters and ranking
 * @access Private
 */
router.post('/search', auth.verifyToken, async (req, res) => {
  try {
    const { query, filters = {}, limit = 10, sortBy = 'relevance' } = req.body

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      })
    }

    const results = await searchTool.execute({
      query,
      filters,
      limit,
      sortBy
    })

    res.json({
      success: true,
      message: 'Search completed',
      data: results
    })
  } catch (error) {
    console.error('Search error:', error)
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    })
  }
})

/**
 * @route POST /api/v1/reasoning/search/advanced
 * @desc Advanced search with facets and aggregations
 * @access Private
 */
router.post('/search/advanced', auth.verifyToken, async (req, res) => {
  try {
    const {
      query,
      filters = {},
      limit = 20,
      sortBy = 'relevance',
      facetFields = []
    } = req.body

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      })
    }

    const results = await searchTool.advancedSearch({
      query,
      filters,
      limit,
      sortBy,
      facetFields
    })

    res.json({
      success: true,
      message: 'Advanced search completed',
      data: results
    })
  } catch (error) {
    console.error('Advanced search error:', error)
    res.status(500).json({
      success: false,
      message: 'Advanced search failed',
      error: error.message
    })
  }
})

/**
 * @route GET /api/v1/reasoning/tools
 * @desc List available tools
 * @access Private
 */
router.get('/tools', auth.verifyToken, (req, res) => {
  try {
    const tools = toolRegistry.list()

    res.json({
      success: true,
      message: 'Tools retrieved',
      data: {
        availableTools: tools,
        toolCount: tools.length,
        tools: tools.map(name => ({
          name,
          description: toolRegistry.get(name)?.description || 'No description'
        }))
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tools',
      error: error.message
    })
  }
})

/**
 * @route POST /api/v1/reasoning/tool/:toolName
 * @desc Execute a specific tool
 * @access Private
 */
router.post('/tool/:toolName', auth.verifyToken, async (req, res) => {
  try {
    const { toolName } = req.params
    const { params = {} } = req.body

    const tool = toolRegistry.get(toolName)
    if (!tool) {
      return res.status(404).json({
        success: false,
        message: `Tool not found: ${toolName}`
      })
    }

    const result = await tool.execute(params)

    res.json({
      success: true,
      message: `Tool executed: ${toolName}`,
      data: result
    })
  } catch (error) {
    console.error(`Tool execution error (${req.params.toolName}):`, error)
    res.status(500).json({
      success: false,
      message: 'Tool execution failed',
      error: error.message
    })
  }
})

/**
 * @route GET /api/v1/reasoning/stats
 * @desc Get reasoning engine statistics
 * @access Private
 */
router.get('/stats', auth.verifyToken, (req, res) => {
  try {
    const stats = {
      searchStats: searchTool.getStats(),
      reasoningStats: {
        currentStep: reasoningEngine.currentStep,
        reasoningChainLength: reasoningEngine.reasoningChain.length
      }
    }

    res.json({
      success: true,
      message: 'Statistics retrieved',
      data: stats
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve statistics',
      error: error.message
    })
  }
})

export default router
