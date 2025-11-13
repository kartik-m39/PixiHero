# PixiHero - Multiplayer WebRTC Game

A real-time multiplayer game built with PixiJS, React, and WebRTC. Players can move around in the same room and communicate via chat, with peer-to-peer movement streaming through WebRTC data channels and chat messaging through WebSockets.

## Features

- **Room-based multiplayer**: Players enter a room ID to join specific game rooms
- **WebRTC P2P movement**: Player movements are streamed peer-to-peer using WebRTC data channels
- **WebSocket chat**: Chat messages are sent through WebSocket server to all players in the room
- **Real-time synchronization**: See other players move in real-time
- **Built with PixiJS**: High-performance 2D rendering
- **React integration**: Modern React architecture with TypeScript

## Architecture

### Movement Streaming (WebRTC)
- Player movements are sent via WebRTC data channels peer-to-peer
- Low latency direct connections between players
- No server bottleneck for movement data

### Chat System (WebSocket)
- Chat messages go through WebSocket signaling server
- Broadcasted to all players in the same room
- Reliable message delivery

### Signaling Server (WebSocket)
- Handles room management
- Facilitates WebRTC peer connections
- Routes chat messages to room participants

## Setup and Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd PixiHero
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

You need to run **two separate processes**: the signaling server and the development client.

### 1. Start the WebSocket Signaling Server

In one terminal:
```bash
npm run server
```

This starts the WebSocket server on `ws://localhost:8080`

### 2. Start the Vite Development Server

In another terminal:
```bash
npm run dev
```

This starts the client application (usually on `http://localhost:5173`)

### 3. Open Multiple Browser Windows

Open the application in multiple browser windows/tabs and enter the **same room ID** to join the same game room.

## How to Use

1. **Enter Room ID**: When you load the application, a dialog will ask for a room ID
2. **Join Room**: Enter any room ID (e.g., "room123") and click "Join Room"
3. **Move Your Character**: Use arrow keys or WASD to move your character
4. **See Other Players**: Other players in the same room will appear with a red tint
5. **Chat**: Use the chat box in the bottom-right corner to send messages to all players in your room
6. **Multiple Rooms**: Players with different room IDs will be in separate rooms and won't see each other

## Project Structure

```
PixiHero/
├── src/
│   ├── components/
│   │   ├── Experience/       # Main game canvas component
│   │   ├── Hero/              # Local player character
│   │   ├── PeerHero/          # Remote player character
│   │   ├── ChatBox/           # Chat UI component
│   │   ├── RoomDialog/        # Room selection dialog
│   │   ├── Camera/            # Camera system
│   │   └── Levels/            # Game level/map
│   ├── services/
│   │   └── WebRTCService.ts   # WebRTC and WebSocket management
│   ├── helpers/               # Utility functions
│   ├── constants/             # Game constants
│   └── types/                 # TypeScript type definitions
├── server.js                  # WebSocket signaling server
├── public/                    # Static assets
└── package.json
```

## Key Components

### WebRTCService
Manages WebRTC peer connections and WebSocket signaling:
- Connects to signaling server
- Creates and manages peer connections
- Sends movement data via WebRTC
- Sends chat messages via WebSocket

### Experience Component
Main game component that:
- Renders the PixiJS canvas
- Manages local player and remote peers
- Integrates chat UI
- Handles WebRTC service lifecycle

### RoomDialog Component
Initial dialog for room selection:
- Prompts user for room ID
- Simple and clean UI
- Prevents game start until room is selected

### ChatBox Component
Real-time chat interface:
- Minimizable chat window
- Auto-scrolling message list
- Distinguished own messages vs others
- Timestamps on all messages

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## Configuration

### WebSocket Server Port
Default: `8080`

To change, edit `server.js`:
```javascript
const wss = new WebSocketServer({ port: 8080 });
```

And update `src/services/WebRTCService.ts`:
```typescript
this.ws = new WebSocket('ws://localhost:8080');
```

## Troubleshooting

### "Cannot connect to signaling server"
- Make sure the signaling server is running (`npm run server`)
- Check that port 8080 is not blocked by firewall
- Verify WebSocket URL in WebRTCService.ts

### "Cannot see other players"
- Ensure both players entered the **same room ID**
- Check browser console for errors
- Verify both clients are connected to the signaling server

### "Chat messages not appearing"
- Verify signaling server is running
- Check browser console for WebSocket errors
- Ensure room IDs match

### WebRTC Connection Issues
- WebRTC requires STUN/TURN servers for NAT traversal in some network configurations
- For local network testing, direct P2P should work
- For internet deployment, consider adding STUN/TURN server configuration

## Technology Stack

- **React 19**: UI framework
- **TypeScript**: Type-safe development
- **PixiJS 8**: High-performance 2D rendering
- **@pixi/react**: React bindings for PixiJS
- **simple-peer**: WebRTC implementation
- **ws**: WebSocket server
- **Vite**: Build tool and dev server

## Future Enhancements

- Add STUN/TURN server support for better connectivity
- Implement player names/avatars
- Add game mechanics (collision, score, etc.)
- Persistent room state
- Player authentication
- Voice chat via WebRTC audio

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
