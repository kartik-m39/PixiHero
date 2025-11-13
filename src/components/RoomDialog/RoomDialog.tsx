import { useState } from 'react';
import './RoomDialog.css';

interface RoomDialogProps {
  onJoinRoom: (roomId: string) => void;
}

export const RoomDialog = ({ onJoinRoom }: RoomDialogProps) => {
  const [roomId, setRoomId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      onJoinRoom(roomId.trim());
    }
  };

  return (
    <div className="room-dialog-overlay">
      <div className="room-dialog">
        <h2>Join a Room</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            autoFocus
            className="room-input"
          />
          <button type="submit" className="join-button">
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
};
