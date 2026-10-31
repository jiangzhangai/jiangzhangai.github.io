const LangContext = React.createContext("en");

function useT() {
  const lang = React.useContext(LangContext);
  return (en, zh) => (lang === "zh" ? zh : en);
}

function Header({ dark, onToggle, onLang }) {
  const t = useT();
  return (
    <header className="site-header">
      <div className="header-tools">
        <button className="lang-button" onClick={onLang} aria-label={t("切换到中文", "Switch to English")}>
          {t("A", "中")}
        </button>
        <button className="theme-button" onClick={onToggle} aria-label={t("Toggle light and dark theme", "切换明暗主题")}>
          <span className={`taiji ${dark ? "is-dark" : ""}`} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

// The spine is a bookshelf: one cell per project, read from projects.json.
function Bookshelf() {
  const t = useT();
  const [shelf, setShelf] = React.useState(null);
  const [open, setOpen] = React.useState(null);
  const ref = React.useRef(null);

  React.useEffect(() => {
    fetch("projects.json").then((response) => response.json()).then(setShelf).catch(() => setShelf(null));
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const close = (event) => { if (event.type === "keydown" ? event.key === "Escape" : !ref.current.contains(event.target)) setOpen(null); };
    document.addEventListener("click", close);
    document.addEventListener("keydown", close);
    return () => { document.removeEventListener("click", close); document.removeEventListener("keydown", close); };
  }, [open]);

  if (!shelf) return null;

  // Book pages live on this site and open in place; products are other sites and open in a new tab.
  const entry = (item) => (
    <div className="shelf-entry" key={item.zh}>
      {item.status === "live"
        ? <a href={item.url} {...(item.url.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}><b>{t(item.en, item.zh)}</b></a>
        : <><b>{t(item.en, item.zh)}</b><span>{t("In preparation", "筹备中")}</span></>}
    </div>
  );

  const cell = (item) => (
    <li key={item.char}>
      <button className={`shelf-cell ${item.char.length > 1 ? "is-latin" : ""} ${open && open.item === item ? "is-open" : ""}`}
        aria-label={t(item.en, item.zh)}
        onClick={(event) => setOpen(open && open.item === item ? null : { item, top: event.currentTarget.getBoundingClientRect().top })}>
        {item.char}
      </button>
    </li>
  );

  return (
    <nav className="bookshelf" ref={ref} aria-label={t("Projects", "项目书架")}>
      <ul>{shelf.thought.map(cell)}</ul>
      <ul className="shelf-commerce">{shelf.commerce.map(cell)}</ul>
      {open && (
        <div className="shelf-card" style={{ top: open.top }}>
          {open.item.children ? <><i>{t(open.item.en, open.item.zh)}</i>{open.item.children.map(entry)}</> : entry(open.item)}
        </div>
      )}
    </nav>
  );
}

function Hero({ typedText, fullText, fading }) {
  const t = useT();
  const role = t(PROFILE.roleEn, PROFILE.roleZh);
  // Line breaks only after a "·"; each phrase stays whole.
  const parts = role.split(/(?<=·) /);
  const seal = <span className="hero-name-zh" role="img" aria-label={t("Family seal", "家族印章")} />;
  // A single line is laid out in full and revealed left to right, keeping its "·" phrases whole.
  // A multi-line passage is written out as it is typed and grows the hero.
  const isLine = !fullText.includes("\n");
  const [lines, ...passage] = typedText.split("\n");
  let offset = 0;
  const lineChunks = fullText.split(/(?<=·) /).map((chunk, i) => {
    const shown = Math.max(0, Math.min(chunk.length, typedText.length - offset));
    offset += chunk.length + 1;
    return <React.Fragment key={i}>{i > 0 && " "}<span className="hero-word">{chunk.slice(0, shown)}<span className="typed-rest">{chunk.slice(shown)}</span></span></React.Fragment>;
  });
  const typedRef = React.useRef(null);
  React.useEffect(() => {
    // Follow the typing downward, unless the reader has scrolled away from it.
    const bottom = typedRef.current.getBoundingClientRect().bottom;
    const target = innerHeight * 0.75;
    if (bottom > target && bottom < innerHeight + 80) window.scrollBy({ top: bottom - target, behavior: "smooth" });
  }, [typedText]);
  return (
    <section className="hero" id="top">
      <div className="hero-map" aria-hidden="true">
        <i className="contour contour-a" />
        <i className="contour contour-b" />
        <i className="contour contour-c" />
      </div>
      <div className="hero-copy">
        <h1 className="sr-only">{role}</h1>
        <div className="hero-signature">
          <p className="role">
            {parts.map((part, i) => (
              <React.Fragment key={i}>{i > 0 && " "}<span className="hero-word">{part}{i === parts.length - 1 && seal}</span></React.Fragment>
            ))}
          </p>
          <span className="hero-divider" aria-hidden="true" />
        </div>
        <div className={`typed ${fading ? "is-fading" : ""}`} ref={typedRef}>
          {isLine ? <p>{lineChunks}</p> : <p>{lines}</p>}
          {passage.map((text, i) => <p className="typed-passage" key={i}>{text}</p>)}
        </div>
      </div>
    </section>
  );
}
