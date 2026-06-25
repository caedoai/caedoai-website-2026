import { lazy, Suspense, useState, useRef, useEffect } from 'react'

export function useLazyComponent(importFn, fallback = null) {
  const LazyComp = lazy(importFn)

  return (props) => (
    <Suspense fallback={fallback || <div style={{ minHeight: '200px' }} />}>
      <LazyComp {...props} />
    </Suspense>
  )
}

export function withViewportLazy(Component, threshold = 0.1) {
  return function ViewportLazyComponent(props) {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
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
