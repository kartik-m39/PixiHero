export type MovementData = {
  x: number;
  y: number;
  direction: string | null;
  isMoving: boolean;
};

export class WebSocketService {
  private ws: WebSocket | null = null;
  private clientId: string;
  private roomId: string;
  private onPeerMovement?: (peerId: string, data: MovementData) => void;
  private onChatMessage?: (from: string, message: string, timestamp: number) => void;
  private onPeerJoined?: (peerId: string) => void;
  private onPeerLeft?: (peerId: string) => void;

  constructor(
    roomId: string,
    onPeerMovement?: (peerId: string, data: MovementData) => void,
    onChatMessage?: (from: string, message: string, timestamp: number) => void,
    onPeerJoined?: (peerId: string) => void,
    onPeerLeft?: (peerId: string) => void
  ) {
    this.clientId = Math.random().toString(36).substring(7);
    this.roomId = roomId;
    this.onPeerMovement = onPeerMovement;
    this.onChatMessage = onChatMessage;
    this.onPeerJoined = onPeerJoined;
    this.onPeerLeft = onPeerLeft;
  }

  connect() {
    this.ws = new WebSocket('ws://localhost:8080');

    this.ws.onopen = () => {
      console.log('Connected to WebSocket server');
      this.ws?.send(JSON.stringify({
        type: 'join',
        roomId: this.roomId,
        clientId: this.clientId
      }));
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);

      switch (message.type) {
        case 'peers':
          console.log('Existing peers in room:', message.peers);
          message.peers.forEach((peerId: string) => {
            if (this.onPeerJoined) {
              this.onPeerJoined(peerId);
            }
          });
          break;

        case 'peer-joined':
          console.log('Peer joined:', message.peerId);
          if (this.onPeerJoined) {
            this.onPeerJoined(message.peerId);
          }
          break;

        case 'peer-left':
          console.log('Peer left:', message.peerId);
          if (this.onPeerLeft) {
            this.onPeerLeft(message.peerId);
          }
          break;

        case 'movement':
          console.log('Movement from', message.from, ':', message.data);
          if (this.onPeerMovement) {
            this.onPeerMovement(message.from, message.data);
          }
          break;

        case 'chat':
          if (this.onChatMessage) {
            this.onChatMessage(message.from, message.message, message.timestamp);
          }
          break;
      }
    };

    this.ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  sendMovement(data: MovementData) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'movement',
        data
      }));
    }
  }

  sendChatMessage(message: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'chat',
        message
      }));
    }
  }

  disconnect() {
    this.ws?.close();
  }

  getClientId(): string {
    return this.clientId;
  }
}
