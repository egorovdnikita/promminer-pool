/** Кусок разметки из движка прототипа. Пока экраны не переехали в TSX — это мост. */
export function Raw({ html, className = 'slot' }: { html: string; className?: string }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
}

/** Инлайн-иконка дизайн-системы (объект I в движке). */
export function Ico({ html, className = 'ico' }: { html: string; className?: string }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
}
