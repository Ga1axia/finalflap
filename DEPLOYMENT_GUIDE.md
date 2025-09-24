# Deployment Guide for Flappy Bird Mobile Controller

This guide covers how to deploy the mobile controller system for remote hosting, allowing users to control the game from anywhere on the internet.

## Architecture Overview

```
Mobile Device (Hosted)  ←→  Your WebSocket Server  ←→  Game Browser
   (GitHub Pages, etc.)         (VPS/Cloud)              (Anywhere)
```

## Option 1: Deploy Mobile Controller to Static Hosting

### GitHub Pages (Recommended for Mobile Controller)

1. **Create a new repository** for your mobile controller
2. **Upload the standalone mobile controller**:
   ```bash
   # Copy the standalone mobile controller
   cp mobile-controller-standalone.html index.html
   ```

3. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Select "Deploy from a branch" → "main"
   - Your mobile controller will be available at: `https://yourusername.github.io/your-repo-name`

4. **Update the default server URL** in the mobile controller to point to your WebSocket server

### Netlify

1. **Drag and drop** the `mobile-controller-standalone.html` file to Netlify
2. **Rename** it to `index.html` in the Netlify dashboard
3. **Your mobile controller** will be available at: `https://your-site-name.netlify.app`

### Vercel

1. **Create a new project** and upload `mobile-controller-standalone.html`
2. **Rename** to `index.html`
3. **Deploy** - your mobile controller will be available at: `https://your-project.vercel.app`

## Option 2: Deploy WebSocket Server to Cloud

### Railway (Recommended for WebSocket Server)

1. **Connect your GitHub repository** to Railway
2. **Add a `railway.json` file**:
   ```json
   {
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "npm start",
       "restartPolicyType": "ON_FAILURE",
       "restartPolicyMaxRetries": 10
     }
   }
   ```

3. **Set environment variables**:
   - `PORT`: 8080 (or let Railway assign one)
   - `HOST`: 0.0.0.0

4. **Deploy** - your WebSocket server will be available at: `wss://your-app.railway.app`

### Heroku

1. **Create a `Procfile`**:
   ```
   web: node websocket-server.js
   ```

2. **Deploy to Heroku**:
   ```bash
   git add .
   git commit -m "Deploy WebSocket server"
   git push heroku main
   ```

3. **Your WebSocket server** will be available at: `wss://your-app.herokuapp.com`

### DigitalOcean App Platform

1. **Create a new app** and connect your repository
2. **Configure build settings**:
   - Build Command: `npm install`
   - Run Command: `npm start`
3. **Set environment variables**:
   - `PORT`: 8080
   - `HOST`: 0.0.0.0

### VPS Deployment (Ubuntu/Debian)

1. **Set up your VPS** with Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Clone your repository**:
   ```bash
   git clone https://github.com/yourusername/flappy-bird-mobile-controller.git
   cd flappy-bird-mobile-controller
   npm install
   ```

3. **Install PM2** for process management:
   ```bash
   sudo npm install -g pm2
   ```

4. **Start the server**:
   ```bash
   pm2 start websocket-server.js --name "flappy-bird-server"
   pm2 save
   pm2 startup
   ```

5. **Configure Nginx** (optional, for better performance):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:8080;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Option 3: Complete Setup with Custom Domain

### 1. Deploy WebSocket Server

Choose one of the cloud options above and note your server URL.

### 2. Deploy Mobile Controller

Deploy to GitHub Pages, Netlify, or Vercel and update the default server URL.

### 3. Update Game Configuration

In your `js/main.js`, update the WebSocket server URL:
```javascript
var websocketServerUrl = 'wss://your-server-domain.com';
```

### 4. Test the Connection

1. Open your game in one browser
2. Open your mobile controller in another browser/device
3. Enter your WebSocket server URL
4. Test the connection

## Environment Variables

Create a `.env` file for local development:
```env
PORT=8080
HOST=0.0.0.0
NODE_ENV=production
```

## Security Considerations

### For Production Deployment

1. **Rate Limiting**: Add rate limiting to prevent spam
2. **Authentication**: Add simple authentication if needed
3. **CORS**: Restrict CORS to your specific domains
4. **HTTPS/WSS**: Always use secure connections in production

### Updated WebSocket Server with Security

```javascript
// Add to websocket-server.js
const rateLimit = require('express-rate-limit');

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Apply rate limiting
server.use(limiter);

// Restrict CORS to specific domains
const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://your-mobile-controller-domain.com',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
};
```

## Monitoring and Maintenance

### Health Check Endpoint

Add to your WebSocket server:
```javascript
server.on('request', (req, res) => {
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'healthy',
            gameClients: gameClients.size,
            mobileClients: mobileClients.size,
            uptime: process.uptime()
        }));
    }
});
```

### Logging

Consider adding proper logging with Winston or similar:
```bash
npm install winston
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure CORS headers are properly set
2. **WebSocket Connection Failed**: Check if the server is running and accessible
3. **Mobile Controller Not Responding**: Verify the WebSocket URL is correct
4. **Game Not Receiving Commands**: Check if the game is connected to the same server

### Debug Steps

1. **Check server logs** for connection attempts
2. **Test WebSocket connection** using browser dev tools
3. **Verify firewall settings** if using VPS
4. **Check SSL certificates** for WSS connections

## Cost Estimates

- **GitHub Pages**: Free
- **Netlify**: Free tier available
- **Vercel**: Free tier available
- **Railway**: $5/month for hobby plan
- **Heroku**: $7/month for basic plan
- **DigitalOcean**: $5/month for basic droplet
- **VPS**: $3-10/month depending on provider

## Quick Start Commands

```bash
# Local development
npm install
npm start

# Deploy to Railway
railway login
railway init
railway up

# Deploy to Heroku
heroku create your-app-name
git push heroku main

# Deploy to VPS
pm2 start websocket-server.js --name "flappy-bird-server"
pm2 save
pm2 startup
```

Choose the deployment option that best fits your needs and budget!
