# Flappy Bird Mobile Controller

This project adds mobile controller support to the Flappy Bird game using WebSockets for real-time communication.

## Features

- **Mobile-friendly controller**: Responsive web page optimized for mobile devices
- **Real-time communication**: WebSocket-based communication between mobile controller and game
- **Visual feedback**: Connection status indicators and button animations
- **Auto-reconnection**: Automatic reconnection if connection is lost
- **Cross-platform**: Works on any device with a modern web browser

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the WebSocket Server

```bash
npm start
```

The server will start on port 8080 by default. You can change this by setting the `PORT` environment variable.

### 3. Open the Game

Open `index.html` in your web browser to start the Flappy Bird game. The game will automatically attempt to connect to the WebSocket server.

### 4. Open the Mobile Controller

Open `mobile-controller.html` in a mobile device's web browser or on your computer. The mobile controller will be available at:
- `http://localhost:8080` (served by the WebSocket server)
- Or directly open `mobile-controller.html` in your browser

### 5. Connect and Play

1. On the mobile controller, enter the WebSocket server URL (default: `ws://localhost:8080`)
2. Click "Connect" to establish connection
3. Once connected, tap the "FLAP!" button to control the bird in the game

## How It Works

### Architecture

```
Mobile Device (Controller)  ←→  WebSocket Server  ←→  Game Browser
     mobile-controller.html         websocket-server.js      index.html + main.js
```

### Communication Flow

1. **Mobile Controller** sends "flap" command via WebSocket
2. **WebSocket Server** receives the command and forwards it to all connected game clients
3. **Game Browser** receives the "flap" command and triggers the bird to jump

### WebSocket Messages

- `mobile-client`: Sent by mobile controller when connecting
- `game-client`: Sent by game when connecting  
- `flap`: Command to make the bird jump
- `mobile-connected`: Confirmation sent to mobile controller
- `game-connected`: Confirmation sent to game

## Customization

### Change WebSocket Server URL

In `js/main.js`, modify the `websocketServerUrl` variable:
```javascript
var websocketServerUrl = 'ws://your-server:port';
```

### Change Server Port

Set the `PORT` environment variable:
```bash
PORT=3000 npm start
```

### Mobile Controller URL Parameters

You can pre-configure the server URL by adding it as a URL parameter:
```
http://localhost:8080?server=ws://your-server:8080
```

## Troubleshooting

### Connection Issues

1. **"Connection failed"**: Check that the WebSocket server is running and the URL is correct
2. **"Not connected to game server"**: Ensure the game is open and connected to the same WebSocket server
3. **Mobile controller not responding**: Check browser console for error messages

### Browser Compatibility

- **Game**: Works in all modern browsers
- **Mobile Controller**: Requires WebSocket support (all modern browsers)
- **WebSocket Server**: Requires Node.js 12+ and the `ws` package

### Network Issues

- Ensure both devices are on the same network
- Check firewall settings if connecting across different networks
- Use the computer's IP address instead of localhost when accessing from mobile devices

## Development

### Running in Development Mode

```bash
npm run dev
```

This will start the server with auto-restart on file changes.

### Adding New Commands

To add new mobile controller commands:

1. Add the command to the mobile controller's `sendFlapCommand()` function
2. Handle the command in the WebSocket server's message handler
3. Add the command handling in the game's WebSocket message handler

## File Structure

```
├── index.html                 # Main game file
├── mobile-controller.html     # Mobile controller interface
├── websocket-server.js        # WebSocket server
├── package.json              # Node.js dependencies
├── js/
│   └── main.js               # Game logic with WebSocket integration
└── css/
    └── main.css              # Game styles
```

## License

This project extends the original Flappy Bird game with mobile controller support. The original game is recreated by Nebez Briefkani based on the concept by Dong Nguyen.
