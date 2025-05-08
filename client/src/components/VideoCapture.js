// client/src/components/VideoCapture.js
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const VideoCapture = () => {
  const webcamRef = useRef(null);
  const [name, setName] = useState('');
  const [showInput, setShowInput] = useState(false);

  const captureImage = async () => {
    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) return alert("Failed to capture image");

    try {
      const response = await axios.post('http://localhost:5000/api/register', {
        name,
        image: screenshot,
      });
      alert(response.data);
      setShowInput(false);
      setName('');
    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
    <div>
      <h2>Face Registration</h2>
      <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
      {showInput ? (
        <>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter name" />
          <button onClick={captureImage}>Submit</button>
        </>
      ) : (
        <button onClick={() => setShowInput(true)}>Capture</button>
      )}
    </div>
  );
};

export default VideoCapture;
