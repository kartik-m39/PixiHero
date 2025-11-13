# Quick Reference - PixiHero Multiplayer

## Start the Game

```bash
# Terminal 1 - Start signaling server
npm run server

# Terminal 2 - Start game client  
npm run dev

# Or use quick start script
./start.sh
```

## URLs
- **Game**: http://localhost:5173
- **Signaling Server**: ws://localhost:8080

## How to Play Multiplayer

1. **Start both servers** (see above)
2. **Open 2+ browser windows** at http://localhost:5173
3. **Enter the same Room ID** in all windows (e.g., "room123")
4. **Move with arrow keys** or WASD
5. **See other players** appear in red
6. **Chat** using the chat box (bottom-right)

## Key Files

| File | Purpose |
|------|---------|
| `server.js` | WebSocket signaling server |
| `src/services/WebRTCService.ts` | WebRTC & WebSocket client |
| `src/components/RoomDialog/` | Room selection UI |
| `src/components/ChatBox/` | Chat interface |
| `src/components/PeerHero/` | Render remote players |
| `src/components/Experience/` | Main game component |

## Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│  Player 1   │         │  Signaling  │         │  Player 2   │
│   Browser   │◄───────►│   Server    │◄───────►│   Browser   │
└──────┬──────┘         │(WebSocket)  │         └──────┬──────┘
       │                └─────────────┘                │
       │                                               │
       │         WebRTC Data Channel                   │
       │         (Movement P2P)                        │
       └───────────────────────────────────────────────┘

Chat: Goes through WebSocket server
Movement: Direct P2P via WebRTC
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't see other players | Check same Room ID, server running |
| Chat not working | Restart signaling server |
| Build fails | Run `npm install --include=dev` |
| Port 8080 in use | Change port in server.js and WebRTCService.ts |

## Development

```bash
# Install dependencies
npm install --include=dev

# Run in development
npm run dev

# Build for production
npm run build

# Run production build
npm run preview
```

## Technologies

- **React 19** + TypeScript
- **PixiJS 8** for rendering
- **WebRTC** (simple-peer) for P2P
- **WebSocket** (ws) for signaling
- **Vite** for bundling
