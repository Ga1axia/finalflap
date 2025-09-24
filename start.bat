@echo off
echo Starting Flappy Bird Mobile Controller System...
echo.
echo 1. Starting WebSocket Server...
start "WebSocket Server" cmd /k "npm start"
echo.
echo 2. Waiting for server to start...
timeout /t 3 /nobreak > nul
echo.
echo 3. Opening game in browser...
start "" "index.html"
echo.
echo 4. Opening mobile controller in browser...
start "" "mobile-controller.html"
echo.
echo System started! 
echo - Game: index.html
echo - Mobile Controller: mobile-controller.html  
echo - WebSocket Server: http://localhost:8080
echo.
echo Press any key to exit...
pause > nul
