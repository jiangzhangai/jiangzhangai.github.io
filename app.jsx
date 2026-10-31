function App() {
  // Dark by default; "theme-v2" so earlier saved choices don't override the new default.
  const [dark, setDark] = React.useState(() => (localStorage.getItem("theme-v2") || "dark") === "dark");
  const [lang, setLang] = React.useState(() => localStorage.getItem("lang") || (navigator.language.startsWith("zh") ? "zh" : "en"));
  const [typedText, setTypedText] = React.useState("");
  const [play, setPlay] = React.useState(0);
  const [fading, setFading] = React.useState(false);

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

  const fullText = lang === "zh" ? PLAYLIST_ZH[play % PLAYLIST_ZH.length].join("\n") : TYPED_LINES.join(" · ");

  React.useEffect(() => {
    const current = fullText;
    const step = lang === "zh" ? 160 : 120;
    let char = 0;
    let timer;
    // After the rest, clear the round and start the next one, but only once the reader has stopped scrolling for five minutes.
    let lastScroll = 0;
    const onScroll = () => { lastScroll = Date.now(); };
    addEventListener("scroll", onScroll, { passive: true });
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
    tick();
    return () => { clearTimeout(timer); removeEventListener("scroll", onScroll); };
  }, [lang, play]);

  return (
    <LangContext.Provider value={lang}>
      <Header dark={dark} onToggle={() => setDark((value) => !value)} onLang={() => setLang((value) => (value === "zh" ? "en" : "zh"))} />
      <Bookshelf />
      <main>
        <Hero typedText={typedText} fullText={fullText} fading={fading} />
      </main>
    </LangContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
