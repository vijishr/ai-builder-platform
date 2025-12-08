import express from 'express';
import db from '../db/index.js';

const router = express.Router();

// Dev-only: return OTPs for an email (safe only in development)
router.get('/otps', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ success: false, message: 'Not available in production' });
    }

    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, message: 'email query required' });

    await db.read();

    const otps = db.data.otps.filter(o => o.email === email);

    res.json({ success: true, data: { otps } });
  } catch (error) {
    console.error('Debug OTPS error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch otps' });
  }
});

// Dev-only: reset the file DB (users + otps)
router.post('/reset-db', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ success: false, message: 'Not available in production' });
    }

    await db.read();
    db.data = { users: [], otps: [] };
    await db.write();

    console.log('[Debug] DB reset by dev endpoint');
    res.json({ success: true, message: 'Database cleared (dev only)' });
  } catch (error) {
    console.error('Debug reset-db error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset db' });
  }
});

export default router;
