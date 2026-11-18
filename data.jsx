const PROFILE = {
  roleEn: "Pre-Qin Chinese Philosophy",
  roleZh: "中华先秦哲学思想研究",
};

// The published address, as against the preview on this machine.
const PUBLISHED = /(^|\.)jiangzhang\.ca$|\.github\.io$/.test(location.hostname);
// On only when published; the preview stays copyable for John's editing, with nothing to switch at publication.
const BLOCK_COPY = PUBLISHED;
// Visitors' notes go privately to John by email, through Formspree (its form address, made on John's account). Nothing is shown on the page.
// Set 2026-11-07. Emptied, the published site leaves the notes link out and the preview shows it but sends nothing.
const NOTES_URL = "https://formspree.io/f/myeeadpz";

// The home page playlist ships encoded (playlist.js), so the passages are not plain text in the source.
// Edit work/playlist/playlist_zh.json and run encode_playlist.py; the key must match it.
// One entry per round, played in order and then from the start again.
const decodePlaylist = (code) => {
  const key = new TextEncoder().encode("jiangzhang.ca/dao");
  const bytes = Uint8Array.from(atob(code), (c, i) => c.charCodeAt(0) ^ key[i % key.length]);
  return JSON.parse(new TextDecoder().decode(bytes));
};
const PLAYLIST_ZH = decodePlaylist(PLAYLIST_CODE);
// Pieces chosen from the bookshelf, by name: played on the slips in place of the playlist.
const PIECES_ZH = decodePlaylist(PIECES_CODE);
const PLAYLIST_EN = decodePlaylist(PLAYLIST_EN_CODE);
const PIECES_EN = decodePlaylist(PIECES_EN_CODE);
