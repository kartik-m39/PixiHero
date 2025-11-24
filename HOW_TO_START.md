# How to Start the Multiplayer Game

## Prerequisites

Make sure all dependencies are installed:
```bash
npm install --include=dev
```

## Starting the Application

### Step 1: Start the WebSocket Signaling Server

In Terminal 1, run:
```bash
npm run server
```

You should see:
```
WebSocket signaling server running on port 8080
```

### Step 2: Start the Vite Development Server

In Terminal 2, run:
```bash
npm run dev
```

You should see something like:
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## Testing Multiplayer

1. **Open the first browser window**: Go to `http://localhost:5173`
2. **Enter a room ID**: Type any room ID (e.g., "room123") and click "Join Room"
3. **Open a second browser window**: Go to `http://localhost:5173` again (in a new tab or window)
4. **Enter the SAME room ID**: Type the exact same room ID ("room123") and click "Join Room"
5. **Move around**: Use arrow keys or WASD in one window
6. **Watch the other window**: You should see the other player (in red tint) moving!
7. **Try the chat**: Type messages in the chat box (bottom-right corner)

## Important Notes

- **Same Room ID**: Players must enter the EXACT same room ID to see each other
- **Both servers must be running**: The WebSocket server (Terminal 1) AND the Vite dev server (Terminal 2)
- **Check browser console**: If something doesn't work, open the browser console (F12) to see errors

## If You Don't See Other Players

1. **Check that both servers are running**:
   - Terminal 1 should show "WebSocket signaling server running on port 8080"
   - Terminal 2 should show the Vite dev server running
   
2. **Verify same room ID**: Make sure you entered the exact same room ID in both windows

3. **Check browser console** (press F12):
   - Look for "Connected to signaling server" message
   - Look for "Connected to peer: xxxxx" messages
   - If you see Stream errors, the polyfills might not be loaded correctly

4. **Refresh both browser windows**: Sometimes the WebRTC connection needs a fresh start

5. **Try a different browser**: Some browsers have stricter WebRTC policies

## Common Issues

### Stream/Buffer Errors in Console
If you see errors about "Stream", "Buffer", or "process", the polyfills are not loading. The vite-polyfills.js file should automatically load them.

### Port 8080 Already in Use
If port 8080 is already taken:
1. Edit `server.js` and change the port number
2. Edit `src/services/WebRTCService.ts` and update the WebSocket URL

### White Screen
- Check browser console for errors
- Make sure npm install completed successfully
- Try clearing browser cache

## Architecture

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Player 1   │         │   Signaling  │         │   Player 2   │
│  (Browser)   │◄───────►│    Server    │◄───────►│  (Browser)   │
│              │         │ (port 8080)  │         │              │
└───────┬──────┘         └──────────────┘         └──────┬───────┘
        │                                                 │
        │         WebRTC Data Channel (P2P)              │
        │         Movement streaming                      │
        └─────────────────────────────────────────────────┘

- Chat messages: Go through WebSocket server
- Player movements: Direct P2P via WebRTC data channels
- Room management: Handled by signaling server
```

## Quick Start Script

For convenience, you can use the start script (runs both servers):
```bash
./start.sh
```

Press Ctrl+C to stop both servers.
