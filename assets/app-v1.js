(function () {
  const contentContainer = document.getElementById('content-frame-main-container');
  const navLinks = Array.from(document.querySelectorAll('.nav-toggle'));
  const bottomLinks = Array.from(document.querySelectorAll('.nav-toggle-bottom'));
  const themeButtons = Array.from(document.querySelectorAll('.header--theme-button'));

  // Simple map from route -> page file (v1 routes - reduced)
  const routes = {
    '#tab-1': 'pages/dashboard-v1.html',
    '#monitoring': 'pages/monitoring.html',
    '#account': 'pages/account.html',
    '#settings': 'pages/settings.html'
  };

  async function loadRoute(hash) {
    const route = routes[hash] || routes['#tab-1'];
    try {
      const res = await fetch(route, { cache: 'no-cache' });
      const html = await res.text();
      contentContainer.innerHTML = html;
      setActive(hash);
    } catch (e) {
      contentContainer.innerHTML = `<div style="padding:20px">Failed to load ${route}</div>`;
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  function setActive(hash) {
    navLinks.forEach(a => a.classList.toggle('nav-toggle-active', a.getAttribute('href') === hash));
  }

  function handleNavClick(e) {
    const a = e.currentTarget;
    const href = a.getAttribute('href');
    if (!href) return;
    e.preventDefault();
    if (location.hash !== href) location.hash = href; else loadRoute(href);
  }

  // Theme handling
  function setThemeFromButton(btn) {
    themeButtons.forEach(b => b.classList.toggle('active', b === btn));
    const theme = btn.getAttribute('data-theme') || 'dark';
    document.body.setAttribute('data-theme', theme);
  }

  function initTheme() {
    const saved = localStorage.getItem('hm-theme');
    if (saved) {
      const btn = themeButtons.find(b => b.getAttribute('data-theme') === saved);
      if (btn) setThemeFromButton(btn);
      document.body.setAttribute('data-theme', saved);
    } else {
      document.body.setAttribute('data-theme', 'dark');
    }
  }

  function handleThemeClick(e) {
    const btn = e.currentTarget;
    setThemeFromButton(btn);
    localStorage.setItem('hm-theme', btn.getAttribute('data-theme') || 'dark');
  }

  // Bind events
  navLinks.forEach(a => a.addEventListener('click', handleNavClick));
  bottomLinks.forEach(a => a.addEventListener('click', handleNavClick));
  themeButtons.forEach(b => b.addEventListener('click', handleThemeClick));

  // Hash routing
  window.addEventListener('hashchange', () => loadRoute(location.hash));

  // Monitoring tab switching
  function initMonitoringTabs() {
    const tabs = document.querySelectorAll('.monitoring-tab');
    const panels = document.querySelectorAll('#content-frame-main-container .heroic-tab-panel');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const panel = document.getElementById(target);
        if (panel) panel.classList.add('active');
      });
    });
  }

  function handleMonitoringLoad() {
    const hasTabs = document.querySelectorAll('.monitoring-tab').length > 0;
    if (hasTabs) initMonitoringTabs();
  }

  // Override loadRoute to handle monitoring tabs
  const originalLoadRoute = loadRoute;
  loadRoute = async function(hash) {
    await originalLoadRoute(hash);
    handleMonitoringLoad();
  };

  // Initial load
  initTheme();
  loadRoute(location.hash || '#tab-1');
})();

