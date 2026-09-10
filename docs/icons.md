# Иконки из дизайн-системы

Все иконки прототипа выгружены из 💙 Дизайн-системы, страница **UI icons** (`140:124`),
стиль **Bold Duotone**. Лежат в [`src/legacy/icons.js`](../src/legacy/icons.js) —
45 штук, ключ → компонент указан комментарием над каждой.

Плюс одна бренд-иконка Telegram со страницы **Brands** (`140:127`).

## Как это выгружено

Вручную скачивать и складывать файлы не нужно: Figma Plugin API умеет отдавать SVG узла.
Скрипт ниже выполняется через `use_figma` — находит компонент-сеты по имени,
берёт вариант `Style=Bold Duotone`, экспортирует и сразу приводит к виду прототипа.

```js
const page = figma.root.children.find(p => p.id === '140:124');
await figma.setCurrentPageAsync(page);

const sets = new Map();
const rec = (n, d) => {
  if (n.type === 'COMPONENT_SET') { sets.set(n.name.replace('UI icons / ', ''), n); return }
  if (n.type === 'COMPONENT') return;
  if (d > 0 && n.children) n.children.forEach(k => rec(k, d - 1));
};
page.children.forEach(k => rec(k, 8));

const dec = b => { let s = ''; for (let i = 0; i < b.length; i += 8192) s += String.fromCharCode.apply(null, b.subarray(i, i + 8192)); return s };

const PAIRS = [['cd', 'Arrow / Alt Arrow Down'], /* ... */];
const out = {};
for (const [key, name] of PAIRS) {
  const set = sets.get(name);
  const v = set.children.find(x => /Bold\s*D[ou]{2}tone/i.test(x.name)) || set.children[0];
  let svg = dec(await v.exportAsync({ format: 'SVG' }));
  svg = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>[\s\S]*$/, '');   // только содержимое
  svg = svg.replace(/fill="(black|#[0-9a-fA-F]{3,8})"/g, 'fill="currentColor"'); // цвет наследуется
  out[key] = svg.replace(/\s*\n\s*/g, '');
}
return out;
```

Что важно:

- **Экспорт отдаёт `fill="black"`, а не hex** — regex должен ловить оба варианта,
  иначе иконка останется чёрной и перестанет краситься от родителя.
- **`viewBox` у всех иконок `0 0 24 24`**, поэтому обёртка `sv()` с этим же viewBox подходит;
  при добавлении новых иконок это стоит проверять — скрипт может вернуть другой размер.
- **В названии варианта в системе есть опечатка**: у части компонентов стиль называется
  `Style=Bold Doutone`. Точное сравнение с `'Style=Bold Duotone'` на них не сработает
  и молча возьмёт первый вариант из набора — поэтому в поиске стоит регулярка
  `/Bold\s*D[ou]{2}tone/i`.
- **Полупрозрачные части** приезжают как `opacity="0.5"` на путях или `<g opacity="0.5">` —
  это ровно та вторичная форма, что была в прототипе раньше.
- **Градиенты** (бренд-иконки) содержат `<defs>` с фиксированным `id`. При нескольких
  вставках одной иконки на страницу id задублируется, поэтому у Telegram заливка
  сведена к `currentColor`, а `defs` выброшен.

## Подключение

`icons.js` перекрывает объект `I` в движке прототипа:

```js
for (const [k, v] of Object.entries(ICONS)) I[k] = sv(v);
I.sortUp = sv(ICONS.sortUp, 16);
I.sortDn = sv(ICONS.cd, 16);
```

Вставка в разметку не изменилась: `${I.bell}` в строковых экранах,
`<Ico html={I.bell} />` в TSX.

## Соответствие ключей

Ключ прототипа → компонент дизайн-системы указан комментарием прямо в `icons.js`.
Если нужна новая иконка — добавить пару в `PAIRS`, выгрузить и вписать в `ICONS`
вместе с комментарием-именем компонента.
