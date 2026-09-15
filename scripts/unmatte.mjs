/* Снятие белой подложки с картинок макетов.
   Часть PNG выгрузилась вместе с белым фоном кадра — в тёмной теме под
   иллюстрацией появляется белый прямоугольник. Скрипт заливкой от краёв
   помечает связанный с рамкой белый фон и делает его прозрачным, а тонкую
   кромку сглаживания разматовывает по белому (unmatte), чтобы не осталось
   светлого ореола. Белое внутри рисунка (звезда, листы бумаги) не трогается:
   до него заливка не доходит.

   Запуск: node scripts/unmatte.mjs public/tier-5.png ...
           node scripts/unmatte.mjs --check public/*.png   (только проверка) */
import { readFileSync, writeFileSync } from 'node:fs';
import zlib from 'node:zlib';

const SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function readPng(buf) {
  if (!buf.subarray(0, 8).equals(SIG)) throw new Error('не PNG');
  let p = 8, ihdr = null; const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), type = buf.toString('ascii', p + 4, p + 8);
    const data = buf.subarray(p + 8, p + 8 + len);
    if (type === 'IHDR') ihdr = { w: data.readUInt32BE(0), h: data.readUInt32BE(4),
      depth: data[8], color: data[9], interlace: data[12] };
    if (type === 'IDAT') idat.push(data);
    p += 12 + len;
  }
  if (ihdr.depth !== 8 || ihdr.interlace !== 0 || (ihdr.color !== 6 && ihdr.color !== 2))
    throw new Error(`не поддержано: depth=${ihdr.depth} color=${ihdr.color} interlace=${ihdr.interlace}`);
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const ch = ihdr.color === 6 ? 4 : 3, { w, h } = ihdr;
  const stride = w * ch, px = Buffer.alloc(w * h * 4);
  let prev = Buffer.alloc(stride);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)];
    const line = Buffer.from(raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride));
    for (let i = 0; i < stride; i++) {
      const a = i >= ch ? line[i - ch] : 0, b = prev[i], c = i >= ch ? prev[i - ch] : 0;
      if (f === 1) line[i] = (line[i] + a) & 255;
      else if (f === 2) line[i] = (line[i] + b) & 255;
      else if (f === 3) line[i] = (line[i] + ((a + b) >> 1)) & 255;
      else if (f === 4) {
        const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c);
        line[i] = (line[i] + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255;
      }
    }
    for (let x = 0; x < w; x++) {
      const s = x * ch, d = (y * w + x) * 4;
      px[d] = line[s]; px[d + 1] = line[s + 1]; px[d + 2] = line[s + 2];
      px[d + 3] = ch === 4 ? line[s + 3] : 255;
    }
    prev = line;
  }
  return { w, h, px };
}

function writePng(w, h, px) {
  const raw = Buffer.alloc(h * (w * 4 + 1));
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    px.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  const chunk = (type, data) => {
    const b = Buffer.alloc(8 + data.length + 4);
    b.writeUInt32BE(data.length, 0); b.write(type, 4, 'ascii');
    data.copy(b, 8);
    b.writeUInt32BE(zlib.crc32(Buffer.concat([Buffer.from(type, 'ascii'), data])) >>> 0, 8 + data.length);
    return b;
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([SIG, chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

/* Фон — почти белый и связан с краем картинки */
const BG = 250;   /* ниже этого пикселя фоном не считаем */
const EDGE = 200; /* кромка сглаживания: светлее — разматовываем */

function unmatte(img) {
  const { w, h, px } = img;
  const bg = new Uint8Array(w * h);
  const q = [];
  const white = (i) => px[i * 4 + 3] > 200 && px[i * 4] >= BG && px[i * 4 + 1] >= BG && px[i * 4 + 2] >= BG;
  for (let x = 0; x < w; x++) { q.push(x, (h - 1) * w + x); }
  for (let y = 0; y < h; y++) { q.push(y * w, y * w + w - 1); }
  while (q.length) {
    const i = q.pop();
    if (bg[i] || !white(i)) continue;
    bg[i] = 1;
    const x = i % w, y = (i - x) / w;
    if (x > 0) q.push(i - 1);
    if (x < w - 1) q.push(i + 1);
    if (y > 0) q.push(i - w);
    if (y < h - 1) q.push(i + w);
  }
  let cleared = 0, soft = 0;
  for (let i = 0; i < w * h; i++) if (bg[i]) { px[i * 4 + 3] = 0; cleared++; }
  /* Кромка: пиксель рядом с фоном — смесь цвета с белым. Восстанавливаем
     исходный цвет и прозрачность, иначе по контуру останется белая полоска. */
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x;
    if (bg[i] || px[i * 4 + 3] < 250) continue;
    let near = false;
    for (let dy = -1; dy <= 1 && !near; dy++) for (let dx = -1; dx <= 1; dx++) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      if (bg[ny * w + nx]) { near = true; break; }
    }
    if (!near) continue;
    const r = px[i * 4], g = px[i * 4 + 1], b = px[i * 4 + 2], m = Math.min(r, g, b);
    if (m <= EDGE) continue;
    const a = (255 - m) / (255 - EDGE);
    if (a >= 1) continue;
    if (a <= 0.02) { px[i * 4 + 3] = 0; soft++; continue; }
    px[i * 4] = Math.max(0, Math.min(255, Math.round((r - 255 * (1 - a)) / a)));
    px[i * 4 + 1] = Math.max(0, Math.min(255, Math.round((g - 255 * (1 - a)) / a)));
    px[i * 4 + 2] = Math.max(0, Math.min(255, Math.round((b - 255 * (1 - a)) / a)));
    px[i * 4 + 3] = Math.round(a * 255);
    soft++;
  }
  return { cleared, soft };
}

const args = process.argv.slice(2);
const check = args.includes('--check');
for (const f of args.filter((a) => a !== '--check')) {
  try {
    const img = readPng(readFileSync(f));
    const { w, h, px } = img;
    const corner = [0, (w - 1) * 4, (h - 1) * w * 4, ((h - 1) * w + w - 1) * 4]
      .filter((i) => px[i + 3] > 200 && px[i] >= BG && px[i + 1] >= BG && px[i + 2] >= BG).length;
    if (check) { console.log(`${f} ${w}×${h} белых углов: ${corner}`); continue; }
    if (!corner) { console.log(`${f} — белой подложки нет, пропускаю`); continue; }
    const r = unmatte(img);
    writeFileSync(f, writePng(w, h, px));
    console.log(`${f} ${w}×${h}: прозрачных ${r.cleared}, кромка ${r.soft}`);
  } catch (e) {
    console.log(`${f} — ${e.message}`);
  }
}
