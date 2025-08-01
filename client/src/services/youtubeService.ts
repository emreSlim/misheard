const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function processYoutube({ url, level }: { url: string, level: number }) {
  const res = await fetch(`${API_BASE_URL}/youtube`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, level }),
  });
  return res.json();
}
