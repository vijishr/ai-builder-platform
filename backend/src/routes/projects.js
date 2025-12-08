import express from 'express';

const router = express.Router();

/**
 * @route   GET /api/v1/projects
 * @desc    Get all projects for user
 * @access  Private
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        name: 'My First Website',
        type: 'website',
        status: 'published',
        createdAt: new Date(),
        updatedAt: new Date(),
        url: 'https://example.aibuilder.com'
      }
    ]
  });
});

/**
 * @route   POST /api/v1/projects
 * @desc    Create new project
 * @access  Private
 */
router.post('/', (req, res) => {
  const { name, type, idea, style, colorTheme } = req.body;

  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    data: {
      id: Date.now().toString(),
      name,
      type,
      idea,
      style,
      colorTheme,
      status: 'draft',
      createdAt: new Date()
    }
  });
});

/**
 * @route   GET /api/v1/projects/:id
 * @desc    Get project by ID
 * @access  Private
 */
router.get('/:id', (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.params.id,
      name: 'Project Name',
      type: 'website',
      pages: ['home', 'about', 'contact'],
      sections: []
    }
  });
});

/**
 * @route   PUT /api/v1/projects/:id
 * @desc    Update project
 * @access  Private
 */
router.put('/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Project updated successfully',
    data: { id: req.params.id, ...req.body }
  });
});

/**
 * @route   DELETE /api/v1/projects/:id
 * @desc    Delete project
 * @access  Private
 */
router.delete('/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Project deleted successfully'
  });
});

/**
 * @route   GET /api/v1/projects/:id/pages
 * @desc    Get all pages in project
 * @access  Private
 */
router.get('/:id/pages', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: '1', name: 'Home', type: 'home' },
      { id: '2', name: 'About', type: 'about' }
    ]
  });
});

/**
 * @route   POST /api/v1/projects/:id/pages
 * @desc    Add new page to project
 * @access  Private
 */
router.post('/:id/pages', (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Page created',
    data: {
      id: Date.now().toString(),
      ...req.body
    }
  });
});

/**
 * @route   PUT /api/v1/projects/:projectId/pages/:pageId
 * @desc    Update page
 * @access  Private
 */
router.put('/:projectId/pages/:pageId', (req, res) => {
  res.json({
    success: true,
    message: 'Page updated',
    data: { id: req.params.pageId, ...req.body }
  });
});

/**
 * @route   DELETE /api/v1/projects/:projectId/pages/:pageId
 * @desc    Delete page
 * @access  Private
 */
router.delete('/:projectId/pages/:pageId', (req, res) => {
  res.json({
    success: true,
    message: 'Page deleted'
  });
});

export default router;
