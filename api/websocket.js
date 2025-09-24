// Vercel API route for WebSocket-like functionality
// Note: Vercel doesn't support WebSockets directly, so we'll use Server-Sent Events (SSE)
// and polling for a similar real-time experience

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
        // Handle SSE connection
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
        });
        
        // Send initial connection message
        res.write(`data: ${JSON.stringify({ type: 'connected', message: 'Connected to server' })}\n\n`);
        
        // Keep connection alive
        const keepAlive = setInterval(() => {
            res.write(`data: ${JSON.stringify({ type: 'ping' })}\n\n`);
        }, 30000);
        
        // Clean up on close
        req.on('close', () => {
            clearInterval(keepAlive);
        });
        
        return;
    }
    
    if (req.method === 'POST') {
        // Handle message sending
        const { message, type } = req.body;
        
        if (type === 'flap') {
            // Broadcast flap command to all connected clients
            // In a real implementation, you'd use a message queue or database
            res.status(200).json({ 
                success: true, 
                message: 'Flap command received',
                timestamp: new Date().toISOString()
            });
        } else if (type === 'register') {
            res.status(200).json({ 
                success: true, 
                message: 'Client registered',
                clientType: message
            });
        } else {
            res.status(400).json({ 
                success: false, 
                message: 'Unknown message type' 
            });
        }
        
        return;
    }
    
    res.status(405).json({ success: false, message: 'Method not allowed' });
}
