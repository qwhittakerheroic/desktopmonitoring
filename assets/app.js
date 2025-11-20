(function () {
  const contentContainer = document.getElementById('content-frame-main-container');
  const navLinks = Array.from(document.querySelectorAll('.nav-toggle'));
  const bottomLinks = Array.from(document.querySelectorAll('.nav-toggle-bottom'));
  const themeButtons = Array.from(document.querySelectorAll('.header--theme-button'));

  // Simple map from route -> page file
  const routes = {
    '#tab-1': 'pages/dashboard.html',
    '#tab-2': 'pages/virus-scan.html',
    '#vpn': 'pages/vpn.html',
    '#monitoring': 'pages/monitoring.html',
    '#toolbox': 'pages/toolbox.html',
    '#tab-3': 'pages/backup.html',
    '#tab-4': 'pages/logs.html',
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

  // Virus scan tab switching
  function initVirusScanTabs() {
    const virusTabs = document.querySelectorAll('.heroic-tab-wrapper .nav-link');
    const tabPanels = document.querySelectorAll('.heroic-tab-panel');
    
    virusTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        
        // Remove active class from all tabs and panels
        virusTabs.forEach(t => t.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding panel
        tab.classList.add('active');
        const targetPanel = document.getElementById(targetTab);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }

  // Initialize virus scan tabs when virus scan page loads
  function handleVirusScanLoad() {
    const hasVirusTabs = document.querySelectorAll('.heroic-tab-wrapper .nav-link').length > 0;
    if (hasVirusTabs) initVirusScanTabs();
  }

  // VPN tab switching
  function initVpnTabs() {
    const vpnTabs = document.querySelectorAll('.vpn-tab');
    const vpnTabPanels = document.querySelectorAll('.vpn-tab-panel');
    
    vpnTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        
        // Remove active class from all tabs and panels
        vpnTabs.forEach(t => t.classList.remove('active'));
        vpnTabPanels.forEach(p => p.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding panel
        tab.classList.add('active');
        const targetPanel = document.getElementById(targetTab);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }

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

  // Initialize VPN tabs when VPN page loads
  function handleVpnLoad() {
    if (contentContainer.innerHTML.includes('vpn-tabs')) {
      initVpnTabs();
    }
  }

  // Override loadRoute to handle virus scan and VPN tabs
  const originalLoadRoute = loadRoute;
  loadRoute = async function(hash) {
    await originalLoadRoute(hash);
    handleVirusScanLoad();
    handleVpnLoad();
    handleMonitoringLoad();
  };

  // Initial load
  initTheme();
  loadRoute(location.hash || '#tab-1');
})();


