export async function uploadAudio({ audio, level }: { audio: Blob | File, level: number }) {
  const formData = new FormData();
  formData.append('audio', audio, audio instanceof File ? audio.name : 'recording.webm');
  formData.append('level', level.toString());
  const res = await fetch('http://localhost:3001/upload', {
    method: 'POST',
    body: formData,
  });
  return res.json();
}
