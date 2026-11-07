const PROFILE = {
  roleEn: "Pre-Qin Chinese Philosophy",
  roleZh: "中华先秦哲学思想研究",
};

// Off while John reviews and copies text; turn on again at publication.
const BLOCK_COPY = true;

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
