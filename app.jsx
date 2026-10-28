function App() {
  const [dark, setDark] = React.useState(() => localStorage.getItem("theme") === "dark");
  const [lang, setLang] = React.useState(() => localStorage.getItem("lang") || (navigator.language.startsWith("zh") ? "zh" : "en"));
  const [typedText, setTypedText] = React.useState("");

  React.useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  React.useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    localStorage.setItem("lang", lang);
  }, [lang]);

  React.useEffect(() => {
    const lines = (lang === "zh" ? TYPED_LINES_ZH : TYPED_LINES).join(" · ");
    const current = lang === "zh" ? [lines, ...TYPED_PASSAGE_ZH].join("\n") : lines;
    const step = lang === "zh" ? 160 : 120;
    let char = 0;
    let timer;
    const tick = () => {
      if (char === current.length) {
        if (lang === "zh") return; // A passage stays on the page once written.
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
    return () => clearTimeout(timer);
  }, [lang]);

  return (
    <LangContext.Provider value={lang}>
      <Header dark={dark} onToggle={() => setDark((value) => !value)} onLang={() => setLang((value) => (value === "zh" ? "en" : "zh"))} />
      <main>
        <Hero typedText={typedText} />
      </main>
    </LangContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
