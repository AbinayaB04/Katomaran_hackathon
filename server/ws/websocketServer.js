const { Server } = require('ws');
const { exec } = require('child_process');
const path = require('path');

module.exports = function websocketServer(server) {
  const wss = new Server({ server });

  wss.on('connection', (ws) => {
    console.log("New WebSocket connection");

    ws.send("WebSocket connected to RAG engine!");

    ws.on('message', (message) => {
      const query = message.toString().trim();
      console.log("User asked:", query);

      const pythonPath = 'python'; // or 'python3'
      const queryScript = path.resolve(__dirname, '../../rag_engine/query.py');
      const cmd = `${pythonPath} "${queryScript}" "${query}"`;

      console.log("Running command:", cmd);

      exec(cmd, (err, stdout, stderr) => {
        if (err) {
          console.error("❌ RAG engine error:", stderr || err.message);
          ws.send("Error processing query.");
          return;
        }

        const reply = stdout.trim();
        console.log("✅ AI Answer:", reply);
        ws.send(reply);
      });
    });
  });
};
