# Контекст проекта

## Цель

Сделать правдоподобный прототип личного кабинета майнинг-пула Promminer, чтобы:

- тестировать новые фичи;
- переключаться между сценариями и состояниями данных;
- пройтись по всем возможным сценариям, которых нет на проде.

На проде (https://pool.promminer.ru/) аккаунт пустой, без данных — прогнать сценарии там нельзя.

## Ограничения и договорённости

- Обычный HTML/CSS/JS — без сборки, чтобы обновления стоили мало токенов.
- Внешний вид — строго по макетам и дизайн-системе.
- Иконки берутся из дизайн-системы (Solar Bold Duotone), инлайн-SVG.
- Пока делаем только **Web**; mobile — отдельным этапом.
- Сайт должен открываться и в чате (Artifact), и в браузере.

## Дизайн-система

💙 Дизайн-система — https://www.figma.com/design/8rrL0jaovYD3jsrq7WF1L1/

## Макеты

| Раздел | Ссылка |
|---|---|
| 🔵 Группа входа | https://www.figma.com/design/iLLJMNuregzOA7KfgF4GLl/ |
| 🔵 Профиль (Mobile) | https://www.figma.com/design/0hha5q5LFeQZrfojS5duRQ/ |
| 🔵 Профиль (Web) | https://www.figma.com/design/QurMA1NnX8rhAOYDsaxedC/ |
| 🔵 Мои активы (Web) | https://www.figma.com/design/cMs238oAwQH0l0rAJSyt3Z/ |
| 🔵 Мои активы (Mobile) | https://www.figma.com/design/csrFfmOTcTwytBVFjLdO3v/ |
| 🔵 Воркеры | https://www.figma.com/design/8mvRUmxWj1tT96Sb7Ou13h/ |
| 🔵 Главная | https://www.figma.com/design/CZTB9Ck7pnF4goeC8xLt8e/ |
| 🔵 Доход и Выплаты (Web) | https://www.figma.com/design/8y1PfPnXDAINZwmMO3xQys/ |
| 🔵 Доход и Выплаты (Mobile) | https://www.figma.com/design/Z3D9XJtIBf9mMty8ba45nR/ |
| 🔵 Отчет о майнинге | https://www.figma.com/design/A2UubaxHc6EFKeXnIxzZYh/ |
| 🔵 Наблюдатель | https://www.figma.com/design/bYjDbs60AQbdejnK2Nkrpz/ |
| 🔵 Сводка по аккаунтам | https://www.figma.com/design/V8iE8aEZMTVjTmB0JFOvvd/ |
| 🔵 Модальные окна | https://www.figma.com/design/D9nJsHafZaQ3JJiqcoThNY/ |
| 🔵 Чат в Max | https://www.figma.com/design/iXIMaLfBhnerzMyxAAOIhc/ |
| 🔵 Реферальная программа (Mobile) | https://www.figma.com/design/Bgh9DeapyzL10ql7QVku1h/ |
| 🔵 Реферальная программа (Web) | https://www.figma.com/design/3h54jI9H1X8tg6p10LPkjF/ |
| 🔵 Калькуляторы | https://www.figma.com/design/bjikQ6ayZpVAl7gYGlkHWT/ |

> Макеты могут лежать и на других страницах внутри файлов — при доработке раздела
> нужно проверять все страницы файла, а не только первую.

## Токены дизайн-системы (перенесены в прототип)

```
accent      #7086fc      accent-sub  #7086fc1f
bg          #f3f4f6      surface     #ffffff      bg3 #e5e7eb
text        #111827 / #6b7280 / #9ca3af
pos #22c55e  warn #f59e0b  neg #ef4444  neutral #6b7280
radius      4 / 12 / 16 / 24 / 999
shadow      0 4px 24px 0 #CBD0E966
шрифт       Gilroy (local) → Manrope (fallback)
контролы    button 48, button-sm 40, input 56
типографика Body/M 16-20, Body/S 14-18, Caption/M 12-16
sidebar     252px (свёрнутый — 72px)
```
