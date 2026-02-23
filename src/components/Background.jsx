import React, { useEffect, useMemo } from 'react'

export default function Background() {
  // generate stable star positions per mount
  const stars = useMemo(() => {
    const N = 140
    const arr = []
    for (let i = 0; i < N; i++) {
      arr.push({
        id: i,
        left: Math.random() * 100,                // percent
        top: Math.random() * 100,                 // percent
        size: 0.8 + Math.random() * 2.8,          // px
        twinkle: 1.8 + Math.random() * 3.6,       // seconds
        drift: 18 + Math.random() * 36,           // seconds
        delay: Math.random() * 6,                 // seconds
        opacity: 0.45 + Math.random() * 0.6
      })
    }
    return arr
  }, [])

  useEffect(() => {
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2 // -1..1
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      document.documentElement.style.setProperty('--mx', (x * 6).toFixed(2) + 'px')
      document.documentElement.style.setProperty('--my', (y * 4).toFixed(2) + 'px')
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // moving objects
  const objs = useMemo(() => {
    return Array.from({ length: 9 }).map((_, i) => {
      const left = 6 + (i * 10) % 84
      const delay = (i * 0.8) % 6
      const dur = 12 + (i % 4) * 4
      return { id: i, left: `${left}%`, delay: `${delay}s`, dur: `${dur}s`, type: i % 3 }
    })
  }, [])

  // Single parent wrapper for all animated background pieces
  return (
    <div className="bg-anim starfield" aria-hidden="true">
      {/* subtle large color blobs (kept low opacity) */}
      <span className="blob b1" />
      <span className="blob b2" />
      <span className="blob b3" />
      <div className="particles" />

      {/* generated stars */}
      {stars.map(s => (
        <span
          key={s.id}
          className="star"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
            animation: `twinkle ${s.twinkle}s ease-in-out ${s.delay}s infinite, drift ${s.drift}s linear ${s.delay}s infinite`
          }}
        />
      ))}

      {/* moving objects (orbs / comets) */}
      <div className="moving-objects" aria-hidden="true">
        {objs.map(o => (
          <div
            key={o.id}
            className={`mobj mobj--type${o.type}`}
            style={{
              left: o.left,
              animationDelay: o.delay,
              animationDuration: o.dur
            }}
          />
        ))}
      </div>
    </div>
  )
}