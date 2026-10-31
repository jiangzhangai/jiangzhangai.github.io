const PROFILE = {
  roleEn: "AI Lends Its Wings · Classics Chase the Light · Thought Endures",
  roleZh: "智能展翼 · 经典追光 · 思想不朽",
};

const TYPED_LINES = [
  "Mathematics · Computing · Artificial Intelligence",
  "Teach · Build · Keep learning",
  "I am not what I was.",
  "The Laozi Decision Support System",
];

// The home page playlist ships encoded (playlist.js), so the passages are not plain text in the source.
// Edit work/playlist/playlist_zh.json and run encode_playlist.py; the key must match it.
// One entry per round, played in order and then from the start again.
const PLAYLIST_ZH = (() => {
  const key = new TextEncoder().encode("jiangzhang.ca/dao");
  const bytes = Uint8Array.from(atob(PLAYLIST_CODE), (c, i) => c.charCodeAt(0) ^ key[i % key.length]);
  return JSON.parse(new TextDecoder().decode(bytes));
})();
