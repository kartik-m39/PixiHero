import { useState, useRef, useEffect } from 'react';

export type ChatMessage = {
  from: string;
  message: string;
  timestamp: number;
};

interface ChatBoxProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  currentUserId: string;
}

export const ChatBox = ({ messages, onSendMessage, currentUserId }: ChatBoxProps) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const chatBoxStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '350px',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100,
    transition: 'height 0.3s ease'
  };

  const headerStyle: React.CSSProperties = {
    padding: '1rem',
    background: '#007bff',
    color: 'white',
    borderRadius: '8px 8px 0 0',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 'bold'
  };

  const messagesStyle: React.CSSProperties = {
    height: '300px',
    overflowY: 'auto',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    background: '#f9f9f9'
  };

  const messageStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    padding: '0.5rem',
    borderRadius: '4px',
    background: 'white',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
  };

  const ownMessageStyle: React.CSSProperties = {
    ...messageStyle,
    background: '#e3f2fd',
    alignSelf: 'flex-end'
  };

  const formStyle: React.CSSProperties = {
    display: 'flex',
    padding: '0.75rem',
    borderTop: '1px solid #ddd',
    background: 'white',
    borderRadius: '0 0 8px 8px'
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px 0 0 4px',
    fontSize: '0.9rem'
  };

  const buttonStyle: React.CSSProperties = {
    padding: '0.5rem 1rem',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '0 4px 4px 0',
    cursor: 'pointer',
    fontSize: '0.9rem'
  };

  return (
    <div style={chatBoxStyle}>
      <div style={headerStyle} onClick={() => setIsMinimized(!isMinimized)}>
        <span>Chat</span>
        <span style={{ fontSize: '0.8rem' }}>{isMinimized ? '▲' : '▼'}</span>
      </div>
      
      {!isMinimized && (
        <>
          <div style={messagesStyle}>
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                style={msg.from === currentUserId ? ownMessageStyle : messageStyle}
              >
                <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#007bff', marginBottom: '0.25rem' }}>
                  {msg.from === currentUserId ? 'You' : msg.from}:
                </span>
                <span style={{ fontSize: '0.95rem', color: '#333', wordWrap: 'break-word' }}>
                  {msg.message}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#999', marginTop: '0.25rem', alignSelf: 'flex-end' }}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} style={formStyle}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>Send</button>
          </form>
        </>
      )}
    </div>
  );
};
