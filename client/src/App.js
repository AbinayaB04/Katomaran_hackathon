import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import VideoCapture from './components/VideoCapture';
import LiveRecognition from './components/LiveRecognition';
import Chat from './components/Chat';

function App() {
  return (
    <Router>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1>Face Recognition Platform</h1>
        <nav style={{ marginBottom: '20px' }}>
          <Link to="/register" style={{ marginRight: '20px' }}>Register</Link>
          <Link to="/recognize" style={{ marginRight: '20px' }}>Recognize</Link>
          <Link to="/chat">Chat</Link>
        </nav>
        <Routes>
          <Route path="/register" element={<VideoCapture />} />
          <Route path="/recognize" element={<LiveRecognition />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
