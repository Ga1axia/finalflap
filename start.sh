#!/bin/bash

echo "Starting Flappy Bird Mobile Controller System..."
echo

echo "1. Starting WebSocket Server..."
npm start &
SERVER_PID=$!

echo
echo "2. Waiting for server to start..."
sleep 3

echo
echo "3. Opening game in browser..."
if command -v xdg-open > /dev/null; then
    xdg-open "index.html"
elif command -v open > /dev/null; then
    open "index.html"
else
    echo "Please open index.html in your browser"
fi

echo
echo "4. Opening mobile controller in browser..."
if command -v xdg-open > /dev/null; then
    xdg-open "mobile-controller.html"
elif command -v open > /dev/null; then
    open "mobile-controller.html"
else
    echo "Please open mobile-controller.html in your browser"
fi

echo
echo "System started!"
echo "- Game: index.html"
echo "- Mobile Controller: mobile-controller.html"
echo "- WebSocket Server: http://localhost:8080"
echo
echo "Press Ctrl+C to stop the server..."

# Wait for user to stop
wait $SERVER_PID
