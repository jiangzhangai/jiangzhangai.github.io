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
      <nav aria-label={t("Main navigation", "主导航")}>
        <a href="#about">{t("About", "关于")}</a>
        <a href="#experience">{t("Experience", "经历")}</a>
        <a href="#projects">{t("Projects", "项目")}</a>
      </nav>
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

function SectionHeader({ titleEn, titleZh }) {
  const t = useT();
  return (
    <div className="section-head reveal">
      <div className="section-title">
        <h2>{t(titleEn, titleZh)}</h2>
      </div>
    </div>
  );
}

function About() {
  const t = useT();
  return (
    <section className="content-section" id="about">
      <SectionHeader titleEn="Between thought & practice" titleZh="思想与实践之间" />
      <div className="about-grid reveal">
        <p className="lead">{t(PROFILE.introEn, PROFILE.introZh)}</p>
        <div className="field-note mono">
          <span>{t("PERSONAL MOTTO", "座右铭")}</span>
          {t("I am not what I was. Keep teaching, building, and becoming.", "今日之我，已非昨日之我。继续教学、实践、成长。")}
        </div>
      </div>
    </section>
  );
}

function Experience() {
  const t = useT();
  return (
    <section className="content-section" id="experience">
      <SectionHeader titleEn="A life of teaching & building" titleZh="教学与实践之路" />
      <div className="experience-list">
        {EXPERIENCE.map((item) => (
          <article className="experience-row reveal" key={`${item.period}-${item.place}`}>
            <span className="mono">{item.period}</span>
            <div>
              <h3>{t(item.place, item.placeZh)}</h3>
              <p>{t(item.role, item.roleZh)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Level({ value }) {
  return <span className="level mono" aria-label={`${value} / 4`}>{"█".repeat(value)}{"░".repeat(4 - value)}</span>;
}

function Skills() {
  const t = useT();
  return (
    <section className="content-section" id="skills">
      <SectionHeader titleEn="Legend · tools & methods" titleZh="图例 · 工具与方法" />
      <div className="skill-grid">
        {SKILL_GROUPS.map((group) => (
          <article className="skill-group reveal" key={group.titleEn}>
            <h3>{t(group.titleEn, group.titleZh)}</h3>
            {group.items.map(([en, zh, level]) => (
              <div className="skill-row" key={en}>
                <div>{t(en, zh)}</div>
                <Level value={level} />
              </div>
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}

function Projects() {
  const t = useT();
  return (
    <section className="content-section" id="projects">
      <SectionHeader titleEn="Work logs" titleZh="项目记录" />
      <div className="project-list">
        {PROJECTS.map((project) => {
          const content = (
            <>
              <div className="project-index mono"><b>{project.code}</b><span>{t(project.year, project.yearZh)}</span></div>
              <div className="project-copy">
                <h3>{t(project.titleEn, project.titleZh)}</h3>
                <p>{t(project.summaryEn, project.summaryZh)}</p>
                <div className="tags mono">{t(project.tags, project.tagsZh).map((tag) => <span key={tag}>{tag}</span>)}</div>
              </div>
              <span className="project-arrow" aria-hidden="true">↗</span>
            </>
          );
          return project.url ? <a className="project-card reveal" href={project.url} key={project.code}>{content}</a> : <article className="project-card reveal" key={project.code}>{content}</article>;
        })}
      </div>
    </section>
  );
}

function Writing() {
  const t = useT();
  return (
    <section className="content-section" id="writing">
      <SectionHeader titleEn="Field notes" titleZh="文章" />
      <div className="writing-list reveal">
        {WRITING.length === 0 && (
          <div className="writing-empty">
            <span className="mono">{t("NOTES IN PREPARATION", "文章整理中")}</span>
            <p>{t("Essays on mathematics, technology, artificial intelligence and the Laozi will appear here.", "关于数学、技术、人工智能与《老子》的文章将在这里陆续发布。")}</p>
          </div>
        )}
        {WRITING.map((item) => (
          <div className="writing-row" key={item.titleEn}>
            <span className="mono">{item.date}</span>
            <div><h3>{t(item.titleEn, item.titleZh)}</h3><p>{item.subtitle}</p></div>
            <b aria-hidden="true">→</b>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const t = useT();
  return (
    <section className="content-section contact" id="contact">
      <SectionHeader titleEn="Make contact" titleZh="联系" />
      <div className="contact-grid reveal">
        <p>{t("Questions, collaborations, or a thoughtful hello.", "如果你有问题、合作设想，或只是想认真地打个招呼。")}</p>
        <div className="contact-links">
          {LINKS.map((link) => {
            const label = t(link.label, link.labelZh);
            return link.url ? <a href={link.url} key={link.label}><b>{label}</b><span>{link.value}</span><i>↗</i></a> : <div key={link.label}><b>{label}</b><span>{link.value}</span></div>;
          })}
        </div>
      </div>
      <footer><span className="mono">© {new Date().getFullYear()} · {t("All rights reserved.", "版权所有")}</span></footer>
    </section>
  );
}
