// client/src/components/LiveRecognition.js
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const LiveRecognition = () => {
  const webcamRef = useRef(null);
  const [name, setName] = useState('');

  const recognizeFace = async () => {
    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) return alert("Failed to capture image");

    try {
      const response = await axios.post('http://localhost:5000/api/recognize', {
        image: screenshot,
      });

      setName(response.data);
    } catch (error) {
      console.error("Recognition failed:", error);
      setName("Error recognizing face");
    }
  };

  return (
    <div>
      <h2>Live Recognition</h2>
      <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
      <button onClick={recognizeFace}>Recognize</button>
      {name && <h3>Recognized: {name}</h3>}
    </div>
  );
};

export default LiveRecognition;
