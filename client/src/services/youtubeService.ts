export async function processYoutube({ url, level }: { url: string, level: number }) {
  const res = await fetch('http://localhost:3001/youtube', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, level }),
  });
  return res.json();
}
