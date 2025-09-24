// Vercel API route for WebSocket-like connections
// This simulates WebSocket behavior using Server-Sent Events and HTTP requests

// In-memory storage for commands (in production, use Redis or database)
let gameCommands = [];
let connectedClients = new Set();

export default function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method === 'GET') {
        // Handle SSE connection for real-time updates
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
        });
        
        // Add client to connected clients
        const clientId = Date.now() + Math.random();
        connectedClients.add(clientId);
        
        // Send initial connection message
        res.write(`data: ${JSON.stringify({ 
            type: 'connected', 
            message: 'Connected to Flappy Bird server',
            timestamp: new Date().toISOString()
        })}\n\n`);
        
        // Keep connection alive with periodic pings
        const keepAlive = setInterval(() => {
            res.write(`data: ${JSON.stringify({ 
                type: 'ping',
                timestamp: new Date().toISOString()
            })}\n\n`);
        }, 30000);
        
        // Clean up on close
        req.on('close', () => {
            clearInterval(keepAlive);
            connectedClients.delete(clientId);
        });
        
        return;
    }
    
    if (req.method === 'POST') {
        // Handle message sending
        const { message, type, clientType } = req.body;
        
        if (type === 'flap') {
            // Store the flap command for the game to pick up
            const command = {
                type: 'flap',
                timestamp: new Date().toISOString(),
                id: Date.now() + Math.random()
            };
            gameCommands.push(command);
            
            console.log('Flap command received and stored:', command);
            console.log('Total commands in queue:', gameCommands.length);
            
            // Keep only the last 10 commands to prevent memory buildup
            if (gameCommands.length > 10) {
                gameCommands = gameCommands.slice(-10);
            }
            
            res.status(200).json({ 
                success: true, 
                message: 'Flap command received and queued',
                timestamp: new Date().toISOString()
            });
        } else if (type === 'register') {
            res.status(200).json({ 
                success: true, 
                message: `${clientType} client registered successfully`,
                clientType: clientType,
                timestamp: new Date().toISOString()
            });
        } else if (type === 'getCommands') {
            // Game client requesting commands
            const commands = [...gameCommands];
            console.log('Game client requesting commands, returning:', commands.length, 'commands');
            gameCommands = []; // Clear commands after sending
            res.status(200).json({ 
                success: true, 
                commands: commands,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(400).json({ 
                success: false, 
                message: 'Unknown message type',
                receivedType: type
            });
        }
        
        return;
    }
    
    res.status(405).json({ success: false, message: 'Method not allowed' });
}
