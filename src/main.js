import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/bodoni-moda/latin-500.css';
import './styles.css';
import { portfolio } from './content.js';

const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" stroke-width="1.4"/></svg>';
const downArrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v16m-6-6 6 6 6-6" stroke="currentColor" stroke-width="1.4"/></svg>';

// Static layout is kept separate from your editable content.
document.querySelector('#app').innerHTML = `
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <a class="wordmark" href="#top" data-name></a>
    <span class="header-edition">Portfolio — <span data-year></span></span>
    <nav aria-label="Main navigation">
      <a href="#about">About</a><a href="#projects">Work</a><a href="#contact">Contact</a>
    </nav>
  </header>
  <main id="main" tabindex="-1">
    <section class="hero" id="top" aria-labelledby="hero-title">
      <div class="hero-scene" aria-hidden="true">
        <div class="scene-fallback"><i></i><i></i></div>
      </div>
      <p class="hero-intro"></p>
      <h1 class="hero-title" id="hero-title"></h1>
      <div class="hero-bottom">
        <a class="scroll-link micro" href="#about">Scroll to explore ${downArrow}</a>
        <button class="motion-toggle micro" type="button" hidden>Pause motion <span aria-hidden="true">Ⅱ</span></button>
      </div>
    </section>
    <section class="about section" id="about" aria-labelledby="about-heading">
      <div class="section-label"><span>[01]</span><h2 id="about-heading">A little about me.</h2></div>
      <div class="about-grid">
        <p class="about-copy display"></p>
        <dl class="education"></dl>
      </div>
      <div class="toolkit" aria-label="Skills and interests"></div>
    </section>
    <section class="projects section" id="projects" aria-labelledby="projects-heading">
      <div class="section-label"><span>[02]</span><h2 id="projects-heading"></h2></div>
      <div class="projects-content"></div>
    </section>
    <section class="contact section" id="contact" aria-labelledby="contact-heading">
      <div class="section-label"><span>[03]</span><h2 id="contact-heading">Let's connect.</h2></div>
      <div class="contact-content"><div class="social-links"></div><span class="contact-arrow" aria-hidden="true">↘</span></div>
      <footer class="site-footer"><p>© <span data-year></span> <span data-name></span></p><p class="footer-title"></p><a class="back-top" href="#top">Back to top <span aria-hidden="true">↑</span></a></footer>
    </section>
  </main>
`;

const text = (selector, value) => document.querySelectorAll(selector).forEach((el) => { el.textContent = value; });
const element = (tag, className, value) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (value !== undefined) node.textContent = value;
  return node;
};
const webUrl = (value) => {
  if (!value) return '';
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : ''; }
  catch { return ''; }
};
const assetUrl = (value) => {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return webUrl(value);
  if (/^[\w./-]+$/.test(value) && !value.includes('..')) return import.meta.env.BASE_URL + value.replace(/^\/+/, '');
  return '';
};
function externalLink(label, href, className) {
  const link = element('a', className);
  link.href = href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label', label + ' (opens in a new tab)');
  link.append(element('span', '', label));
  link.insertAdjacentHTML('beforeend', arrow);
  return link;
}

text('[data-name]', portfolio.name);
text('[data-year]', new Date().getFullYear());
text('.hero-intro', portfolio.heroLabel);
document.querySelector('.hero-title').setAttribute('aria-label', portfolio.headline.join(' '));
text('.about-copy', portfolio.about);
text('.footer-title', portfolio.title);
document.title = portfolio.name + ' — Portfolio';
document.querySelector('meta[name="description"]').content = portfolio.about;
portfolio.headline.forEach((line) => document.querySelector('.hero-title').append(element('span', '', line)));

for (const [label, value] of [['College', portfolio.college], ['Branch', portfolio.branch], ['Year', portfolio.studyYear]]) {
  const group = element('div');
  group.append(element('dt', 'micro', label), element('dd', '', value));
  document.querySelector('.education').append(group);
}
for (const row of portfolio.toolkit) {
  const group = element('div', 'toolkit-row');
  const items = element('p', 'toolkit-items', row.items.join(' / '));
  if (row.note) items.append(element('span', 'toolkit-note', '(' + row.note.toLowerCase() + ')'));
  group.append(element('h3', 'micro', row.label), items);
  document.querySelector('.toolkit').append(group);
}

const projectsRoot = document.querySelector('.projects-content');
text('#projects-heading', portfolio.projects.length ? portfolio.projectsHeading : portfolio.emptyProjectsHeading);
if (!portfolio.projects.length) {
  const empty = element('div', 'projects-empty');
  empty.append(element('p', 'display projects-statement', portfolio.emptyProjectsMessage));
  if (portfolio.emptyProjectsDetail) empty.append(element('p', 'projects-detail', portfolio.emptyProjectsDetail));
  const github = webUrl(portfolio.links.github);
  if (github) empty.append(externalLink('View GitHub profile', github, 'text-link'));
  projectsRoot.append(empty);
} else {
  portfolio.projects.forEach((project, index) => {
    const article = element('article', 'project');
    article.append(element('span', 'project-index micro', String(index + 1).padStart(2, '0')));
    const body = element('div', 'project-body');
    body.append(element('h3', 'display project-title', project.title), element('p', 'project-description', project.description));
    if (project.contribution) body.append(element('p', 'project-contribution', 'My contribution: ' + project.contribution));
    if (project.technologies?.length) body.append(element('p', 'project-technologies', project.technologies.join(' / ')));
    const links = element('div', 'project-links');
    for (const [label, href] of [['Source code', project.repository], ['Live demo', project.demo]]) {
      const url = webUrl(href);
      if (url) links.append(externalLink(label, url, 'text-link'));
    }
    if (links.childElementCount) body.append(links);
    article.append(body);
    const source = assetUrl(project.image);
    if (source) {
      const img = element('img', 'project-image');
      img.src = source;
      img.alt = project.imageAlt || project.title;
      img.loading = 'lazy';
      img.width = 960;
      img.height = 600;
      img.addEventListener('error', () => img.remove(), { once: true });
      article.append(img);
    }
    projectsRoot.append(article);
  });
}

const socialRoot = document.querySelector('.social-links');
for (const [label, value] of [['LinkedIn', portfolio.links.linkedin], ['GitHub', portfolio.links.github]]) {
  const url = webUrl(value);
  if (url) socialRoot.append(externalLink(label, url, 'social-link display'));
}
if (portfolio.links.email) {
  const link = element('a', 'social-link display', 'Email');
  link.href = 'mailto:' + encodeURIComponent(portfolio.links.email);
  link.insertAdjacentHTML('beforeend', arrow);
  socialRoot.append(link);
}
if (portfolio.links.resume) {
  const url = assetUrl(portfolio.links.resume);
  if (url) socialRoot.append(externalLink('Resume', url, 'text-link resume-link'));
}

// Native anchors remain usable. Move keyboard focus to the destination after navigation.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    const destination = document.querySelector(link.getAttribute('href'));
    if (!destination) return;
    destination.tabIndex = -1;
    destination.focus({ preventScroll: true });
  });
});

// The 3D module loads separately so text, navigation and links are available first.
const sceneRoot = document.querySelector('.hero-scene');
import('./hero.js').then(({ createHero }) => {
  createHero(sceneRoot, document.querySelector('.motion-toggle'), portfolio.motion);
}).catch(() => {
  sceneRoot.dataset.fallback = 'true';
});

