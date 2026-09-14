export function getFlavorBadge(item, sectionTitle = '') {
  if (!item) return null

  const text = `${item.name || ''} ${item.toppings || ''} ${item.tag || ''}`.toLowerCase()
  const sec = String(sectionTitle || '').toLowerCase()

  if (
    text.includes('peri peri') ||
    text.includes('schezwan') ||
    text.includes('hot peri') ||
    text.includes('chilli') ||
    text.includes('chili') ||
    text.includes('hot & spicy') ||
    text.includes('hot sauce') ||
    text.includes('spicy')
  ) {
    return {
      emoji: '🌶️',
      label: 'Spicy',
      badgeClass: 'bg-red-950/85 text-red-200 border-red-500/40 shadow-[0_0_8px_rgba(239,68,68,0.35)]',
    }
  }

  if (
    text.includes('double cheese') ||
    text.includes('cheese burst') ||
    text.includes('cheese loaded') ||
    text.includes('cheesy') ||
    text.includes('mozzarella') ||
    text.includes('corn & cheese') ||
    text.includes('cheese special')
  ) {
    return {
      emoji: '🧀',
      label: 'Cheesy',
      badgeClass: 'bg-amber-950/85 text-amber-200 border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.35)]',
    }
  }

  if (
    text.includes('tandoori') ||
    text.includes('paneer tikka') ||
    text.includes('makhani')
  ) {
    return {
      emoji: '🔥',
      label: 'Tandoori',
      badgeClass: 'bg-orange-950/85 text-orange-200 border-orange-500/40 shadow-[0_0_8px_rgba(249,115,22,0.35)]',
    }
  }

  if (
    sec.includes('drinks') ||
    text.includes('cold coffee') ||
    text.includes('lemon soda') ||
    text.includes('shikanji') ||
    text.includes('lassi')
  ) {
    if (text.includes('tea') || text.includes('chai') || text.includes('hot coffee')) {
      return {
        emoji: '☕',
        label: 'Warm',
        badgeClass: 'bg-amber-950/85 text-amber-200 border-amber-600/40 shadow-[0_0_8px_rgba(217,119,6,0.25)]',
      }
    }
    return {
      emoji: '❄️',
      label: 'Chilled',
      badgeClass: 'bg-cyan-950/85 text-cyan-200 border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.25)]',
    }
  }

  if (text.includes('honey')) {
    return {
      emoji: '🍯',
      label: 'Glazed',
      badgeClass: 'bg-amber-950/85 text-amber-200 border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.35)]',
    }
  }

  if (text.includes('garlic')) {
    return {
      emoji: '🧄',
      label: 'Garlic',
      badgeClass: 'bg-stone-900/85 text-amber-100 border-amber-500/30 shadow-[0_0_8px_rgba(217,119,6,0.25)]',
    }
  }

  return null
}
