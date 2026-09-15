/* Смена пароля на вход в прототип: спрашивает пароль в терминале,
   считает SHA-256 и подставляет его в src/gate.ts. Сам пароль никуда
   не сохраняется — ни в файл, ни в историю команд. */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';

const FILE = new URL('../src/gate.ts', import.meta.url);

const ask = (q) => new Promise((res) => {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  /* Гасим эхо, чтобы пароль не остался на экране */
  const hidden = process.stdin.isTTY;
  if (hidden) {
    process.stdout.write(q);
    rl.output.write = () => {};
    rl.question('', (a) => { rl.close(); process.stdout.write('\n'); res(a) });
  } else {
    rl.question(q, (a) => { rl.close(); res(a) });
  }
});

const pass = (await ask('Новый пароль: ')).trim();
if (pass.length < 6) {
  console.error('Слишком короткий пароль: нужно хотя бы шесть символов.');
  process.exit(1);
}
const hash = createHash('sha256').update(pass).digest('hex');
const src = readFileSync(FILE, 'utf8');
const next = src.replace(/export const GATE_HASH = '[0-9a-f]*'/, `export const GATE_HASH = '${hash}'`);
if (next === src) { console.error('Не нашёл строку GATE_HASH в src/gate.ts'); process.exit(1) }
writeFileSync(FILE, next);
console.log('Пароль обновлён. Осталось закоммитить src/gate.ts и запушить.');
console.log('Все, кто уже вошёл, спросятся заново — прежний ключ в localStorage перестанет подходить.');
