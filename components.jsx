const LangContext = React.createContext("en");
const TYPE_STEP = 200; // Milliseconds per character of the Chinese passage.

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
function Bookshelf({ onPiece }) {
  const t = useT();
  const [shelf, setShelf] = React.useState(null);
  const [open, setOpen] = React.useState(null);
  const ref = React.useRef(null);

  React.useEffect(() => {
    // Always check for a newer list, so a change to the shelf reaches returning readers.
    fetch("projects.json", { cache: "no-cache" }).then((response) => response.json()).then(setShelf).catch(() => setShelf(null));
  }, []);

  React.useEffect(() => {
    if (!open) return;
    // composedPath, because opening a name replaces the very button that was clicked.
    const close = (event) => { if (event.type === "keydown" ? event.key === "Escape" : !event.composedPath().includes(ref.current)) setOpen(null); };
    document.addEventListener("click", close);
    document.addEventListener("keydown", close);
    // A name can run past the bottom of a short screen.
    ref.current.querySelector(".shelf-name").scrollIntoView({ block: "nearest" });
    return () => { document.removeEventListener("click", close); document.removeEventListener("keydown", close); };
  }, [open]);

  if (!shelf) return null;

  // Book pages live on this site and open in place; products are other sites and open in a new tab.
  const entry = (item) => (
    <div className="shelf-entry" key={item.zh}>
      {item.status === "live"
        ? <a href={item.url} {...(item.url.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}><b>{t(item.en, item.zh)}</b></a>
        : <b>{t(item.en, item.zh)}</b>}
    </div>
  );

  const closeUnlessLink = (event) => { if (!event.target.closest("a")) setOpen(null); };

  // A name stands in the spine, running down from its cell's own place: a book's full name, or AI's product.
  // A piece's name stays open when clicked, and the piece plays on the slips.
  const cell = (item) => (
    <li key={item.char}>
      {open === item
        ? <div className="shelf-name" onClick={item.piece ? () => onPiece(item.piece, item.glyphs) : closeUnlessLink}>{(item.children || [item]).map(entry)}</div>
        : <button className={`shelf-cell ${item.char.length > 1 ? "is-latin" : ""}`}
            aria-label={t(item.en, item.zh)}
            onClick={() => setOpen(item)}>
            {item.char}
          </button>}
    </li>
  );

  return (
    <nav className="bookshelf" ref={ref} aria-label={t("Projects", "项目书架")}>
      <ul>{shelf.thought.map(cell)}</ul>
      <ul className="shelf-commerce">{shelf.commerce.map(cell)}</ul>
    </nav>
  );
}

// What stands between  and  is the original text of the Laozi, shown as small seal images (seal_glyphs.js); punctuation stays text.
const sealChar = (char, i) => (SEAL_GLYPHS[char]
  ? <svg className="seal-glyph" viewBox={SEAL_VIEW} role="img" aria-label={char} key={i}><path d={SEAL_GLYPHS[char]} /></svg>
  : char);
const withSeal = (text) => text.split(/[]/).map((part, i) => (i % 2 ? <span className="seal" key={i}>{[...part].map(sealChar)}</span> : part));
//  at the start of a line makes it a heading. An empty line is one blank slip.
const paragraph = (text, key) => (
  <p className={`${key ? "typed-passage" : ""} ${text[0] === "" ? "typed-heading" : ""}`} key={key}>
    {text ? withSeal(text.replace("", "")) : "　"}
  </p>
);

// Each new character fades in instead of appearing at once (styles.css). The fade outlasts several characters, so they run together.
// Only the newest characters of a run are separate elements: once faded, they merge into the plain text.
const ink = (p) => {
  const kids = p.props.children;
  if (!Array.isArray(kids)) return p;
  return React.cloneElement(p, null, kids.map((kid, i) => {
    if (typeof kid !== "string") return kid;
    const chars = [...kid];
    const cut = Math.max(0, chars.length - 12);
    return <React.Fragment key={`ink${i}`}>{chars.slice(0, cut).join("")}{chars.slice(cut).map((char, n) => <span className="ink" key={cut + n}>{char}</span>)}</React.Fragment>;
  }));
};

// Only the line being typed changes: a piece can run to thousands of seal images, too many to redraw for each character.
const Line = React.memo(({ text, n }) => ink(paragraph(text, n)));

function Hero({ typedText, fullText, fading }) {
  const t = useT();
  const lang = React.useContext(LangContext);
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
  const heroRef = React.useRef(null);
  const atNewest = React.useRef(true);
  // Lays the slips under the columns as this browser really set them: its font and text scaling can move and space the columns differently.
  const columns = React.useRef(0);
  const measuredShape = React.useRef("");
  const alignSlips = (force) => {
    const scroll = typedRef.current.firstChild;
    // Measuring every column for each character would slow a long piece: the width of the line being typed shows when a column is added.
    const typing = scroll.lastElementChild;
    const shape = `${scroll.children.length}:${typing.getBoundingClientRect().width}`;
    if (!force && shape === measuredShape.current) return;
    measuredShape.current = shape;
    // Measured across all the ordinary text, first column to last: a heading's larger type can sit slightly off,
    // and a browser's rounding, too small to see between two columns, adds up over many.
    const range = document.createRange();
    const centres = [...scroll.querySelectorAll("p:not(.typed-heading)")].filter((text) => !text.querySelector(".seal")).flatMap((text) => {
      range.selectNodeContents(text);
      return [...range.getClientRects()].filter((rect) => rect.width > 2).map((rect) => (rect.left + rect.right) / 2);
    }).filter((centre, i, all) => !i || Math.abs(centre - all[i - 1]) > 8); // The fading characters give a column several boxes.
    // A piece wholly in seal has no ordinary text: its images stand in, a sample of them being enough.
    if (!centres.length) {
      const images = scroll.querySelectorAll(".seal-glyph");
      for (let i = 0; i < images.length; i += i + 10 < images.length ? 10 : Math.max(1, images.length - 1 - i)) {
        const rect = images[i].getBoundingClientRect();
        const centre = (rect.left + rect.right) / 2;
        if (!centres.length || Math.abs(centre - centres[centres.length - 1]) > 8) centres.push(centre);
      }
    }
    // Only a new column or a resize changes the layout. The column being typed moves a little with each character, and the slips must not follow it.
    if (!centres.length || (!force && centres.length === columns.current)) return;
    columns.current = centres.length;
    if (centres.length > 2) centres.pop();
    const span = Math.abs(centres[centres.length - 1] - centres[0]);
    const line = parseFloat(getComputedStyle(scroll).lineHeight);
    const pitch = span > line / 2 ? span / Math.round(span / line) : line;
    scroll.style.setProperty("--slip", `${pitch.toFixed(2)}px`);
    const shift = scroll.getBoundingClientRect().right - centres[0] - pitch / 2;
    scroll.style.setProperty("--slip-x", `${(shift - Math.round(shift / pitch) * pitch).toFixed(2)}px`);
    // A whole number of slips fits the window, so none is left cut through at the right edge when the columns come to rest.
    const box = typedRef.current;
    const room = box.getBoundingClientRect().width + (parseFloat(box.style.marginLeft) || 0);
    box.style.marginLeft = `${(room % pitch).toFixed(2)}px`;
  };
  // The slips move on at an even speed, left to the browser so that the typing can't disturb it: a transition on a transform, retimed at each new column.
  // Scrolling won't do: it goes only by whole pixels, and Safari resets it as the text lays out. The blank slip kept at the left (styles.css) leaves the newest column in view.
  const touched = React.useRef(0);
  const followedWidth = React.useRef(0);
  const follow = () => {
    const el = typedRef.current;
    const scroll = el.firstChild;
    followedWidth.current = el.scrollWidth;
    const target = el.clientWidth - el.scrollWidth;
    if (target >= 0) return;
    if (!scroll.style.transform) {
      const start = el.scrollLeft;
      el.scrollLeft = 0;
      scroll.style.transition = "none";
      scroll.style.transform = `translateX(${-start}px)`;
      scroll.getBoundingClientRect();
    }
    // A little longer than a full column takes to type, so the slips are still moving when the next one starts. After short lines there is further to go in that time, so they go a little faster.
    const text = getComputedStyle(scroll.lastElementChild);
    const image = scroll.lastElementChild.querySelector(".seal-glyph");
    const letter = image ? image.getBoundingClientRect().height * 1.08 : parseFloat(text.fontSize) + (parseFloat(text.letterSpacing) || 0);
    const column = scroll.getBoundingClientRect().height - 2 * parseFloat(getComputedStyle(scroll).paddingTop);
    const seconds = 1.05 * (column / letter) * (TYPE_STEP / 1000);
    scroll.style.transition = `transform ${seconds.toFixed(2)}s linear`;
    scroll.style.transform = `translateX(${-target}px)`;
  };
  // The reader's hand takes over: real scrolling, from where the slips are now.
  const handOver = () => {
    touched.current = Date.now();
    followedWidth.current = 0;
    const el = typedRef.current;
    const scroll = el.firstChild;
    if (!scroll.style.transform) return;
    const at = new DOMMatrix(getComputedStyle(scroll).transform).m41;
    scroll.style.transition = "none";
    scroll.style.transform = "";
    el.scrollLeft = -at;
  };
  React.useEffect(() => {
    if (lang !== "zh") return;
    const realign = () => alignSlips(true);
    addEventListener("resize", realign);
    if (document.fonts) document.fonts.ready.then(realign);
    return () => {
      removeEventListener("resize", realign);
      typedRef.current.style.marginLeft = "";
      typedRef.current.firstChild.style.transition = "none";
      typedRef.current.firstChild.style.transform = "";
      followedWidth.current = 0;
      columns.current = 0;
    };
  }, [lang]);
  React.useEffect(() => {
    if (lang !== "zh") return;
    // The Chinese passage scrolls sideways: wheeling down moves on to the columns at the left.
    const hero = heroRef.current;
    const el = typedRef.current;
    // Only the reader's own hand counts as leaving the newest column; the page's own scrolling passes through other positions too.
    const onWheel = (event) => {
      handOver();
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) el.scrollLeft -= event.deltaY * (event.deltaMode ? 30 : 1);
    };
    const onScroll = () => {
      if (el.scrollWidth - el.clientWidth + el.scrollLeft <= 2) atNewest.current = true;
      else if (Date.now() - touched.current < 1500) atNewest.current = false;
    };
    hero.addEventListener("wheel", onWheel, { passive: true });
    el.addEventListener("touchmove", handOver, { passive: true });
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => { hero.removeEventListener("wheel", onWheel); el.removeEventListener("touchmove", handOver); el.removeEventListener("scroll", onScroll); };
  }, [lang]);
  React.useEffect(() => {
    if (lang === "zh") {
      // New columns open at the left and push the old ones right, unless the reader has gone back to earlier columns.
      const el = typedRef.current;
      alignSlips();
      if (!typedText) {
        atNewest.current = true;
        el.firstChild.style.transition = "none";
        el.firstChild.style.transform = "";
        followedWidth.current = 0;
      }
      if (atNewest.current && el.scrollWidth !== followedWidth.current && Date.now() - touched.current > 1500) follow();
      return;
    }
    // Follow the typing downward, unless the reader has scrolled away from it.
    const bottom = typedRef.current.getBoundingClientRect().bottom;
    const target = innerHeight * 0.75;
    if (bottom > target && bottom < innerHeight + 80) window.scrollBy({ top: bottom - target, behavior: "smooth" });
  }, [typedText]);
  return (
    <section className="hero" id="top" ref={heroRef}>
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
          <div className="typed-scroll">
            {isLine ? <p>{lineChunks}</p> : <Line text={lines} n={0} />}
            {passage.map((text, i) => <Line key={i + 1} text={text} n={i + 1} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
