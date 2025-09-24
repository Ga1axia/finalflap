# Vercel Deployment Guide for Flappy Bird Mobile Controller

This guide shows you how to deploy the entire Flappy Bird project on Vercel with a QR code subpage for easy mobile access.

## 🎯 What You'll Get

- **Main Game**: `https://your-app.vercel.app/` - The Flappy Bird game
- **Mobile Controller**: `https://your-app.vercel.app/mobile` - Mobile controller interface
- **QR Code Page**: `https://your-app.vercel.app/qr` - QR code for easy mobile access

## 📁 Project Structure

```
floppybird/
├── index.html                    # Main game (uses main-vercel.js)
├── mobile-controller-vercel.html # Mobile controller
├── qr-code.html                  # QR code page
├── js/
│   ├── main-vercel.js           # Game with Vercel API support
│   └── main.js                   # Original game
├── api/
│   └── connect.js               # Vercel API route
├── vercel.json                  # Vercel configuration
└── assets/                      # Game assets
```

## 🚀 Quick Deployment

### Option 1: Deploy from GitHub

1. **Push your code to GitHub**
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the configuration

3. **Deploy!** - Vercel will automatically deploy your project

### Option 2: Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts
```

### Option 3: Drag & Drop

1. **Zip your project** (excluding node_modules)
2. **Go to [vercel.com](https://vercel.com)**
3. **Drag and drop** the zip file
4. **Deploy!**

## 🔧 Configuration

The `vercel.json` file handles all routing:

```json
{
  "routes": [
    {
      "src": "/api/connect",
      "dest": "/api/connect.js"
    },
    {
      "src": "/mobile",
      "dest": "/mobile-controller-vercel.html"
    },
    {
      "src": "/qr",
      "dest": "/qr-code.html"
    },
    {
      "src": "/",
      "dest": "/index.html"
    }
  ]
}
```

## 📱 How It Works

### 1. Main Game (`/`)
- Uses `main-vercel.js` with API integration
- Registers as "game" client with the API
- Responds to mobile commands

### 2. Mobile Controller (`/mobile`)
- Uses `mobile-controller-vercel.html`
- Registers as "mobile" client with the API
- Sends "flap" commands via API

### 3. QR Code Page (`/qr`)
- Displays QR code for easy mobile access
- Auto-generates QR code for mobile controller URL
- Click to copy URL functionality

### 4. API (`/api/connect`)
- Handles client registration
- Processes "flap" commands
- Manages Server-Sent Events (SSE) for real-time communication

## 🎮 Usage

1. **Open the game**: Go to `https://your-app.vercel.app/`
2. **Get mobile controller**: Go to `https://your-app.vercel.app/qr`
3. **Scan QR code** with your mobile device
4. **Start playing** - tap "FLAP!" on mobile to control the bird!

## 🔄 Real-time Communication

Since Vercel doesn't support WebSockets, the system uses:

- **Server-Sent Events (SSE)** for real-time updates
- **HTTP POST requests** for sending commands
- **Polling mechanism** for responsive gameplay

## 🛠️ Customization

### Update Game Logic
Edit `js/main-vercel.js` to modify game behavior.

### Update Mobile Controller
Edit `mobile-controller-vercel.html` to change the mobile interface.

### Update API
Edit `api/connect.js` to modify the server logic.

## 📊 Monitoring

Vercel provides built-in monitoring:
- **Function logs**: Check API performance
- **Analytics**: Track usage
- **Deployments**: Monitor deployments

## 🔒 Security

The current setup is open for demo purposes. For production:

1. **Add authentication** to the API
2. **Rate limiting** for commands
3. **CORS restrictions** for specific domains
4. **Input validation** for all requests

## 💰 Cost

- **Vercel Hobby Plan**: Free (100GB bandwidth, 100GB-hours function execution)
- **Vercel Pro Plan**: $20/month (unlimited bandwidth, 1000GB-hours function execution)

## 🆘 Troubleshooting

### Common Issues

1. **Mobile controller not connecting**:
   - Check if API is working: `https://your-app.vercel.app/api/connect`
   - Check browser console for errors

2. **Game not responding to mobile**:
   - Ensure game is open and connected
   - Check API logs in Vercel dashboard

3. **QR code not working**:
   - Ensure QR code page is accessible
   - Check if mobile device can access the URL

### Debug Steps

1. **Check Vercel logs**:
   ```bash
   vercel logs
   ```

2. **Test API directly**:
   ```bash
   curl -X POST https://your-app.vercel.app/api/connect \
     -H "Content-Type: application/json" \
     -d '{"type":"register","clientType":"game"}'
   ```

3. **Check browser console** for JavaScript errors

## 🎉 Result

You now have a complete Flappy Bird game with mobile controller support hosted entirely on Vercel! Users can:

- Play the game on their computer
- Scan a QR code to get the mobile controller
- Control the game from their mobile device
- Everything works in real-time!

## 📞 Support

If you need help:
1. Check Vercel documentation
2. Check browser console for errors
3. Test API endpoints manually
4. Check Vercel function logs
