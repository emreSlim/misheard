require('dotenv').config();

const express = require('express');
const multer = require('multer');
const ytdl = require('@distube/ytdl-core');
const fs = require('fs');
const { getMisheardLyrics } = require('./utils.js');
const cors = require('cors');
const path = require('path');


const app = express();
const upload = multer({ dest: 'uploads/' });

// Logger middleware to log API calls and their IP address
app.use((req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - IP: ${ip}`);
  next();
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN.split(','),
  })
);

console.log('CORS Origin:', process.env.CORS_ORIGIN);

// Health check route
app.get('/', (req, res) => {
  res.send('Server is running.');
});

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.post('/upload', upload.single('audio'), async (req, res) => {
  const result = await getMisheardLyrics(req.file.path, req.body.level);
  res.json(result);
});

app.post('/youtube', express.json(), async (req, res) => {
  const { url, level } = req.body;
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.mp3`;
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
