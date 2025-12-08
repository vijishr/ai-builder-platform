#!/usr/bin/env node

/**
 * AI Builder Backend Startup Script
 * Installs dependencies and starts the server
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const backendDir = __dirname;

console.log('╔════════════════════════════════════════╗');
console.log('║  AI BUILDER BACKEND - STARTUP         ║');
console.log('╚════════════════════════════════════════╝\n');

// Check if node_modules exists
const nodeModulesPath = path.join(backendDir, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('Installing dependencies...');
  try {
    execSync('npm install --legacy-peer-deps', { 
      cwd: backendDir, 
      stdio: 'inherit' 
    });
    console.log('✓ Dependencies installed\n');
  } catch (err) {
    console.error('✗ npm install failed:', err.message);
    process.exit(1);
  }
}

console.log('Starting backend server...\n');
require('./src/server.js');
