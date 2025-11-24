import Peer from "simple-peer";

export type PeerConnection = {
  peer: Peer;
  id: string;
};

export type MovementData = {
  x: number;
  y: number;
  direction: string | null;
  isMoving: boolean;
};

export class WebRTCService {
  private ws: WebSocket | null = null;
  private peers: Map<string, Peer> = new Map();
  private clientId: string;
  private roomId: string;
  private onPeerMovement?: (peerId: string, data: MovementData) => void;
  private onChatMessage?: (
    from: string,
    message: string,
    timestamp: number,
  ) => void;

  constructor(
    roomId: string,
    onPeerMovement?: (peerId: string, data: MovementData) => void,
    onChatMessage?: (from: string, message: string, timestamp: number) => void,
  ) {
    this.clientId = Math.random().toString(36).substring(7);
    this.roomId = roomId;
    this.onPeerMovement = onPeerMovement;
    this.onChatMessage = onChatMessage;
  }

  connect() {
    this.ws = new WebSocket("ws://localhost:8080");

    this.ws.onopen = () => {
      console.log("Connected to signaling server");
      this.ws?.send(JSON.stringify({
        type: "join",
        roomId: this.roomId,
        clientId: this.clientId,
      }));
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case "peers":
          message.peers.forEach((peerId: string) => {
            this.createPeer(peerId, true);
          });
          break;

        case "peer-joined":
          this.createPeer(message.peerId, false);
          break;

        case "signal":
          const peer = this.peers.get(message.from);
          if (peer) {
            peer.signal(message.signal);
          }
          break;

        case "peer-left":
          this.removePeer(message.peerId);
          break;

        case "chat":
          if (this.onChatMessage) {
            this.onChatMessage(
              message.from,
              message.message,
              message.timestamp,
            );
          }
          break;
      }
    };

    this.ws.onclose = () => {
      console.log("Disconnected from signaling server");
      this.peers.forEach((peer) => peer.destroy());
      this.peers.clear();
    };
  }

  private createPeer(peerId: string, initiator: boolean) {
    if (this.peers.has(peerId)) return;

    const peer = new Peer({
      initiator,
      trickle: true,
    });

    peer.on("signal", (signal: any) => {
      this.ws?.send(JSON.stringify({
        type: "signal",
        to: peerId,
        signal,
      }));
    });

    peer.on("connect", () => {
      console.log(`Connected to peer: ${peerId}`);
    });

    peer.on("data", (data: any) => {
      try {
        const message = JSON.parse(data.toString());
        if (message.type === "movement" && this.onPeerMovement) {
          this.onPeerMovement(peerId, message.data);
        }
      } catch (error) {
        console.error("Error parsing peer data:", error);
      }
    });

    peer.on("close", () => {
      console.log(`Peer connection closed: ${peerId}`);
      this.peers.delete(peerId);
    });

    this.peers.set(peerId, peer);
  }

  private removePeer(peerId: string) {
    const peer = this.peers.get(peerId);
    if (peer) {
      peer.destroy();
      this.peers.delete(peerId);
    }
  }

  sendMovement(data: MovementData) {
    const message = JSON.stringify({
      type: "movement",
      data,
    });

    this.peers.forEach((peer) => {
      if ((peer as any).connected) {
        peer.send(message);
      }
    });
  }

  sendChatMessage(message: string) {
    this.ws?.send(JSON.stringify({
      type: "chat",
      message,
    }));
  }

  disconnect() {
    this.peers.forEach((peer) => peer.destroy());
    this.peers.clear();
    this.ws?.close();
  }

  getClientId(): string {
    return this.clientId;
  }
}
