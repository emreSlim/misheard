require('dotenv').config();

const fs = require('fs');
const OpenAI = require('openai');
const { AssemblyAI } = require('assemblyai');
const Mapping = require('./misheard.json');

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
  //split punctuations from the word and add it back later apostrophe and hyphen are exception
  const punctuations = lower.match(/[\w'-]+|[^\w'-]+/g) || [];
  //find the base word without punctuations
  const baseWord = punctuations.filter((p) => p.match(/[\w'-]+/))[0] || '';

  if (Mapping[baseWord]) {
    const misheardWord =
      Mapping[baseWord][Math.floor(Math.random() * Mapping[baseWord].length)];
    return punctuations
      .map((p) => (p === baseWord ? misheardWord : p))
      .join('');
  }
  return word;
}

module.exports = {
  getMisheardLyrics,
  mishearWord,
};
