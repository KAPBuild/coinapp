import { useEffect, useRef, useCallback } from 'react'

/**
 * Attaches an IntersectionObserver to a DOM element and adds the
 * 'visible' class when the element scrolls into view.
 * Works in tandem with the .reveal / .reveal.visible CSS classes in index.css.
 */
export function useScrollReveal(threshold = 0.15) {
  const observer = useRef<IntersectionObserver | null>(null)

  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return

    if (observer.current) {
      observer.current.disconnect()
    }

    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.current?.unobserve(entry.target)
          }
        })
      },
      { threshold }
    )

    observer.current.observe(node)
  }, [threshold])

  useEffect(() => {
    return () => observer.current?.disconnect()
  }, [])

  return ref
}
