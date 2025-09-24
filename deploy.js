#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Deployment script for Flappy Bird Mobile Controller
console.log('🚀 Flappy Bird Mobile Controller Deployment Script');
console.log('================================================\n');

// Read configuration
let config;
try {
    config = require('./config.js');
} catch (error) {
    console.error('❌ Error reading config.js:', error.message);
    process.exit(1);
}

// Get deployment target from command line argument
const target = process.argv[2] || 'local';

console.log(`📦 Deploying to: ${target}`);

// Update mobile controller with correct server URL
function updateMobileController(serverUrl) {
    const mobileControllerPath = 'mobile-controller-standalone.html';
    
    if (!fs.existsSync(mobileControllerPath)) {
        console.error('❌ Mobile controller file not found:', mobileControllerPath);
        return false;
    }
    
    let content = fs.readFileSync(mobileControllerPath, 'utf8');
    
    // Update default server URL
    content = content.replace(
        /value="" placeholder="Enter WebSocket server URL"/,
        `value="${serverUrl}" placeholder="Enter WebSocket server URL"`
    );
    
    // Update preset servers
    const presetServers = config.mobileController.presetServers;
    let presetButtonsHTML = '';
    presetServers.forEach(server => {
        presetButtonsHTML += `<button class="preset-btn" onclick="setServerUrl('${server.url}')">${server.name}</button>\n                `;
    });
    
    content = content.replace(
        /<div class="preset-buttons">[\s\S]*?<\/div>/,
        `<div class="preset-buttons">\n                ${presetButtonsHTML.trim()}\n            </div>`
    );
    
    fs.writeFileSync(mobileControllerPath, content);
    console.log('✅ Mobile controller updated with server URL:', serverUrl);
    return true;
}

// Update game configuration
function updateGameConfig(serverUrl) {
    const gameConfigPath = 'js/main.js';
    
    if (!fs.existsSync(gameConfigPath)) {
        console.error('❌ Game configuration file not found:', gameConfigPath);
        return false;
    }
    
    let content = fs.readFileSync(gameConfigPath, 'utf8');
    
    // Update WebSocket server URL
    content = content.replace(
        /var websocketServerUrl = '[^']*';/,
        `var websocketServerUrl = '${serverUrl}';`
    );
    
    fs.writeFileSync(gameConfigPath, content);
    console.log('✅ Game configuration updated with server URL:', serverUrl);
    return true;
}

// Create deployment package
function createDeploymentPackage() {
    const packageDir = 'deployment-package';
    
    if (fs.existsSync(packageDir)) {
        fs.rmSync(packageDir, { recursive: true });
    }
    fs.mkdirSync(packageDir);
    
    // Copy necessary files
    const filesToCopy = [
        'mobile-controller-standalone.html',
        'index.html',
        'js/main.js',
        'css/main.css',
        'css/reset.css',
        'assets/',
        'websocket-server.js',
        'package.json',
        'config.js'
    ];
    
    filesToCopy.forEach(file => {
        const srcPath = file;
        const destPath = path.join(packageDir, file);
        
        if (fs.existsSync(srcPath)) {
            if (fs.statSync(srcPath).isDirectory()) {
                fs.cpSync(srcPath, destPath, { recursive: true });
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
            console.log(`📁 Copied: ${file}`);
        } else {
            console.warn(`⚠️  File not found: ${file}`);
        }
    });
    
    // Create README for deployment
    const readmeContent = `# Flappy Bird Mobile Controller - Deployment Package

This package contains all files needed to deploy the Flappy Bird Mobile Controller system.

## Files Included:
- mobile-controller-standalone.html - Mobile controller interface
- index.html - Main game file
- js/main.js - Game logic with WebSocket support
- websocket-server.js - WebSocket server
- package.json - Dependencies
- config.js - Configuration file

## Quick Start:
1. Install dependencies: npm install
2. Start server: npm start
3. Open index.html in browser for the game
4. Open mobile-controller-standalone.html for the controller

## Server URL:
Current configuration: ${config.websocket.servers[target] || config.websocket.serverUrl}

Generated on: ${new Date().toISOString()}
`;
    
    fs.writeFileSync(path.join(packageDir, 'README.md'), readmeContent);
    console.log('📄 Created deployment README');
    
    return packageDir;
}

// Main deployment logic
async function deploy() {
    try {
        // Get server URL for target
        const serverUrl = config.websocket.servers[target] || config.websocket.serverUrl;
        
        if (!serverUrl) {
            console.error(`❌ No server URL configured for target: ${target}`);
            console.log('Available targets:', Object.keys(config.websocket.servers));
            process.exit(1);
        }
        
        console.log(`🔗 Using server URL: ${serverUrl}\n`);
        
        // Update configurations
        updateMobileController(serverUrl);
        updateGameConfig(serverUrl);
        
        // Create deployment package
        const packageDir = createDeploymentPackage();
        
        console.log('\n✅ Deployment preparation complete!');
        console.log(`📦 Deployment package created in: ${packageDir}/`);
        console.log(`🔗 Server URL configured: ${serverUrl}`);
        
        // Platform-specific instructions
        switch (target) {
            case 'railway':
                console.log('\n🚂 Railway Deployment:');
                console.log('1. Upload the deployment-package folder to Railway');
                console.log('2. Set environment variables: PORT, HOST');
                console.log('3. Deploy!');
                break;
                
            case 'heroku':
                console.log('\n🟣 Heroku Deployment:');
                console.log('1. Create a new Heroku app');
                console.log('2. Upload the deployment-package folder');
                console.log('3. Add Procfile: web: node websocket-server.js');
                console.log('4. Deploy!');
                break;
                
            case 'github':
                console.log('\n🐙 GitHub Pages Deployment:');
                console.log('1. Upload mobile-controller-standalone.html to GitHub Pages');
                console.log('2. Rename it to index.html');
                console.log('3. Deploy your WebSocket server separately');
                break;
                
            default:
                console.log('\n🏠 Local Deployment:');
                console.log('1. Run: npm install');
                console.log('2. Run: npm start');
                console.log('3. Open index.html for the game');
                console.log('4. Open mobile-controller-standalone.html for the controller');
        }
        
    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
        process.exit(1);
    }
}

// Run deployment
deploy();
