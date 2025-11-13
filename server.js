import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

const rooms = new Map();

wss.on('connection', (ws) => {
  let currentRoom = null;
  let clientId = null;

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);

      switch (message.type) {
        case 'join':
          currentRoom = message.roomId;
          clientId = message.clientId;

          if (!rooms.has(currentRoom)) {
            rooms.set(currentRoom, new Map());
          }

          const room = rooms.get(currentRoom);
          room.set(clientId, ws);

          // Notify others in the room
          const peers = Array.from(room.keys()).filter(id => id !== clientId);
          ws.send(JSON.stringify({
            type: 'peers',
            peers: peers
          }));

          // Notify others about new peer
          broadcast(currentRoom, {
            type: 'peer-joined',
            peerId: clientId
          }, clientId);
          break;

        case 'signal':
          // Forward WebRTC signaling messages
          const targetRoom = rooms.get(currentRoom);
          if (targetRoom && targetRoom.has(message.to)) {
            const targetWs = targetRoom.get(message.to);
            targetWs.send(JSON.stringify({
              type: 'signal',
              from: clientId,
              signal: message.signal
            }));
          }
          break;

        case 'chat':
          // Broadcast chat message to room
          broadcast(currentRoom, {
            type: 'chat',
            from: clientId,
            message: message.message,
            timestamp: Date.now()
          }, null);
          break;
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    if (currentRoom && clientId) {
      const room = rooms.get(currentRoom);
      if (room) {
        room.delete(clientId);
        
        // Notify others about peer leaving
        broadcast(currentRoom, {
          type: 'peer-left',
          peerId: clientId
        }, null);

        // Clean up empty rooms
        if (room.size === 0) {
          rooms.delete(currentRoom);
        }
      }
    }
  });

  function broadcast(roomId, message, excludeId) {
    const room = rooms.get(roomId);
    if (!room) return;

    room.forEach((client, id) => {
      if (id !== excludeId && client.readyState === 1) {
        client.send(JSON.stringify(message));
      }
    });
  }
});

console.log('WebSocket signaling server running on port 8080');
