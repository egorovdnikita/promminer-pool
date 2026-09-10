# Индекс страниц Figma

Получен через `use_figma` (Plugin API) одним запросом:

```js
return figma.root.children.map((p,i)=>({i, id:p.id, name:p.name}));
```

Это единственный надёжный способ: `get_metadata` без `nodeId` возвращает только первый
элемент верхнего уровня, а `loadAllPagesAsync` в `use_figma` запрещён (и не нужен —
`figma.root.children` отдаёт все страницы сразу).

## 🔵 Профиль [Web] — `QurMA1NnX8rhAOYDsaxedC`

Актуальные макеты — всё до «Уведомления» включительно; ниже архив и черновики.

| Страница | node-id | Статус |
|---|---|---|
| Сводка профиля | `451:6014` | разобрана |
| Действия с телефоном | `531:19524` | разобрана |
| Действия с почтой | `531:19523` | |
| Действия с телеграмом | `531:19525` | |
| Флоу подтверждения | `493:9597` | |
| Верификация и реквизиты | `759:68419` | |
| Центр суб-аккаунтов | `840:27406` | |
| Наблюдатели | `882:61237` | |
| Безопасность | `588:83412` | |
| Уведомления | `940:22834` | |

Архив (не смотрим): `1857:87153` Доработки профиля, `788:55149` Workspace 2.0,
`1031:106451` про воркера, `146:14224` Preview, `1:4` Workspace 1.0, `305:26484` References.

## 💙 Дизайн-система — `8rrL0jaovYD3jsrq7WF1L1`

Токены: `152:54175` Brand Colors, `152:54455` Global Tokens.

Базовые компоненты:

| Компонент | node-id | | Компонент | node-id |
|---|---|---|---|---|
| Alert | `40001751:86` | | Pagination | `40001674:845` |
| Button | `140:158` | | Radio | `140:165` |
| Checkbox | `140:164` | | Scroll | `40001511:15373` |
| Chips | `40001996:193` | | Select | `140:162` |
| Counter | `193:4842` | | Search | `40001612:14824` |
| Color picker | `40003359:4198` | | Status | `214:4821` |
| Date Picker | `214:2522` | | Switch | `140:163` |
| Input | `40001618:6205` | | Tab | `140:168` |
| Indicator | `40003231:867` | | Tags | `214:4822` |
| Notification | `40001812:5858` | | Tooltip | `40001512:4126` |

Разобраны и перенесены: Button, Tab, Input, Modals/Base, Table cell,
**Checkbox, Radio, Switch, Select** (спецификации — в `docs/prod-analysis.md`).
Осталось: Chips, Tags, Status, Alert, Notification, Tooltip, Pagination, Counter,
Date Picker, Header, Footer, Sidebar.

Остальное: `140:739` Modals/Base, `40001644:465` Table cell,
`140:141` Header, `140:142` Footer, `140:143` Sidebar, `140:144` Tabbar,
`140:147` Workers, `140:148` Finance, `140:152` My referrals, `140:154` Profile,
`40001465:1909` Sub-accounts, `140:138` Logo, `140:123` IconBox, `140:124` UI icons,
`140:130` Loader, `140:131` Skeleton.
