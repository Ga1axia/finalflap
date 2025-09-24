// Vercel API route for WebSocket-like connections
// This simulates WebSocket behavior using Server-Sent Events and HTTP requests

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
        });
        
        return;
    }
    
    if (req.method === 'POST') {
        // Handle message sending
        const { message, type, clientType } = req.body;
        
        if (type === 'flap') {
            // In a real implementation, you'd broadcast this to all connected clients
            // For now, we'll just acknowledge receipt
            res.status(200).json({ 
                success: true, 
                message: 'Flap command received and processed',
                timestamp: new Date().toISOString()
            });
        } else if (type === 'register') {
            res.status(200).json({ 
                success: true, 
                message: `${clientType} client registered successfully`,
                clientType: clientType,
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
