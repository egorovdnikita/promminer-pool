/** Пароль на вход в прототип.
 *
 * Проверка идёт в браузере, поэтому это не защита, а щеколда: она закрывает
 * прототип от случайного посетителя, но не от того, кто откроет исходники.
 * В бандле лежит не сам пароль, а его SHA-256 — чтобы он хотя бы не читался
 * глазами в исходнике вкладки.
 *
 * Сменить пароль: `npm run gate` — скрипт спросит его в терминале
 * и перезапишет хэш ниже. Сам пароль никуда не записывается.
 */
/* Временный пароль — «promminer». Смените своим: `npm run gate`. */
export const GATE_HASH = '5588a4f85b5a02fa8e11645a8bd09ccd2440d0471d8ce7a69a2396c0c181207e'

/** Ключ в localStorage: один раз ввёл — больше не спрашиваем на этом устройстве. */
const KEY = 'pm.gate'

export const unlocked = () => {
  try { return localStorage.getItem(KEY) === GATE_HASH } catch { return false }
}

const sha256 = async (s: string) => {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

/** Проверяет пароль и, если верный, запоминает вход. */
export async function tryPassword(pass: string) {
  const h = await sha256(pass.trim())
  if (h !== GATE_HASH) return false
  try { localStorage.setItem(KEY, h) } catch { /* приватный режим */ }
  return true
}
