const {readFileSync, readdirSync, mkdirSync, writeFileSync} = process.getBuiltinModule("fs");
const {join} = process.getBuiltinModule("path");
const I = process.env.MAKEFUN_INPUT_DIR || "/input";
const O = process.env.MAKEFUN_OUTPUT_DIR || "/output";
function run(p, g) {
  const s = [], c = [], m = new Int32Array(256), o = [];
  let pc = 0, n = 0, k = 0;
  while (1) {
    if (n >= 1e6) return [o, 10];
    if (pc < 0 || pc >= p.length) return [o, 9];
    const op = p[pc];
    if (!(op <= 7 || (op >= 16 && op <= 30) || (op >= 32 && op <= 34) || (op >= 48 && op <= 52) || op === 64 || op === 65 || (op >= 80 && op <= 83))) return [o, 5];
    let L = 1;
    if (op === 1) L = 2; else if (op === 2) L = 5; else if (op >= 48 && op <= 51) L = 3;
    if (pc + L > p.length) return [o, 9];
    let a = 0, b = 0;
    if (op === 1 || op === 2 || op === 82) b = 1;
    else if (op === 4 || op === 23 || op === 27 || op === 64) { a = 1; b = 1; }
    else if (op === 6) { a = 2; b = 1; }
    else if (op === 3 || op === 80 || op === 81 || op === 83 || op === 49 || op === 50) a = 1;
    else if (op === 5) a = 2;
    else if (op === 7) a = 3;
    else if (op >= 16 && op <= 34) { a = 2; b = 1; }
    else if (op === 65) a = 2;
    if (s.length < a) return [o, 2];
    if (s.length - a + b > 256) return [o, 3];
    n++;
    const nx = pc + L, u = p[pc + 1] | (p[pc + 2] << 8), j = u >= 32768 ? u - 65536 : u;
    switch (op) {
      case 0: return [o, 0];
      case 1: { const v = p[pc + 1]; s.push(v > 127 ? v - 256 : v); break; }
      case 2: s.push(p.readInt32LE(pc + 1)); break;
      case 3: s.pop(); break;
      case 4: s.push(s[s.length - 1]); break;
      case 5: { const t = s[s.length - 1]; s[s.length - 1] = s[s.length - 2]; s[s.length - 2] = t; break; }
      case 6: s.push(s[s.length - 2]); break;
      case 7: { const t = s[s.length - 3]; s[s.length - 3] = s[s.length - 2]; s[s.length - 2] = s[s.length - 1]; s[s.length - 1] = t; break; }
      case 16: case 17: case 18: case 19: case 20: case 21: case 22: case 24: case 25: case 26: case 28: case 29: case 30: case 32: case 33: case 34: {
        const y = s.pop(), x = s.pop();
        let r = 0;
        if (op === 16) r = (x + y) | 0;
        else if (op === 17) r = (x - y) | 0;
        else if (op === 18) r = Math.imul(x, y);
        else if (op === 19) { if (!y) return [o, 4]; r = (x / y) | 0; }
        else if (op === 20) { if (!y) return [o, 4]; r = x % y; }
        else if (op === 21) { if (!y) return [o, 4]; r = ((x >>> 0) / (y >>> 0)) | 0; }
        else if (op === 22) { if (!y) return [o, 4]; r = ((x >>> 0) % (y >>> 0)) | 0; }
        else if (op === 24) r = x & y;
        else if (op === 25) r = x | y;
        else if (op === 26) r = x ^ y;
        else if (op === 28) r = x << y;
        else if (op === 29) r = x >> y;
        else if (op === 30) r = (x >>> y) | 0;
        else if (op === 32) r = x === y ? 1 : 0;
        else if (op === 33) r = x < y ? 1 : 0;
        else r = (x >>> 0) < (y >>> 0) ? 1 : 0;
        s.push(r); break; }
      case 23: s.push((-s.pop()) | 0); break;
      case 27: s.push(~s.pop()); break;
      case 48: pc = nx + j; continue;
      case 49: if (!s.pop()) { pc = nx + j; continue; } break;
      case 50: if (s.pop()) { pc = nx + j; continue; } break;
      case 51: if (c.length >= 64) return [o, 7]; c.push(nx); pc = u; continue;
      case 52: if (!c.length) return [o, 8]; pc = c.pop(); continue;
      case 64: { const q = s.pop(); if (q < 0 || q > 255) return [o, 6]; s.push(m[q]); break; }
      case 65: { const q = s.pop(), v = s.pop(); if (q < 0 || q > 255) return [o, 6]; m[q] = v; break; }
      case 80: { const t = String(s.pop()); if (o.length + t.length > 65536) return [o, 11]; for (let i = 0; i < t.length; i++) o.push(t.charCodeAt(i)); break; }
      case 81: if (o.length >= 65536) return [o, 11]; o.push(s.pop() & 255); break;
      case 82: s.push(k < g.length ? g[k++] : -1); break;
      case 83: return [o, s.pop() & 255];
    }
    pc = nx;
  }
}
for (const e of readdirSync(I, {withFileTypes: true}).sort((x, y) => x.name.localeCompare(y.name))) {
  if (!e.isDirectory()) continue;
  const d = join(I, e.name);
  let p, g;
  try { p = readFileSync(join(d, "program.bin")); } catch { p = Buffer.alloc(0); }
  try { g = readFileSync(join(d, "input.bin")); } catch { g = Buffer.alloc(0); }
  const [o, x] = run(p, g), od = join(O, e.name);
  mkdirSync(od, {recursive: true});
  writeFileSync(join(od, "stdout.bin"), Buffer.from(o));
  writeFileSync(join(od, "exit.txt"), x + "\n");
}
