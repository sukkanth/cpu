import React, { useState, useEffect } from 'react'

export default function ProcessForm({ onAdd, existing }) {
  const [mode, setMode] = useState('single') // 'single' | 'bulk'
  const [pid, setPid] = useState(() => `P${existing.length + 1}`)
  const [arrival, setArrival] = useState(0)
  const [burst, setBurst] = useState(1)
  const [priority, setPriority] = useState(1)
  const [bulkText, setBulkText] = useState('') // CSV: PID,arrival,burst,priority per line

  useEffect(() => {
    setPid(`P${existing.length + 1}`)
  }, [existing.length])

  function add(e) {
    e && e.preventDefault()
    if (!pid || burst <= 0) return
    onAdd({ pid, arrival: Number(arrival), burst: Number(burst), priority: Number(priority) })
    setPid(`P${existing.length + 2}`)
    setArrival(0); setBurst(1); setPriority(1)
  }

  function importBulk(e) {
    e && e.preventDefault()
    const lines = bulkText.split('\n').map(l => l.trim()).filter(Boolean)
    let nextIndex = existing.length + 1
    const parsed = []
    for (const line of lines) {
      // Accept CSV or space-separated values
      const parts = line.split(/[,;\s]+/).map(p => p.trim()).filter(Boolean)
      if (parts.length < 2) continue
      const ppid = parts[0].match(/^P/i) ? parts[0] : `P${nextIndex++}`
      const parr = Number(parts[1] ?? 0)
      const pburst = Number(parts[2] ?? parts[1] ?? 1)
      const pprio = Number(parts[3] ?? 1)
      parsed.push({ pid: ppid, arrival: parr, burst: pburst, priority: pprio })
    }
    if (parsed.length === 0) return
    for (const p of parsed) onAdd(p)
    setBulkText('')
  }

  return (
    <div className="proc-form-wrap">
      <div className="mode-switch">
        <button className={mode==='single'?'active':''} onClick={()=>setMode('single')}>Single</button>
        <button className={mode==='bulk'?'active':''} onClick={()=>setMode('bulk')}>Bulk</button>
      </div>

      {mode === 'single' ? (
        <form className="proc-form" onSubmit={add}>
          <input value={pid} onChange={e => setPid(e.target.value)} placeholder="PID (e.g. P1)" />
          <input type="number" value={arrival} onChange={e => setArrival(e.target.value)} />
          <input type="number" min="1" value={burst} onChange={e => setBurst(e.target.value)} />
          <input type="number" value={priority} onChange={e => setPriority(e.target.value)} />
          <button type="submit">Add</button>
        </form>
      ) : (
        <form className="proc-form" onSubmit={importBulk}>
          <textarea placeholder={"Paste lines: PID,arrival,burst,priority\nOr: arrival burst priority (PID auto)"} value={bulkText} onChange={e=>setBulkText(e.target.value)} rows="5" />
          <div style={{display:'flex',gap:8}}>
            <button type="submit">Import</button>
            <button type="button" onClick={()=>setBulkText('')}>Clear</button>
          </div>
        </form>
      )}
    </div>
  )
}