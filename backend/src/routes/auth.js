import express from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import nodemailer from 'nodemailer';
import db from '../db/index.js';
import mongo from '../db/mongo.js';

const router = express.Router();

// ==================== UTILITIES ====================

// Generate JWT Token
const generateToken = (userId, type = 'access') => {
  const secret = type === 'access' ? process.env.JWT_SECRET : process.env.JWT_REFRESH_SECRET || 'refresh_secret';
  const expiresIn = type === 'access' ? process.env.JWT_EXPIRE || '7d' : '30d';
  
  return jwt.sign(
    { userId, type },
    secret,
    { expiresIn }
  );
};

// Hash Password
const hashPassword = async (password) => {
  return await bcryptjs.hash(password, 12);
};

// Compare Password
const comparePassword = async (password, hashedPassword) => {
  return await bcryptjs.compare(password, hashedPassword);
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send Email (robust for dev)
const sendEmail = async (to, subject, text, html) => {
  try {
    // If SMTP is not configured, fall back to a Nodemailer test account
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    let transporter;

    const smtpConfigured = smtpUser && smtpPass && !smtpUser.startsWith('your_') && !smtpPass.startsWith('your_');

    if (smtpConfigured) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '465', 10),
        secure: true,
        auth: { user: smtpUser, pass: smtpPass },
        tls: { rejectUnauthorized: process.env.NODE_ENV === 'production' }
      });
    } else {
      console.warn('[Email] SMTP not configured or using placeholder credentials — using Nodemailer test account for development');
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: { user: testAccount.user, pass: testAccount.pass },
        tls: { rejectUnauthorized: false }
      });
    }

    const info = await transporter.sendMail({
      from: smtpConfigured ? process.env.SMTP_USER : 'no-reply@ai-builder.local',
      to,
      subject,
      text,
      html
    });

    // If using test account, log preview URL so developer can view the email
    if (!smtpConfigured) {
      const preview = nodemailer.getTestMessageUrl(info);
      console.log('[Email] Preview URL:', preview);
    }

    return true;
  } catch (error) {
    console.error('Email sending failed:', error && error.message ? error.message : error);
    return false;
  }
};

// ==================== ROUTES ====================

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('name').trim().notEmpty(),
  body('userType').isIn(['business', 'student', 'startup', 'freelancer'])
], async (req, res) => {
  try {
    console.log('⚡ Register endpoint called');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password, name, userType } = req.body;
    console.log(`📝 Processing registration for: ${email}`);

    // Check if user already exists (try MongoDB if configured, always fallback to file DB)
    let existingUser = null;
    const useMongo = process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('<user>');
    console.log(`🗄️  useMongo: ${useMongo}`);
    
    if (useMongo) {
      console.log('🔍 Checking MongoDB for existing user...');
      existingUser = await mongo.findUserByEmail(email);
      console.log(`📊 MongoDB result:`, existingUser ? 'Found' : 'Not found');
    }
    
    if (!existingUser) {
      console.log('📂 Reading file DB...');
      await db.read();
      existingUser = db.data.users.find(u => u.email === email);
      console.log(`📊 File DB result:`, existingUser ? 'Found' : 'Not found');
    }
    
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await hashPassword(password);

    // Generate OTP
    console.log('📲 Generating OTP...');
    const otp = generateOTP();

    // Create user object and persist
    const user = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      name,
      userType,
      otpVerified: false,
      createdAt: new Date()
    };
    console.log('👤 User object created');

    if (useMongo) {
      console.log('💾 Attempting to save to MongoDB...');
      // Try to persist to Mongo
      const mongoUser = await mongo.createUser({ ...user, createdAt: new Date(), otpVerified: false });
      console.log(`📊 MongoDB save result:`, mongoUser ? 'Success' : 'Failed');

      if (!mongoUser) {
        // MongoDB failed, fall back to file DB
        console.log('⚠️  MongoDB failed, falling back to file DB');
        db.data.users.push(user);
        db.data.otps.push({ email, otp, expiresAt: Date.now() + 10 * 60 * 1000 });
        console.log('📝 User and OTP saved to file DB');
        await db.write();
        console.log('✅ File DB written');
      } else {
        // MongoDB succeeded, store OTP there
        try {
          console.log('💾 Saving OTP to MongoDB...');
          await mongo.addOtp({ email, otp, expiresAt: Date.now() + 10 * 60 * 1000 });
          console.log('✅ OTP saved to MongoDB');
        } catch (e) {
          console.warn('⚠️ Could not save OTP to MongoDB:', e && e.message ? e.message : e);
        }

        // Also mirror to file DB for development/debugging so db.json contains records
        try {
          console.log('💾 Mirroring user and OTP to file DB for local debugging...');
          db.data.users.push(user);
          db.data.otps.push({ email, otp, expiresAt: Date.now() + 10 * 60 * 1000 });
          await db.write();
          console.log('✅ File DB written (mirror)');
        } catch (e) {
          console.warn('⚠️ Could not write mirror to file DB:', e && e.message ? e.message : e);
        }
      }
    } else {
      // Use file DB directly
      console.log('💾 Saving to file DB directly...');
      db.data.users.push(user);
      // Store OTP with expiry (10 minutes)
      db.data.otps.push({ email, otp, expiresAt: Date.now() + 10 * 60 * 1000 });
      console.log('📝 User and OTP prepared');
      await db.write();
      console.log('✅ File DB written');
    }

    // Send OTP email (best-effort)
    console.log('📧 Sending verification email...');
    try {
      await sendEmail(
        email,
        'AI Builder - Email Verification OTP',
        `Your OTP is: ${otp}`,
        `<h2>Welcome to AI Builder!</h2><p>Your verification OTP is: <strong>${otp}</strong></p>`
      );
      console.log('✅ Email sent successfully');
    } catch (emailError) {
      console.warn('⚠️  Email sending failed (non-critical):', emailError.message);
    }

    console.log('✨ Registration successful, sending response...');
    res.status(201).json({
      success: true,
      message: 'User registered. Please verify your email.',
      data: {
        userId: user.id,
        email: user.email,
        name: user.name,
        userType: user.userType
      }
    });
    console.log('🎉 Response sent!');

  } catch (error) {
    console.error('❌ Registration error:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

/**
 * @route   POST /api/v1/auth/verify-email
 * @desc    Verify user email with OTP
 * @access  Public
 */
router.post('/verify-email', [
  body('email').isEmail(),
  body('otp').isLength({ min: 6, max: 6 })
], async (req, res) => {
  try {
    const { email, otp } = req.body;
    const useMongo = process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('<user>');

    // Verify OTP: try MongoDB first, then file DB
    let otpRecord = null;
    let user = null;
    
    if (useMongo) {
      otpRecord = await mongo.findOtp(email, otp);
      user = await mongo.findUserByEmail(email);
    }
    
    if (!otpRecord) {
      // Fall back to file DB
      await db.read();
      const otpRecordIndex = db.data.otps.findIndex(o => o.email === email && o.otp === otp);
      otpRecord = otpRecordIndex !== -1 ? db.data.otps[otpRecordIndex] : null;
      user = db.data.users.find(u => u.email === email);
      
      if (!otpRecord || otpRecord.expiresAt < Date.now()) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
      }
      
      // Mark user as verified in file DB
      if (user) user.otpVerified = true;
      if (otpRecordIndex !== -1) db.data.otps.splice(otpRecordIndex, 1);
      await db.write();
    } else {
      // Verify in MongoDB
      if (!otpRecord || otpRecord.expiresAt < Date.now()) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
      }
      await mongo.markUserVerified(email);
      await mongo.removeOtp(email, otp);
    }

    // Generate tokens
    const accessToken = generateToken(user ? user.id : 'mock-user-id', 'access');
    const refreshToken = generateToken(user ? user.id : 'mock-user-id', 'refresh');

    res.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        accessToken,
        refreshToken,
        user: {
          email,
          verified: true
        }
      }
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
});

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const { email, password } = req.body;
    const useMongo = process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('<user>');
    
    // Find user: try MongoDB first, then file DB
    let user = null;
    if (useMongo) {
      user = await mongo.findUserByEmail(email);
    }
    if (!user) {
      await db.read();
      user = db.data.users.find(u => u.email === email);
    }
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare password
    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = generateToken(user.id, 'access');
    const refreshToken = generateToken(user.id, 'refresh');

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          userType: user.userType
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret');

    // Generate new access token
    const newAccessToken = generateToken(decoded.userId, 'access');

    res.json({
      success: true,
      data: { accessToken: newAccessToken }
    });

  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
});

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', (req, res) => {
  try {
    // Clear tokens (client-side) and session (server-side if needed)
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Logout failed' });
  }
});

/**
 * @route   POST /api/v1/auth/resend-otp
 * @desc    Resend OTP for email verification
 * @access  Public
 */
router.post('/resend-otp', [
  body('email').isEmail()
], async (req, res) => {
  try {
    const { email } = req.body;
    const useMongo = process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('<user>');

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP in database
    if (useMongo) {
      await mongo.addOtp({ email, otp, expiresAt });
    } else {
      // Store in file DB
      await db.read();
      // Remove old OTPs for this email
      db.data.otps = db.data.otps.filter(o => o.email !== email);
      // Add new OTP
      db.data.otps.push({ email, otp, expiresAt });
      await db.write();
    }

    // Send OTP via email (best-effort)
    await sendEmail(
      email,
      'AI Builder - OTP Resent',
      `Your new OTP is: ${otp}`,
      `<h2>New OTP</h2><p>Your verification OTP is: <strong>${otp}</strong></p><p>Valid for 10 minutes</p>`
    );

    res.json({
      success: true,
      message: 'OTP sent successfully'
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ success: false, message: 'Failed to resend OTP' });
  }
});

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post('/forgot-password', [
  body('email').isEmail()
], async (req, res) => {
  try {
    const { email } = req.body;
    const useMongo = process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('<user>');

    // Check if user exists
    let user = null;
    if (useMongo) {
      user = await mongo.findUserByEmail(email);
    } else {
      await db.read();
      user = db.data.users.find(u => u.email === email);
    }

    if (!user) {
      // Don't reveal whether email exists (security best practice)
      return res.json({
        success: true,
        message: 'If email exists, password reset link sent'
      });
    }

    // Generate reset token with user ID
    const resetToken = generateToken(user.id, 'reset');
    
    // Store reset token temporarily (30 minutes validity)
    const resetObj = {
      email,
      token: resetToken,
      expiresAt: Date.now() + 30 * 60 * 1000,
      used: false
    };
    
    if (useMongo) {
      // Store in MongoDB (create a reset collection or similar)
      // For now, we'll just use the token verification
    } else {
      // Store in file DB
      await db.read();
      db.data.resetTokens = db.data.resetTokens || [];
      db.data.resetTokens = db.data.resetTokens.filter(t => t.email !== email);
      db.data.resetTokens.push(resetObj);
      await db.write();
    }

    // Send reset email
    await sendEmail(
      email,
      'AI Builder - Password Reset',
      `Click here to reset: http://localhost:3000/reset-password?token=${resetToken}`,
      `<h2>Password Reset</h2><p><a href="http://localhost:3000/reset-password?token=${resetToken}">Click here to reset your password</a></p>`
    );

    res.json({
      success: true,
      message: 'Password reset link sent to email'
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send reset email' });
  }
});

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', [
  body('token').notEmpty(),
  body('newPassword').isLength({ min: 8 })
], async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const useMongo = process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('<user>');

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify token hasn't been used
    if (!useMongo) {
      await db.read();
      const resetToken = db.data.resetTokens?.find(t => t.token === token);
      if (!resetToken || resetToken.used || resetToken.expiresAt < Date.now()) {
        return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
      }
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user password
    if (useMongo) {
      // MongoDB update
      const result = await mongo.updateUserPassword(decoded.userId, hashedPassword);
    } else {
      // File DB update
      await db.read();
      const user = db.data.users.find(u => u.id === decoded.userId);
      if (user) {
        user.password = hashedPassword;
      }
      // Mark reset token as used
      const resetToken = db.data.resetTokens?.find(t => t.token === token);
      if (resetToken) {
        resetToken.used = true;
      }
      await db.write();
    }

    res.json({
      success: true,
      message: 'Password reset successfully. Please login with your new password.'
    });

  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid or expired token' });
  }
});


/**
 * @route   GET /api/v1
 * @desc    API status check
 * @access  Public
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'AI Builder Platform - Backend API',
    data: {
      server: {
        port: process.env.PORT || 5000,
        environment: process.env.NODE_ENV || 'development',
        url: `http://localhost:${process.env.PORT || 5000}`
      },
      status: 'Ready to accept requests'
    }
  });
});
export default router;
