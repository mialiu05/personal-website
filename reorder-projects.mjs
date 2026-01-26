import fs from 'fs';

const path = 'constants.ts';
const s = fs.readFileSync(path, 'utf8');
const lines = s.split('\n');

const p1 = lines.slice(58, 176).join('\n');   // Wallpaper
const p2 = lines.slice(176, 308).join('\n');  // AI
const p3 = lines.slice(308, 397).join('\n');  // Design Guidelines
const p4 = lines.slice(397, 507).join('\n');  // Game

// New order: Game, AI, Wallpaper, Design Guidelines
// Game (was last): change "  }\n" before ]; to "  },"
// Design Guidelines (now last): change "  }," to "  }\n];"
const game = p4.replace(/\s*\}\s*$/, '  },');
const dg = p3.replace(/\s*\}\s*,\s*$/, '  }\n];');

const head = lines.slice(0, 58).join('\n');
const tail = lines.length > 508 ? lines.slice(508).join('\n') : '';
const out = head + '\n' + game + '\n' + p2 + '\n' + p1 + '\n' + dg + (tail ? '\n' + tail : '');
fs.writeFileSync(path, out);
console.log('OK: Game, AI, Wallpaper, Design Guidelines');
