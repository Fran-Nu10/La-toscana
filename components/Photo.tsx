'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { Photo as PhotoData } from '@/content'
import styles from './Photo.module.css'

type Props = {
  photo: PhotoData
  /** How wide the frame actually is, per breakpoint. Required: this is what
   *  keeps a phone from downloading a desktop-sized file. */
  sizes: string
  /** Only the hero. Everything else stays lazy and below the fold. */
  priority?: boolean
  className?: string
}

/**
 * A photograph in its frame.
 *
 * The frame owns the aspect ratio (set by whichever section is using it), so
 * the space is reserved before the file arrives and nothing shifts on load.
 * A warm `tone` wash is painted underneath and the image fades in over it, so a
 * slow connection sees a considered surface instead of a white hole.
 *
 * The client boundary exists for one reason: `onError` falls back to the wash,
 * which matters while the photography is placeholder URLs. Once the real photos
 * are in /public this can become a Server Component by dropping the state.
 */
export function Photo({ photo, sizes, priority = false, className }: Props) {
  const [state, setState] = useState<'loading' | 'loaded' | 'failed'>('loading')

  return (
    <div
      className={[styles.frame, styles[photo.tone], className].filter(Boolean).join(' ')}
      data-state={state}
    >
      {state !== 'failed' && (
        <Image
          className={styles.img}
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          /* Keeps the subject in frame when the crop gets tall on a phone. */
          style={{ objectPosition: photo.focal ?? '50% 50%' }}
          onLoad={() => setState('loaded')}
          onError={() => setState('failed')}
        />
      )}
    </div>
  )
}
