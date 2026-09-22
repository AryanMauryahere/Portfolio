// This adapter runs before the original page wires its animations and navigation.
// Retain the source's scene attributes, IDs and structure when editing.
export function personalizeKage(p) {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const text = (s, value) => { const el = $(s); if (el) el.textContent = value; };
  const external = (el, label, href) => {
    if (label) el.textContent = label;
    el.href = href; el.target = '_blank'; el.rel = 'noopener noreferrer';
  };
  const validURL = (value) => {
    try { return ['https:', 'http:'].includes(new URL(value).protocol); } catch { return false; }
  };
  document.title = `${p.name} — Portfolio`;
  $('meta[name="description"]').content = p.about;
  text('.brand-tx b', p.name.toUpperCase());
  text('.brand-tx i', 'STUDENT PORTFOLIO');
  $('.brand').setAttribute('aria-label', `${p.name} — home`);
  text('.pre-jp', p.name.toUpperCase());
  text('.pre-meta > span', 'Opening my portfolio');
  const labels = ['About', 'Explore', 'Skills', 'Connect'];
  $$('.nav-link').forEach((el, i) => {
    el.querySelectorAll('span').forEach(span => { span.textContent = labels[i]; });
    el.querySelector('.alt').textContent = '0' + (i + 1);
    el.querySelector('.alt').setAttribute('aria-hidden', 'true');
  });
  $('.hero-top .eyebrow').lastChild.textContent = ` ${p.studyYear} · ${p.branch}`;
  $$('.hero h1 .mask-line > span').forEach((el, i) => { el.textContent = p.headline[i] || ''; });
  text('.hero-sub', `${p.name}. ${p.title} at ${p.college}.`);
  const chips = [
    ['Build', 'HTML, CSS and JavaScript.'],
    ['Learn', 'Python fundamentals, through loops.'],
    ['Explore', 'Web development and cybersecurity.'],
    ['Connect', 'Find me on GitHub and LinkedIn.'],
  ];
  $$('.chip').forEach((el, i) => {
    el.querySelector('b').textContent = chips[i][0];
    el.querySelector('p').textContent = chips[i][1];
  });
  text('.peek-cap b', '01');
  text('.peek-cap i', 'A little about me');
  $('.peek').href = '#gate';
  $('.peek').setAttribute('aria-label', 'Read about Aryan');
  text('.hero-side .v', 'AM');
  text('.word-fb', p.wordmark);
  const sectionLabel = (id, title, end) => {
    $(`${id} .sec-head .k`).lastChild.textContent = ` — ${title}`;
    text(`${id} .sec-head .jp`, end);
  };
  sectionLabel('#gate', 'About me', '01 / 04');
  text('#gate h2', p.aboutHeading);
  text('.gate-copy .lead', p.about);
  text('.gate-copy .body', p.aboutDetail);
  text('.gate-copy .arrowlink > span:first-child', 'Explore my interests');
  $$('.gate-stats > div').forEach((el, i) => {
    el.querySelector('b').textContent = p.facts[i].value;
    el.querySelector('span').textContent = p.facts[i].label;
  });
  sectionLabel('#pathways', 'Work & interests', '02 / 04');
  $$('.card').forEach((el, i) => {
    const interest = p.interests[i];
    el.querySelector('.card-lab b').textContent = interest.name;
    el.querySelector('.card-lab .jp').textContent = interest.tag;
    el.querySelector('.card-meta > span').textContent = interest.caption;
    el.setAttribute('aria-label', `${interest.name}: ${interest.caption}`);
  });
  const work = document.createElement('div');
  work.className = 'portfolio-work';
  const heading = document.createElement('h2');
  heading.className = 'display h-sec'; heading.dataset.rv = 'up';
  heading.textContent = p.projects.length ? p.projectsHeading : p.emptyProjectsHeading;
  work.append(heading);
  if (!p.projects.length) {
    const note = document.createElement('p'); note.className = 'body-lg';
    note.textContent = p.emptyProjectsMessage;
    const a = document.createElement('a'); a.className = 'arrowlink';
    external(a, 'Explore my GitHub ↗', p.links.github);
    work.append(note, a);
  } else {
    const grid = document.createElement('div'); grid.className = 'portfolio-projects';
    p.projects.forEach(project => {
      const article = document.createElement('article');
      if (project.image && /^(?:\/|\.\.\/|https:\/\/)/.test(project.image)) {
        const img = document.createElement('img'); img.src = project.image;
        img.alt = project.imageAlt || project.title; img.loading = 'lazy'; article.append(img);
      }
      const title = document.createElement('h3'); title.textContent = project.title;
      const description = document.createElement('p'); description.className = 'body'; description.textContent = project.description;
      const stack = document.createElement('p'); stack.className = 'eyebrow'; stack.textContent = (project.stack || []).join(' · ');
      article.append(title, description, stack);
      [['Live project ↗', project.liveUrl], ['Source code ↗', project.githubUrl]].forEach(([label, href]) => {
        if (!validURL(href)) return;
        const a = document.createElement('a'); a.className = 'arrowlink'; external(a, label, href); article.append(a);
      });
      grid.append(article);
    });
    work.append(grid);
  }
  $('#pathways').append(work);
  sectionLabel('#lessons', 'My toolkit', '03 / 04');
  text('.cur-head h2', p.skillsHeading); text('.cur-head p', p.skillsIntro);
  $$('.les').forEach((el, i) => {
    const skill = p.skills[i];
    el.querySelector('h3').firstChild.textContent = skill.name;
    el.querySelector('h3 em').textContent = skill.tag;
    el.querySelector('h3 em').setAttribute('aria-hidden', 'true');
    el.querySelector('p').textContent = skill.description;
    el.querySelector('.t').textContent = skill.status;
  });
  text('#eternity .eyebrow', 'Chapter 04 — Let’s connect');
  text('#eternity h2', 'Say hello.'); text('#eternity p', p.contactMessage);
  text('#eternity .cta > span', 'Connect on LinkedIn');
  external($('#eternity .cta'), null, p.links.linkedin);
  text('.foot-brand p', `${p.name}. ${p.heroLabel}. Curious about the web, code and the systems behind them.`);
  const cols = $$('.foot-grid > div');
  cols[1].querySelector('h4').textContent = 'Portfolio';
  cols[1].querySelectorAll('a').forEach((el, i) => { el.textContent = labels[i]; });
  cols[2].querySelector('h4').textContent = 'Learning & building';
  cols[2].querySelectorAll('a').forEach((el, i) => { el.textContent = ['HTML', 'CSS', 'JavaScript', 'Python fundamentals'][i]; });
  cols[3].querySelector('h4').textContent = 'Elsewhere';
  const social = cols[3].querySelectorAll('a');
  external(social[0], 'GitHub ↗', p.links.github); external(social[1], 'LinkedIn ↗', p.links.linkedin);
  social[2].textContent = 'Back to top ↑';
  if (p.links.email) {
    const li = document.createElement('li'), a = document.createElement('a');
    a.href = `mailto:${p.links.email}`; a.textContent = 'Email ↗'; li.append(a); cols[3].querySelector('ul').append(li);
  }
  if (p.links.resume) {
    const li = document.createElement('li'), a = document.createElement('a');
    external(a, 'Résumé ↗', p.links.resume); li.append(a); cols[3].querySelector('ul').append(li);
  }
  const base = $$('.foot-base > span');
  base[0].textContent = `© ${new Date().getFullYear()} ${p.name}`;
  base[1].textContent = 'Keep learning. Keep building.';
  base[2].textContent = 'Kage scene by ThreeUI';
  const rail = $('#rail');
  const observer = new MutationObserver(() => {
    const buttons = rail.querySelectorAll('button');
    if (buttons.length !== 6) return;
    buttons.forEach((el, i) => {
      const name = ['Home', 'About me', 'Work & interests', 'My toolkit', 'Connect', 'Footer'][i];
      el.title = name; el.setAttribute('aria-label', name);
    });
    observer.disconnect();
  });
  observer.observe(rail, { childList: true });
  const style = document.createElement('style'); style.id = 'portfolio-content-styles';
  style.textContent = `
    .portfolio-work { margin-top:clamp(56px,9vh,110px); padding-top:32px; border-top:1px solid var(--line); }
    .portfolio-work > p { max-width:52ch; }
    .portfolio-work .arrowlink { margin-top:12px; }
    .portfolio-projects { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:28px; margin-top:32px; }
    .portfolio-projects article { padding:24px; border:1px solid var(--line); background:rgba(5,7,10,.8); }
    .portfolio-projects img { width:100%; aspect-ratio:16/10; object-fit:cover; margin-bottom:24px; }
    .portfolio-projects .arrowlink { margin-right:24px; }
    a:focus-visible, button:focus-visible { outline:2px solid var(--bone); outline-offset:6px; }
    @media (min-width:821px) { .nav-burger { display:none; } }
    @media (max-width:560px) { .hero-side { display:none; } .portfolio-projects { grid-template-columns:1fr; } .brand-tx b { font-size:10px; letter-spacing:.15em; } }
  `;
  document.head.append(style);
}


