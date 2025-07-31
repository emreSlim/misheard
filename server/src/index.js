const express = require('express');
const multer = require('multer');
const ytdl = require('@distube/ytdl-core');
const fs = require('fs');
const { getMisheardLyrics } = require('./utils.js');
const cors = require('cors');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.post('/upload', upload.single('audio'), async (req, res) => {
  const result = await getMisheardLyrics(req.file.path, req.body.level);
  res.json(result);
});

app.post('/youtube', express.json(), async (req, res) => {
  const { url, level } = req.body;
  const fileName = `${Date.now()}.mp3`;
  const tempPath = `uploads/${fileName}`;

  await new Promise((resolve, reject) => {
    ytdl(url, { filter: 'audioonly' })
      .pipe(fs.createWriteStream(tempPath))
      .on('finish', resolve)
      .on('error', reject);
  });

  const result = await getMisheardLyrics(tempPath, level);
  res.json({
    lyrics: result,
    audioUrl: fileName,
  });
});

app.listen(3001, () => console.log('Server running on port 3001'));
