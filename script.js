// The neon tree artwork is already full of flowers, so we start with 0 extra blossoms.
const STARTER_BLOOMS = 0;

/**
 * ==========================================================================
 * Romantic Birthday Surprise - Interactive Engine (script.js)
 * ==========================================================================
 */

/* ==========================================================================
   1. CONFIGURATION: BIRTHDAY & ROMANTIC PLAYLIST
   ========================================================================== */
const BIRTHDAY_CONFIG = {
  // Target birthday date (ISO format: YYYY-MM-DDTHH:mm:ss)
  targetDate: '2026-10-21T00:00:00',

  // Recipient name
  recipientName: 'My Love',

  // Bypass countdown automatically if desired
  forceShowMain: false,
};

/**
 * Romantic Love Playlist
 * Single-track setup: only the user's existing root-level song.mp3 is played.
 */
const PLAYLIST = [
  {
    id: 1,
    title: 'My Song',
    artist: 'Your MP3',
    subtitle: 'Your chosen song',
    src: 'song.mp3',
    cover: 'assets/images/album_cover_better_together_1792175153679.jpg',
    duration: 260,
    durationText: '4:20',
    isReady: true,
  },
];

/* ==========================================================================
   2. GLOBAL STATE
   ========================================================================== */
const state = {
  countdownInterval: null,
  isBirthdayPassed: false,
  testModeActive: false,

  // Tree Blooming State - Persistent and Cumulative
  blossomCount: 0,
  bloomRounds: 0,
  persistentBlooms: [],

  // Music Player State
  currentTrackIndex: 0,
  isPlaying: false,
  isShuffle: false,
  recentlyPlayed: [],
  audioElement: null,
  currentTrackTime: 0,
  trackDuration: PLAYLIST[0].duration,
  isLiked: false,
  playlistDrawerOpen: false,
};

/* ==========================================================================
   3. INITIALIZATION
   ========================================================================== */
function initApp() {
  initStarfield();
  initCountdown();
  initTree();
  initWishForm();
  initGallery();
  initPlaylistAndAudio();
  initFloatingParticles();
  initLoveStoryFeatures();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

/* ==========================================================================
   4. BACKGROUND STARFIELD CANVAS & MAGICAL SHOOTING STAR ENGINE
   ========================================================================== */
function initStarfield() {
  const canvas = document.getElementById('starfield-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    generateStars();
  });

  const stars = [];
  const numStars = Math.floor((width * height) / 3600);

  function generateStars() {
    stars.length = 0;
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        color: Math.random() > 0.8 ? '#ffb6d9' : '#ffffff',
      });
    }
  }
  generateStars();

  // Active Shooting Stars List
  const shootingStars = [];
  const sparkleParticles = [];

  // Expose Global Shooting Star Trigger
  window.triggerMagicalShootingStar = function () {
    const startX = Math.random() * (width * 0.45);
    const startY = Math.random() * (height * 0.3);
    const angle = Math.PI / 4 + (Math.random() * 0.15 - 0.07); // ~45 deg diagonal
    const speed = Math.random() * 4 + 16;
    const len = Math.random() * 80 + 170;

    shootingStars.push({
      x: startX,
      y: startY,
      len: len,
      speed: speed,
      angle: angle,
      opacity: 1,
      color: Math.random() > 0.5 ? '#ffd166' : '#ff85b3',
    });
  };

  // Ambient occasional shooting star
  function checkAmbientShootingStar() {
    if (Math.random() < 0.003 && shootingStars.length < 2) {
      window.triggerMagicalShootingStar();
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // 1. Render Stars
    for (const star of stars) {
      star.alpha += star.twinkleSpeed;
      if (star.alpha > 1 || star.alpha < 0.2) {
        star.twinkleSpeed = -star.twinkleSpeed;
      }
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.globalAlpha = Math.max(0.1, Math.min(1, star.alpha));
      ctx.shadowBlur = star.radius > 1 ? 6 : 0;
      ctx.shadowColor = star.color;
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // 2. Render Active Shooting Stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const s = shootingStars[i];
      const tailX = s.x - Math.cos(s.angle) * s.len;
      const tailY = s.y - Math.sin(s.angle) * s.len;

      // Glowing trail gradient
      const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
      grad.addColorStop(0, `rgba(255, 255, 255, ${s.opacity})`);
      grad.addColorStop(0.35, `rgba(255, 220, 140, ${s.opacity * 0.9})`);
      grad.addColorStop(0.75, `rgba(255, 105, 180, ${s.opacity * 0.6})`);
      grad.addColorStop(1, 'rgba(255, 105, 180, 0)');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(tailX, tailY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 3.2;
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 18;
      ctx.stroke();

      // Bright Star Head
      ctx.beginPath();
      ctx.arc(s.x, s.y, 3.8, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 25;
      ctx.shadowColor = '#ffffff';
      ctx.fill();
      ctx.restore();

      // Emit trailing sparkle stardust
      if (Math.random() < 0.7) {
        sparkleParticles.push({
          x: s.x - Math.cos(s.angle) * (Math.random() * s.len * 0.6),
          y: s.y - Math.sin(s.angle) * (Math.random() * s.len * 0.6),
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          radius: Math.random() * 1.8 + 0.8,
          alpha: s.opacity,
          color: Math.random() > 0.5 ? '#fff3a3' : '#ff9ec4',
        });
      }

      // Move star
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.opacity -= 0.012;

      if (s.opacity <= 0 || s.x > width + 100 || s.y > height + 100) {
        shootingStars.splice(i, 1);
      }
    }

    // 3. Render Trailing Sparkle Particles
    for (let p = sparkleParticles.length - 1; p >= 0; p--) {
      const part = sparkleParticles[p];
      part.x += part.vx;
      part.y += part.vy;
      part.alpha -= 0.025;

      ctx.save();
      ctx.beginPath();
      ctx.arc(part.x, part.y, part.radius, 0, Math.PI * 2);
      ctx.fillStyle = part.color;
      ctx.globalAlpha = Math.max(0, part.alpha);
      ctx.shadowBlur = 4;
      ctx.shadowColor = part.color;
      ctx.fill();
      ctx.restore();

      if (part.alpha <= 0) {
        sparkleParticles.splice(p, 1);
      }
    }

    checkAmbientShootingStar();
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

/* ==========================================================================
   5. COUNTDOWN TIMER & NAVIGATION
   ========================================================================== */
function initCountdown() {
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const testModeBtn = document.getElementById('btn-test-mode');
  const beginBtn = document.getElementById('btn-begin-surprise');

  function update() {
    const target = new Date(BIRTHDAY_CONFIG.targetDate).getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0 || BIRTHDAY_CONFIG.forceShowMain) {
      state.isBirthdayPassed = true;
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(d).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(m).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(s).padStart(2, '0');
  }

  update();
  state.countdownInterval = setInterval(update, 1000);

  if (testModeBtn) {
    testModeBtn.addEventListener('click', () => {
      state.testModeActive = true;
      showMainScreen();
    });
  }

  if (beginBtn) {
    beginBtn.addEventListener('click', () => {
      showMainScreen();
    });
  }

  if (state.isBirthdayPassed || BIRTHDAY_CONFIG.forceShowMain) {
    showMainScreen();
  }
}

function showMainScreen() {
  const countdownScreen = document.getElementById('countdown-screen');
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  function ensureTreeReady() {
    if (typeof getActualBlossomCountInDOM === 'function' && getActualBlossomCountInDOM() < STARTER_BLOOMS) {
      initStarterBlooms();
    }
  }

  if (countdownScreen) {
    countdownScreen.style.opacity = '0';
    countdownScreen.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      countdownScreen.classList.add('hidden');
      mainContent.classList.remove('hidden');
      mainContent.classList.add('fade-in');
      ensureTreeReady();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 550);
  } else {
    mainContent.classList.remove('hidden');
    ensureTreeReady();
  }

  // Automatically start romantic music when entering surprise!
  setTimeout(() => {
    if (state.audioElement && !state.isPlaying) {
      playTrack();
    }
  }, 300);
}

/* ==========================================================================
   6. MAGICAL FLOWERING TREE: PERMANENT BLOOM ENGINE
   Flowers and attached hearts STAY visible on the branches forever!
   ========================================================================== */

/**
 * Registry of 180+ exact coordinates along the natural organic SVG tree branches and twig tips.
 * Symmetrically and organically distributed across the entire canopy.
 */
const BRANCH_ANCHORS = [
  { x: 258, y: 183, s: 0.59, a: -9, type: 'pink' },
  { x: 636, y: 259, s: 0.66, a: -15, heart: true, type: 'pink' },
  { x: 603, y: 445, s: 0.56, a: -26, heart: true, type: 'pink' },
  { x: 151, y: 450, s: 0.55, a: -19, type: 'pink' },
  { x: 610, y: 342, s: 0.54, a: 33, type: 'white' },
  { x: 142, y: 390, s: 0.59, a: -3, type: 'pink' },
  { x: 576, y: 259, s: 0.55, a: -37, type: 'white' },
  { x: 618, y: 516, s: 0.56, a: 33, type: 'white' },
  { x: 306, y: 521, s: 0.59, a: -38, heart: true, type: 'pink' },
  { x: 494, y: 295, s: 0.63, a: 25, type: 'pink' },
  { x: 122, y: 395, s: 0.7, a: -9, type: 'pink' },
  { x: 423, y: 196, s: 0.56, a: 3, type: 'pink' },
  { x: 684, y: 323, s: 0.68, a: 11, heart: true, type: 'pink' },
  { x: 559, y: 486, s: 0.53, a: -2, heart: true, type: 'white' },
  { x: 339, y: 333, s: 0.68, a: 10, type: 'white' },
  { x: 262, y: 280, s: 0.49, a: -12, heart: true, type: 'white' },
  { x: 161, y: 417, s: 0.71, a: -11, heart: true, type: 'pink' },
  { x: 468, y: 417, s: 0.62, a: -1, type: 'pink' },
  { x: 367, y: 426, s: 0.56, a: 24, type: 'pink' },
  { x: 554, y: 286, s: 0.46, a: -34, type: 'pink' },
  { x: 469, y: 266, s: 0.46, a: 26, type: 'pink' },
  { x: 752, y: 353, s: 0.45, a: -4, type: 'pink' },
  { x: 503, y: 165, s: 0.71, a: -27, type: 'pink' },
  { x: 462, y: 214, s: 0.59, a: -36, type: 'pink' },
  { x: 111, y: 399, s: 0.63, a: -21, type: 'pink' },
  { x: 575, y: 324, s: 0.54, a: 38, type: 'pink' },
  { x: 286, y: 213, s: 0.55, a: -14, type: 'pink' },
  { x: 169, y: 329, s: 0.45, a: -12, type: 'pink' },
  { x: 313, y: 207, s: 0.6, a: -33, type: 'pink' },
  { x: 465, y: 110, s: 0.47, a: 29, type: 'pink' },
  { x: 224, y: 167, s: 0.54, a: -36, type: 'white' },
  { x: 530, y: 456, s: 0.68, a: -12, type: 'pink' },
  { x: 471, y: 247, s: 0.71, a: -20, type: 'white' },
  { x: 221, y: 194, s: 0.66, a: -7, type: 'pink' },
  { x: 399, y: 293, s: 0.56, a: -24, type: 'pink' },
  { x: 521, y: 501, s: 0.52, a: 27, type: 'pink' },
  { x: 755, y: 250, s: 0.6, a: -34, type: 'white' },
  { x: 453, y: 345, s: 0.58, a: -33, type: 'white' },
  { x: 376, y: 290, s: 0.56, a: 30, type: 'pink' },
  { x: 698, y: 377, s: 0.58, a: -21, type: 'pink' },
  { x: 491, y: 214, s: 0.48, a: -2, type: 'white' },
  { x: 582, y: 492, s: 0.45, a: -6, type: 'pink' },
  { x: 535, y: 274, s: 0.53, a: 2, type: 'pink' },
  { x: 446, y: 79, s: 0.51, a: 8, type: 'pink' },
  { x: 601, y: 493, s: 0.53, a: -28, type: 'pink' },
  { x: 612, y: 437, s: 0.67, a: -21, heart: true, type: 'pink' },
  { x: 198, y: 425, s: 0.46, a: -21, type: 'pink' },
  { x: 322, y: 237, s: 0.51, a: 3, heart: true, type: 'pink' },
  { x: 439, y: 294, s: 0.69, a: -15, type: 'pink' },
  { x: 301, y: 216, s: 0.47, a: -19, type: 'pink' },
  { x: 289, y: 98, s: 0.67, a: -6, type: 'white' },
  { x: 631, y: 330, s: 0.7, a: 24, heart: true, type: 'pink' },
  { x: 443, y: 128, s: 0.52, a: 33, heart: true, type: 'pink' },
  { x: 99, y: 175, s: 0.45, a: -40, type: 'white' },
  { x: 652, y: 342, s: 0.65, a: -5, type: 'pink' },
  { x: 186, y: 243, s: 0.5, a: -40, heart: true, type: 'pink' },
  { x: 362, y: 194, s: 0.7, a: 21, heart: true, type: 'white' },
  { x: 597, y: 351, s: 0.46, a: -13, type: 'pink' },
  { x: 321, y: 343, s: 0.46, a: 2, heart: true, type: 'pink' },
  { x: 496, y: 517, s: 0.6, a: -39, type: 'pink' },
  { x: 589, y: 420, s: 0.56, a: 18, heart: true, type: 'pink' },
  { x: 130, y: 484, s: 0.64, a: -4, type: 'pink' },
  { x: 267, y: 233, s: 0.42, a: -31, type: 'pink' },
  { x: 436, y: 367, s: 0.5, a: -38, heart: true, type: 'white' },
  { x: 534, y: 475, s: 0.47, a: 32, type: 'pink' },
  { x: 374, y: 165, s: 0.63, a: 8, type: 'pink' },
  { x: 271, y: 219, s: 0.66, a: 15, type: 'pink' },
  { x: 561, y: 447, s: 0.44, a: 33, heart: true, type: 'pink' },
  { x: 607, y: 124, s: 0.66, a: -8, type: 'white' },
  { x: 651, y: 414, s: 0.49, a: -23, type: 'white' },
  { x: 242, y: 436, s: 0.66, a: -20, heart: true, type: 'pink' },
  { x: 368, y: 138, s: 0.58, a: 20, type: 'white' },
  { x: 283, y: 398, s: 0.71, a: 15, type: 'pink' },
  { x: 372, y: 279, s: 0.71, a: -8, type: 'pink' },
  { x: 583, y: 345, s: 0.51, a: -15, type: 'pink' },
  { x: 297, y: 183, s: 0.69, a: 7, type: 'pink' },
  { x: 715, y: 423, s: 0.45, a: 23, type: 'white' },
  { x: 587, y: 250, s: 0.72, a: 24, type: 'pink' },
  { x: 222, y: 373, s: 0.57, a: 16, type: 'white' },
  { x: 293, y: 245, s: 0.68, a: -36, type: 'pink' },
  { x: 210, y: 506, s: 0.67, a: 30, type: 'pink' },
  { x: 624, y: 280, s: 0.67, a: -17, type: 'pink' },
  { x: 496, y: 197, s: 0.67, a: 1, type: 'pink' },
  { x: 339, y: 261, s: 0.57, a: 30, type: 'white' },
  { x: 726, y: 339, s: 0.58, a: 5, type: 'pink' },
  { x: 363, y: 117, s: 0.59, a: 33, type: 'pink' },
  { x: 657, y: 511, s: 0.43, a: 12, heart: true, type: 'pink' },
  { x: 421, y: 226, s: 0.46, a: -31, heart: true, type: 'white' },
  { x: 65, y: 251, s: 0.69, a: -2, type: 'pink' },
  { x: 688, y: 340, s: 0.68, a: -19, heart: true, type: 'white' },
  { x: 215, y: 320, s: 0.57, a: -9, type: 'white' },
  { x: 700, y: 433, s: 0.48, a: 14, type: 'pink' },
  { x: 483, y: 369, s: 0.44, a: 18, type: 'pink' },
  { x: 531, y: 92, s: 0.51, a: 29, type: 'white' },
  { x: 209, y: 223, s: 0.62, a: -3, type: 'pink' },
  { x: 516, y: 228, s: 0.46, a: 15, heart: true, type: 'pink' },
  { x: 213, y: 416, s: 0.6, a: -2, type: 'pink' },
  { x: 604, y: 379, s: 0.64, a: -11, heart: true, type: 'pink' },
  { x: 137, y: 355, s: 0.45, a: 34, type: 'pink' },
  { x: 606, y: 269, s: 0.49, a: 25, type: 'pink' },
  { x: 692, y: 355, s: 0.47, a: 22, heart: true, type: 'pink' },
  { x: 186, y: 339, s: 0.45, a: 16, type: 'pink' },
  { x: 558, y: 267, s: 0.72, a: 7, type: 'pink' },
  { x: 514, y: 254, s: 0.61, a: -18, type: 'pink' },
  { x: 596, y: 289, s: 0.53, a: 17, type: 'pink' },
  { x: 549, y: 171, s: 0.44, a: 37, type: 'white' },
  { x: 238, y: 389, s: 0.71, a: -40, type: 'pink' },
  { x: 361, y: 360, s: 0.52, a: 29, type: 'pink' },
  { x: 171, y: 346, s: 0.53, a: 28, type: 'pink' },
  { x: 510, y: 380, s: 0.6, a: 36, heart: true, type: 'pink' },
  { x: 478, y: 206, s: 0.44, a: -27, type: 'white' },
  { x: 86, y: 407, s: 0.47, a: 15, type: 'pink' },
  { x: 222, y: 111, s: 0.6, a: -11, type: 'pink' },
  { x: 109, y: 441, s: 0.49, a: 24, type: 'pink' },
  { x: 541, y: 182, s: 0.7, a: -21, type: 'pink' },
  { x: 681, y: 410, s: 0.68, a: -28, type: 'white' },
  { x: 272, y: 135, s: 0.48, a: -11, type: 'white' },
  { x: 439, y: 425, s: 0.72, a: 20, type: 'pink' },
  { x: 328, y: 38, s: 0.45, a: 2, heart: true, type: 'pink' },
  { x: 219, y: 497, s: 0.63, a: -12, type: 'pink' },
  { x: 654, y: 256, s: 0.47, a: 9, type: 'white' },
  { x: 248, y: 342, s: 0.6, a: 37, type: 'pink' },
  { x: 661, y: 267, s: 0.52, a: -21, type: 'pink' },
  { x: 573, y: 533, s: 0.56, a: -32, type: 'pink' },
  { x: 535, y: 431, s: 0.64, a: 30, type: 'pink' },
  { x: 459, y: 384, s: 0.58, a: -7, heart: true, type: 'pink' },
  { x: 570, y: 494, s: 0.63, a: -8, type: 'white' },
  { x: 587, y: 458, s: 0.67, a: -38, type: 'pink' },
  { x: 348, y: 244, s: 0.42, a: 9, type: 'pink' },
  { x: 436, y: 37, s: 0.62, a: -32, type: 'pink' },
  { x: 599, y: 391, s: 0.67, a: -10, type: 'pink' },
  { x: 341, y: 375, s: 0.59, a: -6, type: 'pink' },
  { x: 357, y: 101, s: 0.49, a: -36, type: 'white' },
  { x: 539, y: 485, s: 0.43, a: 20, type: 'pink' },
  { x: 246, y: 460, s: 0.48, a: 36, type: 'white' },
  { x: 489, y: 255, s: 0.49, a: 37, type: 'white' },
  { x: 272, y: 390, s: 0.46, a: -29, type: 'white' },
  { x: 635, y: 181, s: 0.58, a: -11, type: 'pink' },
  { x: 441, y: 146, s: 0.67, a: -13, type: 'pink' },
  { x: 235, y: 345, s: 0.67, a: -19, type: 'pink' },
  { x: 463, y: 283, s: 0.59, a: -34, type: 'pink' },
  { x: 133, y: 441, s: 0.45, a: 7, heart: true, type: 'pink' },
  { x: 377, y: 218, s: 0.7, a: -5, type: 'white' },
  { x: 222, y: 229, s: 0.68, a: -17, type: 'white' },
  { x: 111, y: 460, s: 0.49, a: 0, type: 'pink' },
  { x: 497, y: 267, s: 0.65, a: -12, type: 'pink' },
  { x: 535, y: 236, s: 0.7, a: 6, type: 'pink' },
  { x: 343, y: 320, s: 0.7, a: -4, heart: true, type: 'white' },
  { x: 118, y: 491, s: 0.48, a: -24, type: 'pink' },
  { x: 422, y: 160, s: 0.62, a: 25, type: 'pink' },
  { x: 572, y: 194, s: 0.46, a: -7, heart: true, type: 'white' },
  { x: 436, y: 158, s: 0.48, a: -37, heart: true, type: 'pink' },
  { x: 710, y: 362, s: 0.59, a: -15, type: 'pink' },
  { x: 576, y: 309, s: 0.66, a: -35, type: 'pink' },
  { x: 421, y: 454, s: 0.44, a: 37, type: 'pink' },
  { x: 564, y: 225, s: 0.62, a: -18, type: 'pink' },
  { x: 615, y: 482, s: 0.62, a: -11, type: 'white' },
  { x: 642, y: 374, s: 0.65, a: 3, heart: true, type: 'pink' },
  { x: 517, y: 448, s: 0.67, a: -14, type: 'pink' },
  { x: 121, y: 446, s: 0.67, a: -25, type: 'pink' },
  { x: 355, y: 347, s: 0.43, a: -18, heart: true, type: 'pink' },
  { x: 314, y: 123, s: 0.59, a: -20, heart: true, type: 'pink' },
  { x: 460, y: 134, s: 0.62, a: 27, type: 'pink' },
  { x: 665, y: 464, s: 0.69, a: -40, heart: true, type: 'pink' },
  { x: 179, y: 438, s: 0.61, a: 30, type: 'pink' },
  { x: 365, y: 531, s: 0.69, a: -11, type: 'pink' },
  { x: 352, y: 498, s: 0.62, a: 22, heart: true, type: 'pink' },
  { x: 223, y: 272, s: 0.44, a: 22, type: 'pink' },
  { x: 433, y: 381, s: 0.54, a: 12, type: 'white' },
  { x: 502, y: 392, s: 0.57, a: -37, type: 'pink' },
  { x: 651, y: 305, s: 0.44, a: -12, type: 'white' },
  { x: 277, y: 354, s: 0.56, a: -5, type: 'pink' },
  { x: 478, y: 410, s: 0.57, a: 15, heart: true, type: 'pink' },
  { x: 623, y: 494, s: 0.47, a: 3, type: 'pink' },
  { x: 646, y: 269, s: 0.68, a: 18, type: 'pink' },
  { x: 394, y: 282, s: 0.71, a: 36, type: 'pink' },
  { x: 233, y: 185, s: 0.47, a: -17, type: 'white' },
  { x: 289, y: 223, s: 0.66, a: 0, type: 'pink' },
  { x: 250, y: 277, s: 0.64, a: 10, type: 'white' },
  { x: 362, y: 398, s: 0.42, a: -17, type: 'pink' },
  { x: 539, y: 105, s: 0.69, a: -8, type: 'pink' },
  { x: 472, y: 176, s: 0.71, a: 15, type: 'pink' },
  { x: 742, y: 400, s: 0.55, a: -37, type: 'white' },
  { x: 476, y: 148, s: 0.67, a: 8, heart: true, type: 'white' },
  { x: 373, y: 350, s: 0.63, a: 9, type: 'white' },
  { x: 355, y: 133, s: 0.61, a: 0, type: 'pink' },
  { x: 624, y: 440, s: 0.52, a: -30, type: 'white' },
  { x: 279, y: 305, s: 0.63, a: -1, type: 'pink' },
  { x: 242, y: 366, s: 0.46, a: 7, type: 'pink' },
  { x: 558, y: 508, s: 0.67, a: -35, type: 'white' },
  { x: 525, y: 318, s: 0.71, a: -40, type: 'pink' },
  { x: 511, y: 143, s: 0.6, a: 20, type: 'pink' },
  { x: 58, y: 355, s: 0.51, a: 31, type: 'pink' },
  { x: 479, y: 193, s: 0.45, a: 36, type: 'pink' },
  { x: 383, y: 382, s: 0.65, a: -6, type: 'pink' },
  { x: 470, y: 28, s: 0.53, a: -27, type: 'pink' },
  { x: 147, y: 343, s: 0.49, a: -39, type: 'pink' },
  { x: 426, y: 306, s: 0.54, a: 12, type: 'white' },
  { x: 503, y: 327, s: 0.64, a: 13, type: 'pink' },
  { x: 548, y: 322, s: 0.65, a: -27, type: 'pink' },
  { x: 523, y: 277, s: 0.56, a: -40, type: 'white' },
  { x: 347, y: 357, s: 0.58, a: -20, type: 'white' },
  { x: 631, y: 314, s: 0.6, a: 23, type: 'pink' },
  { x: 437, y: 70, s: 0.44, a: 36, type: 'white' },
  { x: 395, y: 158, s: 0.68, a: 25, heart: true, type: 'pink' },
  { x: 568, y: 335, s: 0.5, a: -11, heart: true, type: 'pink' },
  { x: 545, y: 87, s: 0.57, a: -31, heart: true, type: 'pink' },
  { x: 401, y: 197, s: 0.56, a: -33, type: 'pink' },
  { x: 580, y: 470, s: 0.44, a: 20, type: 'white' },
  { x: 542, y: 214, s: 0.55, a: 2, type: 'pink' },
  { x: 411, y: 267, s: 0.5, a: -7, type: 'white' },
  { x: 282, y: 275, s: 0.5, a: 31, type: 'pink' },
  { x: 151, y: 368, s: 0.44, a: 28, heart: true, type: 'white' },
  { x: 626, y: 373, s: 0.62, a: 36, type: 'pink' },
  { x: 89, y: 458, s: 0.58, a: 31, type: 'pink' },
  { x: 310, y: 172, s: 0.69, a: -7, type: 'pink' },
  { x: 150, y: 356, s: 0.72, a: -20, type: 'pink' },
  { x: 327, y: 255, s: 0.69, a: -16, type: 'white' },
  { x: 284, y: 163, s: 0.61, a: -11, type: 'pink' },
  { x: 443, y: 191, s: 0.61, a: 16, type: 'pink' },
];

/**
 * Counts the actual blossom cluster SVG nodes currently present in the DOM.
 */
function getActualBlossomCountInDOM() {
  const blossomsLayer = document.getElementById('tree-blossoms-layer');
  if (!blossomsLayer) return 0;
  return blossomsLayer.querySelectorAll('.blossom-cluster').length;
}

function initTree() {
  console.log('[Tree] Initializing Make-a-Wish Tree...');
  const blossomsLayer = document.getElementById('tree-blossoms-layer');
  const treeSvg = document.getElementById('magical-tree-svg');
  const counterEl = document.getElementById('bloom-counter-text');

  if (!treeSvg || !blossomsLayer) {
    console.warn('[Tree] Tree SVG or blossoms layer not found in DOM yet.');
    return;
  }

  // 1. Ensure starter blooms exist (at least 42 blossoms)
  initStarterBlooms();

  // 2. Sync blossom count from actual DOM nodes
  const count = getActualBlossomCountInDOM();
  state.blossomCount = count;
  if (counterEl) {
    counterEl.innerHTML = `Wish blooms attached: <span id="bloom-count-num" style="color:#a84475; font-weight:700;">${count}</span> 🌸 (Click below to bloom more!)`;
  }

  // 3. Wire the Make a Wish button
  const makeWishBtn = document.getElementById('btn-make-wish');
  if (makeWishBtn) {
    makeWishBtn.removeEventListener('click', bloomTree);
    makeWishBtn.addEventListener('click', bloomTree);
  }
}

/**
 * Initializes exactly 42 beautiful starter blossoms and attached glowing hearts directly on the tree.
 * Stored in state.persistentBlooms so they stay attached permanently!
 */
function initStarterBlooms() {
  const blossomsLayer = document.getElementById('tree-blossoms-layer');
  const counterEl = document.getElementById('bloom-counter-text');
  if (!blossomsLayer) return;

  const existingCount = getActualBlossomCountInDOM();
  if (existingCount >= STARTER_BLOOMS) {
    state.blossomCount = existingCount;
    if (counterEl) {
      counterEl.innerHTML = `Wish blooms attached: <span id="bloom-count-num" style="color:#a84475; font-weight:700;">${existingCount}</span> 🌸 (Click below to bloom more!)`;
    }
    console.log(`[Bloom] Starter blossoms already present in SVG: ${existingCount}`);
    return;
  }

  const needed = STARTER_BLOOMS - existingCount;
  for (let i = 0; i < needed; i++) {
    const anchor = BRANCH_ANCHORS[(existingCount + i) % BRANCH_ANCHORS.length];
    if (!anchor) continue;

    const cluster = createPermanentBlossomSVG(anchor, 0, true);
    if (cluster) {
      blossomsLayer.appendChild(cluster);
      state.persistentBlooms.push({
        x: anchor.x,
        y: anchor.y,
        scale: anchor.s,
        angle: anchor.a,
        isStarter: true,
      });
    }
  }

  const actualCount = getActualBlossomCountInDOM();
  state.blossomCount = actualCount;
  console.log(`[Bloom] Starter blossoms rendered: ${actualCount}`);

  if (counterEl) {
    counterEl.innerHTML = `Wish blooms attached: <span id="bloom-count-num" style="color:#a84475; font-weight:700;">${actualCount}</span> 🌸 (Click below to bloom more!)`;
  }
}

/**
 * Adds exactly 35 new permanent blossom clusters and attached hearts to the tree.
 * Preserves all previously attached blooms permanently.
 * Does NOT auto-scroll away so user can watch the tree bloom!
 */
function bloomTree() {
  console.log('[Wish] Wish button clicked. Adding blooms...');
  state.bloomRounds++;
  const blossomsLayer = document.getElementById('tree-blossoms-layer');
  const sparklesLayer = document.getElementById('tree-sparkles-layer');
  const counterEl = document.getElementById('bloom-counter-text');
  const makeWishBtn = document.getElementById('btn-make-wish');

  if (!blossomsLayer) {
    console.error('[Bloom] Cannot bloom: #tree-blossoms-layer missing');
    return;
  }

  // A soft blossom-glow burst accompanies every wish (visual only; no generated audio).
  const treeSvg = document.getElementById('magical-tree-svg');
  if (treeSvg) {
    treeSvg.classList.remove('wish-blooming');
    void treeSvg.getBoundingClientRect();
    treeSvg.classList.add('wish-blooming');
    window.setTimeout(() => treeSvg.classList.remove('wish-blooming'), 2200);
  }

  // Send a shooting star across the sky as a visual-only effect.
  if (window.triggerMagicalShootingStar) {
    window.triggerMagicalShootingStar();
  }

  // Pick 35 anchors distributed across the canopy
  const batchSize = 35;
  const startIdx = ((state.bloomRounds - 1) * batchSize + 17) % BRANCH_ANCHORS.length;

  for (let i = 0; i < batchSize; i++) {
    const anchorIdx = (startIdx + i) % BRANCH_ANCHORS.length;
    const anchor = BRANCH_ANCHORS[anchorIdx];

    // Build the permanent SVG group
    const cluster = createPermanentBlossomSVG(anchor, i * 20, false);
    if (cluster) {
      blossomsLayer.appendChild(cluster);
      state.persistentBlooms.push({
        x: anchor.x,
        y: anchor.y,
        scale: anchor.s,
        angle: anchor.a,
        round: state.bloomRounds,
      });
    }
  }

  // Add golden stardust sparkles along branch nodes
  if (sparklesLayer) {
    for (let k = 0; k < 10; k++) {
      const a = BRANCH_ANCHORS[Math.floor(Math.random() * BRANCH_ANCHORS.length)];
      const sp = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      sp.setAttribute('cx', a.x + (Math.random() - 0.5) * 14);
      sp.setAttribute('cy', a.y + (Math.random() - 0.5) * 14);
      sp.setAttribute('r', (Math.random() * 1.6 + 1.2).toFixed(1));
      sp.setAttribute('fill', '#fff6b0');
      sp.setAttribute('class', 'branch-sparkle');
      sparklesLayer.appendChild(sp);
    }
  }

  // Count the actual SVG blossom elements directly in the DOM
  const actualCount = getActualBlossomCountInDOM();
  state.blossomCount = actualCount;
  console.log(`[Bloom] Permanent blossoms currently visible: ${actualCount}`);

  // Update Persistent Blossom Count in UI
  if (counterEl) {
    counterEl.innerHTML = `Our little tree now holds <span id="bloom-count-num" style="color:#a84475; font-weight:700;">${actualCount}</span> blossoms of love 🌸`;
  }

  // Temporary floating ambient petals & stardust into the sky
  spawnDriftingPetals();
  spawnFloatingHearts();

  // Update Button Text
  if (makeWishBtn) {
    makeWishBtn.innerHTML = '<span>♡</span> Wish Again for More Blooms';
  }

  // Show Sweet Toast (User stays right at the tree to admire the blooms!)
  showToast(`🌸 Your wish made our little tree bloom. ${actualCount} blossoms, and every one reminds me of you.`);
}

/**
 * Builds an authentic Cherry Blossom Cluster attached directly to branch coordinate.
 * Position and base scale are baked on the outer group.
 * Returns the fully constructed SVG element.
 */
function createPermanentBlossomSVG(anchor, animDelayMs, isInitial) {
  const SVG_NS = 'http://www.w3.org/2000/svg';

  // 1. Outer Group: NEVER ANIMATED in CSS; holds absolute branch attachment coordinates
  const outer = document.createElementNS(SVG_NS, 'g');
  outer.setAttribute('class', 'blossom-cluster');
  outer.setAttribute(
    'transform',
    `translate(${anchor.x}, ${anchor.y}) scale(${anchor.s || 1}) rotate(${anchor.a || 0})`
  );

  // 2. Inner Group: Scales from 0 to 1 with spring pop, centered at (0, 0)
  const inner = document.createElementNS(SVG_NS, 'g');
  inner.setAttribute('class', isInitial ? 'blossom-inner' : 'blossom-inner pop-in');
  if (!isInitial && animDelayMs > 0) {
    inner.style.animationDelay = `${animDelayMs}ms`;
  }

  // 3. Delicate connecting wooden stem to branch
  const stem = document.createElementNS(SVG_NS, 'path');
  stem.setAttribute('d', 'M 0 0 C 1 3, 2 6, 3 8');
  stem.setAttribute('stroke', '#54203a');
  stem.setAttribute('stroke-width', '1.4');
  stem.setAttribute('stroke-linecap', 'round');
  stem.setAttribute('fill', 'none');
  inner.appendChild(stem);

  // 4. Attached Glowing Heart if designated on this branch junction
  if (anchor.heart || Math.random() < 0.32) {
    const heart = document.createElementNS(SVG_NS, 'path');
    heart.setAttribute('class', 'attached-heart');
    heart.setAttribute(
      'd',
      'M 0 -6 C -3 -11, -8 -8, -8 -4 C -8 1, 0 8, 0 10 C 0 8, 8 1, 8 -4 C 8 -8, 3 -11, 0 -6 Z'
    );
    heart.setAttribute('fill', '#ff2a80');
    heart.setAttribute('stroke', '#ffffff');
    heart.setAttribute('stroke-width', '0.8');
    heart.setAttribute('transform', 'translate(-10, -5) scale(0.75) rotate(-15)');
    inner.appendChild(heart);
  }

  // 5. Authentic 5-petal sakura cherry blossom with soft gradient petals
  const flower = document.createElementNS(SVG_NS, 'g');
  flower.setAttribute('class', 'sakura-blossom');

  const isWhite = anchor.type === 'white' || Math.random() < 0.32;
  const petalGrad = isWhite ? 'url(#blossomPetalSoftWhite)' : 'url(#blossomPetalGrad)';
  const strokeColor = isWhite ? '#ff9ec4' : '#ffffff';

  const petalCount = 5;
  for (let p = 0; p < petalCount; p++) {
    const angle = (p * 360) / petalCount;
    const petal = document.createElementNS(SVG_NS, 'path');
    petal.setAttribute('d', 'M 0 0 C -4.2 -5, -6.5 -12, 0 -16 C 6.5 -12, 4.2 -5, 0 0 Z');
    petal.setAttribute('fill', petalGrad);
    petal.setAttribute('stroke', strokeColor);
    petal.setAttribute('stroke-width', '0.6');
    petal.setAttribute('transform', `rotate(${angle})`);
    flower.appendChild(petal);
  }

  // Bright golden stamen center
  const center = document.createElementNS(SVG_NS, 'circle');
  center.setAttribute('cx', '0');
  center.setAttribute('cy', '0');
  center.setAttribute('r', '3.6');
  center.setAttribute('fill', '#ffe066');
  center.setAttribute('stroke', '#ffffff');
  center.setAttribute('stroke-width', '0.6');
  flower.appendChild(center);

  // Delicate white stamen dots around pistil
  for (let d = 0; d < 5; d++) {
    const rad = (d * 72 * Math.PI) / 180;
    const dot = document.createElementNS(SVG_NS, 'circle');
    dot.setAttribute('cx', (Math.cos(rad) * 4.2).toFixed(1));
    dot.setAttribute('cy', (Math.sin(rad) * 4.2).toFixed(1));
    dot.setAttribute('r', '0.9');
    dot.setAttribute('fill', '#ffffff');
    flower.appendChild(dot);
  }

  inner.appendChild(flower);
  outer.appendChild(inner);

  return outer;
}


function spawnDriftingPetals() {
  const container = document.querySelector('.tree-container');
  if (!container) return;

  const count = 10;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'floating-petal-particle';
    p.textContent = '🌸';
    p.style.left = `${Math.random() * 80 + 10}%`;
    p.style.top = `${Math.random() * 45 + 20}%`;
    p.style.fontSize = `${Math.random() * 6 + 12}px`;
    p.style.opacity = '0.9';

    container.appendChild(p);

    setTimeout(() => {
      p.style.transform = `translate(${(Math.random() - 0.5) * 140}px, ${Math.random() * 160 + 80}px) rotate(${Math.random() * 360}deg)`;
      p.style.opacity = '0';
    }, 40);

    setTimeout(() => {
      p.remove();
    }, 6100);
  }
}

function spawnFloatingHearts() {
  const container = document.getElementById('particles-container');
  if (!container) return;

  const count = 12;
  const treeContainer = document.querySelector('.tree-container');
  const rect = treeContainer
    ? treeContainer.getBoundingClientRect()
    : { left: window.innerWidth / 2, top: 300, width: 300 };

  for (let i = 0; i < count; i++) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart-particle';
    heart.textContent = '♥';

    const startX = rect.left + rect.width * 0.2 + Math.random() * (rect.width * 0.6);
    const startY = rect.top + 80 + Math.random() * 150;
    const duration = Math.random() * 2 + 2.5;

    heart.style.position = 'fixed';
    heart.style.left = `${startX}px`;
    heart.style.top = `${startY}px`;
    heart.style.fontSize = `${Math.random() * 10 + 12}px`;
    heart.style.color = '#ff65a5';
    heart.style.textShadow = '0 0 10px rgba(255, 101, 165, 0.8)';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '99';
    heart.style.transition = `all ${duration}s cubic-bezier(0.2, 0.8, 0.3, 1)`;

    container.appendChild(heart);

    setTimeout(() => {
      heart.style.transform = `translate(${(Math.random() - 0.5) * 120}px, -${Math.random() * 200 + 140}px) scale(1.3)`;
      heart.style.opacity = '0';
    }, 50);

    setTimeout(() => {
      heart.remove();
    }, duration * 1000 + 100);
  }
}

/* ==========================================================================
   7. WISH SUBMISSION FORM & CONFIRMATION
   ========================================================================== */
function initWishForm() {
  const wishInput = document.getElementById('wish-input');
  const charCurrent = document.getElementById('char-current');
  const sendWishBtn = document.getElementById('btn-send-wish');
  const errorMsg = document.getElementById('wish-error');

  if (wishInput && charCurrent) {
    wishInput.addEventListener('input', () => {
      charCurrent.textContent = wishInput.value.length;
      if (errorMsg) errorMsg.style.display = 'none';
    });
  }

  if (sendWishBtn) {
    sendWishBtn.addEventListener('click', () => {
      const wishText = wishInput ? wishInput.value.trim() : '';
      if (!wishText) {
        if (errorMsg) {
          errorMsg.textContent = 'Please write a heartfelt wish before sending to the stars... ♡';
          errorMsg.style.display = 'block';
        }
        return;
      }

      sendWishToUniverse(wishText);
    });
  }
}

function sendWishToUniverse(wishText) {
  const wishSection = document.getElementById('wish-section');
  const shootingStarSection = document.getElementById('shooting-star-section');
  const submittedWishText = document.getElementById('submitted-wish-quote');

  if (submittedWishText) {
    submittedWishText.textContent = `"${wishText}"`;
  }

  // Trigger shooting star across sky canvas
  if (window.triggerMagicalShootingStar) {
    window.triggerMagicalShootingStar();
  }

  // Transition to confirmation card
  if (wishSection && shootingStarSection) {
    wishSection.style.display = 'none';
    shootingStarSection.classList.remove('hidden');
    shootingStarSection.classList.add('fade-in');
    shootingStarSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  playShootingStarSectionCanvas();
}

function playShootingStarSectionCanvas() {
  const canvas = document.getElementById('star-animation-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = canvas.parentElement.clientWidth || 700;
  canvas.height = 300;

  let x = canvas.width * 0.15;
  let y = canvas.height * 0.2;
  const targetX = canvas.width * 0.85;
  const targetY = canvas.height * 0.75;
  const angle = Math.atan2(targetY - y, targetX - x);
  const speed = 14;
  const particles = [];

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ff85b3';
    ctx.shadowBlur = 18;
    ctx.fill();

    const trailLen = 140;
    const grad = ctx.createLinearGradient(
      x,
      y,
      x - Math.cos(angle) * trailLen,
      y - Math.sin(angle) * trailLen
    );
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.35, 'rgba(255, 215, 140, 0.9)');
    grad.addColorStop(0.75, 'rgba(255, 82, 154, 0.4)');
    grad.addColorStop(1, 'rgba(255, 82, 154, 0)');

    ctx.beginPath();
    ctx.strokeStyle = grad;
    ctx.lineWidth = 3.5;
    ctx.moveTo(x, y);
    ctx.lineTo(x - Math.cos(angle) * trailLen, y - Math.sin(angle) * trailLen);
    ctx.stroke();
    ctx.restore();

    if (Math.random() < 0.6) {
      particles.push({
        x: x + (Math.random() - 0.5) * 15,
        y: y + (Math.random() - 0.5) * 15,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 2 + 1,
        alpha: 1,
        color: Math.random() > 0.5 ? '#ffe066' : '#ff85b3',
      });
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.02;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fill();

      if (p.alpha <= 0) particles.splice(i, 1);
    }
    ctx.globalAlpha = 1;

    x += Math.cos(angle) * speed;
    y += Math.sin(angle) * speed;

    if (x < targetX && y < targetY) {
      requestAnimationFrame(draw);
    }
  }

  requestAnimationFrame(draw);
}

/* ==========================================================================
   8. POLAROID GALLERY & LIGHTBOX
   ========================================================================== */
function initGallery() {
  const polaroids = document.querySelectorAll('.polaroid-card');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  const grid = document.querySelector('.polaroid-grid');

  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  polaroids.forEach((card) => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.polaroid-img');
      const caption = card.querySelector('.polaroid-caption');
      if (lightbox && lightboxImg && lightboxCaption) {
        lightboxImg.src = img.src;
        lightboxCaption.textContent = caption.textContent;
        lightbox.classList.add('active');
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
      }
    });
  }

  if (prevBtn && grid) {
    prevBtn.addEventListener('click', () => {
      grid.scrollBy({ left: -240, behavior: 'smooth' });
    });
  }
  if (nextBtn && grid) {
    nextBtn.addEventListener('click', () => {
      grid.scrollBy({ left: 240, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   9. MUSIC PLAYER & PLAYLIST ENGINE
   Real event-driven audio player with verified files and explicit diagnostics
   ========================================================================== */
function initPlaylistAndAudio() {
  const playBtn = document.getElementById('btn-play-pause');
  const prevBtn = document.getElementById('btn-prev-track');
  const nextBtn = document.getElementById('btn-next-track');
  const shuffleBtn = document.getElementById('btn-shuffle');
  const playlistToggleBtn = document.getElementById('btn-toggle-playlist');
  const playlistCloseBtn = document.getElementById('btn-close-playlist');
  const playlistDrawer = document.getElementById('playlist-drawer');
  const floatingBtn = document.getElementById('floating-music-toggle');
  const likeBtn = document.getElementById('btn-like-track');
  const scrubberTrack = document.getElementById('scrubber-track');
  const fileInput = document.getElementById('local-audio-file-input');
  const uploadBtn = document.getElementById('btn-upload-audio');

  // Single Authoritative Audio Element in the DOM
  state.audioElement = document.getElementById('main-audio') || new Audio();
  state.audioElement.preload = 'metadata';

  // Render Initial Playlist and Load Track 1 without autoplay
  renderPlaylistDrawer();
  loadTrack(0, false);

  // Audio Event: Play -> State & UI driven purely by real audio state
  state.audioElement.addEventListener('play', () => {
    state.isPlaying = true;
    updatePlayUI(true);
    const track = PLAYLIST[state.currentTrackIndex];
    console.log(`[Music] Audio playback started: "${track ? track.title : 'Unknown'}"`);
    renderPlaylistDrawer();
  });

  // Audio Event: Pause
  state.audioElement.addEventListener('pause', () => {
    state.isPlaying = false;
    updatePlayUI(false);
    console.log('[Music] Audio playback paused.');
    renderPlaylistDrawer();
  });

  // Audio Event: Metadata Loaded
  state.audioElement.addEventListener('loadedmetadata', () => {
    if (state.audioElement.duration && !isNaN(state.audioElement.duration)) {
      state.trackDuration = Math.floor(state.audioElement.duration);
      const durEl = document.getElementById('time-duration');
      if (durEl) durEl.textContent = formatTime(state.trackDuration);
      console.log(`[Music] Metadata loaded for track. Duration: ${state.trackDuration}s`);
    }
  });

  // Audio Event: Live Playback Time Update
  state.audioElement.addEventListener('timeupdate', () => {
    if (state.audioElement.duration) {
      state.currentTrackTime = Math.floor(state.audioElement.currentTime);
      updateScrubberUI();
    }
  });

  // Audio Event: Song Ended -> Automatic Progression to Next Song
  state.audioElement.addEventListener('ended', () => {
    console.log('[Music] Track ended. Auto-advancing...');
    advanceToNextTrack();
  });

  // Audio Event: Error Handler (Never fake playing state on failure)
  state.audioElement.addEventListener('error', () => {
    const track = PLAYLIST[state.currentTrackIndex];
    state.isPlaying = false;
    updatePlayUI(false);
    renderPlaylistDrawer();
    const src = track ? track.src : (state.audioElement.src || 'unknown');
    console.warn(`[Music] Playback failed: File not found or unplayable at ${src}`);
    showToast(`⚠️ Cannot play "${track ? track.title : 'Track'}": file not found at "${src}". Make sure song.mp3 was uploaded beside index.html.`);
  });

  // Play / Pause Toggle handler
  function togglePlay() {
    if (state.isPlaying) {
      pauseTrack();
    } else {
      playTrack();
    }
  }

  if (playBtn) playBtn.addEventListener('click', togglePlay);
  if (floatingBtn) floatingBtn.addEventListener('click', togglePlay);

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (state.currentTrackTime > 3) {
        seekTrack(0);
      } else {
        advanceToPrevTrack();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      advanceToNextTrack();
    });
  }

  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      state.isShuffle = !state.isShuffle;
      shuffleBtn.classList.toggle('active', state.isShuffle);
      showToast(state.isShuffle ? '🔀 Fair Shuffle enabled (no repeats)' : '▶ Normal sequential playback');
    });
  }

  if (playlistToggleBtn && playlistDrawer) {
    playlistToggleBtn.addEventListener('click', () => {
      state.playlistDrawerOpen = !state.playlistDrawerOpen;
      playlistDrawer.classList.toggle('hidden', !state.playlistDrawerOpen);
    });
  }

  if (playlistCloseBtn && playlistDrawer) {
    playlistCloseBtn.addEventListener('click', () => {
      state.playlistDrawerOpen = false;
      playlistDrawer.classList.add('hidden');
    });
  }

  if (likeBtn) {
    likeBtn.addEventListener('click', () => {
      state.isLiked = !state.isLiked;
      likeBtn.classList.toggle('liked', state.isLiked);
      likeBtn.innerHTML = state.isLiked ? '♥' : '♡';
      showToast(state.isLiked ? 'Added to favorites ♡' : 'Removed from favorites');
      spawnFloatingHearts();
    });
  }

  if (scrubberTrack) {
    scrubberTrack.addEventListener('click', (e) => {
      const rect = scrubberTrack.getBoundingClientRect();
      const clickPos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const targetTime = Math.floor(clickPos * state.trackDuration);
      seekTrack(targetTime);
    });
  }

  // Custom Local Audio File Testing via File Picker
  if (uploadBtn && fileInput) {
    uploadBtn.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const fileUrl = URL.createObjectURL(file);
        const fileName = file.name.replace(/\.[^/.]+$/, '');

        // Insert as top custom track
        const customTrack = {
          id: Date.now(),
          title: fileName,
          artist: 'My Custom Song',
          subtitle: 'Uploaded File (Ready)',
          src: fileUrl,
          cover: 'assets/images/album_cover_better_together_1792175153679.jpg',
          duration: 180,
          durationText: '3:00',
          isReady: true,
        };

        PLAYLIST.unshift(customTrack);
        renderPlaylistDrawer();
        loadTrack(0, true);
        showToast(`Loaded and playing your song: "${fileName}"! ♫`);
      }
    });
  }
}

function renderPlaylistDrawer() {
  const listEl = document.getElementById('playlist-items-list');
  if (!listEl) return;

  listEl.innerHTML = '';
  PLAYLIST.forEach((song, idx) => {
    const item = document.createElement('div');
    item.className = `playlist-item ${idx === state.currentTrackIndex ? 'active' : ''}`;
    item.setAttribute('data-index', idx.toString());

    item.innerHTML = `
      <div class="playlist-item-left">
        <span class="playlist-item-idx">${idx + 1}</span>
        <div class="playlist-item-info">
          <span class="playlist-item-title">
            ${song.title}
            ${song.isReady ? '<span class="ready-badge">Ready ♫</span>' : '<span class="custom-badge">MP3 Needed</span>'}
          </span>
          <span class="playlist-item-artist">${song.artist} • <em style="opacity:0.8">${song.subtitle}</em></span>
        </div>
      </div>
      <div class="playlist-item-right">
        ${
          idx === state.currentTrackIndex && state.isPlaying
            ? `<div class="playing-bars"><span></span><span></span><span></span></div>`
            : ''
        }
        <span class="playlist-item-duration">${song.durationText}</span>
      </div>
    `;

    item.addEventListener('click', () => {
      loadTrack(idx, true);
    });

    listEl.appendChild(item);
  });
}

function loadTrack(index, autoPlay = true) {
  state.currentTrackIndex = index;
  const track = PLAYLIST[index];
  if (!track) return;

  state.trackDuration = track.duration || 32;
  state.currentTrackTime = 0;

  const titleEl = document.getElementById('player-track-title');
  const artistEl = document.getElementById('player-track-artist');
  const thumbEl = document.getElementById('player-album-thumb');
  const durEl = document.getElementById('time-duration');
  const curEl = document.getElementById('time-current');

  if (titleEl) titleEl.textContent = track.title;
  if (artistEl) artistEl.textContent = track.artist;
  if (thumbEl) thumbEl.src = track.cover;
  if (durEl) durEl.textContent = track.durationText;
  if (curEl) curEl.textContent = '0:00';

  updateScrubberUI();
  renderPlaylistDrawer();

  if (state.audioElement) {
    state.audioElement.src = track.src;
    state.audioElement.muted = false;
    state.audioElement.volume = 0.85;
    state.audioElement.load();
    console.log(`[Music] Track loaded: "${track.title}" from "${track.src}"`);
  }

  if (autoPlay) {
    playTrack();
  }
}

// This experience intentionally plays only the supplied song.mp3.
// No oscillator, synthetic melody, or generated background audio is used.
function stopWebAudioChimes() {
  // Kept as a compatibility hook for pauseTrack(); there are no generated sounds.
}

function playTrack() {
  const track = PLAYLIST[state.currentTrackIndex];
  if (!track) return;

  if (!state.audioElement) {
    state.audioElement = document.getElementById('main-audio') || new Audio();
  }

  state.audioElement.muted = false;
  state.audioElement.volume = 0.85;

  if (!state.audioElement.src || !state.audioElement.src.includes(track.src.replace(/^assets\//, ''))) {
    state.audioElement.src = track.src;
    state.audioElement.load();
  }

  console.log(`[Music] Requesting playback for: "${track.title}" (${track.src})`);

  const playPromise = state.audioElement.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        state.isPlaying = true;
        updatePlayUI(true);
        renderPlaylistDrawer();
        showToast(`Now Playing: ${track.title} - ${track.artist} ♫`);
      })
      .catch((err) => {
        console.warn(`[Music] HTML5 audio play error:`, err);
        if (err.name === 'NotAllowedError') {
          showToast('Click anywhere or click Play to start music ♫');
          const unlock = () => {
            if (state.audioElement) {
              state.audioElement.play().then(() => {
                state.isPlaying = true;
                updatePlayUI(true);
                renderPlaylistDrawer();
              }).catch(() => {
                state.isPlaying = false;
                updatePlayUI(false);
                renderPlaylistDrawer();
                showToast('The browser could not start song.mp3. Press the Play button to try again.');
              });
            }
            window.removeEventListener('click', unlock);
            window.removeEventListener('touchstart', unlock);
          };
          window.addEventListener('click', unlock, { once: true });
          window.addEventListener('touchstart', unlock, { once: true });
        } else {
          state.isPlaying = false;
          updatePlayUI(false);
          renderPlaylistDrawer();
          showToast(`Couldn't play ${track.title}. Please check that song.mp3 uploaded correctly, then press Play again.`);
        }
      });
  } else {
    state.isPlaying = true;
    updatePlayUI(true);
    renderPlaylistDrawer();
  }
}

function pauseTrack() {
  if (state.audioElement) {
    state.audioElement.pause();
  }
  stopWebAudioChimes();
  state.isPlaying = false;
  updatePlayUI(false);
  renderPlaylistDrawer();
}

function seekTrack(targetSeconds) {
  state.currentTrackTime = targetSeconds;
  if (state.audioElement) {
    try {
      state.audioElement.currentTime = targetSeconds;
    } catch (e) {
      // ignore seek errors
    }
  }
  updateScrubberUI();
}

function advanceToNextTrack() {
  let nextIndex;

  if (state.isShuffle) {
    if (state.recentlyPlayed.length >= PLAYLIST.length - 1) {
      state.recentlyPlayed = [];
    }
    state.recentlyPlayed.push(state.currentTrackIndex);

    const pool = PLAYLIST.map((_, i) => i).filter(
      (i) => i !== state.currentTrackIndex && !state.recentlyPlayed.includes(i)
    );

    nextIndex = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : (state.currentTrackIndex + 1) % PLAYLIST.length;
  } else {
    nextIndex = (state.currentTrackIndex + 1) % PLAYLIST.length;
  }

  loadTrack(nextIndex, true);
}

function advanceToPrevTrack() {
  const prevIndex = (state.currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
  loadTrack(prevIndex, true);
}

function updatePlayUI(playing) {
  const playBtn = document.getElementById('btn-play-pause');
  const floatingBtn = document.getElementById('floating-music-toggle');

  if (playBtn) playBtn.innerHTML = playing ? '❚❚' : '▶';
  if (floatingBtn) {
    if (playing) {
      floatingBtn.classList.add('playing');
    } else {
      floatingBtn.classList.remove('playing');
    }
  }
}

function updateScrubberUI() {
  const curEl = document.getElementById('time-current');
  const fillEl = document.getElementById('scrubber-fill');
  const trackEl = document.getElementById('scrubber-track');

  if (curEl) curEl.textContent = formatTime(state.currentTrackTime);
  if (fillEl && state.trackDuration) {
    const percent = Math.min(100, (state.currentTrackTime / state.trackDuration) * 100);
    fillEl.style.width = `${percent}%`;
  }
  if (trackEl) {
    trackEl.setAttribute('aria-valuenow', state.currentTrackTime.toString());
  }
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

/* ==========================================================================
   10. AMBIENT BACKGROUND PARTICLES
   ========================================================================= */
function initLoveStoryFeatures() {
  const openLetter = document.getElementById('btn-open-letter');
  const letterCopy = document.getElementById('love-letter-copy');
  if (openLetter && letterCopy) {
    openLetter.addEventListener('click', () => {
      const opening = letterCopy.hidden;
      letterCopy.hidden = !opening;
      openLetter.setAttribute('aria-expanded', String(opening));
      openLetter.innerHTML = opening ? 'Keep this letter close <span aria-hidden="true">♥</span>' : 'Open your letter <span aria-hidden="true">✉</span>';
      if (opening) letterCopy.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      spawnFloatingHearts();
    });
  }

  document.querySelectorAll('.constellation-star').forEach((star) => {
    star.addEventListener('click', () => {
      document.querySelectorAll('.constellation-star').forEach((other) => other.classList.remove('selected'));
      star.classList.add('selected');
      const output = document.getElementById('constellation-promise');
      if (output) output.textContent = star.dataset.promise || 'I choose you, again and again. ♥';
      if (typeof spawnFloatingHearts === 'function') spawnFloatingHearts();
    });
  });

  const birthdayWishBtn = document.getElementById('btn-birthday-wish');
  const birthdayNote = document.getElementById('birthday-final-note');
  if (birthdayWishBtn && birthdayNote) {
    birthdayWishBtn.addEventListener('click', () => {
      birthdayNote.hidden = false;
      birthdayNote.classList.add('revealed');
      birthdayWishBtn.disabled = true;
      birthdayWishBtn.textContent = 'Wish sent with all my love ♥';
      if (typeof spawnFloatingHearts === 'function') spawnFloatingHearts();
      if (typeof window.triggerMagicalShootingStar === 'function') window.triggerMagicalShootingStar();
    });
  }

  const backToTree = document.getElementById('btn-back-to-tree');
  if (backToTree) backToTree.addEventListener('click', () => {
    const tree = document.getElementById('tree-section');
    if (tree) tree.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function initFloatingParticles() {
  const container = document.getElementById('particles-container');
  if (!container) return;

  setInterval(() => {
    if (document.hidden) return;
    const particle = document.createElement('div');
    const isHeart = Math.random() > 0.45;
    particle.textContent = isHeart ? '♥' : '✦';
    particle.style.position = 'fixed';
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.bottom = '-20px';
    particle.style.fontSize = `${Math.random() * 12 + 10}px`;
    particle.style.color = isHeart ? 'rgba(255, 105, 180, 0.45)' : 'rgba(255, 255, 255, 0.5)';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '2';
    particle.style.transition = 'transform 10s linear, opacity 10s ease-out';
    particle.style.filter = 'drop-shadow(0 0 5px rgba(255, 105, 180, 0.5))';

    container.appendChild(particle);

    setTimeout(() => {
      particle.style.transform = `translate(${(Math.random() - 0.5) * 80}px, -105vh) rotate(${Math.random() * 360}deg)`;
      particle.style.opacity = '0';
    }, 50);

    setTimeout(() => {
      particle.remove();
    }, 10500);
  }, 1800);
}

/* ==========================================================================
   11. TOAST NOTIFICATIONS
   ========================================================================== */
function showToast(message) {
  let toast = document.getElementById('toast-msg');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-msg';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4200);
}
