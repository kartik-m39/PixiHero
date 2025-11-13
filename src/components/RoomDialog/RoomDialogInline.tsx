import { useState } from 'react';

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

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };

  const dialogStyle: React.CSSProperties = {
    background: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    minWidth: '300px'
  };

  const inputStyle: React.CSSProperties = {
    padding: '0.75rem',
    border: '2px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    width: '100%',
    marginBottom: '1rem'
  };

  const buttonStyle: React.CSSProperties = {
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    width: '100%'
  };

  return (
    <div style={overlayStyle}>
      <div style={dialogStyle}>
        <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#333', textAlign: 'center' }}>
          Join a Room
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            autoFocus
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
};
