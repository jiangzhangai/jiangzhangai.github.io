// WeChat enlarges type by its reader's font setting, which would burst the small rings of the menu. Up to 112% it still fits well; beyond that the ring's character is drawn back to that size.
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
  // A tap holds the typing where it is; the next tap lets the waiting character go on.
  const held = React.useRef(false);
  const waiting = React.useRef(null);
  const hold = (on) => {
    held.current = on;
    if (!on && waiting.current) {
      const go = waiting.current;
      waiting.current = null;
      go();
    }
  };

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
    // A blank character, not an empty title: given none, a phone's title bar shows the address instead.
    document.title = lang === "zh" ? "⠀" : PROFILE.roleEn;
    localStorage.setItem("lang", lang);
  }, [lang]);

  // Chinese runs vertically, where curly quotes come out differently from browser to browser: use the vertical forms, which hold in all of them.
  const fullText = lang === "zh" ? (piece ? PIECES_ZH[piece] : PLAYLIST_ZH[play % PLAYLIST_ZH.length]).join("\n").replace(/“/g, "﹃").replace(/”/g, "﹄") : TYPED_LINES.join(" · ");

  React.useEffect(() => {
    const current = fullText;
    const step = lang === "zh" ? stepOf(current) : 120;
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
      if (held.current) {
        waiting.current = tick;
        return;
      }
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
    held.current = false;
    waiting.current = null;
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
        <Hero typedText={typedText} fullText={fullText} fading={fading} held={held} onHold={hold} />
      </main>
    </LangContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
