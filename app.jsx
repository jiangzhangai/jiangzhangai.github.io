function App() {
  // Dark by default; "theme-v2" so earlier saved choices don't override the new default.
  const [dark, setDark] = React.useState(() => (localStorage.getItem("theme-v2") || "dark") === "dark");
  const [lang, setLang] = React.useState(() => localStorage.getItem("lang") || (navigator.language.startsWith("zh") ? "zh" : "en"));
  const [typedText, setTypedText] = React.useState("");
  const [play, setPlay] = React.useState(0);
  const [fading, setFading] = React.useState(false);
  const [piece, setPiece] = React.useState(null);

  React.useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("theme-v2", dark ? "dark" : "light");
  }, [dark]);

  React.useEffect(() => {
    // Deters copying; a screenshot still works.
    const block = (event) => event.preventDefault();
    const events = ["copy", "cut", "contextmenu", "selectstart", "dragstart"];
    events.forEach((name) => document.addEventListener(name, block));
    return () => events.forEach((name) => document.removeEventListener(name, block));
  }, []);

  React.useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.title = lang === "zh" ? PROFILE.roleZh : PROFILE.roleEn;
    localStorage.setItem("lang", lang);
  }, [lang]);

  // Chinese runs vertically, where curly quotes come out differently from browser to browser: use the vertical forms, which hold in all of them.
  const fullText = lang === "zh" ? (piece ? PIECES_ZH[piece] : PLAYLIST_ZH[play % PLAYLIST_ZH.length]).join("\n").replace(/“/g, "﹃").replace(/”/g, "﹄") : TYPED_LINES.join(" · ");

  React.useEffect(() => {
    const current = fullText;
    const step = lang === "zh" ? TYPE_STEP : 120;
    let char = 0;
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
      if (char === current.length) {
        if (lang === "zh") {
          timer = setTimeout(next, 10 * 60 * 1000); // Ten minutes to read it again and think.
          return;
        }
        char = 0;
        setTypedText("");
        timer = setTimeout(tick, 600);
        return;
      }
      char += 1;
      setTypedText(current.slice(0, char));
      timer = setTimeout(tick, char === current.length ? 8000 : step);
    };
    // Clear first, so that a piece chosen midway starts on bare slips.
    setFading(false);
    setTypedText("");
    timer = setTimeout(tick, 300);
    return () => { clearTimeout(timer); removeEventListener("scroll", onScroll, { capture: true }); };
  }, [lang, play, piece]);

  // A piece in seal brings its own images, loaded only now because they are large.
  const choosePiece = (name, glyphs) => {
    if (lang !== "zh") return;
    if (!glyphs) { setPiece(name); return; }
    const script = document.createElement("script");
    script.src = glyphs;
    script.onload = () => setPiece(name);
    document.head.appendChild(script);
  };

  return (
    <LangContext.Provider value={lang}>
      <Header dark={dark} onToggle={() => setDark((value) => !value)} onLang={() => setLang((value) => (value === "zh" ? "en" : "zh"))} />
      <Bookshelf onPiece={choosePiece} />
      <main>
        <Hero typedText={typedText} fullText={fullText} fading={fading} />
      </main>
    </LangContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
