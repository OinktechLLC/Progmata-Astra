// ============================================================
// ASTRA — Девочка и Земля | Game Engine
// A PRAGMATA-inspired 3D adventure for OneGames Platform
// ============================================================

'use strict';

// ===== GAME STATE =====
const GameState = {
  currentScreen: 'menu',
  paused: false,
  health: 100,
  xp: 10,
  xpToNextLevel: 100,
  level: 1,
  bpLevel: 1,
  bpXp: 10,
  bpXpNeeded: 100,
  hasPremiumPass: false,
  chapter: 0,
  storyIndex: 0,
  dialogQueue: [],
  dialogIndex: 0,
  inDialog: false,
  mapUnlocked: [0, 1],
  mapCompleted: [],
  collectibles: 0,
  score: 0,
};

// ===== STORY DATA =====
const STORY_CHAPTERS = [
  {
    chapter: '— ПРОЛОГ —',
    texts: [
      `Земля. 2157 год.\n\nПосле Великого Молчания — загадочного события, стёршего все электронные сети — планета погрузилась в тишину. Мегаполисы опустели. Технологии замолчали.\n\nНо в одном бункере под Москвой проснулась девочка.`,
      `Её имя — Астра. Ей 9 лет. Она не знает, что произошло с миром. Она знает только одно: там, снаружи, что-то ждёт её.\n\nВ её запястье встроен голографический навигатор — наследие матери, учёного проекта CRADLE.\n\nСегодня она выходит впервые.`
    ]
  },
  {
    chapter: '— ГЛАВА 1 — ПРОБУЖДЕНИЕ —',
    texts: [
      `Заброшенный Московский метрополитен. Астра спускается по эскалатору, подсвечивая путь голограммой с запястья. Стены покрыты ржавчиной и мхом — но красота разрушения завораживает её.`,
      `«Мама говорила: мир — это приключение. Даже если мир сломан — искать в нём красоту.»\n\nВ тёмных туннелях что-то движется. Но Астра не боится. Ей любопытно.`
    ]
  },
  {
    chapter: '— ГЛАВА 2 — РУИНЫ —',
    texts: [
      `Красная площадь. Асфальт взломан корнями деревьев. Кремль стоит, как и столетия назад, но в его башнях живут птицы размером с человека — мутанты эпохи Молчания.`,
      `Астра находит старый экран. На нём — последнее сообщение: "ПРОЕКТ CRADLE АКТИВИРОВАН. ИЩИ МАЯКИ. МАМА ТЕБЯ ЛЮБИТ."\n\nТеперь у неё есть цель.`
    ]
  },
  {
    chapter: '— ГЛАВА 3 — МАЯКИ —',
    texts: [
      `По всей Земле разбросаны семь Маяков — устройств, которые могут перезапустить глобальную сеть. Мать Астры спрятала их перед исчезновением.\n\nКаждый маяк — в особом месте: Сибирская тайга, Тихий океан, Антарктида, Египет, Амазония, Тибет, и... орбита Земли.`,
      `Но Астра — одна. Или нет?\n\nЗа ней следит кто-то в тяжёлом боевом скафандре. Молчаливый страж. Он не враг — но и не союзник. Пока что.`
    ]
  }
];

const STORY_DIALOGS = {
  spawn: [
    { speaker: 'АСТРА', text: 'Вот это да... Снаружи совсем не страшно! Мама права — там красота!' },
    { speaker: 'НАВИГАТОР', text: 'Обнаружено 3 артефакта в зоне. Рекомендуется сбор данных.' },
  ],
  collectible: [
    { speaker: 'АСТРА', text: 'Ух ты! Что это? Наверное, раньше это было важным для кого-то.' },
    { speaker: 'НАВИГАТОР', text: 'Артефакт сохранён в базе данных проекта CRADLE.' },
  ],
  beacon: [
    { speaker: 'АСТРА', text: 'МАЯК! Мама... ты здесь была. Я чувствую.' },
    { speaker: 'НАВИГАТОР', text: 'Маяк активирован. Сигнал передан на орбиту. 6 маяков осталось.' },
    { speaker: '???', text: '...' },
  ],
  danger: [
    { speaker: 'АСТРА', text: 'Стоп. Там что-то движется. Но убегать — не интересно.' },
    { speaker: 'НАВИГАТОР', text: 'Внимание: мутировавшая фауна. Рекомендую обходной маршрут.' },
  ]
};

// ===== BATTLE PASS DATA =====
const BP_REWARDS = [
  { level: 1,  free: { icon: '🎒', name: 'Рюкзак Астры', type: 'cosmetic' }, premium: { icon: '✨', name: 'Голо-эффект', type: 'effect' } },
  { level: 2,  free: { icon: '💙', name: '+50 Здоровья', type: 'boost' }, premium: { icon: '🔵', name: 'Синий след', type: 'trail' } },
  { level: 3,  free: { icon: '🗺️', name: 'Карта Сибири', type: 'chapter' }, premium: { icon: '⭐', name: 'Звёздный плащ', type: 'cosmetic' } },
  { level: 4,  free: { icon: '🔦', name: 'Голо-фонарь', type: 'item' }, premium: { icon: '💫', name: 'Астральный след', type: 'trail' } },
  { level: 5,  free: { icon: '🎯', name: '+100 XP Буст', type: 'boost' }, premium: { icon: '🌟', name: 'Скин Маяк', type: 'skin' } },
  { level: 6,  free: { icon: '🧩', name: 'Артефакт №1', type: 'collectible' }, premium: { icon: '🛡️', name: 'Броня CRADLE', type: 'cosmetic' } },
  { level: 7,  free: { icon: '💎', name: '50 Кристаллов', type: 'currency' }, premium: { icon: '🌌', name: 'Галактич. скин', type: 'skin' } },
  { level: 8,  free: { icon: '📡', name: 'Глава 2 ранний доступ', type: 'chapter' }, premium: { icon: '🔮', name: 'Хрустальный щит', type: 'effect' } },
  { level: 9,  free: { icon: '⚡', name: 'Скорость +25%', type: 'boost' }, premium: { icon: '🌠', name: 'Метеоритный след', type: 'trail' } },
  { level: 10, free: { icon: '🏆', name: 'Медаль Первопроходца', type: 'title' }, premium: { icon: '👑', name: 'СКИН: Мать Астры', type: 'legendary' } },
];

// ===== MAP LOCATIONS =====
const MAP_LOCATIONS = [
  { name: 'Москва', chapter: 'Глава 1', x: 58, y: 28, status: 'current' },
  { name: 'Сибирь', chapter: 'Глава 2', x: 70, y: 22, status: 'locked' },
  { name: 'Египет', chapter: 'Глава 3', x: 52, y: 50, status: 'locked' },
  { name: 'Амазония', chapter: 'Глава 4', x: 28, y: 58, status: 'locked' },
  { name: 'Антарктида', chapter: 'Глава 5', x: 45, y: 88, status: 'locked' },
  { name: 'Тибет', chapter: 'Глава 6', x: 72, y: 42, status: 'locked' },
  { name: 'Орбита', chapter: 'Финал', x: 50, y: 8, status: 'locked' },
];

// ===== KEYBOARD INPUT =====
const keys = { up: false, down: false, left: false, right: false, e: false, esc: false, m: false };

document.addEventListener('keydown', e => {
  switch(e.key) {
    case 'w': case 'W': case 'ArrowUp':    keys.up    = true; break;
    case 's': case 'S': case 'ArrowDown':  keys.down  = true; break;
    case 'a': case 'A': case 'ArrowLeft':  keys.left  = true; break;
    case 'd': case 'D': case 'ArrowRight': keys.right = true; break;
    case 'e': case 'E': handleInteract(); break;
    case 'Escape': togglePause(); break;
    case 'm': case 'M': if (GameState.currentScreen === 'game') showMap(); break;
  }
});

document.addEventListener('keyup', e => {
  switch(e.key) {
    case 'w': case 'W': case 'ArrowUp':    keys.up    = false; break;
    case 's': case 'S': case 'ArrowDown':  keys.down  = false; break;
    case 'a': case 'A': case 'ArrowLeft':  keys.left  = false; break;
    case 'd': case 'D': case 'ArrowRight': keys.right = false; break;
  }
});

// ===== SCREEN MANAGEMENT =====
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id + 'Screen').classList.add('active');
  GameState.currentScreen = id;
}

function showMenu() {
  document.getElementById('pauseMenu').classList.remove('show');
  GameState.paused = false;
  stopGameLoop();
  showScreen('menu');
}

function showMap() {
  if (GameState.currentScreen === 'game') {
    stopGameLoop();
  }
  renderMap();
  showScreen('map');
}

function showBattlepass() {
  document.getElementById('pauseMenu').classList.remove('show');
  GameState.paused = false;
  if (GameState.currentScreen === 'game') stopGameLoop();
  renderBattlepass();
  showScreen('battlepass');
}

function showCredits() {
  showNotification('OneGames Platform — onegames.base44.app', 4000);
  setTimeout(() => {
    alert('🎮 ASTRA — Девочка и Земля\n\nСоздано для OneGames Platform\nonegames.base44.app\n\nВдохновлено игрой PRAGMATA (Capcom)\n\nВерсия 1.0 | Сезон 1');
  }, 500);
}

// ===== STORY SCREEN =====
let storyChapterIdx = 0;
let storyTextIdx = 0;

function startStory() {
  storyChapterIdx = 0;
  storyTextIdx = 0;
  renderStory();
  showScreen('story');
}

function renderStory() {
  const chap = STORY_CHAPTERS[storyChapterIdx];
  if (!chap) {
    // All story done, start game
    startGame();
    return;
  }
  document.getElementById('storyChapter').textContent = chap.chapter;

  const el = document.getElementById('storyText');
  el.style.opacity = '0';
  el.style.animation = 'none';
  el.textContent = chap.texts[storyTextIdx];
  void el.offsetWidth;
  el.style.animation = 'fadeIn 2s forwards 0.5s';

  const btn = document.getElementById('storyContinueBtn');
  btn.style.opacity = '0';
  btn.style.animation = 'none';
  void btn.offsetWidth;
  btn.style.animation = 'fadeIn 1s forwards 3s';
}

function continueStory() {
  const chap = STORY_CHAPTERS[storyChapterIdx];
  storyTextIdx++;
  if (storyTextIdx >= chap.texts.length) {
    storyChapterIdx++;
    storyTextIdx = 0;
    if (storyChapterIdx >= STORY_CHAPTERS.length) {
      startGame();
      return;
    }
  }
  renderStory();
}

// ===== MAP RENDERING =====
function renderMap() {
  const container = document.getElementById('worldMap');
  container.innerHTML = '';

  // Simple world map background (continents outline)
  const mapBg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  mapBg.setAttribute('viewBox', '0 0 100 100');
  mapBg.setAttribute('width', '100%');
  mapBg.setAttribute('height', '100%');
  mapBg.style.position = 'absolute';
  mapBg.style.inset = '0';
  mapBg.style.opacity = '0.15';

  // Simple continent shapes
  const continents = [
    'M 15 20 Q 25 15 30 25 Q 35 30 28 38 Q 20 42 15 35 Z', // Americas rough
    'M 48 20 Q 58 18 62 28 Q 65 35 58 42 Q 50 45 45 38 Q 43 30 48 20 Z', // Europe/Africa
    'M 65 22 Q 80 20 88 30 Q 85 40 78 45 Q 70 48 65 40 Q 62 30 65 22 Z', // Asia
    'M 75 55 Q 85 52 88 60 Q 86 68 80 70 Q 73 68 72 62 Z', // Australia
    'M 30 80 Q 55 78 60 88 Q 50 95 35 92 Q 25 88 30 80 Z', // Antarctica
  ];

  continents.forEach(d => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'rgba(0,212,255,0.4)');
    path.setAttribute('stroke', 'rgba(0,212,255,0.6)');
    path.setAttribute('stroke-width', '0.5');
    mapBg.appendChild(path);
  });

  // Grid lines
  for (let i = 0; i <= 10; i++) {
    const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    hLine.setAttribute('x1', '0'); hLine.setAttribute('y1', i * 10);
    hLine.setAttribute('x2', '100'); hLine.setAttribute('y2', i * 10);
    hLine.setAttribute('stroke', 'rgba(0,212,255,0.1)'); hLine.setAttribute('stroke-width', '0.3');
    mapBg.appendChild(hLine);

    const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    vLine.setAttribute('x1', i * 10); vLine.setAttribute('y1', '0');
    vLine.setAttribute('x2', i * 10); vLine.setAttribute('y2', '100');
    vLine.setAttribute('stroke', 'rgba(0,212,255,0.1)'); vLine.setAttribute('stroke-width', '0.3');
    mapBg.appendChild(vLine);
  }

  container.appendChild(mapBg);

  MAP_LOCATIONS.forEach((loc, i) => {
    const isUnlocked = GameState.mapUnlocked.includes(i);
    const isCompleted = GameState.mapCompleted.includes(i);

    const el = document.createElement('div');
    el.className = 'map-location';
    el.style.left = loc.x + '%';
    el.style.top = loc.y + '%';
    el.style.transform = 'translate(-50%, -50%)';

    const dot = document.createElement('div');
    dot.className = 'map-dot' + (isCompleted ? ' completed' : isUnlocked ? '' : ' locked');

    const name = document.createElement('div');
    name.className = 'map-location-name';
    name.textContent = loc.name;
    name.style.color = isCompleted ? 'var(--gold)' : isUnlocked ? '#fff' : 'rgba(255,255,255,0.3)';

    const chap = document.createElement('div');
    chap.className = 'map-location-chapter';
    chap.textContent = loc.chapter;

    el.appendChild(dot);
    el.appendChild(name);
    el.appendChild(chap);

    if (isUnlocked) {
      el.onclick = () => {
        showNotification(`Переход: ${loc.name} — ${loc.chapter}`);
        setTimeout(() => startGame(), 1500);
      };
    }

    container.appendChild(el);
  });
}

// ===== BATTLE PASS RENDERING =====
function renderBattlepass() {
  document.getElementById('bpLevelDisplay').textContent = GameState.bpLevel;
  const xpPct = (GameState.bpXp / GameState.bpXpNeeded) * 100;
  document.getElementById('bpXpFill').style.width = xpPct + '%';
  document.getElementById('bpXpText').textContent = `${GameState.bpXp} / ${GameState.bpXpNeeded} XP`;

  const container = document.getElementById('bpTracks');
  container.innerHTML = '';

  BP_REWARDS.forEach((reward, i) => {
    const track = document.createElement('div');
    track.className = 'bp-track';

    const levelNum = document.createElement('div');
    levelNum.className = 'bp-level-num';
    levelNum.textContent = `LVL ${reward.level}`;
    track.appendChild(levelNum);

    // Free reward
    const freeDiv = createRewardCard(reward.free, false, i < GameState.bpLevel);
    track.appendChild(freeDiv);

    // Premium reward
    const premDiv = createRewardCard(reward.premium, true, i < GameState.bpLevel && GameState.hasPremiumPass);
    track.appendChild(premDiv);

    // Connector line
    if (i < BP_REWARDS.length - 1) {
      const line = document.createElement('div');
      line.style.cssText = 'width:2px;height:20px;background:var(--border);margin:0 auto;';
      // add before next
    }

    container.appendChild(track);
  });
}

function createRewardCard(reward, isPremium, isUnlocked) {
  const div = document.createElement('div');
  div.className = 'bp-reward' + (isPremium ? ' premium' : '') + (isUnlocked ? ' unlocked' : ' locked');

  const tag = document.createElement('div');
  tag.className = isPremium ? 'bp-tag-premium' : 'bp-tag-free';
  tag.textContent = isPremium ? 'PREM' : 'FREE';
  div.appendChild(tag);

  const icon = document.createElement('div');
  icon.className = 'bp-reward-icon';
  icon.textContent = isUnlocked ? reward.icon : '🔒';
  div.appendChild(icon);

  const name = document.createElement('div');
  name.className = 'bp-reward-name';
  name.textContent = reward.name;
  div.appendChild(name);

  div.onclick = () => {
    if (isUnlocked) {
      showNotification(`Награда: ${reward.name} получена!`);
    } else if (isPremium && !GameState.hasPremiumPass) {
      showNotification('Купите Premium Pass чтобы получить!');
    } else {
      showNotification(`Достигните уровня ${BP_REWARDS.findIndex(r => r.free === reward || r.premium === reward) + 1} Battle Pass`);
    }
  };

  return div;
}

function buyBattlepass() {
  if (GameState.hasPremiumPass) {
    showNotification('У вас уже есть Premium Pass!');
    return;
  }
  // Simulate purchase flow
  if (confirm('Купить Premium Battle Pass за 950 ⭐?\n\nВсе премиум награды станут доступны!\nОплата через OneGames Platform.')) {
    GameState.hasPremiumPass = true;
    showNotification('⭐ Premium Pass активирован! Все награды разблокированы!');
    renderBattlepass();
  }
}

// ===== 3D GAME ENGINE =====
let canvas, ctx;
let gameLoop = null;
let lastTime = 0;

// Player
const player = {
  x: 0, y: 0, z: 5,
  velX: 0, velZ: 0,
  angle: 0,
  speed: 3,
  height: 0,
  bobPhase: 0,
  animFrame: 0,
  animTimer: 0,
};

// Camera
const camera = {
  x: 0, y: 1.8, z: 0,
  pitch: -0.15,
  fov: 75,
};

// Scene objects
let sceneObjects = [];
let particles = [];
let dialogScheduled = null;

function generateScene() {
  sceneObjects = [];

  // Ground
  // Buildings (ruins)
  const buildingPositions = [
    { x: -15, z: -20, w: 8, h: 25, d: 8, color: '#2a3040', damaged: 0.3 },
    { x: 10, z: -25, w: 10, h: 35, d: 10, color: '#253035', damaged: 0.5 },
    { x: -8, z: -35, w: 6, h: 18, d: 6, color: '#2a2535', damaged: 0.7 },
    { x: 20, z: -15, w: 7, h: 22, d: 7, color: '#1a2535', damaged: 0.2 },
    { x: -25, z: -18, w: 12, h: 28, d: 9, color: '#202a30', damaged: 0.6 },
    { x: 30, z: -30, w: 9, h: 40, d: 9, color: '#1a2030', damaged: 0.4 },
    { x: -30, z: -40, w: 15, h: 15, d: 12, color: '#252030', damaged: 0.8 },
    { x: 5, z: -50, w: 8, h: 30, d: 8, color: '#202530', damaged: 0.3 },
  ];

  buildingPositions.forEach(b => {
    sceneObjects.push({ type: 'building', ...b });
  });

  // Collectibles
  const collectiblePositions = [
    { x: -5, z: -12, collected: false },
    { x: 8, z: -18, collected: false },
    { x: -12, z: -22, collected: false },
    { x: 3, z: -30, collected: false },
    { x: 15, z: -25, collected: false },
  ];

  collectiblePositions.forEach(c => {
    sceneObjects.push({ type: 'collectible', ...c, y: 0, bobOffset: Math.random() * Math.PI * 2 });
  });

  // Beacon (main objective)
  sceneObjects.push({ type: 'beacon', x: 0, z: -40, y: 0, activated: false });

  // Debris / environmental
  for (let i = 0; i < 20; i++) {
    sceneObjects.push({
      type: 'debris',
      x: (Math.random() - 0.5) * 60,
      z: -(Math.random() * 50 + 5),
      size: Math.random() * 1.5 + 0.5,
      color: Math.random() > 0.5 ? '#3a3a3a' : '#2a3a2a'
    });
  }

  // Trees (overgrown)
  for (let i = 0; i < 15; i++) {
    sceneObjects.push({
      type: 'tree',
      x: (Math.random() - 0.5) * 70,
      z: -(Math.random() * 60 + 5),
      height: Math.random() * 4 + 3,
    });
  }

  // Danger zone
  sceneObjects.push({ type: 'danger', x: -18, z: -28, radius: 5, active: true });
}

function startGame() {
  player.x = 0;
  player.z = 0;
  player.angle = 0;
  camera.y = 1.8;

  generateScene();
  particles = [];

  showScreen('game');
  document.getElementById('pauseMenu').classList.remove('show');
  GameState.paused = false;

  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  resizeCanvas();

  // Show initial dialog
  setTimeout(() => {
    showDialog(STORY_DIALOGS.spawn);
  }, 2000);

  window.removeEventListener('resize', resizeCanvas);
  window.addEventListener('resize', resizeCanvas);

  if (gameLoop) cancelAnimationFrame(gameLoop);
  lastTime = performance.now();
  requestAnimationFrame(gameFrame);
}

function stopGameLoop() {
  if (gameLoop) {
    cancelAnimationFrame(gameLoop);
    gameLoop = null;
  }
}

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// ===== RENDER ENGINE (Raycasting-style pseudo-3D) =====
function gameFrame(timestamp) {
  if (GameState.currentScreen !== 'game') return;

  const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
  lastTime = timestamp;

  if (!GameState.paused) {
    update(dt);
  }

  render();
  gameLoop = requestAnimationFrame(gameFrame);
}

function update(dt) {
  // Movement
  const speed = player.speed * dt;
  let moved = false;

  if (keys.up) {
    player.x += Math.sin(player.angle) * speed;
    player.z -= Math.cos(player.angle) * speed;
    moved = true;
  }
  if (keys.down) {
    player.x -= Math.sin(player.angle) * speed * 0.6;
    player.z += Math.cos(player.angle) * speed * 0.6;
    moved = true;
  }
  if (keys.left) {
    player.angle -= 1.8 * dt;
  }
  if (keys.right) {
    player.angle += 1.8 * dt;
  }

  // Bobbing
  if (moved) {
    player.bobPhase += dt * 8;
    player.animTimer += dt;
    if (player.animTimer > 0.3) {
      player.animFrame = (player.animFrame + 1) % 4;
      player.animTimer = 0;
    }
  } else {
    player.bobPhase = 0;
    player.animFrame = 0;
  }

  camera.x = player.x;
  camera.z = player.z;
  camera.y = 1.8 + Math.sin(player.bobPhase) * 0.05;

  // Collision with buildings
  sceneObjects.forEach(obj => {
    if (obj.type === 'building') {
      const dx = player.x - obj.x;
      const dz = player.z - obj.z;
      const hw = obj.w / 2 + 0.8;
      const hd = obj.d / 2 + 0.8;
      if (Math.abs(dx) < hw && Math.abs(dz) < hd) {
        if (Math.abs(dx) < Math.abs(dz)) player.z -= dz > 0 ? (hd - Math.abs(dz)) : -(hd - Math.abs(dz));
        else player.x -= dx > 0 ? (hw - Math.abs(dx)) : -(hw - Math.abs(dx));
      }
    }
  });

  // Check collectibles
  sceneObjects.forEach(obj => {
    if (obj.type === 'collectible' && !obj.collected) {
      const dx = player.x - obj.x;
      const dz = player.z - obj.z;
      if (Math.sqrt(dx*dx + dz*dz) < 1.5) {
        obj.collected = true;
        GameState.collectibles++;
        gainXP(15, 'Артефакт');
        showNotification(`✨ Артефакт собран! +15 XP (${GameState.collectibles}/5)`);
        spawnParticles(obj.x, 1, obj.z, '#ffd700', 15);
      }
    }
  });

  // Check beacon
  sceneObjects.forEach(obj => {
    if (obj.type === 'beacon' && !obj.activated) {
      const dx = player.x - obj.x;
      const dz = player.z - obj.z;
      if (Math.sqrt(dx*dx + dz*dz) < 3) {
        obj.activated = true;
        GameState.mapCompleted.push(0);
        gainXP(50, 'Маяк');
        showNotification('📡 МАЯК АКТИВИРОВАН! +50 XP', 4000);
        showDialog(STORY_DIALOGS.beacon);
        spawnParticles(obj.x, 2, obj.z, '#00d4ff', 40);
      }
    }
  });

  // Danger zone
  sceneObjects.forEach(obj => {
    if (obj.type === 'danger' && obj.active) {
      const dx = player.x - obj.x;
      const dz = player.z - obj.z;
      if (Math.sqrt(dx*dx + dz*dz) < obj.radius) {
        GameState.health = Math.max(0, GameState.health - 5 * dt);
        document.getElementById('healthFill').style.width = GameState.health + '%';
        if (Math.random() < 0.01) showNotification('⚠️ Опасная зона! Покиньте немедленно!');
      }
    }
  });

  // Update particles
  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.z += p.vz * dt;
    p.vy -= 2 * dt; // gravity
    p.life -= dt;
  });

  // Update bobbing on collectibles
  sceneObjects.forEach(obj => {
    if (obj.type === 'collectible' && !obj.collected) {
      obj.y = Math.sin(performance.now() / 800 + obj.bobOffset) * 0.3 + 0.5;
    }
  });

  // Update compass
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const normalized = ((player.angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const idx = Math.round(normalized / (Math.PI / 4)) % 8;
  document.getElementById('hudCompass').textContent = dirs[idx];
}

function render() {
  if (!ctx) return;
  const W = canvas.width;
  const H = canvas.height;

  // Sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.6);
  skyGrad.addColorStop(0, '#020508');
  skyGrad.addColorStop(0.4, '#041020');
  skyGrad.addColorStop(0.7, '#061828');
  skyGrad.addColorStop(1, '#0a2030');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, H);

  // Stars
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  for (let i = 0; i < 80; i++) {
    const sx = (Math.sin(i * 2.3 + player.angle * 0.3) * 0.5 + 0.5) * W;
    const sy = (Math.cos(i * 1.7) * 0.5 + 0.5) * (H * 0.55);
    const ss = i % 5 === 0 ? 1.5 : 0.8;
    ctx.beginPath();
    ctx.arc(sx, sy, ss, 0, Math.PI * 2);
    ctx.fill();
  }

  // Atmospheric glow on horizon
  const horizonGrad = ctx.createLinearGradient(0, H * 0.45, 0, H * 0.55);
  horizonGrad.addColorStop(0, 'transparent');
  horizonGrad.addColorStop(0.5, 'rgba(0,100,200,0.15)');
  horizonGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = horizonGrad;
  ctx.fillRect(0, 0, W, H * 0.55);

  // Ground
  const groundGrad = ctx.createLinearGradient(0, H * 0.55, 0, H);
  groundGrad.addColorStop(0, '#0a1a10');
  groundGrad.addColorStop(0.3, '#0d1f14');
  groundGrad.addColorStop(1, '#152518');
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, H * 0.55, W, H);

  // Ground grid
  ctx.strokeStyle = 'rgba(0,212,255,0.06)';
  ctx.lineWidth = 1;
  const horizon = H * 0.55;
  for (let i = 0; i < 15; i++) {
    const t = i / 14;
    const y = horizon + t * (H - horizon);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  for (let i = -10; i <= 10; i++) {
    const screenX = W / 2 + (i * 80 - (player.angle * 200) % 80) * 2;
    if (screenX < -W || screenX > W * 2) continue;
    ctx.beginPath();
    ctx.moveTo(W / 2, horizon);
    ctx.lineTo(W / 2 + (screenX - W / 2) * 3, H);
    ctx.stroke();
  }

  // Sort and render scene objects
  const objsToRender = sceneObjects
    .map(obj => {
      const dx = obj.x - camera.x;
      const dz = obj.z - camera.z;
      const cos = Math.cos(-player.angle);
      const sin = Math.sin(-player.angle);
      const rx = dx * cos - dz * sin;
      const rz = dx * sin + dz * cos;
      return { ...obj, rx, rz, dist: Math.sqrt(dx*dx + dz*dz) };
    })
    .filter(obj => obj.rz < -0.5)
    .sort((a, b) => b.dist - a.dist);

  objsToRender.forEach(obj => renderObject(obj, W, H));

  // Render player character (Astra - third person view from behind)
  renderPlayer(W, H);

  // Render particles
  particles.forEach(p => {
    const dx = p.x - camera.x;
    const dz = p.z - camera.z;
    const cos = Math.cos(-player.angle);
    const sin = Math.sin(-player.angle);
    const rx = dx * cos - dz * sin;
    const rz = dx * sin + dz * cos;
    if (rz >= -0.5) return;

    const scale = 200 / (-rz);
    const sx = W / 2 + rx * scale;
    const sy = H * 0.55 - (p.y - camera.y) * scale;
    const sr = Math.max(1, 4 * scale / 100);

    ctx.globalAlpha = p.life * 0.8;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.globalAlpha = 1;

  // Vignette
  const vigGrad = ctx.createRadialGradient(W/2, H/2, H*0.3, W/2, H/2, H*0.8);
  vigGrad.addColorStop(0, 'transparent');
  vigGrad.addColorStop(1, 'rgba(0,0,10,0.5)');
  ctx.fillStyle = vigGrad;
  ctx.fillRect(0, 0, W, H);

  // Scanlines
  ctx.fillStyle = 'rgba(0,0,0,0.03)';
  for (let y = 0; y < H; y += 3) {
    ctx.fillRect(0, y, W, 1);
  }

  // Health damage flash
  if (GameState.health < 30) {
    ctx.fillStyle = `rgba(255,0,0,${(30 - GameState.health) / 100 * 0.15})`;
    ctx.fillRect(0, 0, W, H);
  }
}

function renderObject(obj, W, H) {
  const horizon = W / 2; // screen center x
  const vertCenter = canvas.height * 0.55;
  const scale = 200 / (-obj.rz);
  const sx = W / 2 + obj.rx * scale;
  const sy = vertCenter;

  if (sx < -W || sx > W * 2) return;

  switch (obj.type) {
    case 'building': renderBuilding(obj, sx, sy, scale, W, canvas.height); break;
    case 'collectible': if (!obj.collected) renderCollectible(obj, sx, sy, scale, canvas.height); break;
    case 'beacon': if (!obj.activated) renderBeacon(obj, sx, sy, scale, canvas.height); break;
    case 'tree': renderTree(obj, sx, sy, scale, canvas.height); break;
    case 'debris': renderDebris(obj, sx, sy, scale); break;
    case 'danger': renderDanger(obj, sx, sy, scale, canvas.height); break;
  }
}

function renderBuilding(obj, sx, sy, scale, W, H) {
  const w = obj.w * scale;
  const h = obj.h * scale;
  const d = obj.d * scale;

  // Main face
  const brightness = Math.max(0.2, 1 - obj.dist / 60);
  ctx.fillStyle = shadeColor(obj.color, brightness);
  ctx.fillRect(sx - w/2, sy - h, w, h);

  // Side face (3D effect)
  ctx.fillStyle = shadeColor(obj.color, brightness * 0.6);
  ctx.beginPath();
  ctx.moveTo(sx + w/2, sy - h);
  ctx.lineTo(sx + w/2 + d*0.4, sy - h - d*0.2);
  ctx.lineTo(sx + w/2 + d*0.4, sy - d*0.2);
  ctx.lineTo(sx + w/2, sy);
  ctx.fill();

  // Top face
  ctx.fillStyle = shadeColor(obj.color, brightness * 0.4);
  ctx.beginPath();
  ctx.moveTo(sx - w/2, sy - h);
  ctx.lineTo(sx + w/2, sy - h);
  ctx.lineTo(sx + w/2 + d*0.4, sy - h - d*0.2);
  ctx.lineTo(sx - w/2 + d*0.4, sy - h - d*0.2);
  ctx.fill();

  // Windows (glowing)
  const winCols = Math.max(1, Math.floor(obj.w / 2));
  const winRows = Math.max(1, Math.floor(obj.h / 4));
  for (let c = 0; c < winCols; c++) {
    for (let r = 0; r < winRows; r++) {
      if (Math.random() < obj.damaged) continue; // damaged = broken windows
      const wx = sx - w/2 + (c + 0.5) * (w / winCols);
      const wy = sy - h + (r + 0.5) * (h / winRows);
      const isLit = (c * 3 + r * 7 + Math.floor(performance.now() / 2000)) % 5 === 0;
      ctx.fillStyle = isLit ? 'rgba(100,200,255,0.6)' : 'rgba(0,20,40,0.8)';
      ctx.fillRect(wx - 3, wy - 4, 6, 8);
    }
  }

  // Damage cracks
  if (obj.damaged > 0.4 && scale > 3) {
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sx - w*0.2, sy - h*0.6);
    ctx.lineTo(sx + w*0.1, sy - h*0.3);
    ctx.lineTo(sx - w*0.05, sy - h*0.1);
    ctx.stroke();
  }
}

function renderCollectible(obj, sx, sy, scale, H) {
  const size = scale * 0.6;
  const pulse = Math.sin(performance.now() / 400) * 0.2 + 1;
  const screenY = sy - (obj.y - 0) * scale;

  // Glow
  const grd = ctx.createRadialGradient(sx, screenY, 0, sx, screenY, size * 2 * pulse);
  grd.addColorStop(0, 'rgba(255,215,0,0.6)');
  grd.addColorStop(1, 'transparent');
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(sx, screenY, size * 2 * pulse, 0, Math.PI * 2);
  ctx.fill();

  // Crystal shape
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.moveTo(sx, screenY - size);
  ctx.lineTo(sx + size * 0.7, screenY);
  ctx.lineTo(sx, screenY + size * 0.5);
  ctx.lineTo(sx - size * 0.7, screenY);
  ctx.closePath();
  ctx.fill();

  // Inner shine
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.beginPath();
  ctx.moveTo(sx, screenY - size * 0.6);
  ctx.lineTo(sx + size * 0.3, screenY - size * 0.1);
  ctx.lineTo(sx, screenY + size * 0.1);
  ctx.lineTo(sx - size * 0.3, screenY - size * 0.1);
  ctx.closePath();
  ctx.fill();

  // Label
  if (scale > 5) {
    ctx.fillStyle = 'rgba(255,215,0,0.8)';
    ctx.font = `${Math.floor(10 * scale/20)}px Orbitron`;
    ctx.textAlign = 'center';
    ctx.fillText('[ E ]', sx, screenY - size - 5);
  }
}

function renderBeacon(obj, sx, sy, scale, H) {
  const size = scale * 1.2;
  const screenY = sy;
  const pulse = Math.sin(performance.now() / 600) * 0.3 + 1;

  // Beacon tower
  ctx.fillStyle = '#1a4a6a';
  ctx.fillRect(sx - size*0.3, screenY - size*2, size*0.6, size*2);

  // Pulsing top
  const grd = ctx.createRadialGradient(sx, screenY - size*2, 0, sx, screenY - size*2, size * pulse * 1.5);
  grd.addColorStop(0, 'rgba(0,212,255,0.9)');
  grd.addColorStop(0.3, 'rgba(0,212,255,0.5)');
  grd.addColorStop(1, 'transparent');
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(sx, screenY - size*2, size * pulse * 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Beam upward
  const beamGrad = ctx.createLinearGradient(sx, screenY - size*2, sx, 0);
  beamGrad.addColorStop(0, 'rgba(0,212,255,0.4)');
  beamGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = beamGrad;
  ctx.fillRect(sx - 3, 0, 6, screenY - size*2);

  // Label
  if (scale > 3) {
    ctx.fillStyle = 'rgba(0,212,255,0.9)';
    ctx.font = `bold ${Math.floor(12 * scale/20)}px Orbitron`;
    ctx.textAlign = 'center';
    ctx.fillText('МАЯК CRADLE', sx, screenY - size*2 - 10);
    if (scale > 6) ctx.fillText('[ E — Активировать ]', sx, screenY - size*2 - 25);
  }
}

function renderTree(obj, sx, sy, scale, H) {
  const h = obj.height * scale;
  const trunkH = h * 0.35;

  // Trunk
  ctx.fillStyle = '#2a1a0a';
  ctx.fillRect(sx - scale*0.15, sy - trunkH, scale*0.3, trunkH);

  // Foliage - overgrown, mutated
  ctx.fillStyle = '#0a2a10';
  ctx.beginPath();
  ctx.arc(sx, sy - trunkH - h*0.25, h*0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0d3a15';
  ctx.beginPath();
  ctx.arc(sx - h*0.1, sy - trunkH - h*0.4, h*0.25, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#143a1a';
  ctx.beginPath();
  ctx.arc(sx + h*0.1, sy - trunkH - h*0.5, h*0.2, 0, Math.PI * 2);
  ctx.fill();

  // Glowing spores
  if (scale > 3 && Math.sin(performance.now() / 1000 + obj.x) > 0.5) {
    ctx.fillStyle = 'rgba(0,255,100,0.3)';
    ctx.beginPath();
    ctx.arc(sx + Math.sin(performance.now()/400)*h*0.2, sy - trunkH - h*0.6, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function renderDebris(obj, sx, sy, scale) {
  const s = obj.size * scale * 0.4;
  ctx.fillStyle = obj.color;
  ctx.beginPath();
  ctx.moveTo(sx, sy - s);
  ctx.lineTo(sx + s*0.8, sy - s*0.3);
  ctx.lineTo(sx + s*0.5, sy);
  ctx.lineTo(sx - s*0.6, sy);
  ctx.lineTo(sx - s*0.9, sy - s*0.5);
  ctx.closePath();
  ctx.fill();
}

function renderDanger(obj, sx, sy, scale, H) {
  // Red zone indicator
  const size = obj.radius * scale * 0.8;
  const alpha = (Math.sin(performance.now() / 300) * 0.3 + 0.4);
  ctx.strokeStyle = `rgba(255,50,50,${alpha})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(sx, sy, size, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = `rgba(255,0,0,${alpha * 0.1})`;
  ctx.beginPath();
  ctx.arc(sx, sy, size, 0, Math.PI * 2);
  ctx.fill();

  if (scale > 4) {
    ctx.fillStyle = `rgba(255,50,50,${alpha})`;
    ctx.font = '12px Orbitron';
    ctx.textAlign = 'center';
    ctx.fillText('⚠ ОПАСНО', sx, sy - size - 5);
  }
}

function shadeColor(hex, brightness) {
  // Parse hex to rgb and apply brightness
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return `rgba(${Math.floor(r*brightness)},${Math.floor(g*brightness)},${Math.floor(b*brightness)},1)`;
}

// ===== RENDER PLAYER (ASTRA) =====
function renderPlayer(W, H) {
  // Third-person view: Astra is rendered at bottom center of screen
  const playerX = W / 2;
  const playerY = H * 0.85;
  const playerScale = Math.min(W, H) * 0.0025;
  
  // Bobbing animation when moving
  const bobOffset = Math.sin(player.bobPhase) * 3;
  
  // Leg animation based on movement
  const legSwing = player.animFrame * 0.3;
  
  // Body shadow/glow
  const bodyGlow = ctx.createRadialGradient(playerX, playerY - 60 * playerScale, 0, playerX, playerY - 60 * playerScale, 80 * playerScale);
  bodyGlow.addColorStop(0, 'rgba(0,212,255,0.15)');
  bodyGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = bodyGlow;
  ctx.beginPath();
  ctx.arc(playerX, playerY - 60 * playerScale, 80 * playerScale, 0, Math.PI * 2);
  ctx.fill();
  
  // Legs (animated)
  const legWidth = 14 * playerScale;
  const legHeight = 50 * playerScale;
  const legGap = 18 * playerScale;
  
  // Left leg
  ctx.fillStyle = '#1a1a3a';
  ctx.save();
  ctx.translate(playerX - legGap/2, playerY - 20 * playerScale);
  ctx.rotate(Math.sin(legSwing) * 0.3);
  ctx.fillRect(-legWidth/2, -legHeight, legWidth, legHeight);
  ctx.restore();
  
  // Right leg
  ctx.save();
  ctx.translate(playerX + legGap/2, playerY - 20 * playerScale);
  ctx.rotate(Math.sin(legSwing + Math.PI) * 0.3);
  ctx.fillRect(-legWidth/2, -legHeight, legWidth, legHeight);
  ctx.restore();
  
  // Boots
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.roundRect(playerX - legGap/2 - legWidth/2 - 2*playerScale, playerY - 22 * playerScale, legWidth + 4*playerScale, 14 * playerScale, 3*playerScale);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(playerX + legGap/2 - legWidth/2 - 2*playerScale, playerY - 22 * playerScale, legWidth + 4*playerScale, 14 * playerScale, 3*playerScale);
  ctx.fill();
  
  // Body (blue jacket with hood)
  const bodyWidth = 50 * playerScale;
  const bodyHeight = 70 * playerScale;
  
  // Jacket gradient
  const jacketGrad = ctx.createLinearGradient(playerX - bodyWidth/2, playerY - 90 * playerScale, playerX + bodyWidth/2, playerY - 20 * playerScale);
  jacketGrad.addColorStop(0, '#2266ee');
  jacketGrad.addColorStop(1, '#1a5acc');
  ctx.fillStyle = jacketGrad;
  
  // Main body shape
  ctx.beginPath();
  ctx.roundRect(playerX - bodyWidth/2, playerY - 90 * playerScale - bobOffset, bodyWidth, bodyHeight, 10 * playerScale);
  ctx.fill();
  
  // Jacket details - zipper
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 2 * playerScale;
  ctx.beginPath();
  ctx.moveTo(playerX, playerY - 85 * playerScale - bobOffset);
  ctx.lineTo(playerX, playerY - 35 * playerScale - bobOffset);
  ctx.stroke();
  
  // Jacket buttons
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.beginPath();
  ctx.arc(playerX, playerY - 65 * playerScale - bobOffset, 3 * playerScale, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(playerX, playerY - 50 * playerScale - bobOffset, 3 * playerScale, 0, Math.PI * 2);
  ctx.fill();
  
  // Arms (slight swing animation)
  const armWidth = 12 * playerScale;
  const armLength = 45 * playerScale;
  const armAngle = Math.sin(legSwing) * 0.2;
  
  // Left arm
  ctx.fillStyle = '#2266ee';
  ctx.save();
  ctx.translate(playerX - bodyWidth/2 - armWidth/2, playerY - 85 * playerScale - bobOffset);
  ctx.rotate(armAngle - 0.1);
  ctx.beginPath();
  ctx.roundRect(-armWidth/2, 0, armWidth, armLength, 6 * playerScale);
  ctx.fill();
  ctx.restore();
  
  // Right arm
  ctx.save();
  ctx.translate(playerX + bodyWidth/2 + armWidth/2, playerY - 85 * playerScale - bobOffset);
  ctx.rotate(-armAngle + 0.1);
  ctx.beginPath();
  ctx.roundRect(-armWidth/2, 0, armWidth, armLength, 6 * playerScale);
  ctx.fill();
  ctx.restore();
  
  // Holographic wrist device (left hand)
  ctx.fillStyle = '#00d4ff';
  ctx.beginPath();
  ctx.roundRect(playerX - bodyWidth/2 - armWidth/2 - 3*playerScale, playerY - 55 * playerScale - bobOffset + armAngle * 20 * playerScale, 8 * playerScale, 6 * playerScale, 2 * playerScale);
  ctx.fill();
  
  // Device glow
  const deviceGlow = ctx.createRadialGradient(
    playerX - bodyWidth/2 - armWidth/2, 
    playerY - 52 * playerScale - bobOffset + armAngle * 20 * playerScale, 
    0,
    playerX - bodyWidth/2 - armWidth/2, 
    playerY - 52 * playerScale - bobOffset + armAngle * 20 * playerScale, 
    15 * playerScale
  );
  deviceGlow.addColorStop(0, 'rgba(0,212,255,0.6)');
  deviceGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = deviceGlow;
  ctx.beginPath();
  ctx.arc(playerX - bodyWidth/2 - armWidth/2, playerY - 52 * playerScale - bobOffset + armAngle * 20 * playerScale, 15 * playerScale, 0, Math.PI * 2);
  ctx.fill();
  
  // Neck
  ctx.fillStyle = '#f4c896';
  ctx.beginPath();
  ctx.roundRect(playerX - 10 * playerScale, playerY - 100 * playerScale - bobOffset, 20 * playerScale, 15 * playerScale, 5 * playerScale);
  ctx.fill();
  
  // Head
  const headRadius = 28 * playerScale;
  ctx.fillStyle = '#f4c896';
  ctx.beginPath();
  ctx.arc(playerX, playerY - 110 * playerScale - bobOffset, headRadius, 0, Math.PI * 2);
  ctx.fill();
  
  // Hair (long blonde, flowing)
  const hairColor = '#d4a030';
  const hairHighlight = '#e0b040';
  
  // Back hair (flowing down)
  ctx.fillStyle = hairColor;
  ctx.beginPath();
  ctx.arc(playerX, playerY - 115 * playerScale - bobOffset, headRadius + 3 * playerScale, Math.PI, 0);
  ctx.lineTo(playerX + headRadius + 5 * playerScale, playerY - 70 * playerScale - bobOffset);
  ctx.lineTo(playerX - headRadius - 5 * playerScale, playerY - 70 * playerScale - bobOffset);
  ctx.closePath();
  ctx.fill();
  
  // Side hair strands
  ctx.beginPath();
  ctx.roundRect(playerX - headRadius - 8 * playerScale, playerY - 115 * playerScale - bobOffset, 12 * playerScale, 60 * playerScale, 6 * playerScale);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(playerX + headRadius - 4 * playerScale, playerY - 115 * playerScale - bobOffset, 12 * playerScale, 60 * playerScale, 6 * playerScale);
  ctx.fill();
  
  // Top hair
  ctx.fillStyle = hairHighlight;
  ctx.beginPath();
  ctx.ellipse(playerX, playerY - 120 * playerScale - bobOffset, headRadius + 2 * playerScale, headRadius * 0.6, 0, Math.PI, 0);
  ctx.fill();
  
  // Face features
  // Eyes
  ctx.fillStyle = '#2a1a0a';
  ctx.beginPath();
  ctx.ellipse(playerX - 8 * playerScale, playerY - 110 * playerScale - bobOffset, 4 * playerScale, 5 * playerScale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(playerX + 8 * playerScale, playerY - 110 * playerScale - bobOffset, 4 * playerScale, 5 * playerScale, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Eye highlights (sparkle)
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(playerX - 6 * playerScale, playerY - 112 * playerScale - bobOffset, 2 * playerScale, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(playerX + 10 * playerScale, playerY - 112 * playerScale - bobOffset, 2 * playerScale, 0, Math.PI * 2);
  ctx.fill();
  
  // Smile
  ctx.strokeStyle = '#c47050';
  ctx.lineWidth = 2 * playerScale;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(playerX, playerY - 105 * playerScale - bobOffset, 8 * playerScale, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.stroke();
  
  // Cheeks (rosy)
  ctx.fillStyle = 'rgba(255,150,100,0.25)';
  ctx.beginPath();
  ctx.arc(playerX - 12 * playerScale, playerY - 107 * playerScale - bobOffset, 5 * playerScale, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(playerX + 12 * playerScale, playerY - 107 * playerScale - bobOffset, 5 * playerScale, 0, Math.PI * 2);
  ctx.fill();
  
  // Hood outline (semi-transparent energy effect)
  ctx.strokeStyle = 'rgba(0,212,255,0.2)';
  ctx.lineWidth = 2 * playerScale;
  ctx.beginPath();
  ctx.arc(playerX, playerY - 115 * playerScale - bobOffset, headRadius + 8 * playerScale, Math.PI * 0.8, Math.PI * 2.2);
  ctx.stroke();
  
  // Floating particles around Astra
  const time = performance.now() / 1000;
  for (let i = 0; i < 5; i++) {
    const px = playerX + Math.sin(time * 2 + i * 1.5) * 40 * playerScale;
    const py = playerY - 80 * playerScale - bobOffset + Math.cos(time * 3 + i * 2) * 30 * playerScale;
    const pSize = (i % 3 + 1) * 1.5 * playerScale;
    
    ctx.fillStyle = i % 2 === 0 ? 'rgba(0,212,255,0.6)' : 'rgba(255,215,0,0.5)';
    ctx.beginPath();
    ctx.arc(px, py, pSize, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Name tag above head
  ctx.fillStyle = 'rgba(0,212,255,0.8)';
  ctx.font = `bold ${12 * playerScale}px Orbitron`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText('АСТРА', playerX, playerY - 155 * playerScale - bobOffset);
}

// ===== PARTICLES =====
function spawnParticles(x, y, z, color, count) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x, y, z, color,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 5 + 2,
      vz: (Math.random() - 0.5) * 4,
      life: Math.random() * 1.5 + 0.5,
    });
  }
}

// ===== XP & LEVELING =====
function gainXP(amount, source) {
  GameState.xp += amount;
  GameState.bpXp += Math.floor(amount * 0.5);

  const xpPct = Math.min(100, (GameState.xp / GameState.xpToNextLevel) * 100);
  const xpEl = document.getElementById('xpFill');
  const xpNumEl = document.getElementById('hudXp');
  if (xpEl) xpEl.style.width = xpPct + '%';
  if (xpNumEl) xpNumEl.textContent = GameState.xp;

  if (GameState.xp >= GameState.xpToNextLevel) {
    levelUp();
  }

  if (GameState.bpXp >= GameState.bpXpNeeded) {
    GameState.bpLevel++;
    GameState.bpXp -= GameState.bpXpNeeded;
    GameState.bpXpNeeded = Math.floor(GameState.bpXpNeeded * 1.1);
    showNotification(`⚡ Battle Pass: Уровень ${GameState.bpLevel}!`);
  }
}

function levelUp() {
  GameState.level++;
  GameState.xp -= GameState.xpToNextLevel;
  GameState.xpToNextLevel = Math.floor(GameState.xpToNextLevel * 1.5);
  GameState.health = 100;
  document.getElementById('healthFill').style.width = '100%';

  const lvlEl = document.getElementById('levelUp');
  document.getElementById('levelUpNum').textContent = `УРОВЕНЬ ${GameState.level}`;
  document.getElementById('levelUpReward').textContent = `+${GameState.level * 10} Battle Pass XP`;
  lvlEl.classList.add('show');

  gainXP(GameState.level * 10, 'Level Up Bonus');

  setTimeout(() => lvlEl.classList.remove('show'), 3000);
}

// ===== DIALOG SYSTEM =====
let dialogData = [];
let dialogIdx = 0;

function showDialog(dialogArray) {
  if (!dialogArray || dialogArray.length === 0) return;
  dialogData = dialogArray;
  dialogIdx = 0;
  GameState.inDialog = true;
  renderDialog();
}

function renderDialog() {
  const d = dialogData[dialogIdx];
  if (!d) { closeDialog(); return; }
  document.getElementById('dialogSpeaker').textContent = d.speaker;
  document.getElementById('dialogText').textContent = d.text;
  document.getElementById('dialog').classList.add('show');
}

function closeDialog() {
  document.getElementById('dialog').classList.remove('show');
  GameState.inDialog = false;
  dialogData = [];
  dialogIdx = 0;
}

function handleInteract() {
  if (GameState.inDialog) {
    dialogIdx++;
    if (dialogIdx >= dialogData.length) {
      closeDialog();
    } else {
      renderDialog();
    }
    return;
  }

  // Check nearby interactables
  sceneObjects.forEach(obj => {
    if (obj.type === 'collectible' && !obj.collected) {
      const dx = player.x - obj.x;
      const dz = player.z - obj.z;
      if (Math.sqrt(dx*dx + dz*dz) < 2.5) {
        obj.collected = true;
        GameState.collectibles++;
        gainXP(15, 'Артефакт');
        showNotification(`✨ Артефакт! +15 XP`);
        spawnParticles(obj.x, 1, obj.z, '#ffd700', 15);
        showDialog(STORY_DIALOGS.collectible);
      }
    }
    if (obj.type === 'beacon' && !obj.activated) {
      const dx = player.x - obj.x;
      const dz = player.z - obj.z;
      if (Math.sqrt(dx*dx + dz*dz) < 4) {
        obj.activated = true;
        GameState.mapCompleted.push(0);
        gainXP(50, 'Маяк');
        showNotification('📡 МАЯК АКТИВИРОВАН! +50 XP', 4000);
        showDialog(STORY_DIALOGS.beacon);
        spawnParticles(obj.x, 2, obj.z, '#00d4ff', 40);
      }
    }
  });
}

// ===== NOTIFICATIONS =====
let notifTimer = null;
function showNotification(msg, duration = 2500) {
  const el = document.getElementById('notification');
  el.textContent = msg;
  el.classList.add('show');
  if (notifTimer) clearTimeout(notifTimer);
  notifTimer = setTimeout(() => el.classList.remove('show'), duration);
}

// ===== PAUSE =====
function togglePause() {
  if (GameState.currentScreen !== 'game') return;
  GameState.paused = !GameState.paused;
  document.getElementById('pauseMenu').classList.toggle('show', GameState.paused);
}

// ===== INIT =====
window.addEventListener('load', () => {
  console.log('🌍 ASTRA — Девочка и Земля | OneGames Platform');
  console.log('Inspired by PRAGMATA (Capcom)');
});
