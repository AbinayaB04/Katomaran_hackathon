import React, { useEffect, useRef, useState } from 'react';

const Chat = () => {
  const ws = useRef(null);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:5000");

    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.current.onmessage = (event) => {
      setMessages(prev => [...prev, { role: 'bot', text: event.data }]);
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  const sendQuery = () => {
    if (!query.trim() || ws.current.readyState !== WebSocket.OPEN) return;
    ws.current.send(query);
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setQuery('');
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>AI Q&A Chat</h2>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask about face registration..."
        style={{ width: '300px', marginRight: '10px' }}
      />
      <button onClick={sendQuery}>Ask</button>

      <div style={{ marginTop: '20px' }}>
        {messages.map((msg, i) => (
          <p key={i} style={{ textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.text}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Chat;
