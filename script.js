document.addEventListener('DOMContentLoaded', () => {

  // ── Config loader ──
  fetch('/api/config')
    .then(r => r.json())
    .then(cfg => {
      const caEl = document.getElementById('ca-value');
      const buyEl = document.getElementById('buy-link');
      const commEl = document.getElementById('community-link');

      if (cfg.ca) {
        caEl.textContent = cfg.ca;
        caEl.dataset.full = cfg.ca;
      } else {
        caEl.textContent = 'CA NOT SET';
      }
      if (cfg.buy) buyEl.href = cfg.buy;
      if (cfg.community) commEl.href = cfg.community;
    })
    .catch(() => {
      document.getElementById('ca-value').textContent = 'CONNECT FAILED';
    });

  // ── Copy CA ──
  document.getElementById('ca-display').addEventListener('click', () => {
    const full = document.getElementById('ca-value').dataset.full;
    if (!full) return;
    navigator.clipboard.writeText(full).then(() => {
      const toast = document.getElementById('toast');
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 1500);
    });
  });

  // ── Background SEC table ──
  const bgTable = document.getElementById('bg-table');
  const rows = [
    'NVDA    JENSEN H.      CEO        SALE       1,700,000    $303,332,000    2025-03-20',
    'AAPL    TIMOTHY C.     COO        SALE         600,000    $138,000,000    2025-03-19',
    'TSLA    ELON M.        CEO        SALE       4,400,000  $1,100,000,000    2025-03-18',
    'META    MARK Z.        Chairman   SALE       1,200,000    $485,000,000    2025-03-17',
    'AMZN    ANDREW J.      CEO        SALE         850,000    $142,000,000    2025-03-17',
    'MSFT    SATYA N.       CEO        SALE         320,000    $134,000,000    2025-03-16',
    'GOOGL   SUNDAR P.      CEO        SALE          22,500     $39,150,000    2025-03-15',
    'ORCL    LARRY E.       CTO        SALE       1,800,000    $252,000,000    2025-03-15',
    'CRM     MARC B.        CEO        SALE          15,000      $4,430,000    2025-03-14',
    'JPM     JAMIE D.       CEO        SALE         133,639     $31,520,000    2025-03-14',
    'AMD     LISA S.        CEO        SALE         200,000     $30,400,000    2025-03-13',
    'COIN    BRIAN A.       CEO        P.SALE     2,000,000     $90,000,000    2025-03-13',
    'NFLX    REED H.        Chairman   SALE          50,000     $31,000,000    2025-03-12',
    'INTC    PAT G.         CEO        SALE         500,000     $15,500,000    2025-03-12',
    'SQ      JACK D.        Chairman   SALE       1,000,000     $72,000,000    2025-03-11',
    'SHOP    TOBIAS L.      CEO        SALE         100,000     $10,800,000    2025-03-11',
  ];
  const header = 'TICKER  INSIDER        ROLE       TYPE       SHARES        VALUE           DATE';
  const sep = '─'.repeat(90);
  let tableText = '';
  for (let i = 0; i < 8; i++) {
    tableText += header + '\n' + sep + '\n';
    rows.forEach(r => tableText += r + '\n');
    tableText += '\n';
  }
  bgTable.textContent = tableText;

  // ── Marquee duplication ──
  const alertTrack = document.getElementById('alert-track');
  const alertContent = alertTrack.innerHTML;
  alertTrack.innerHTML = alertContent + alertContent;

  // ── Data rain (canvas) ──
  const canvas = document.getElementById('data-rain');
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const tickers = ['NVDA','TSLA','AAPL','META','AMZN','SELL','$$$','BTC','SOL','ETH','MSFT','DUMP','0BUY','INU','LEAK','SEC','13-F','EXIT'];
  const colWidth = Math.max(Math.floor(W / 10), 80);
  const numCols = Math.min(12, Math.floor(W / colWidth));
  const columns = [];

  for (let i = 0; i < numCols; i++) {
    columns.push({
      x: Math.floor((W / numCols) * i + colWidth * 0.3),
      y: Math.random() * H,
      speed: 0.3 + Math.random() * 0.7,
      opacity: 0.04 + Math.random() * 0.03,
    });
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function drawRain() {
    if (prefersReduced) return;
    ctx.clearRect(0, 0, W, H);

    columns.forEach(col => {
      const ticker = tickers[Math.floor(Math.random() * tickers.length)];
      ctx.font = '11px "Martian Mono", monospace';
      ctx.fillStyle = `rgba(255,191,0,${col.opacity})`;
      ctx.fillText(ticker, col.x, col.y);

      col.y += col.speed;
      if (col.y > H) {
        col.y = -20;
        col.x = Math.floor((W / numCols) * columns.indexOf(col) + Math.random() * 30);
      }
    });

    requestAnimationFrame(drawRain);
  }
  requestAnimationFrame(drawRain);

  // ── Scroll fade-in (IntersectionObserver) ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 200);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.narrative-block, .diamond, .proof-card').forEach(el => observer.observe(el));

  // ── Terminal typing effect ──
  const termObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const lines = entry.target.querySelectorAll('.terminal-line');
        lines.forEach(line => {
          const delay = parseInt(line.dataset.delay) || 0;
          setTimeout(() => line.classList.add('visible'), delay);
        });
        termObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const termBox = document.querySelector('.terminal-body');
  if (termBox) termObserver.observe(termBox);

});
