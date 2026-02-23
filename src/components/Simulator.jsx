import React, { useState, useRef } from 'react'
import { computeSchedule } from '../utils/scheduler'
import Gantt from './Gantt'
import ProcessForm from './ProcessForm'

const DEFAULTS = [
  { pid: 'P1', arrival: 0, burst: 5, priority: 2 },
  { pid: 'P2', arrival: 1, burst: 3, priority: 1 },
  { pid: 'P3', arrival: 2, burst: 8, priority: 3 },
  { pid: 'P4', arrival: 3, burst: 6, priority: 2 }
]

export default function Simulator() {
  const [processes, setProcesses] = useState(DEFAULTS)
  const [algo, setAlgo] = useState('FCFS')
  const [quantum, setQuantum] = useState(2)
  const [timeline, setTimeline] = useState([])
  const [metrics, setMetrics] = useState(null)
  const [playing, setPlaying] = useState(false)
  const ganttRef = useRef()

  function handleAdd(p) {
    setProcesses(prev => [...prev, p])
  }
  function handleRemove(pid) {
    setProcesses(prev => prev.filter(x => x.pid !== pid))
  }
  function handleStart() {
    const { timeline: tl, metrics: m } = computeSchedule(processes, algo, Number(quantum))
    setTimeline(tl)
    setMetrics(m)
    setPlaying(true)
    // trigger Gantt animation via ref
    setTimeout(() => {
      ganttRef.current && ganttRef.current.play()
    }, 80)
  }
  function handleReset() {
    setTimeline([])
    setMetrics(null)
    setPlaying(false)
  }

  return (
    <div className="sim">
      <section className="controls">
        <div className="left">
          <h2>Processes</h2>
          <table className="proc-table">
            <thead><tr><th>PID</th><th>Arr</th><th>Burst</th><th>Prio</th><th></th></tr></thead>
            <tbody>
              {processes.map(p => (
                <tr key={p.pid}>
                  <td>{p.pid}</td>
                  <td>{p.arrival}</td>
                  <td>{p.burst}</td>
                  <td>{p.priority}</td>
                  <td><button onClick={() => handleRemove(p.pid)}>✖</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <ProcessForm onAdd={handleAdd} existing={processes} />
        </div>

        <div className="right">
          <h2>Simulation</h2>
          <label>Algorithm
            <select value={algo} onChange={e => setAlgo(e.target.value)}>
              <option>FCFS</option>
              <option>SJF</option>
              <option>SRTF</option>
              <option>Priority</option>
              <option>RoundRobin</option>
            </select>
          </label>
          {algo === 'RoundRobin' && (
            <label>Quantum
              <input type="number" min="1" value={quantum} onChange={e => setQuantum(e.target.value)} />
            </label>
          )}
          <div className="buttons">
            <button className="primary" onClick={handleStart}>Start</button>
            <button onClick={handleReset}>Reset</button>
          </div>

          {metrics && (
            <div className="metrics">
              <h3>Metrics</h3>
              <div>Avg Waiting Time: {metrics.avgWaiting.toFixed(2)}</div>
              <div>Avg Turnaround Time: {metrics.avgTurnaround.toFixed(2)}</div>
            </div>
          )}
        </div>
      </section>

      <section className="gantt-area">
        <h2>Gantt Chart</h2>
        <Gantt ref={ganttRef} timeline={timeline} playing={playing} />
      </section>
    </div>
  )
}