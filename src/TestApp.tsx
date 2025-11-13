import { useState } from "react"

function TestApp() {
  const [roomId, setRoomId] = useState<string | null>(null);

  if (!roomId) {
    return (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px'
        }}>
          <h2>Test Dialog</h2>
          <input 
            type="text" 
            placeholder="Enter Room ID"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                setRoomId((e.target as HTMLInputElement).value);
              }
            }}
          />
          <button onClick={() => setRoomId('test')}>
            Join Room
          </button>
        </div>
      </div>
    );
  }

  return <div style={{ color: 'black', padding: '20px' }}>Room ID: {roomId}</div>;
}

export default TestApp
