// Hook RAG / your API here later, e.g.:
// export async function sendChatMessage({ question }) {
//   const r = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/chat`, { ... });
//   return r.json();
// }

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

export async function sendChatMessage({ question }) {
  void API_BASE;
  void question;
  return { answer: "" };
}
