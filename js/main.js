(function () {
  'use strict';

  const config = window.PORTFOLIO || {};
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Helpers & icons */
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  /* if storage is blocked (e.g. private mode). */
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

  /** reads a message out via the hidden live region. */
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

  // icon paths from Lucide (ISC) and Simple Icons (CC0).
  const ICONS = {
    github: fillIcon(
      'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'
    ),
    linkedin: fillIcon(
      'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
    ),
    email: strokeIcon('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>'),
    website: strokeIcon('<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>'),
    external: strokeIcon('<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>'),
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

  /* Content rendering */
  function renderContent() {
    const name = config.name || 'Your Name';
    const roles = (config.roles || []).filter(Boolean);
    const values = {
      name,
      initials: config.initials || initialsFrom(name),
      role: config.role,
      location: config.location,
      email: config.email,
      availability: config.availability,
      bio: config.bio,
      rolesPrefix: config.rolesPrefix,
      rolesText: roles.join(', '),
      contactBlurb: config.contactBlurb,
    };

    // plain text binds
    $$('[data-bind]').forEach((el) => {
      const value = values[el.dataset.bind];
      if (value) el.textContent = value;
    });

    // page title & description
    document.title = config.role ? `${name} | ${config.role}` : name;
    if (config.bio) {
      $$('meta[name="description"], meta[property="og:description"]').forEach((meta) => meta.setAttribute('content', config.bio));
    }
    $('meta[property="og:title"]')?.setAttribute('content', document.title);

    // availability badge
    const badge = $('[data-availability]');
    if (badge) badge.hidden = !config.availability;

    // email links
    $$('[data-email-link]').forEach((link) => {
      if (config.email) link.href = `mailto:${config.email}`;
      else link.closest('.contact-item')?.setAttribute('hidden', '');
    });

    // profile pic
    const avatar = $('[data-avatar]');
    if (avatar) {
      const fallback = 'assets/images/profile.svg';
      avatar.alt = `Portrait of ${name}`;
      avatar.addEventListener('error', () => {
        if (!avatar.src.endsWith(fallback)) avatar.src = fallback;
      }, { once: true });
      if (config.avatar) avatar.src = config.avatar;
    }

    // optional resume bttn
    const resume = $('[data-resume]');
    if (resume && config.resume) {
      resume.href = config.resume;
      resume.hidden = false;
    }

    // footer year
    $$('[data-year]').forEach((el) => {
      el.textContent = new Date().getFullYear();
    });

    renderSocials();
    renderAbout();
    renderSkills();
    renderProjects();
    renderAchievements();
    renderCredentials();
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
        <article class="skill-group" data-reveal style="--delay: ${index * 110}ms">
          <h3 class="skill-group-title">
            <span class="skill-icon">${ICONS[group.icon] || ICONS.code}</span>
            ${escapeHTML(group.group)}
          </h3>
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
      links.push(`<a class="text-link" href="${escapeHTML(project.repo)}" target="_blank" rel="noopener noreferrer">${ICONS.code} Source code<span class="visually-hidden"> of ${escapeHTML(project.title)} (opens in a new tab)</span></a>`);
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

    // category filter
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
          // restart animation for the cards that stay visible
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

  /* list and hides its whole card when the config has no entries for it. */
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

  /* Theme toggle */
  function initTheme() {
    const toggle = $('.theme-toggle');
    const store = getStorage('localStorage');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
    const themeColor = $('meta[name="theme-color"]');

    function applyTheme(theme, animate = false) {
      if (animate && !reducedMotion) {
        root.classList.add('theme-transition');
        window.setTimeout(() => root.classList.remove('theme-transition'), 400);
      }
      root.setAttribute('data-theme', theme);
      toggle?.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      themeColor?.setAttribute('content', theme === 'dark' ? '#0b0b14' : '#f6f6fb');
    }

    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

    toggle?.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next, true);
      store?.setItem('theme', next);
    });

    // follow OS setting til the visitor picks a theme themselves
    systemDark.addEventListener('change', (event) => {
      if (!store?.getItem('theme')) applyTheme(event.matches ? 'dark' : 'light', true);
    });
  }

  /* nav */
  function initNavigation() {
    const header = $('.site-header');
    const menuToggle = $('.menu-toggle');
    const navLinks = $$('.nav-link');
    const progress = $('.scroll-progress');
    const backToTop = $('.back-to-top');

    /* menu */
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

    /* Scroll effects */
    let ticking = false;

    function onScroll() {
      const scrolled = window.scrollY;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;

      header.classList.toggle('is-scrolled', scrolled > 8);
      backToTop.classList.toggle('is-visible', scrolled > 600);
      progress.style.transform = `scaleX(${scrollable > 0 ? Math.min(scrolled / scrollable, 1) : 0})`;
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

  /* ==========================================================================
   * 5. Hero typing effect
   * ======================================================================== */
  function initTyping() {
    const target = $('[data-typing]');
    const roles = (config.roles || []).filter(Boolean);
    if (!target || !roles.length) return;

    if (reducedMotion || roles.length === 1) {
      target.textContent = roles[0];
      return;
    }

    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      const word = roles[roleIndex];
      charIndex += deleting ? -1 : 1;
      target.textContent = word.slice(0, charIndex);

      let delay = deleting ? 40 : 80;
      if (!deleting && charIndex === word.length) {
        delay = 1800; // pause on the full word
        deleting = true;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 350;
      }
      window.setTimeout(tick, delay);
    }

    window.setTimeout(tick, 900); // start after the intro animation
  }

  /* ==========================================================================
   * 6. Scroll reveal animations
   * ======================================================================== */
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

  /** Fades elements in as they scroll into view (or shows them at once if motion is reduced). */
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

  /* ==========================================================================
   * 7. GitHub repositories
   * ======================================================================== */
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

    // Keep only the fields we render, so the cache stays small
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
      /* storage full: skip caching */
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
        // Fall back to the descriptions in config.js for repos without one on GitHub
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
        else if (error.rateLimited) reason = 'GitHub\'s API rate limit has been reached for now. Please try again in a few minutes.';

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

    // Wait until the section is close to the viewport before calling the API
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

  /* ==========================================================================
   * 8. Contact form
   * ======================================================================== */
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

    // Re-trigger the slide-in and timer bar if a toast is already showing
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
      // Validate when leaving a field, then live while the visitor fixes it
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

      // No backend is required for this challenge, so we simulate a short network request.
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

  /* ==========================================================================
   * 9. Photo lightbox
   * ======================================================================== */
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

    // Clicking the dark backdrop (outside the photo) closes the viewer
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

  /* Boot */
  renderContent();
  initTheme();
  initNavigation();
  initTyping();
  initReveal();
  initGitHub();
  initContactForm();
  initLightbox();
})();
