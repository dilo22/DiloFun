const ADJECTIVES = [
  "Neon",
  "Turbo",
  "Silent",
  "Lucky",
  "Mystic",
  "Shadow",
  "Cosmic",
  "Hyper",
  "Quantum",
  "Nova",
  "Electric",
  "Frozen",
  "Crimson",
  "Golden",
  "Rapid",
  "Stormy",
  "Epic",
  "Radiant",
  "Atomic",
  "Phantom",
  "Lunar",
  "Solar",
  "Glitchy",
  "Wild",
  "Cyber",
  "Galactic",
  "Shiny",
  "Sneaky",
  "Thunder",
  "Velvet",
  "Funky",
  "Infinite",
  "Pixelated",
  "Magnetic",
  "Blazing",
  "Retro",
  "Dynamic",
  "Legendary",
  "Twilight",
  "Nebula",
  "ElectricBlue",
  "Cracked",
  "Ultra",
  "Prismatic",
  "Chromatic",
  "Floating",
  "Secret",
  "Whispering",
  "Hidden",
  "Radiant",
];

const NOUNS = [
  "Digit",
  "Pixel",
  "Hash",
  "Code",
  "Fox",
  "Ghost",
  "Spark",
  "Cipher",
  "Byte",
  "Vector",
  "Dragon",
  "Ninja",
  "Wizard",
  "Robot",
  "Comet",
  "Falcon",
  "Tiger",
  "Panther",
  "Samurai",
  "Voyager",
  "Rider",
  "Storm",
  "Blade",
  "Circuit",
  "Orb",
  "Matrix",
  "Golem",
  "Phoenix",
  "Raven",
  "Wolf",
  "Vortex",
  "Knight",
  "Glider",
  "Nomad",
  "Sentinel",
  "Hunter",
  "Explorer",
  "Pirate",
  "Pilot",
  "Architect",
  "Engine",
  "Beacon",
  "Catalyst",
  "Prism",
  "Echo",
  "Signal",
  "Portal",
  "Satellite",
  "Navigator",
  "Pulse",
];


export const generateRandomNickname = () => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const number = Math.floor(100 + Math.random() * 900);

  return `${adj}${noun}#${number}`;
};

export const createPlayer = (nickname, isAnonymous) => {
  const player = {
    playerId: crypto.randomUUID(),
    nickname,
    isAnonymous,
    createdAt: Date.now(),
  };

  localStorage.setItem('dilofun_player', JSON.stringify(player));
  return player;
};

export const getPlayer = () => {
  const stored = localStorage.getItem('dilofun_player');
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};