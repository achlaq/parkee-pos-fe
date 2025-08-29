const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:9090";

async function readErr(res) {
  try { return await res.text(); } catch { return res.statusText; }
}

export async function get(path, { signal } = {}) {
  const res = await fetch(BASE + path, { credentials: "include", signal });
  if (!res.ok) throw new Error(await readErr(res) || "Request gagal");
  return res.json();
}

export async function post(path, body, { signal } = {}) {
  const res = await fetch(BASE + path, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
    signal,
  });
  if (!res.ok) throw new Error(await readErr(res) || "Request gagal");
  return res.json();
}
