/* Сборка альтернативных наборов иконок для оси «Иконки» в панели сценариев.
   Иконки тянем из Iconify (api.iconify.design) один раз и кладём в
   src/legacy/icon-packs/*.js — в браузере сети не требуется.

   Лицензии наборов: Lucide — ISC, Material Icons — Apache 2.0,
   Phosphor — MIT, Material Design Icons — Apache 2.0. Все допускают
   включение в проект; список наборов и авторство — в docs/icons.md.

   Запуск: node scripts/icon-packs.mjs */
import { writeFileSync, mkdirSync } from 'node:fs';

const PACKS = {
  /* ключ оси → префикс Iconify, подпись, как рисовать обёртку */
  line:  { prefix: 'lucide', title: 'Lucide' },
  sharp: { prefix: 'ic', title: 'Material Icons Sharp' },
  thin:  { prefix: 'ph', title: 'Phosphor Thin' },
  fill:  { prefix: 'mdi', title: 'Material Design Icons' },
};

/* Ключ движка → имя иконки в каждом наборе. Порядок: line, sharp, thin, fill.
   Пустая строка — в наборе такой иконки нет, останется иконка дизайн-системы. */
const MAP = {
  cd:       ['chevron-down', 'sharp-keyboard-arrow-down', 'caret-down-thin', 'chevron-down'],
  cv:       ['chevron-right', 'sharp-chevron-right', 'caret-right-thin', 'chevron-right'],
  cl:       ['chevron-left', 'sharp-chevron-left', 'caret-left-thin', 'chevron-left'],
  sortUp:   ['chevron-up', 'sharp-keyboard-arrow-up', 'caret-up-thin', 'chevron-up'],
  arl:      ['arrow-left', 'sharp-arrow-back', 'arrow-left-thin', 'arrow-left'],
  arr:      ['chevron-right', 'sharp-chevron-right', 'caret-right-thin', 'chevron-right'],
  ext:      ['arrow-up-right', 'sharp-north-east', 'arrow-up-right-thin', 'arrow-top-right'],
  aru:      ['arrow-up-right', 'sharp-north-east', 'arrow-up-right-thin', 'arrow-top-right'],
  bell:     ['bell', 'sharp-notifications', 'bell-thin', 'bell'],
  user:     ['user', 'sharp-person', 'user-thin', 'account'],
  ref:      ['users', 'sharp-group', 'users-three-thin', 'account-group'],
  dl:       ['download', 'sharp-download', 'download-simple-thin', 'download'],
  dlm:      ['download', 'sharp-download', 'download-simple-thin', 'download'],
  cal:      ['calendar', 'sharp-calendar-month', 'calendar-blank-thin', 'calendar'],
  srch:     ['search', 'sharp-search', 'magnifying-glass-thin', 'magnify'],
  warr:     ['circle-arrow-up', 'sharp-arrow-circle-up', 'arrow-circle-up-thin', 'arrow-up-circle'],
  wdng:     ['circle-alert', 'sharp-error', 'warning-circle-thin', 'alert-circle'],
  wrec:     ['circle-dot', 'sharp-radio-button-checked', 'record-thin', 'record-circle'],
  woff:     ['wifi-off', 'sharp-wifi-off', 'wifi-slash-thin', 'wifi-off'],
  zi:       ['zoom-in', 'sharp-zoom-in', 'magnifying-glass-plus-thin', 'magnify-plus'],
  zo:       ['zoom-out', 'sharp-zoom-out', 'magnifying-glass-minus-thin', 'magnify-minus'],
  cp:       ['copy', 'sharp-content-copy', 'copy-thin', 'content-copy'],
  pl:       ['plus', 'sharp-add', 'plus-thin', 'plus'],
  inf:      ['info', 'sharp-info', 'info-thin', 'information'],
  flt:      ['list-filter', 'sharp-filter-alt', 'funnel-thin', 'filter-variant'],
  tune:     ['sliders-horizontal', 'sharp-tune', 'sliders-horizontal-thin', 'tune'],
  upm:      ['upload', 'sharp-upload', 'upload-simple-thin', 'upload'],
  up:       ['upload', 'sharp-file-upload', 'upload-simple-thin', 'upload'],
  xo:       ['x', 'sharp-close', 'x-thin', 'close'],
  x:        ['x', 'sharp-close', 'x-thin', 'close'],
  xc:       ['circle-x', 'sharp-cancel', 'x-circle-thin', 'close-circle'],
  folder:   ['folder', 'sharp-folder', 'folder-thin', 'folder'],
  tagic:    ['tag', 'sharp-sell', 'tag-thin', 'tag'],
  dots:     ['ellipsis', 'sharp-more-horiz', 'dots-three-thin', 'dots-horizontal'],
  sun:      ['sun', 'sharp-light-mode', 'sun-thin', 'white-balance-sunny'],
  moon:     ['moon', 'sharp-dark-mode', 'moon-thin', 'weather-night'],
  monitor:  ['monitor-smartphone', 'sharp-devices', 'devices-thin', 'monitor-cellphone'],
  pc:       ['monitor', 'sharp-computer', 'desktop-thin', 'monitor'],
  key:      ['key-round', 'sharp-key', 'key-thin', 'key-variant'],
  tr2:      ['trash-2', 'sharp-delete', 'trash-thin', 'delete'],
  tr:       ['trash', 'sharp-delete-outline', 'trash-simple-thin', 'trash-can-outline'],
  unlink:   ['unlink', 'sharp-link-off', 'link-break-thin', 'link-off'],
  clock:    ['clock', 'sharp-schedule', 'clock-thin', 'clock-outline'],
  edit:     ['pencil', 'sharp-edit', 'pencil-simple-thin', 'pencil'],
  sortv:    ['arrow-up-down', 'sharp-swap-vert', 'arrows-down-up-thin', 'swap-vertical'],
  home:     ['house', 'sharp-home', 'house-thin', 'home'],
  doc:      ['file-text', 'sharp-description', 'file-text-thin', 'file-document'],
  book:     ['book-open', 'sharp-menu-book', 'book-open-thin', 'book-open-variant'],
  shield:   ['shield-check', 'sharp-verified-user', 'shield-check-thin', 'shield-check'],
  eye:      ['eye', 'sharp-visibility', 'eye-thin', 'eye'],
  eyed:     ['eye', 'sharp-visibility', 'eye-thin', 'eye'],
  eyeoff:   ['eye-off', 'sharp-visibility-off', 'eye-slash-thin', 'eye-off'],
  pick2:    ['pickaxe', 'sharp-hardware', 'hammer-thin', 'pickaxe'],
  pie:      ['chart-pie', 'sharp-pie-chart', 'chart-pie-slice-thin', 'chart-pie'],
  calc:     ['calculator', 'sharp-calculate', 'calculator-thin', 'calculator'],
  bars:     ['chart-column', 'sharp-bar-chart', 'chart-bar-thin', 'chart-bar'],
  card:     ['credit-card', 'sharp-credit-card', 'credit-card-thin', 'credit-card'],
  lock:     ['lock', 'sharp-lock', 'lock-thin', 'lock'],
  gear:     ['settings', 'sharp-settings', 'gear-thin', 'cog'],
  uid:      ['id-card', 'sharp-badge', 'identification-card-thin', 'card-account-details'],
  login3:   ['log-in', 'sharp-login', 'sign-in-thin', 'login'],
  out:      ['log-out', 'sharp-logout', 'sign-out-thin', 'logout'],
  checkall: ['check-check', 'sharp-done-all', 'checks-thin', 'check-all'],
  ok:       ['circle-check', 'sharp-check-circle', 'check-circle-thin', 'check-circle'],
  okc:      ['check', 'sharp-check', 'check-thin', 'check'],
  excl:     ['circle-alert', 'sharp-error', 'warning-circle-thin', 'alert-circle'],
  pause:    ['circle-pause', 'sharp-pause-circle', 'pause-circle-thin', 'pause-circle'],
  phone:    ['phone', 'sharp-call', 'phone-thin', 'phone'],
  mail:     ['mail', 'sharp-mail', 'envelope-simple-thin', 'email'],
  qr:       ['qr-code', 'sharp-qr-code', 'qr-code-thin', 'qrcode'],
  fbtc:     ['bitcoin', 'sharp-currency-bitcoin', 'currency-btc-thin', 'bitcoin'],
  crecv:    ['hand-coins', 'sharp-payments', 'hand-coins-thin', 'cash-plus'],
  wallet:   ['wallet', 'sharp-account-balance-wallet', 'wallet-thin', 'wallet'],
};

const order = Object.keys(PACKS);
const out = {};
for (let i = 0; i < order.length; i++) {
  const id = order[i], { prefix } = PACKS[id];
  const names = [...new Set(Object.values(MAP).map((v) => v[i]).filter(Boolean))];
  const url = `https://api.iconify.design/${prefix}.json?icons=${names.join(',')}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${prefix}: HTTP ${res.status}`);
  const json = await res.json();
  const miss = json.not_found || [];
  if (miss.length) console.log(`${prefix}: не нашлось — ${miss.join(', ')}`);
  out[id] = { json, miss: new Set(miss) };
  console.log(`${prefix}: получено ${Object.keys(json.icons || {}).length} из ${names.length}`);
}

mkdirSync(new URL('../src/legacy/icon-packs/', import.meta.url), { recursive: true });
const HEAD = (title, prefix) => `/* Набор иконок «${title}» (${prefix}) с Iconify.
   Собран скриптом scripts/icon-packs.mjs — руками не править. */\n`;

for (let i = 0; i < order.length; i++) {
  const id = order[i], { prefix, title } = PACKS[id];
  const { json } = out[id];
  const aliases = json.aliases || {};
  const body = (name) => {
    const a = aliases[name];
    const icon = json.icons[name] || (a && json.icons[a.parent]);
    return icon ? icon.body : null;
  };
  const lines = [];
  let have = 0, lost = [];
  for (const [key, names] of Object.entries(MAP)) {
    const n = names[i];
    const b = n && body(n);
    if (!b) { if (n) lost.push(`${key}→${n}`); continue; }
    have++;
    lines.push(`  ${key}: ${JSON.stringify(b)},`);
  }
  const w = json.width || 24, h = json.height || 24;
  const src = HEAD(title, prefix)
    + `export const VB = '0 0 ${w} ${h}';\n`
    + `export const ICONS = {\n${lines.join('\n')}\n};\n`;
  writeFileSync(new URL(`../src/legacy/icon-packs/${id}.js`, import.meta.url), src);
  console.log(`${id}.js: ${have} иконок${lost.length ? `, без пары: ${lost.join(', ')}` : ''}`);
}
