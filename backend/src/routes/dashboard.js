import express from 'express';

const router = express.Router();

/**
 * @route   GET /api/v1/dashboard/stats
 * @desc    Get dashboard statistics
 * @access  Private
 */
router.get('/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalProjects: 12,
      publishedProjects: 8,
      totalVisitors: 45230,
      totalSales: 15420,
      thisMonthVisitors: 8920,
      thisMonthSales: 3240,
      avgPageLoadTime: '1.2s',
      uptime: '99.95%'
    }
  });
});

/**
 * @route   GET /api/v1/dashboard/recent-projects
 * @desc    Get recent projects
 * @access  Private
 */
router.get('/recent-projects', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        name: 'E-Commerce Store',
        type: 'website',
        status: 'published',
        visitors: 5420,
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Mobile App',
        type: 'app',
        status: 'draft',
        updatedAt: new Date()
      }
    ]
  });
});

/**
 * @route   GET /api/v1/dashboard/analytics
 * @desc    Get detailed analytics
 * @access  Private
 */
router.get('/analytics', (req, res) => {
  res.json({
    success: true,
    data: {
      trafficByDay: [
        { date: '2024-01-01', visitors: 120 },
        { date: '2024-01-02', visitors: 150 },
        { date: '2024-01-03', visitors: 180 }
      ],
      trafficByCountry: [
        { country: 'US', percentage: 45 },
        { country: 'UK', percentage: 20 },
        { country: 'India', percentage: 35 }
      ],
      deviceBreakdown: {
        mobile: 55,
        desktop: 40,
        tablet: 5
      },
      topPages: [
        { name: 'Home', views: 5420 },
        { name: 'Products', views: 3210 },
        { name: 'Contact', views: 1520 }
      ]
    }
  });
});

/**
 * @route   GET /api/v1/dashboard/form-submissions
 * @desc    Get form submissions
 * @access  Private
 */
router.get('/form-submissions', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        formName: 'Contact Form',
        name: 'John Doe',
        email: 'john@example.com',
        message: 'I am interested in your services',
        submittedAt: new Date()
      },
      {
        id: '2',
        formName: 'Newsletter',
        email: 'user@example.com',
        submittedAt: new Date()
      }
    ]
  });
});

/**
 * @route   GET /api/v1/dashboard/users
 * @desc    Get user management data
 * @access  Private
 */
router.get('/users', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        status: 'active',
        joinedAt: new Date()
      },
      {
        id: '2',
        name: 'Editor User',
        email: 'editor@example.com',
        role: 'editor',
        status: 'active',
        joinedAt: new Date()
      }
    ]
  });
});

/**
 * @route   POST /api/v1/dashboard/users/:userId/role
 * @desc    Update user role
 * @access  Private
 */
router.post('/users/:userId/role', (req, res) => {
  res.json({
    success: true,
    message: 'User role updated',
    data: {
      userId: req.params.userId,
      role: req.body.role
    }
  });
});

/**
 * @route   DELETE /api/v1/dashboard/users/:userId
 * @desc    Delete user
 * @access  Private
 */
router.delete('/users/:userId', (req, res) => {
  res.json({
    success: true,
    message: 'User deleted'
  });
});

/**
 * @route   GET /api/v1/dashboard/api-keys
 * @desc    Get API keys
 * @access  Private
 */
router.get('/api-keys', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        name: 'Development Key',
        key: 'sk_dev_1234567890',
        createdAt: new Date(),
        lastUsed: new Date()
      }
    ]
  });
});

/**
 * @route   POST /api/v1/dashboard/api-keys
 * @desc    Generate new API key
 * @access  Private
 */
router.post('/api-keys', (req, res) => {
  res.json({
    success: true,
    message: 'API key generated',
    data: {
      id: Date.now().toString(),
      name: req.body.name,
      key: 'sk_prod_' + Math.random().toString(36).substr(2, 20),
      createdAt: new Date()
    }
  });
});

/**
 * @route   DELETE /api/v1/dashboard/api-keys/:keyId
 * @desc    Delete API key
 * @access  Private
 */
router.delete('/api-keys/:keyId', (req, res) => {
  res.json({
    success: true,
    message: 'API key deleted'
  });
});

/**
 * @route   GET /api/v1/dashboard/logs
 * @desc    Get activity logs
 * @access  Private
 */
router.get('/logs', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        action: 'Project Published',
        projectName: 'E-Commerce Store',
        timestamp: new Date(),
        status: 'success'
      },
      {
        id: '2',
        action: 'Page Updated',
        projectName: 'Blog',
        timestamp: new Date(),
        status: 'success'
      }
    ]
  });
});

export default router;
