const express = require('express');
const multer = require('multer');
const ytdl = require('@distube/ytdl-core');
const fs = require('fs');
const { getMisheardLyrics } = require('./utils.js');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('audio'), async (req, res) => {
  const result = await getMisheardLyrics(req.file.path, req.body.level);
  res.json(result);
});

app.post('/youtube', express.json(), async (req, res) => {
  const {
    url,
    level
  } = req.body;
  const tempPath = `uploads/${Date.now()}.mp3`;

  await new Promise((resolve, reject) => {
    ytdl(url, { filter: 'audioonly' })
      .pipe(fs.createWriteStream(tempPath))
      .on('finish', resolve)
      .on('error', reject);
  });

  const result = await getMisheardLyrics(tempPath);
  res.json(result);
});

app.listen(3001, () => console.log('Server running on port 3001'));
