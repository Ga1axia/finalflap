const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// CORS headers for cross-origin requests
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
};

// Create HTTP server to serve the mobile controller
const server = http.createServer((req, res) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200, corsHeaders);
        res.end();
        return;
    }

    // Add CORS headers to all responses
    Object.keys(corsHeaders).forEach(key => {
        res.setHeader(key, corsHeaders[key]);
    });

    let filePath = req.url === '/' ? '/mobile-controller.html' : req.url;
    filePath = path.join(__dirname, filePath);
    
    // Set content type based on file extension
    const ext = path.extname(filePath);
    const contentTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.ico': 'image/x-icon'
    };
    
    const contentType = contentTypes[ext] || 'text/plain';
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, corsHeaders);
            res.end('File not found');
            return;
        }
        
        res.writeHead(200, { 
            'Content-Type': contentType,
            ...corsHeaders
        });
        res.end(data);
    });
});

// Create WebSocket server with CORS support
const wss = new WebSocket.Server({ 
    server,
    verifyClient: (info) => {
        // Allow connections from any origin for now
        // In production, you might want to restrict this
        return true;
    }
});

// Store connected clients
const gameClients = new Set();
const mobileClients = new Set();

// Client connection tracking
let connectionCount = 0;

wss.on('connection', (ws, req) => {
    connectionCount++;
    const clientId = connectionCount;
    const clientIP = req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unknown';
    
    console.log(`[${new Date().toISOString()}] Client #${clientId} connected from ${clientIP}`);
    console.log(`User-Agent: ${userAgent}`);
    
    // Set up ping/pong for connection health
    ws.isAlive = true;
    ws.on('pong', () => {
        ws.isAlive = true;
    });
    
    ws.on('message', (message) => {
        const data = message.toString();
        console.log(`[${new Date().toISOString()}] Client #${clientId} sent: ${data}`);
        
        if (data === 'flap') {
            // Forward flap command to all game clients
            let forwardedCount = 0;
            gameClients.forEach(gameClient => {
                if (gameClient.readyState === WebSocket.OPEN) {
                    gameClient.send('flap');
                    forwardedCount++;
                }
            });
            console.log(`Flap command forwarded to ${forwardedCount} game clients`);
        } else if (data === 'game-client') {
            // This is a game client connecting
            gameClients.add(ws);
            ws.clientType = 'game';
            console.log(`Game client #${clientId} registered (Total game clients: ${gameClients.size})`);
            
            // Send confirmation
            ws.send('game-connected');
        } else if (data === 'mobile-client') {
            // This is a mobile client connecting
            mobileClients.add(ws);
            ws.clientType = 'mobile';
            console.log(`Mobile client #${clientId} registered (Total mobile clients: ${mobileClients.size})`);
            
            // Send confirmation
            ws.send('mobile-connected');
        } else {
            console.log(`Unknown message from client #${clientId}: ${data}`);
        }
    });
    
    ws.on('close', (code, reason) => {
        console.log(`[${new Date().toISOString()}] Client #${clientId} disconnected (Code: ${code}, Reason: ${reason})`);
        gameClients.delete(ws);
        mobileClients.delete(ws);
        console.log(`Remaining clients - Game: ${gameClients.size}, Mobile: ${mobileClients.size}`);
    });
    
    ws.on('error', (error) => {
        console.error(`[${new Date().toISOString()}] WebSocket error for client #${clientId}:`, error);
        gameClients.delete(ws);
        mobileClients.delete(ws);
    });
});

// Ping/pong mechanism to keep connections alive
const pingInterval = setInterval(() => {
    wss.clients.forEach((ws) => {
        if (ws.isAlive === false) {
            console.log('Terminating inactive connection');
            return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
    });
}, 30000); // Ping every 30 seconds

// Start the server
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
    console.log(`🚀 WebSocket server running on ${HOST}:${PORT}`);
    console.log(`📱 Mobile controller available at: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
    console.log(`🔌 WebSocket endpoint: ws://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
    console.log(`🌐 For external access, use your public IP or domain name`);
    console.log(`📊 Server ready to accept connections...`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    clearInterval(pingInterval);
    
    // Close all WebSocket connections
    wss.clients.forEach((ws) => {
        ws.close(1000, 'Server shutting down');
    });
    
    server.close(() => {
        console.log('✅ Server closed gracefully');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    clearInterval(pingInterval);
    
    wss.clients.forEach((ws) => {
        ws.close(1000, 'Server shutting down');
    });
    
    server.close(() => {
        console.log('✅ Server closed gracefully');
        process.exit(0);
    });
});
