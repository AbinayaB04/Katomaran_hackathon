// server/routes/recognizeRoute.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).send("Image is required.");

    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const filename = `${Date.now()}.jpg`;
    const filePath = path.resolve(__dirname, '../../shared/images', filename);

    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        console.error("Failed to write image:", err);
        return res.status(500).send("Failed to save image.");
      }

      const pythonPath = 'python'; // or 'python3' depending on your setup
      const scriptPath = path.resolve(__dirname, '../../recognition/recognize.py');

      console.log(`Running: ${pythonPath} "${scriptPath}" --image "${filePath}"`);

      exec(`${pythonPath} "${scriptPath}" --image "${filePath}"`, (err, stdout, stderr) => {
        if (err) {
          console.error("Recognition error:", stderr);
          return res.status(500).send("Recognition failed.");
        }

        console.log("Recognition result:", stdout);
        res.send(stdout.trim());
      });
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
