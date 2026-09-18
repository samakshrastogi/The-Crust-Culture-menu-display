import { memo } from 'react'

/**
 * Text keyword highlight component
 * Splits text on search terms and wraps matching words with gold highlighted mark tag
 */
export default memo(function Highlight({ text, query, className = '' }) {
  if (!query?.trim()) return text

  const terms = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))

  if (terms.length === 0) return text

  const regex = new RegExp(`(${terms.join('|')})`, 'gi')
  const testRegex = new RegExp(`^(${terms.join('|')})$`, 'i')
  const parts = String(text).split(regex)

  return parts.map((part, index) =>
    testRegex.test(part) ? (
      <mark
        key={`${part}-${index}`}
        className={`rounded bg-[var(--gold)]/35 px-0.5 text-inherit font-black ${className}`}
      >
        {part}
      </mark>
    ) : (
      part
    ),
  )
})
