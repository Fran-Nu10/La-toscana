'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { SiteContent, VideoSource } from '@/content'
import { ShopIcons } from './shop/icons'
import styles from './Film.module.css'

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))

/** La primera fuente que este navegador puede reproducir. */
function pickSource(video: HTMLVideoElement, sources: VideoSource[]): string | undefined {
  return (sources.find((source) => video.canPlayType(source.type) !== '') ?? sources[sources.length - 1])?.src
}
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/** Pantallas apaisadas o casi cuadradas: el reel vertical va centrado a
 *  alto completo y una capa ambiente difuminada llena los costados. */
const WIDE_QUERY = '(min-aspect-ratio: 3/4)'
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'

/**
 * "Un día en La Toscana": el reel real del restaurante como sección
 * cinematográfica.
 *
 * Al entrar, un marco editorial contenido bajo el título. A medida que se
 * scrollea, el marco crece, pierde la inclinación y el radio, y termina
 * ocupando la pantalla entera; después la página sigue sola. No hay
 * scroll-jacking: el scroll es del usuario y la sección sólo lee su progreso.
 *
 * Implementación: el alto extra lo da el `track` y un contenedor sticky de
 * 100lvh hace de escenario. Un único `requestAnimationFrame` por evento de
 * scroll lee la posición (lectura antes de escritura, sin thrashing) y
 * escribe sólo `transform` y `opacity`. El listener existe sólo mientras la
 * sección está cerca del viewport.
 *
 * Con `prefers-reduced-motion: reduce` no hay sticky ni transformación: la
 * sección es una composición estática y el video no arranca solo.
 */
export function Film({ film }: { film: SiteContent['film'] }) {
  const sectionRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const outroRef = useRef<HTMLDivElement>(null)
  const ambientRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const ambientVideoRef = useRef<HTMLVideoElement>(null)

  const [reduced, setReduced] = useState(false)
  const [playing, setPlaying] = useState(false)
  /** El póster y la capa ambiente se piden recién cuando la sección está cerca. */
  const [near, setNear] = useState(false)
  const userPaused = useRef(false)
  const visible = useRef(false)

  // Preferencia de movimiento, en vivo.
  useEffect(() => {
    const query = window.matchMedia(REDUCED_QUERY)
    const sync = () => setReduced(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  /** Carga diferida: el video pesa ~2,7 MB y está lejos del primer viewport. */
  const ensureSources = useCallback(() => {
    const video = videoRef.current
    if (video && !video.getAttribute('src')) {
      const src = pickSource(video, film.sources)
      if (src) {
        video.muted = true
        video.preload = 'auto'
        video.src = src
      }
    }
    // La capa ambiente sólo existe en pantallas apaisadas.
    const ambient = ambientVideoRef.current
    if (ambient && !ambient.getAttribute('src') && window.matchMedia(WIDE_QUERY).matches) {
      const src = pickSource(ambient, film.ambientSources)
      if (src) {
        ambient.muted = true
        ambient.preload = 'auto'
        ambient.src = src
      }
    }
  }, [film.sources, film.ambientSources])

  const play = useCallback(() => {
    ensureSources()
    const video = videoRef.current
    if (!video) return
    video.muted = true
    video.play().catch(() => setPlaying(false))
    const ambient = ambientVideoRef.current
    if (ambient?.getAttribute('src')) ambient.play().catch(() => {})
  }, [ensureSources])

  const pause = useCallback(() => {
    videoRef.current?.pause()
    ambientVideoRef.current?.pause()
  }, [])

  // Cargar un viewport antes y reproducir sólo mientras se ve.
  useEffect(() => {
    const section = sectionRef.current
    if (!section || typeof IntersectionObserver === 'undefined') return

    const preload = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNear(true)
          ensureSources()
          preload.disconnect()
        }
      },
      { rootMargin: '0px 0px 100% 0px' },
    )
    const view = new IntersectionObserver(
      ([entry]) => {
        visible.current = Boolean(entry?.isIntersecting)
        if (visible.current && !reduced && !userPaused.current) play()
        if (!visible.current) pause()
      },
      { threshold: 0.15 },
    )
    preload.observe(section)
    view.observe(section)
    return () => {
      preload.disconnect()
      view.disconnect()
    }
  }, [ensureSources, play, pause, reduced])

  // El escenario: progreso de scroll → transform/opacity.
  useEffect(() => {
    if (reduced) return
    const section = sectionRef.current
    const sticky = stickyRef.current
    const frame = frameRef.current
    const intro = introRef.current
    const outro = outroRef.current
    const ambient = ambientRef.current
    if (!section || !sticky || !frame || !intro || !outro || !ambient) return

    const wide = window.matchMedia(WIDE_QUERY)
    const root = document.documentElement
    let raf = 0
    let immersive = false

    const update = () => {
      raf = 0
      // Lectura: una sola, al principio del frame.
      const rect = section.getBoundingClientRect()
      const vh = sticky.clientHeight || window.innerHeight
      const distance = rect.height - vh
      const p = distance > 0 ? clamp(-rect.top / distance) : 0
      const g = easeInOutCubic(clamp((p - 0.04) / 0.62))

      const isWide = wide.matches
      const s0 = isWide ? 0.5 : 0.7
      const ty0 = (isWide ? 0.2 : 0.16) * vh
      const rx0 = isWide ? 14 : 5
      const r0 = isWide ? 40 : 34

      // Escritura: sólo transform, opacity y el radio del marco.
      frame.style.transform = `translate3d(0, ${(ty0 * (1 - g)).toFixed(2)}px, 0) rotateX(${(rx0 * (1 - g)).toFixed(3)}deg) scale(${(s0 + (1 - s0) * g).toFixed(4)})`
      frame.style.borderRadius = `${(r0 * (1 - g)).toFixed(1)}px`
      intro.style.transform = `translate3d(0, ${(-g * 0.22 * vh).toFixed(2)}px, 0)`
      intro.style.opacity = clamp(1 - g * 1.8).toFixed(3)
      ambient.style.opacity = clamp((g - 0.15) * 1.3).toFixed(3)

      const o = clamp((p - 0.7) / 0.14)
      outro.style.opacity = o.toFixed(3)
      outro.style.transform = `translate3d(0, ${((1 - o) * 18).toFixed(2)}px, 0)`
      outro.style.visibility = o > 0.01 ? 'visible' : 'hidden'

      // En plena inmersión el header se aparta; vuelve en cuanto se sale.
      const nowImmersive = g > 0.6 && p < 0.985
      if (nowImmersive !== immersive) {
        immersive = nowImmersive
        if (immersive) root.dataset.film = 'immersive'
        else delete root.dataset.film
      }
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    let listening = false
    const listen = (on: boolean) => {
      if (on === listening) return
      listening = on
      const method = on ? 'addEventListener' : 'removeEventListener'
      window[method]('scroll', schedule, { passive: true } as AddEventListenerOptions)
      window[method]('resize', schedule)
      if (on) schedule()
    }

    const nearObserver = new IntersectionObserver(([entry]) => listen(Boolean(entry?.isIntersecting)), {
      rootMargin: '50% 0px 50% 0px',
    })
    nearObserver.observe(section)
    wide.addEventListener('change', schedule)
    update()

    return () => {
      nearObserver.disconnect()
      listen(false)
      wide.removeEventListener('change', schedule)
      if (raf) cancelAnimationFrame(raf)
      delete root.dataset.film
      for (const el of [frame, intro, outro, ambient]) el.removeAttribute('style')
    }
  }, [reduced])

  const toggle = () => {
    if (playing) {
      userPaused.current = true
      pause()
    } else {
      userPaused.current = false
      play()
    }
  }

  return (
    <section id="un-dia" className={styles.film} ref={sectionRef} aria-labelledby="film-titulo">
      <div className={styles.track}>
        <div className={styles.sticky} ref={stickyRef}>
          <div
            className={styles.ambient}
            ref={ambientRef}
            aria-hidden="true"
            style={near ? { backgroundImage: `url(${film.ambientPoster})` } : undefined}
          >
            <video
              ref={ambientVideoRef}
              className={styles.ambientVideo}
              muted
              loop
              playsInline
              preload="none"
              tabIndex={-1}
              disablePictureInPicture
            />
          </div>

          <div className={styles.intro} ref={introRef}>
            <p className="kicker kicker--dark">{film.kicker}</p>
            <h2 className={styles.title} id="film-titulo">
              {film.title}
            </h2>
            <p className={styles.body}>{film.body}</p>
          </div>

          <div className={styles.stage}>
            <div className={styles.frame} ref={frameRef}>
              <video
                ref={videoRef}
                className={styles.video}
                poster={near ? film.poster : undefined}
                width={film.width}
                height={film.height}
                muted
                loop
                playsInline
                preload="none"
                disablePictureInPicture
                aria-label={film.description}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              />
            </div>
            <button
              type="button"
              className={`iconBtn ${styles.toggle}`}
              onClick={toggle}
              aria-label={playing ? 'Pausar el video' : 'Reproducir el video'}
            >
              {playing ? ShopIcons.pause : ShopIcons.play}
            </button>
          </div>

          <div className={styles.outro} ref={outroRef}>
            <p className={styles.caption}>{film.caption}</p>
            <a href={film.cta.href} className="btn btn--light btn--lg">
              {film.cta.label}
              {ShopIcons.arrow}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
