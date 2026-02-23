import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react'

const COLORS = ['#ff5f6d', '#ffc371', '#7bd389', '#4cc9f0', '#9b6bff', '#ff8fab', '#ffd36e']

const Gantt = forwardRef(({ timeline = [], playing }, ref) => {
  const [played, setPlayed] = useState(false)
  useImperativeHandle(ref, () => ({
    play: () => {
      setPlayed(false)
      // allow reflow
      setTimeout(() => setPlayed(true), 30)
    }
  }), [])

  useEffect(() => {
    if (!playing) setPlayed(false)
  }, [playing])

  if (!timeline || timeline.length === 0) {
    return <div className="gantt empty">No schedule yet. Add processes and start.</div>
  }

  const totalTime = timeline[timeline.length - 1].end
  return (
    <div className="gantt">
      <div className="timeline" style={{ gridTemplateColumns: `repeat(${totalTime}, 1fr)` }}>
        {timeline.map((seg, idx) => {
          const width = (seg.end - seg.start) // in time units
          const color = COLORS[idx % COLORS.length]
          return (
            <div
              key={idx}
              className="g-seg"
              title={`${seg.pid} [${seg.start} → ${seg.end}]`}
              style={{
                gridColumn: `span ${width}`,
                background: `linear-gradient(135deg, ${color}, rgba(255,255,255,0.06))`,
                transition: 'opacity 600ms ease',
                opacity: played ? 1 : 0,
                boxShadow: '0 6px 18px rgba(0,0,0,0.12)'
              }}
            >
              <div className="g-label">{seg.pid}</div>
            </div>
          )
        })}
      </div>
      <div className="time-row">
        {Array.from({ length: totalTime + 1 }).map((_, i) => (
          <div key={i} className="tick">{i}</div>
        ))}
      </div>
    </div>
  )
})

export default Gantt