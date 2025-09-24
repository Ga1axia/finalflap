// Configuration file for Flappy Bird Mobile Controller
// Update these values for your deployment

const config = {
    // WebSocket Server Configuration
    websocket: {
        // Default server URL - update this for your deployment
        serverUrl: 'ws://localhost:8080',
        
        // Alternative server URLs for different environments
        servers: {
            local: 'ws://localhost:8080',
            development: 'ws://your-dev-server.com:8080',
            production: 'wss://your-production-server.com',
            railway: 'wss://your-app.railway.app',
            heroku: 'wss://your-app.herokuapp.com'
        },
        
        // Connection settings
        reconnectAttempts: 5,
        reconnectDelay: 3000, // milliseconds
        pingInterval: 30000, // milliseconds
    },
    
    // Mobile Controller Configuration
    mobileController: {
        // Default server URL to show in the input field
        defaultServerUrl: 'ws://localhost:8080',
        
        // Preset server options for quick connection
        presetServers: [
            { name: 'Local Server', url: 'ws://localhost:8080' },
            { name: 'Your Server', url: 'wss://your-domain.com:8080' },
            { name: 'Railway', url: 'wss://your-app.railway.app' },
            { name: 'Heroku', url: 'wss://your-app.herokuapp.com' }
        ],
        
        // UI settings
        showPresetButtons: true,
        showInstructions: true,
        autoConnect: false, // Set to true to auto-connect on page load
    },
    
    // Game Configuration
    game: {
        // WebSocket server URL for the game to connect to
        websocketServerUrl: 'ws://localhost:8080',
        
        // Auto-reconnect settings
        autoReconnect: true,
        reconnectDelay: 3000,
    },
    
    // Server Configuration
    server: {
        port: process.env.PORT || 8080,
        host: process.env.HOST || '0.0.0.0',
        
        // CORS settings
        cors: {
            origin: '*', // Change to specific domains in production
            methods: ['GET', 'POST', 'OPTIONS'],
            headers: ['Content-Type', 'Authorization'],
            maxAge: 86400
        },
        
        // Security settings
        security: {
            rateLimit: {
                windowMs: 15 * 60 * 1000, // 15 minutes
                max: 100 // requests per window
            },
            maxConnections: 100,
            connectionTimeout: 30000
        }
    },
    
    // Environment detection
    environment: process.env.NODE_ENV || 'development',
    
    // Feature flags
    features: {
        logging: true,
        healthCheck: true,
        metrics: true,
        autoReconnect: true
    }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
} else if (typeof window !== 'undefined') {
    window.FlappyBirdConfig = config;
}
