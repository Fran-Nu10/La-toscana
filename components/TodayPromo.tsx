'use client'

import { useEffect, useState } from 'react'
import type { Promo } from '@/content'

/**
 * El chip de promo del hero. En el servidor muestra el texto general; al
 * hidratar, si hoy es martes, miércoles o jueves, anuncia la promo de hoy.
 * Se calcula después de montar para no desincronizar la hidratación.
 */
export function TodayPromo({
  promos,
  fallback,
  className,
  dotClassName,
}: {
  promos: Promo[]
  fallback: string
  className?: string
  dotClassName?: string
}) {
  const [text, setText] = useState(fallback)

  useEffect(() => {
    const today = promos.find((promo) => promo.weekday === new Date().getDay())
    if (today) setText(`Hoy ${today.day.toLowerCase()} · ${today.name} + refresco de regalo`)
  }, [promos])

  return (
    <a href="#promos" className={className}>
      <span className={dotClassName} aria-hidden="true" />
      {text}
    </a>
  )
}
