// server/routes/registerRoute.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { image, name } = req.body;

    if (!image || !name) {
      return res.status(400).send("Missing image or name.");
    }

    // Decode base64 image
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Ensure 'shared/images' folder exists
    const imagesDir = path.resolve(__dirname, '../../shared/images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    // Write image to disk
    const filename = `${Date.now()}.png`;
    const absolutePath = path.join(imagesDir, filename);

    fs.writeFile(absolutePath, buffer, async (err) => {
      if (err) {
        console.error("Error writing image:", err);
        return res.status(500).send("Failed to save image.");
      }

      console.log(`Registering face: ${name}, Image Path: ${absolutePath}`);

      // Call Python script with full path to the image
      const pythonPath = 'python'; // use 'python3' if required on your system
      const registerScriptPath = path.resolve(__dirname, '../../recognition/register.py');

      const command = `${pythonPath} "${registerScriptPath}" --image "${absolutePath}" --name "${name}"`;

      exec(command, (err, stdout, stderr) => {
        if (err) {
          console.error("Python error:", stderr);
          return res.status(500).send(stderr || "Face registration failed.");
        }

        console.log("Python Output:", stdout);
        res.status(200).send(stdout);
      });
    });

  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;
