const LangContext = React.createContext("en");

function useT() {
  const lang = React.useContext(LangContext);
  return (en, zh) => (lang === "zh" ? zh : en);
}

function Header({ dark, onToggle, onLang }) {
  const t = useT();
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label={t("Back to top", "返回首页")}>
        <img className="brand-photo" src="assets/avatar.jpg" alt={PROFILE.nameEn} />
      </a>
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

function Hero({ typedText }) {
  const t = useT();
  const role = t(PROFILE.roleEn, PROFILE.roleZh);
  // Line breaks only at spaces or zero-width spaces; each word stays whole.
  const parts = role.split(/([ ​])/);
  const seal = <span className="hero-name-zh" role="img" aria-label={t(`${PROFILE.nameZh} seal`, `${PROFILE.nameZh}篆书印章`)} />;
  // The first line keeps its "·" phrases whole; later lines are a passage that grows the hero.
  const [lines, ...passage] = typedText.split("\n");
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
        <h1 className="sr-only">{PROFILE.nameEn} · {PROFILE.nameZh}</h1>
        <div className="hero-signature">
          <p className="role">
            {parts.map((part, i) => (i % 2
              ? (part === " " ? " " : <wbr key={i} />)
              : <span className="hero-word" key={i}>{part}{i === parts.length - 1 && seal}</span>))}
          </p>
          <span className="hero-divider" aria-hidden="true" />
        </div>
        <div className="typed" ref={typedRef}>
          <p>{lines.split(/(?<=·) /).map((chunk, i) => <React.Fragment key={i}>{i > 0 && " "}<span className="hero-word">{chunk}</span></React.Fragment>)}</p>
          {passage.map((text, i) => <p className="typed-passage" key={i}>{text}</p>)}
        </div>
      </div>
    </section>
  );
}
