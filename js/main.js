(function () {
  'use strict';

  const config = window.PORTFOLIO || {};
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const smooth = (t) => t * t * (3 - 2 * t);

  function getStorage(type) {
    try {
      const store = window[type];
      store.setItem('__test__', '1');
      store.removeItem('__test__');
      return store;
    } catch (error) {
      return null;
    }
  }

  function announce(message) {
    const region = $('#live-region');
    if (!region) return;
    region.textContent = '';
    window.setTimeout(() => {
      region.textContent = message;
    }, 50);
  }

  function initialsFrom(name = '') {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('');
  }

  const strokeIcon = (paths) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  const fillIcon = (path) => `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${path}"/></svg>`;

  const ICONS = {
    github: fillIcon(
      'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'
    ),
    linkedin: fillIcon(
      'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
    ),
    email: strokeIcon('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>'),
    website: strokeIcon('<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>'),
    external: strokeIcon('<path d="M7 17 17 7"/><path d="M7 7h10v10"/>'),
    code: strokeIcon('<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>'),
    book: strokeIcon('<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>'),
    star: strokeIcon('<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>'),
    fork: strokeIcon('<circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"/><path d="M12 12v3"/>'),
    clock: strokeIcon('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'),
    refresh: strokeIcon('<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/>'),
    frontend: strokeIcon('<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>'),
    backend: strokeIcon('<rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 6h.01"/><path d="M6 18h.01"/>'),
    tools: strokeIcon('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'),
    database: strokeIcon('<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>'),
    security: strokeIcon('<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>'),
    chart: strokeIcon('<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>'),
    design: strokeIcon('<path d="M6 12h4"/><path d="M8 10v4"/><path d="M15 13h.01"/><path d="M18 11h.01"/><rect width="20" height="12" x="2" y="6" rx="2"/>'),
    trophy: strokeIcon('<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>'),
    images: strokeIcon('<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>'),
    expand: strokeIcon('<path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/>'),
  };

  function renderContent() {
    const name = config.name || 'Your Name';
    const values = {
      name,
      initials: config.initials || initialsFrom(name),
      role: config.role,
      location: config.location,
      email: config.email,
      availability: config.availability,
      bio: config.bio,
      contactBlurb: config.contactBlurb,
    };

    $$('[data-bind]').forEach((el) => {
      const value = values[el.dataset.bind];
      if (value) el.textContent = value;
    });

    document.title = config.role ? `${name} | ${config.role}` : name;
    if (config.bio) {
      $$('meta[name="description"], meta[property="og:description"]').forEach((meta) => meta.setAttribute('content', config.bio));
    }
    $('meta[property="og:title"]')?.setAttribute('content', document.title);

    const badge = $('[data-availability]');
    if (badge) badge.hidden = !config.availability;

    $$('[data-email-link]').forEach((link) => {
      if (config.email) link.href = `mailto:${config.email}`;
      else link.closest('.contact-item')?.setAttribute('hidden', '');
    });

    const avatar = $('[data-avatar]');
    if (avatar) {
      const fallback = 'assets/images/profile.svg';
      avatar.alt = `Portrait of ${name}`;
      avatar.addEventListener('error', () => {
        if (!avatar.src.endsWith(fallback)) avatar.src = fallback;
      }, { once: true });
      if (config.avatar && !avatar.src.endsWith(config.avatar)) avatar.src = config.avatar;
    }

    $$('[data-year]').forEach((el) => {
      el.textContent = new Date().getFullYear();
    });

    renderStoryText();
    renderSocials();
    renderAbout();
    renderSkills();
    renderProjects();
    renderAchievements();
    renderCredentials();
  }

  function renderStoryText() {
    const story = config.story || {};
    $$('[data-story]').forEach((el) => {
      const [group, field] = el.dataset.story.split('.');
      const value = story[group] && story[group][field];
      if (value) el.textContent = value;
      else el.hidden = true;
    });
  }

  function getSocialLinks() {
    const socials = config.socials || {};
    const username = config.github?.username;
    const links = [
      { key: 'github', label: 'GitHub', href: socials.github || (username ? `https://github.com/${username}` : '') },
      { key: 'linkedin', label: 'LinkedIn', href: socials.linkedin },
      { key: 'website', label: 'Website', href: socials.website },
      { key: 'email', label: 'Email', href: config.email ? `mailto:${config.email}` : '' },
    ];
    return links.filter((link) => link.href);
  }

  function renderSocials() {
    const markup = getSocialLinks()
      .map((link) => {
        const external = link.key === 'email' ? '' : ' target="_blank" rel="noopener noreferrer"';
        return `<li><a class="social-link" href="${escapeHTML(link.href)}"${external} aria-label="${link.label}" title="${link.label}">${ICONS[link.key]}</a></li>`;
      })
      .join('');

    $$('[data-socials]').forEach((list) => {
      list.innerHTML = markup;
      list.hidden = !markup;
    });
  }

  function renderAbout() {
    const paragraphs = $('#about-paragraphs');
    const facts = $('#facts');

    if (paragraphs) {
      paragraphs.innerHTML = (config.about || []).map((text) => `<p>${escapeHTML(text)}</p>`).join('');
    }

    if (facts) {
      const items = (config.facts || []).filter((fact) => fact.label && fact.value);
      facts.innerHTML = items
        .map((fact) => `<div class="fact"><dt>${escapeHTML(fact.label)}</dt><dd>${escapeHTML(fact.value)}</dd></div>`)
        .join('');
      facts.hidden = !items.length;
    }
  }

  function renderSkills() {
    const container = $('#skills');
    if (!container) return;

    container.innerHTML = (config.skills || [])
      .map(
        (group, index) => `
        <article class="skill-group" data-reveal style="--delay: ${(index % 3) * 100}ms">
          <h4 class="skill-group-title">
            <span class="skill-icon">${ICONS[group.icon] || ICONS.code}</span>
            ${escapeHTML(group.group)}
          </h4>
          <ul class="skill-list">
            ${(group.items || []).map((item) => `<li>${escapeHTML(item)}</li>`).join('')}
          </ul>
        </article>`
      )
      .join('');
  }

  function projectCard(project, index) {
    const links = [];
    if (project.demo) {
      links.push(`<a class="text-link" href="${escapeHTML(project.demo)}" target="_blank" rel="noopener noreferrer">Live demo ${ICONS.external}<span class="visually-hidden"> of ${escapeHTML(project.title)} (opens in a new tab)</span></a>`);
    }
    if (project.repo) {
      links.push(`<a class="text-link" href="${escapeHTML(project.repo)}" target="_blank" rel="noopener noreferrer">Source code ${ICONS.external}<span class="visually-hidden"> of ${escapeHTML(project.title)} (opens in a new tab)</span></a>`);
    }

    const image = project.image
      ? `<img src="${escapeHTML(project.image)}" alt="Preview of ${escapeHTML(project.title)}" width="800" height="500" loading="lazy" decoding="async">`
      : '';

    return `
      <article class="project-card" data-category="${escapeHTML(project.category || '')}" data-reveal style="--delay: ${(index % 2) * 120}ms">
        <div class="project-media">
          ${image}
          ${project.category ? `<span class="project-category">${escapeHTML(project.category)}</span>` : ''}
        </div>
        <div class="project-body">
          <div>
            ${project.role ? `<p class="project-role">${escapeHTML(project.role)}</p>` : ''}
            <h3 class="project-title">${escapeHTML(project.title)}</h3>
          </div>
          <p class="project-desc">${escapeHTML(project.description)}</p>
          <ul class="tag-list" aria-label="Technologies used">
            ${(project.tech || []).map((tech) => `<li class="tag">${escapeHTML(tech)}</li>`).join('')}
          </ul>
          ${links.length ? `<div class="project-links">${links.join('')}</div>` : ''}
        </div>
      </article>`;
  }

  function renderProjects() {
    const grid = $('#project-grid');
    const filterBar = $('#project-filters');
    const projects = config.projects || [];
    if (!grid) return;

    grid.innerHTML = projects.map(projectCard).join('');

    const categories = [...new Set(projects.map((project) => project.category).filter(Boolean))];
    if (!filterBar || categories.length < 2) return;

    const countFor = (category) =>
      category === 'All' ? projects.length : projects.filter((project) => project.category === category).length;

    filterBar.innerHTML = ['All', ...categories]
      .map(
        (category) =>
          `<button class="filter-btn" type="button" data-filter="${escapeHTML(category)}" aria-pressed="${category === 'All'}">${escapeHTML(category)}<span class="filter-count">${countFor(category)}</span></button>`
      )
      .join('');
    filterBar.hidden = false;

    filterBar.addEventListener('click', (event) => {
      const button = event.target.closest('.filter-btn');
      if (!button) return;

      const filter = button.dataset.filter;
      $$('.filter-btn', filterBar).forEach((btn) => btn.setAttribute('aria-pressed', String(btn === button)));

      let shown = 0;
      $$('.project-card', grid).forEach((card) => {
        const match = filter === 'All' || card.dataset.category === filter;
        card.hidden = !match;
        if (match) {
          shown += 1;
          card.classList.add('is-visible');
          card.classList.remove('is-filtered-in');
          void card.offsetWidth;
          card.classList.add('is-filtered-in');
        }
      });

      announce(`Showing ${shown} ${shown === 1 ? 'project' : 'projects'}${filter === 'All' ? '' : ` in ${filter}`}.`);
    });
  }

  function achievementCard(item, index) {
    const photos = item.photos || [];
    const cover = photos[0];
    const media = cover
      ? `<button class="achievement-media" type="button" data-gallery="${index}" aria-label="View ${photos.length > 1 ? `${photos.length} photos` : 'photo'}: ${escapeHTML(item.title)}">
          <img src="${escapeHTML(cover.src)}" alt="" loading="lazy" decoding="async">
          ${photos.length > 1 ? `<span class="photo-count">${ICONS.images}${photos.length}</span>` : ''}
          <span class="zoom-hint" aria-hidden="true">${ICONS.expand}</span>
        </button>`
      : '';

    return `
      <article class="achievement-card" data-reveal style="--delay: ${(index % 3) * 110}ms">
        ${media}
        <div class="achievement-body">
          ${item.badge ? `<span class="achievement-badge">${ICONS.trophy}${escapeHTML(item.badge)}</span>` : ''}
          <h3 class="achievement-title">${escapeHTML(item.title)}</h3>
          <p class="achievement-meta">${[item.org, item.date].filter(Boolean).map(escapeHTML).join('<span aria-hidden="true"> · </span>')}</p>
          ${item.description ? `<p class="achievement-desc">${escapeHTML(item.description)}</p>` : ''}
        </div>
      </article>`;
  }

  function renderAchievements() {
    const grid = $('#achievement-grid');
    const credit = $('#photo-credit');
    if (!grid) return;

    grid.innerHTML = (config.achievements || []).map(achievementCard).join('');
    if (credit && config.photoCredit) {
      credit.textContent = config.photoCredit;
      credit.hidden = false;
    }
  }

  function fillList(selector, items, render) {
    const list = $(selector);
    if (!list) return;
    list.innerHTML = items.map(render).join('');
    list.closest('.credential-card').hidden = !items.length;
  }

  function renderCredentials() {
    fillList('#certifications', config.certifications || [], (cert) => `
      <li>
        <span class="credential-name">${escapeHTML(cert.title)}</span>
        ${cert.meta ? `<span class="credential-meta">${escapeHTML(cert.meta)}</span>` : ''}
      </li>`);

    fillList('#leadership', config.leadership || [], (role) => `
      <li class="timeline-item">
        ${role.date ? `<span class="timeline-date">${escapeHTML(role.date)}</span>` : ''}
        <h4 class="timeline-title">${escapeHTML(role.title)}</h4>
        ${role.org ? `<p class="timeline-org">${escapeHTML(role.org)}</p>` : ''}
        ${role.description ? `<p class="timeline-desc">${escapeHTML(role.description)}</p>` : ''}
      </li>`);

    fillList('#trainings', config.trainings || [], (training) => `
      <li>
        <span>${escapeHTML(training.title)}</span>
        ${training.date ? `<span class="training-date">${escapeHTML(training.date)}</span>` : ''}
      </li>`);

    const host = $('#trainings-host');
    if (host && config.trainingsHost) {
      host.textContent = config.trainingsHost;
      host.hidden = false;
    }
  }

  function initTheme() {
    const toggle = $('.theme-toggle');
    const store = getStorage('localStorage');
    const themeColor = $('meta[name="theme-color"]');

    function applyTheme(theme, animate = false) {
      if (animate && !reducedMotion) {
        root.classList.add('theme-transition');
        window.setTimeout(() => root.classList.remove('theme-transition'), 450);
      }
      root.setAttribute('data-theme', theme);
      toggle?.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      themeColor?.setAttribute('content', theme === 'dark' ? '#050505' : '#fafafa');
    }

    applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

    toggle?.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next, true);
      store?.setItem('theme', next);
    });
  }

  function initNavigation() {
    const header = $('.site-header');
    const menuToggle = $('.menu-toggle');
    const navLinks = $$('.nav-link');
    const backToTop = $('.back-to-top');
    const story = $('#home');

    const isMenuOpen = () => header.classList.contains('menu-open');

    function setMenu(open) {
      header.classList.toggle('menu-open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    menuToggle.addEventListener('click', () => setMenu(!isMenuOpen()));
    navLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isMenuOpen()) {
        setMenu(false);
        menuToggle.focus();
      }
    });

    document.addEventListener('click', (event) => {
      if (isMenuOpen() && !header.contains(event.target)) setMenu(false);
    });

    window.matchMedia('(min-width: 961px)').addEventListener('change', (event) => {
      if (event.matches) setMenu(false);
    });

    let ticking = false;

    function onScroll() {
      const scrolled = window.scrollY;
      const storyEnd = story ? story.offsetHeight - window.innerHeight : 600;
      header.classList.toggle('is-scrolled', scrolled > 8);
      backToTop.classList.toggle('is-visible', scrolled > Math.max(600, storyEnd));
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });
    onScroll();

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
      $('.logo').focus({ preventScroll: true });
    });

    if (!('IntersectionObserver' in window)) return;

    function setActive(id) {
      navLinks.forEach((link) => {
        const active = link.hash === `#${id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    navLinks
      .map((link) => document.getElementById(link.hash.slice(1)))
      .filter(Boolean)
      .forEach((section) => sectionObserver.observe(section));
  }

  const STORY_PANELS = {
    hero: [-1, 0, 0.07, 0.15],
    cue: [-1, 0, 0.02, 0.06],
    left: [0.17, 0.24, 0.36, 0.43],
    right: [0.48, 0.55, 0.66, 0.73],
    cta: [0.84, 0.91, 2, 2],
  };

  const STORY_EXPLODE = [
    [0, 0],
    [0.1, 0],
    [0.52, 1],
    [0.7, 1],
    [0.9, 0],
    [1, 0],
  ];

  const ASSEMBLED_BOUNDS = { l: 0.215, t: 0.351, r: 0.795, b: 0.877 };

  function alphaBounds(img) {
    try {
      return measureBounds(img);
    } catch (error) {
      return ASSEMBLED_BOUNDS;
    }
  }

  function measureBounds(img) {
    const scale = Math.min(1, 400 / img.naturalWidth);
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));
    const probe = document.createElement('canvas');
    probe.width = w;
    probe.height = h;
    const pctx = probe.getContext('2d', { willReadFrequently: true });
    pctx.drawImage(img, 0, 0, w, h);
    const { data } = pctx.getImageData(0, 0, w, h);
    const cols = new Uint16Array(w);
    const rows = new Uint16Array(h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (data[(y * w + x) * 4 + 3] > 96) {
          cols[x] += 1;
          rows[y] += 1;
        }
      }
    }
    const minCount = Math.max(4, Math.round(h * 0.02));
    const first = (arr) => arr.findIndex((n) => n >= minCount);
    const last = (arr) => arr.length - 1 - [...arr].reverse().findIndex((n) => n >= minCount);
    const minX = first(cols), minY = first(rows);
    if (minX < 0 || minY < 0) return ASSEMBLED_BOUNDS;
    return { l: minX / w, t: minY / h, r: (last(cols) + 1) / w, b: (last(rows) + 1) / h };
  }

  function sampleTrack(track, p, mix) {
    if (p <= track[0][0]) return track[0][1];
    for (let i = 1; i < track.length; i++) {
      const [p1, v1] = track[i];
      if (p <= p1) {
        const [p0, v0] = track[i - 1];
        return mix(v0, v1, smooth((p - p0) / (p1 - p0 || 1)));
      }
    }
    return track[track.length - 1][1];
  }

  const mixNumber = (a, b, t) => a + (b - a) * t;
  const mixLayout = (a, b, t) => ({ s: mixNumber(a.s, b.s, t), x: mixNumber(a.x, b.x, t), y: mixNumber(a.y, b.y, t) });

  function panelOpacity([fadeIn, fullIn, fullOut, fadeOut], p) {
    if (p <= fadeIn || p >= fadeOut) return 0;
    if (p < fullIn) return smooth((p - fadeIn) / (fullIn - fadeIn));
    if (p <= fullOut) return 1;
    return 1 - smooth((p - fullOut) / (fadeOut - fullOut));
  }

  function finishLoading() {
    if (!root.classList.contains('is-loading')) return;
    root.classList.remove('is-loading');
    const id = decodeURIComponent(location.hash.slice(1));
    const target = id && document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: 'instant' });
  }

  function initStory() {
    const section = $('#home');
    const canvas = $('#story-canvas');
    const percent = $('#loader-percent');
    const story = config.story || {};
    const count = Number(story.frames) || 0;
    const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;

    if (!section || !ctx || !count || !story.path) {
      root.classList.add('no-story');
      finishLoading();
      return;
    }

    const narrowQuery = window.matchMedia('(max-width: 760px)');
    const size = window.innerWidth <= 760 ? 'sm' : 'lg';
    const frames = new Array(count);
    const panels = $$('[data-panel]', section).map((el) => ({
      el,
      range: STORY_PANELS[el.dataset.panel] || [0, 0, 0, 0],
      links: el.matches('a') ? [el] : $$('a, button', el),
      active: null,
    }));

    const heroPanel = $('[data-panel="hero"]', section);
    const ctaPanel = $('[data-panel="cta"]', section);

    let settled = 0;
    let ready = false;
    let current = 0;
    let rafId = 0;
    let view = { w: 0, h: 0, dpr: 1, narrow: false };
    let assembled = ASSEMBLED_BOUNDS;
    let exploded = { l: 0, t: 0, r: 1, b: 1 };
    let track = [[0, { s: 1, x: 0, y: 0 }]];

    const fallbackTimer = window.setTimeout(start, 15000);

    function onSettled() {
      settled += 1;
      if (percent) percent.textContent = String(Math.round((settled / count) * 100));
      if (settled === count) start();
    }

    for (let i = 0; i < count; i++) {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        const decoded = img.decode ? img.decode() : Promise.resolve();
        decoded.catch(() => {}).then(() => {
          frames[i] = img;
          onSettled();
        });
      };
      img.onerror = onSettled;
      img.src = `${story.path}/${size}/${story.prefix || 'frame'}_${String(i).padStart(3, '0')}.webp`;
    }

    function readProgress() {
      const total = section.offsetHeight - window.innerHeight;
      if (total <= 0) return 0;
      return clamp(-section.getBoundingClientRect().top / total, 0, 1);
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      view = { w, h, dpr, narrow: narrowQuery.matches };
      buildTrack();
    }

    function fitContent(bounds, box, align = 0.5) {
      const img = nearestFrame(0);
      const { w, h } = view;
      if (!img || !w || !h) return { s: 1, x: 0, y: 0 };
      const aspect = img.naturalWidth / img.naturalHeight;
      const baseHeight = Math.min(w / img.naturalWidth, h / img.naturalHeight) * img.naturalHeight;
      const relW = bounds.r - bounds.l;
      const relH = bounds.b - bounds.t;
      const frameH = Math.min((box.b - box.t) / relH, (box.r - box.l) / (relW * aspect));
      const frameW = frameH * aspect;
      const frameLeft = (box.l + box.r) / 2 - (bounds.l + relW / 2) * frameW;
      const frameTop = box.t + (box.b - box.t - relH * frameH) * align - bounds.t * frameH;
      return {
        s: frameH / baseHeight,
        x: (frameLeft + frameW / 2 - w / 2) / w,
        y: (frameTop + frameH / 2 - h / 2) / h,
      };
    }

    function restingLayout(panel, bottomSpace) {
      const { w, h, narrow } = view;
      const top = panel ? panel.offsetTop + panel.offsetHeight + (narrow ? 20 : 28) : h * 0.3;
      const room = Math.max(h - bottomSpace - top, h * 0.28);
      const maxWidth = w * (narrow ? 0.92 : 0.5);
      return fitContent(assembled, { l: (w - maxWidth) / 2, r: (w + maxWidth) / 2, t: top, b: top + room });
    }

    function buildTrack() {
      const { w, h, narrow } = view;
      const headerHeight = $('.site-header')?.offsetHeight || 64;
      const hero = restingLayout(heroPanel, narrow ? 64 : 76);
      const cta = restingLayout(ctaPanel, narrow ? 28 : 40);
      let chapters;
      if (narrow) {
        const textTops = $$('.story-side', section).map((panel) => {
          const copy = $('.story-copy', panel);
          return copy ? panel.offsetTop + copy.offsetTop : h * 0.6;
        });
        const textTop = Math.min(h * 0.75, ...textTops);
        const above = fitContent(exploded, { l: 12, r: w - 12, t: headerHeight + 16, b: Math.max(headerHeight + 160, textTop - 24) }, 0.7);
        chapters = [[0.3, above], [0.68, above]];
      } else {
        const margin = Math.max(20, (w - 1120) / 2);
        const top = headerHeight + 40;
        const bottom = h - 40;
        const right = fitContent(exploded, { l: w * 0.42, r: Math.min(w - 16, w - margin + 40), t: top, b: bottom });
        const left = fitContent(exploded, { l: Math.max(16, margin - 40), r: w * 0.58, t: top, b: bottom });
        chapters = [[0.3, right], [0.52, left], [0.68, left]];
      }
      track = [[0, hero], [0.1, hero], ...chapters, [0.9, cta], [1, cta]];
    }

    function nearestFrame(index) {
      if (frames[index]) return frames[index];
      for (let d = 1; d < count; d++) {
        if (frames[index - d]) return frames[index - d];
        if (frames[index + d]) return frames[index + d];
      }
      return null;
    }

    function drawFrame(position, layout) {
      const i0 = Math.floor(position);
      const fraction = position - i0;
      const a = nearestFrame(i0);
      const b = fraction > 0.001 ? nearestFrame(Math.min(count - 1, i0 + 1)) : null;
      if (!a) return;

      const { w, h, dpr } = view;
      const fit = Math.min(w / a.naturalWidth, h / a.naturalHeight) * layout.s;
      const dw = a.naturalWidth * fit;
      const dh = a.naturalHeight * fit;
      const dx = (w - dw) / 2 + layout.x * w;
      const dy = (h - dh) / 2 + layout.y * h;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.imageSmoothingQuality = 'high';
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = b && b !== a ? 1 - fraction : 1;
      ctx.drawImage(a, dx, dy, dw, dh);
      if (b && b !== a) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = fraction;
        ctx.drawImage(b, dx, dy, dw, dh);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      canvas.dataset.frame = String(Math.round(position));
    }

    function updatePanel(panel, p) {
      const opacity = panelOpacity(panel.range, p);
      const shift = (1 - opacity) * (p < panel.range[1] ? 28 : -28);
      panel.el.style.opacity = opacity.toFixed(3);
      panel.el.style.transform = opacity === 1 ? '' : `translate3d(0, ${shift.toFixed(1)}px, 0)`;
      const active = opacity > 0.5;
      if (panel.active === active) return;
      panel.active = active;
      panel.el.classList.toggle('is-active', active);
      panel.links.forEach((link) => (active ? link.removeAttribute('tabindex') : link.setAttribute('tabindex', '-1')));
    }

    function render() {
      const explode = sampleTrack(STORY_EXPLODE, current, mixNumber);
      const layout = sampleTrack(track, current, mixLayout);
      drawFrame(explode * (count - 1), layout);
      panels.forEach((panel) => updatePanel(panel, current));
    }

    function tick() {
      rafId = 0;
      const target = readProgress();
      const diff = target - current;
      current = reducedMotion || Math.abs(diff) < 0.0005 ? target : current + diff * 0.14;
      render();
      if (current !== target) schedule();
    }

    function schedule() {
      if (ready && !rafId) rafId = window.requestAnimationFrame(tick);
    }

    function start() {
      if (ready) return;
      ready = true;
      window.clearTimeout(fallbackTimer);
      if (!frames.some(Boolean)) {
        root.classList.add('no-story');
        finishLoading();
        return;
      }
      assembled = alphaBounds(nearestFrame(0));
      exploded = alphaBounds(nearestFrame(count - 1));
      resize();
      current = readProgress();
      render();
      finishLoading();
      current = readProgress();
      render();
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          buildTrack();
          render();
        });
      }
    }

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', () => {
      if (!ready) return;
      resize();
      render();
      schedule();
    });
  }

  const revealObserver =
    'IntersectionObserver' in window && !reducedMotion
      ? new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            });
          },
          { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        )
      : null;

  function reveal(elements) {
    elements.forEach((el) => {
      if (revealObserver) revealObserver.observe(el);
      else el.classList.add('is-visible');
    });
  }

  function initReveal() {
    if (revealObserver) root.classList.add('reveal-ready');
    reveal($$('[data-reveal]'));
  }

  const GITHUB_CACHE_TTL = 15 * 60 * 1000;

  const LANGUAGE_COLORS = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    HTML: '#e34c26',
    CSS: '#663399',
    SCSS: '#c6538c',
    PHP: '#4f5d95',
    Blade: '#f7523f',
    Python: '#3572a5',
    Java: '#b07219',
    'C#': '#178600',
    'C++': '#f34b7d',
    C: '#555555',
    Vue: '#41b883',
    Svelte: '#ff3e00',
    Dart: '#00b4ab',
    Kotlin: '#a97bff',
    Swift: '#f05138',
    Go: '#00add8',
    Rust: '#dea584',
    Ruby: '#701516',
    Shell: '#89e051',
    'Jupyter Notebook': '#da5b0b',
  };

  function timeAgo(dateString) {
    const seconds = (new Date(dateString).getTime() - Date.now()) / 1000;
    const units = [
      ['year', 31536000],
      ['month', 2592000],
      ['week', 604800],
      ['day', 86400],
      ['hour', 3600],
      ['minute', 60],
    ];
    const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    for (const [unit, size] of units) {
      if (Math.abs(seconds) >= size) return formatter.format(Math.round(seconds / size), unit);
    }
    return 'just now';
  }

  async function fetchRepos(username) {
    const cache = getStorage('sessionStorage');
    const cacheKey = `github-repos:${username.toLowerCase()}`;

    try {
      const cached = JSON.parse(cache?.getItem(cacheKey) || 'null');
      if (cached && Date.now() - cached.savedAt < GITHUB_CACHE_TTL) return cached.repos;
    } catch (error) {
      cache?.removeItem(cacheKey);
    }

    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=pushed&per_page=100`,
      { headers: { Accept: 'application/vnd.github+json' } }
    );

    if (!response.ok) {
      const error = new Error(`GitHub API responded with ${response.status}`);
      error.status = response.status;
      error.rateLimited =
        response.status === 429 || (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0');
      throw error;
    }

    const repos = (await response.json()).map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      pushedAt: repo.pushed_at,
      homepage: repo.homepage,
      topics: repo.topics || [],
      fork: repo.fork,
      archived: repo.archived,
    }));

    try {
      cache?.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), repos }));
    } catch (error) {
      cache?.removeItem(cacheKey);
    }
    return repos;
  }

  function repoCard(repo, index) {
    const language = repo.language
      ? `<span><i class="lang-dot" style="--lang-color: ${LANGUAGE_COLORS[repo.language] || 'var(--text-subtle)'}"></i>${escapeHTML(repo.language)}</span>`
      : '';
    const homepage = /^https?:\/\//i.test(repo.homepage || '')
      ? `<a class="repo-homepage" href="${escapeHTML(repo.homepage)}" target="_blank" rel="noopener noreferrer">Live site<span class="visually-hidden"> for ${escapeHTML(repo.name)}</span></a>`
      : '';
    const topics = repo.topics.length
      ? `<ul class="tag-list" aria-label="Topics">${repo.topics.slice(0, 3).map((topic) => `<li class="tag">${escapeHTML(topic)}</li>`).join('')}</ul>`
      : '';

    return `
      <article class="repo-card" data-reveal style="--delay: ${(index % 3) * 90}ms">
        <div class="repo-head">
          ${ICONS.book}
          <a class="repo-name" href="${escapeHTML(repo.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(repo.name)}</a>
        </div>
        <p class="repo-desc">${escapeHTML(repo.description || 'No description provided.')}</p>
        ${topics}
        <div class="repo-meta">
          ${language}
          <span title="Stars">${ICONS.star}<span class="visually-hidden">Stars:</span>${repo.stars}</span>
          <span title="Forks">${ICONS.fork}<span class="visually-hidden">Forks:</span>${repo.forks}</span>
          <span>${ICONS.clock}Updated ${timeAgo(repo.pushedAt)}</span>
          ${homepage}
        </div>
      </article>`;
  }

  function initGitHub() {
    const grid = $('#repo-grid');
    const status = $('#repo-status');
    const profileLink = $('#github-profile-link');
    const { username = '', maxRepos = 6, excludeForks = true, exclude = [], descriptions = {} } = config.github || {};
    const excluded = new Set(exclude.map((name) => name.toLowerCase()));
    if (!grid) return;

    const showMessage = (html) => {
      grid.innerHTML = `<div class="repo-message">${html}</div>`;
    };

    if (!username.trim()) {
      status.textContent = 'My latest public repositories, loaded live from the GitHub API.';
      showMessage(
        '<strong>Connect your GitHub</strong>Add your username to <code>github.username</code> in <code>js/config.js</code> to show your latest repositories here.'
      );
      return;
    }

    const profileUrl = `https://github.com/${encodeURIComponent(username.trim())}`;
    profileLink.href = profileUrl;
    profileLink.hidden = false;

    async function load() {
      grid.setAttribute('aria-busy', 'true');
      grid.innerHTML = Array.from({ length: Math.min(maxRepos, 6) }, () => '<div class="repo-skeleton" aria-hidden="true"></div>').join('');
      status.textContent = 'Loading repositories from GitHub…';

      try {
        const repos = await fetchRepos(username.trim());
        const visible = repos
          .filter((repo) => !(excludeForks && repo.fork) && !repo.archived && !excluded.has(repo.name.toLowerCase()))
          .sort((a, b) => new Date(b.pushedAt) - new Date(a.pushedAt));
        const shown = visible
          .slice(0, maxRepos)
          .map((repo) => ({ ...repo, description: repo.description || descriptions[repo.name] || '' }));

        if (!shown.length) {
          status.textContent = 'My latest public repositories, loaded live from the GitHub API.';
          showMessage(`<strong>No public repositories yet</strong>New projects will show up here automatically once they're on <a href="${profileUrl}" target="_blank" rel="noopener noreferrer">GitHub</a>.`);
          return;
        }

        grid.innerHTML = shown.map(repoCard).join('');
        reveal($$('.repo-card', grid));
        status.textContent = `My ${shown.length} most recently updated repositories, out of ${visible.length} public ${visible.length === 1 ? 'repo' : 'repos'}. Loaded live from the GitHub API.`;
      } catch (error) {
        let reason = "Couldn't reach GitHub right now. Check your connection and try again.";
        if (error.status === 404) reason = `The GitHub user "${escapeHTML(username)}" doesn't exist. Check <code>github.username</code> in <code>js/config.js</code>.`;
        else if (error.rateLimited) reason = "GitHub's API rate limit has been reached for now. Please try again in a few minutes.";

        status.textContent = 'My latest public repositories, loaded live from the GitHub API.';
        showMessage(
          `<strong>Repositories couldn't be loaded</strong>${reason}<br>` +
            `<button class="btn btn-ghost" type="button" data-retry>${ICONS.refresh} Try again</button>`
        );
        $('[data-retry]', grid).addEventListener('click', load);
      } finally {
        grid.setAttribute('aria-busy', 'false');
      }
    }

    if ('IntersectionObserver' in window) {
      const lazyObserver = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          lazyObserver.disconnect();
          load();
        },
        { rootMargin: '600px 0px' }
      );
      lazyObserver.observe(grid);
    } else {
      load();
    }
  }

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const VALIDATORS = {
    name: (value) => value.trim().length >= 2 || 'Please enter your name (at least 2 characters).',
    email: (value) => {
      if (!value.trim()) return 'Please enter your email address.';
      return EMAIL_PATTERN.test(value.trim()) || 'Please enter a valid email address, like name@example.com.';
    },
    message: (value) => value.trim().length >= 10 || 'Please write a message of at least 10 characters.',
  };

  let toastTimer;

  function showToast(title, message, duration = 5000) {
    const toast = $('#toast');
    $('#toast-title').textContent = title;
    $('#toast-message').textContent = message;
    toast.style.setProperty('--toast-duration', `${duration}ms`);

    toast.classList.remove('is-visible');
    void toast.offsetWidth;
    toast.classList.add('is-visible');
    toast.setAttribute('aria-hidden', 'false');

    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(hideToast, duration);
  }

  function hideToast() {
    const toast = $('#toast');
    toast.classList.remove('is-visible');
    toast.setAttribute('aria-hidden', 'true');
    window.clearTimeout(toastTimer);
  }

  function initContactForm() {
    const form = $('#contact-form');
    if (!form) return;

    const fields = ['name', 'email', 'message'].map((name) => form.elements[name]);
    const submitButton = $('button[type="submit"]', form);
    const message = form.elements.message;
    const counter = $('#message-count');
    const maxLength = Number(message.getAttribute('maxlength')) || 1000;

    function setFieldState(field, error) {
      const wrapper = field.closest('.form-field');
      wrapper.classList.toggle('has-error', Boolean(error));
      wrapper.classList.toggle('is-valid', !error && field.value.trim() !== '');
      field.setAttribute('aria-invalid', String(Boolean(error)));
      $(`#${field.name}-error`).textContent = error || '';
    }

    function validateField(field) {
      const result = VALIDATORS[field.name](field.value);
      const error = result === true ? '' : result;
      setFieldState(field, error);
      return !error;
    }

    function updateCounter() {
      const length = message.value.length;
      counter.textContent = `${length} / ${maxLength}`;
      counter.classList.toggle('is-near-limit', length > maxLength * 0.9);
    }

    fields.forEach((field) => {
      field.addEventListener('blur', () => {
        if (field.value.trim()) validateField(field);
      });
      field.addEventListener('input', () => {
        if (field.getAttribute('aria-invalid') === 'true' || field.closest('.form-field').classList.contains('is-valid')) {
          validateField(field);
        }
      });
    });
    message.addEventListener('input', updateCounter);

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (submitButton.classList.contains('is-loading')) return;

      const results = fields.map(validateField);
      const firstInvalid = fields[results.indexOf(false)];
      if (firstInvalid) {
        firstInvalid.focus();
        announce('Please fix the highlighted fields and try again.');
        return;
      }

      const label = $('.btn-label', submitButton);
      submitButton.classList.add('is-loading');
      submitButton.setAttribute('aria-disabled', 'true');
      label.textContent = 'Sending…';

      await wait(900);

      const firstName = form.elements.name.value.trim().split(/\s+/)[0];
      submitButton.classList.remove('is-loading');
      submitButton.removeAttribute('aria-disabled');
      label.textContent = 'Send message';

      form.reset();
      fields.forEach((field) => setFieldState(field, ''));
      fields.forEach((field) => field.removeAttribute('aria-invalid'));
      updateCounter();

      const successMessage = `Thanks, ${firstName}! Your message has been received. I'll get back to you soon.`;
      showToast('Message sent!', successMessage);
      announce(`Message sent. ${successMessage}`);
    });

    $('.toast-close').addEventListener('click', hideToast);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && $('#toast').classList.contains('is-visible')) hideToast();
    });
  }

  function initLightbox() {
    const dialog = $('#lightbox');
    if (!dialog || typeof dialog.showModal !== 'function') return;

    const image = $('#lightbox-img');
    const caption = $('#lightbox-caption');
    const counter = $('#lightbox-counter');
    const prevButton = $('.lightbox-prev', dialog);
    const nextButton = $('.lightbox-next', dialog);
    let photos = [];
    let current = 0;
    let opener = null;

    function show(index) {
      current = (index + photos.length) % photos.length;
      const photo = photos[current];
      image.src = photo.full || photo.src;
      image.alt = photo.alt || '';
      caption.textContent = photo.alt || '';
      counter.textContent = photos.length > 1 ? `${current + 1} / ${photos.length}` : '';
      prevButton.hidden = nextButton.hidden = photos.length < 2;
    }

    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-gallery]');
      if (!trigger) return;
      const item = (config.achievements || [])[Number(trigger.dataset.gallery)];
      if (!item || !(item.photos || []).length) return;

      photos = item.photos;
      opener = trigger;
      show(0);
      dialog.showModal();
    });

    prevButton.addEventListener('click', () => show(current - 1));
    nextButton.addEventListener('click', () => show(current + 1));
    $('.lightbox-close', dialog).addEventListener('click', () => dialog.close());

    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });

    dialog.addEventListener('keydown', (event) => {
      if (photos.length < 2) return;
      if (event.key === 'ArrowLeft') show(current - 1);
      if (event.key === 'ArrowRight') show(current + 1);
    });

    dialog.addEventListener('close', () => {
      opener?.focus();
    });
  }

  renderContent();
  initTheme();
  initNavigation();
  initStory();
  initReveal();
  initGitHub();
  initContactForm();
  initLightbox();
})();
