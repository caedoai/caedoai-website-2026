import { lazy, Suspense } from 'react'

/**
 * Lazy load a component when it enters the viewport.
 * Wraps React.lazy + Suspense + IntersectionObserver pattern.
 */
export function useLazyComponent(importFn, fallback = null) {
  const LazyComp = lazy(importFn)
  
  return (props) => (
    <Suspense fallback={fallback || <div style={{ minHeight: '200px' }} />}>
      <LazyComp {...props} />
    </Suspense>
  )
}

/**
 * Wrap a component to only render when in viewport.
 */
export function withViewportLazy(Component, threshold = 0.1) {
  return function ViewportLazyComponent(props) {
    const [isVisible, setIsVisible] = React.useState(false)
    const ref = React.useRef(null)

    React.useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        },
        { threshold }
      )
      if (ref.current) observer.observe(ref.current)
      return () => observer.disconnect()
    }, [])

    return (
      <div ref={ref}>
        {isVisible ? <Component {...props} /> : <Suspense fallback={<div />} />}
      </div>
    )
  }
}
