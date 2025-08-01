const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function uploadAudio({ audio, level }: { audio: Blob | File, level: number }) {
  const formData = new FormData();
  formData.append('audio', audio, audio instanceof File ? audio.name : 'recording.webm');
  formData.append('level', level.toString());
  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
}
