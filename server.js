import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

const rooms = new Map();

wss.on("connection", (ws) => {
  let currentRoom = null;
  let clientId = null;

  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data);

      switch (message.type) {
        case "join":
          currentRoom = message.roomId;
          clientId = message.clientId;

          if (!rooms.has(currentRoom)) {
            rooms.set(currentRoom, new Map());
          }

          const room = rooms.get(currentRoom);
          room.set(clientId, ws);

          console.log(
            `Client ${clientId} joined room ${currentRoom}. Room size: ${room.size}`,
          );

          // Notify client about existing peers
          const peers = Array.from(room.keys()).filter((id) => id !== clientId);
          ws.send(JSON.stringify({
            type: "peers",
            peers: peers,
          }));

          // Notify others about new peer
          broadcast(currentRoom, {
            type: "peer-joined",
            peerId: clientId,
          }, clientId);
          break;

        case "movement":
          // Broadcast movement to all others in room
          broadcast(currentRoom, {
            type: "movement",
            from: clientId,
            data: message.data,
          }, clientId);
          break;

        case "chat":
          // Broadcast chat message to room
          broadcast(currentRoom, {
            type: "chat",
            from: clientId,
            message: message.message,
            timestamp: Date.now(),
          }, clientId);
          break;
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  ws.on("close", () => {
    if (currentRoom && clientId) {
      const room = rooms.get(currentRoom);
      if (room) {
        room.delete(clientId);

        console.log(
          `Client ${clientId} left room ${currentRoom}. Room size: ${room.size}`,
        );

        // Notify others about peer leaving
        broadcast(currentRoom, {
          type: "peer-left",
          peerId: clientId,
        }, null);

        // Clean up empty rooms
        if (room.size === 0) {
          rooms.delete(currentRoom);
          console.log(`Room ${currentRoom} deleted (empty)`);
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

console.log("WebSocket server running on port 8080");
console.log("Handling rooms, movement, and chat via WebSocket only");
