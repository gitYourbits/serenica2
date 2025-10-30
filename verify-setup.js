#!/usr/bin/env node

/**
 * EmotionX Setup Verification Script
 * This script checks if all prerequisites are properly configured
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkMark(passed) {
  return passed ? '✅' : '❌';
}

async function checkNodeVersion() {
  const version = process.version;
  const major = parseInt(version.slice(1).split('.')[0]);
  const passed = major >= 18;
  log(`${checkMark(passed)} Node.js version: ${version} ${passed ? '(OK)' : '(Need v18+)'}`, passed ? 'green' : 'red');
  return passed;
}

function checkEnvFile() {
  const envPath = path.join(__dirname, '.env');
  const exists = fs.existsSync(envPath);
  
  if (!exists) {
    log(`${checkMark(false)} .env file: Not found`, 'red');
    log('  → Copy env.template to .env and add your Firebase config', 'yellow');
    return false;
  }
  
  // Check if env has placeholder values
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasPlaceholders = envContent.includes('your-firebase-api-key-here') || 
                          envContent.includes('your-project-id');
  
  if (hasPlaceholders) {
    log(`${checkMark(false)} .env file: Contains placeholder values`, 'yellow');
    log('  → Update .env with your actual Firebase configuration', 'yellow');
    return false;
  }
  
  // Check required variables
  const requiredVars = [
    'VITE_APP_API_KEY',
    'VITE_APP_AUTH_DOMAIN',
    'VITE_APP_PROJECT_ID',
    'VITE_APP_STORAGE_BUCKET',
    'VITE_APP_MESSAGING_SENDER_ID',
    'VITE_APP_APP_ID'
  ];
  
  const missingVars = requiredVars.filter(varName => !envContent.includes(varName));
  
  if (missingVars.length > 0) {
    log(`${checkMark(false)} .env file: Missing variables: ${missingVars.join(', ')}`, 'red');
    return false;
  }
  
  log(`${checkMark(true)} .env file: Configured`, 'green');
  return true;
}

function checkNodeModules() {
  const nmPath = path.join(__dirname, 'node_modules');
  const exists = fs.existsSync(nmPath);
  
  if (!exists) {
    log(`${checkMark(false)} node_modules: Not found`, 'red');
    log('  → Run: npm install', 'yellow');
    return false;
  }
  
  log(`${checkMark(true)} node_modules: Installed`, 'green');
  return true;
}

function checkFaceModels() {
  const modelsPath = path.join(__dirname, 'public', 'models');
  const requiredFiles = [
    'face_expression_model-shard1',
    'face_expression_model-weights_manifest.json',
    'face_landmark_68_model-shard1',
    'face_landmark_68_model-weights_manifest.json',
    'tiny_face_detector_model-shard1',
    'tiny_face_detector_model-weights_manifest.json'
  ];
  
  if (!fs.existsSync(modelsPath)) {
    log(`${checkMark(false)} Face detection models: Not found`, 'red');
    log('  → Run: npm run download-models', 'yellow');
    return false;
  }
  
  const missingFiles = requiredFiles.filter(file => 
    !fs.existsSync(path.join(modelsPath, file))
  );
  
  if (missingFiles.length > 0) {
    log(`${checkMark(false)} Face detection models: Incomplete (${missingFiles.length} missing)`, 'yellow');
    log('  → Run: npm run download-models', 'yellow');
    return false;
  }
  
  log(`${checkMark(true)} Face detection models: Downloaded`, 'green');
  return true;
}

async function checkOllama() {
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    
    if (!response.ok) {
      log(`${checkMark(false)} Ollama: Service not responding`, 'red');
      log('  → Start Ollama service', 'yellow');
      return false;
    }
    
    const data = await response.json();
    const hasLlama2 = data.models?.some(model => model.name.includes('llama2'));
    
    if (!hasLlama2) {
      log(`${checkMark(false)} Ollama: llama2 model not found`, 'yellow');
      log('  → Run: ollama pull llama2:latest', 'yellow');
      return false;
    }
    
    log(`${checkMark(true)} Ollama: Running with llama2 model`, 'green');
    return true;
  } catch (error) {
    log(`${checkMark(false)} Ollama: Not running`, 'red');
    log('  → Install Ollama: https://ollama.com/', 'yellow');
    log('  → Then run: ollama pull llama2:latest', 'yellow');
    return false;
  }
}

function checkFunctionsSetup() {
  const functionsPath = path.join(__dirname, 'functions', 'node_modules');
  const exists = fs.existsSync(functionsPath);
  
  if (!exists) {
    log(`${checkMark(false)} Firebase Functions: Dependencies not installed`, 'yellow');
    log('  → Run: cd functions && npm install', 'yellow');
    return false;
  }
  
  log(`${checkMark(true)} Firebase Functions: Configured`, 'green');
  return true;
}

async function runAllChecks() {
  log('\n╔════════════════════════════════════════════╗', 'cyan');
  log('║   EmotionX Setup Verification Script      ║', 'cyan');
  log('╚════════════════════════════════════════════╝\n', 'cyan');
  
  const results = {
    node: await checkNodeVersion(),
    modules: checkNodeModules(),
    env: checkEnvFile(),
    models: checkFaceModels(),
    functions: checkFunctionsSetup(),
    ollama: await checkOllama()
  };
  
  const allPassed = Object.values(results).every(r => r);
  
  log('\n' + '═'.repeat(46), 'cyan');
  log('\n📊 SUMMARY:', 'blue');
  log(`   Passed: ${Object.values(results).filter(r => r).length}/${Object.keys(results).length}`, 
      allPassed ? 'green' : 'yellow');
  
  if (allPassed) {
    log('\n🎉 All checks passed! You\'re ready to run:', 'green');
    log('   npm run dev\n', 'cyan');
  } else {
    log('\n⚠️  Some issues need attention. Follow the suggestions above.', 'yellow');
    log('   After fixing, run this script again to verify.\n', 'yellow');
  }
  
  log('═'.repeat(46) + '\n', 'cyan');
  
  return allPassed ? 0 : 1;
}

// Run the checks
runAllChecks()
  .then(exitCode => process.exit(exitCode))
  .catch(error => {
    log(`\n❌ Error running verification: ${error.message}`, 'red');
    process.exit(1);
  });

