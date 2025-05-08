const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');

const registerRoute = require('./routes/registerRoute');
const recognizeRoute = require('./routes/recognizeRoute');
const websocketServer = require('./ws/websocketServer');  // ✅

const app = express();
const server = http.createServer(app);
websocketServer(server);  // ✅ Initialize WebSocket server

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

app.use('/api/register', registerRoute);
app.use('/api/recognize', recognizeRoute);

server.listen(5000, () => console.log("Server running on port 5000"));
