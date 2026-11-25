// WeChat enlarges type by its reader's font setting, which would burst the small rings of the menu and double the home page's prose. Up to 112% it still fits well; beyond that both are drawn back to that size.
{
  const probe = document.body.appendChild(document.createElement("div"));
  probe.style.fontSize = "100px";
  probe.textContent = "一";
  const enlarged = parseFloat(getComputedStyle(probe).fontSize) / 100;
  probe.remove();
  document.documentElement.style.setProperty("--ring-scale", Math.min(1, 1.12 / enlarged).toFixed(3));
}

function App() {
  // Dark by default; "theme-v2" so earlier saved choices don't override the new default.
  const [dark, setDark] = React.useState(() => (localStorage.getItem("theme-v2") || "dark") === "dark");
  const [lang, setLang] = React.useState(() => localStorage.getItem("lang") || (navigator.language.startsWith("zh") ? "zh" : "en"));
  const [typedText, setTypedText] = React.useState("");
  const [play, setPlay] = React.useState(0);
  const [fading, setFading] = React.useState(false);
  const [piece, setPiece] = React.useState(null);
  const [noting, setNoting] = React.useState(false);
  // A tap holds the typing where it is; the next tap lets the waiting character go on.
  const held = React.useRef(false);
  const waiting = React.useRef(null);
  // A double tap shows the whole text at once; another double tap goes back to where the typing had got to and goes on (John 2026-11-18).
  const whole = React.useRef(false);
  const [wholeOn, setWholeOn] = React.useState(false);
  const hold = (on) => {
    held.current = on;
    if (!on && !whole.current && waiting.current) {
      const go = waiting.current;
      waiting.current = null;
      go();
    }
  };
  const toggleWhole = () => {
    whole.current = !whole.current;
    setWholeOn(whole.current);
    if (!whole.current) hold(false);
  };

  React.useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("theme-v2", dark ? "dark" : "light");
  }, [dark]);

  React.useEffect(() => {
    // Deters copying; a screenshot still works.
    if (!BLOCK_COPY) return undefined;
    document.documentElement.classList.add("no-copy");
    // The notes form is the reader's own writing: there they may select, paste and long-press as usual.
    const block = (event) => { if (!event.target.closest?.("input, textarea")) event.preventDefault(); };
    const events = ["copy", "cut", "contextmenu", "selectstart", "dragstart"];
    events.forEach((name) => document.addEventListener(name, block));
    return () => events.forEach((name) => document.removeEventListener(name, block));
  }, []);

  React.useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.title = lang === "zh" ? PROFILE.roleZh : PROFILE.roleEn;
    localStorage.setItem("lang", lang);
  }, [lang]);

  // A book runs vertically, where curly quotes come out differently from browser to browser: use the vertical forms, which hold in all of them.
  // The study of the classics is modern prose, set like the home page and not on the slips.
  // The column 问道 is modern prose too (John 2026-11-25).
  const slips = lang === "zh" && Boolean(piece) && piece !== "考" && !piece.startsWith("问");
  const fullText = lang === "zh" ? (piece ? (slips ? PIECES_ZH[piece].join("\n").replace(/“/g, "﹃").replace(/”/g, "﹄") : PIECES_ZH[piece].join("\n")) : PLAYLIST_ZH[play % PLAYLIST_ZH.length].join("\n")) : (PIECES_EN[piece] || PLAYLIST_EN[play % PLAYLIST_EN.length]).join("\n");

  React.useEffect(() => {
    const current = fullText;
    const step = lang === "zh" ? stepOf(current) : EN_STEP;
    // The home page's title stands there from the start; only its text is written out. Typed into its centred line, it would seem to slide in.
    const start = !slips && current[0] === "" ? current.indexOf("\n") + 1 : 0;
    let char = start;
    let timer;
    // After the rest, clear the round and start the next one, but only once the reader has stopped scrolling for five minutes.
    let lastScroll = 0;
    const onScroll = () => { lastScroll = Date.now(); };
    // Capture, because the Chinese passage scrolls in its own box and scroll events don't bubble.
    addEventListener("scroll", onScroll, { passive: true, capture: true });
    const idle = 5 * 60 * 1000;
    const next = () => {
      const still = Date.now() - lastScroll;
      if (still < idle) {
        timer = setTimeout(next, idle - still);
        return;
      }
      setFading(true);
      timer = setTimeout(() => {
        scrollTo({ top: 0 });
        setTypedText("");
        setFading(false);
        // A chosen piece plays once; then the playlist goes on.
        setPiece(null);
        setPlay((value) => value + 1);
      }, 1200);
    };
    const tick = () => {
      if (held.current || whole.current) {
        waiting.current = tick;
        return;
      }
      if (char === current.length) {
        timer = setTimeout(next, 10 * 60 * 1000); // Ten minutes to read it again and think.
        return;
      }
      char += 1;
      setTypedText(current.slice(0, char));
      timer = setTimeout(tick, char === current.length ? 8000 : step);
    };
    // Clear first, so that a piece chosen midway starts on bare slips.
    held.current = false;
    waiting.current = null;
    whole.current = false;
    setWholeOn(false);
    setFading(false);
    setTypedText(current.slice(0, start));
    timer = setTimeout(tick, 300);
    return () => { clearTimeout(timer); removeEventListener("scroll", onScroll, { capture: true }); };
  }, [lang, play, piece]);

  // A piece in seal brings its own images, loaded only now because they are large.
  const choosePiece = (name, glyphs) => {
    // In English only what has been translated plays; seal images belong to the Chinese.
    if (lang !== "zh" && !PIECES_EN[name]) return;
    if (lang !== "zh" || !glyphs) { setPiece(name); return; }
    const script = document.createElement("script");
    script.src = glyphs;
    script.onload = () => setPiece(name);
    document.head.appendChild(script);
  };
  // A tap on the bare spine goes between the two opening essays: the home page's and, from it, the study of the classics.
  const onSpine = () => (piece ? setPiece(null) : choosePiece("考"));

  return (
    <LangContext.Provider value={lang}>
      <Header dark={dark} onToggle={() => setDark((value) => !value)} onLang={() => setLang((value) => (value === "zh" ? "en" : "zh"))} />
      <Bookshelf onPiece={choosePiece} onSpine={onSpine} onNotes={() => setNoting(true)} />
      <main>
        <Hero typedText={wholeOn ? fullText : typedText} fullText={fullText} fading={fading} held={held} onHold={hold} slips={slips} whole={wholeOn} onWhole={toggleWhole} />
      </main>
      {noting && <Notes onClose={() => setNoting(false)} />}
    </LangContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
