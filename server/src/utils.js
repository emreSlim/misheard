const fs = require('fs');
const OpenAI = require('openai');
const { config } = require('dotenv');
const { AssemblyAI } = require('assemblyai');
const { Mapping } = require('./constants.js');

config();

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLY_API_KEY,
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getMisheardLyrics(audioPath, level = 2) {
  const params = {
    audio: fs.createReadStream(audioPath),
    speech_model: 'universal',
  };

  const transcription = await client.transcripts.transcribe(params);
  const funnyWords = transcription.words.map((word) => {
    return {
      start: word.start,
      end: word.end,
      text: mishearWord(word.text, level),
    };
  });

  return funnyWords;
}

function mishearWord(word, level) {
  if (Math.random() > level * 0.1) {
    return word;
  }

  const lower = word.toLowerCase();
  if (Mapping[lower]) {
    return Mapping[lower][Math.floor(Math.random() * Mapping[lower].length)];
  }
  return word;
}

module.exports = {
  getMisheardLyrics,
  mishearWord,
};
