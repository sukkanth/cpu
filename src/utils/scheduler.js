export function computeSchedule(processes, algo = 'FCFS', quantum = 2) {
  // clone and sort processes
  const procs = processes.map(p => ({ ...p }))
  // ensure numeric
  procs.forEach(p => { p.arrival = Number(p.arrival); p.burst = Number(p.burst); p.rem = Number(p.burst) })

  let time = 0
  const timeline = []
  const completed = []
  const q = []

  const pushSegment = (pid, start, end) => timeline.push({ pid, start, end })

  const avgMetrics = () => {
    const n = completed.length
    const avgWaiting = completed.reduce((s, p) => s + (p.startTimeSum - p.arrival), 0) / n
    const avgTurnaround = completed.reduce((s, p) => s + (p.finish - p.arrival), 0) / n
    return { avgWaiting, avgTurnaround }
  }

  if (algo === 'FCFS') {
    procs.sort((a, b) => a.arrival - b.arrival)
    time = 0
    for (const p of procs) {
      time = Math.max(time, p.arrival)
      p.start = time
      p.finish = time + p.burst
      pushSegment(p.pid, p.start, p.finish)
      time = p.finish
      completed.push(p)
    }
    const metrics = computeStats(completed)
    return { timeline, metrics }
  }

  if (algo === 'SJF') {
    const pending = [...procs].sort((a,b)=>a.arrival-b.arrival)
    const ready = []
    time = 0
    while (pending.length || ready.length) {
      while (pending.length && pending[0].arrival <= time) ready.push(pending.shift())
      if (!ready.length) { time = pending[0].arrival; continue }
      ready.sort((a,b)=>a.burst-b.burst || a.arrival-b.arrival)
      const p = ready.shift()
      p.start = time
      p.finish = time + p.burst
      pushSegment(p.pid, p.start, p.finish)
      time = p.finish
      completed.push(p)
    }
    const metrics = computeStats(completed)
    return { timeline, metrics }
  }

  if (algo === 'SRTF') {
    // preemptive shortest remaining time first
    const pending = [...procs].sort((a,b)=>a.arrival-b.arrival)
    const ready = []
    time = 0
    while (pending.length || ready.length) {
      while (pending.length && pending[0].arrival <= time) ready.push(pending.shift())
      if (!ready.length) { time = pending[0].arrival; continue }
      ready.sort((a,b)=>a.rem-b.rem || a.arrival-b.arrival)
      const p = ready[0]
      const nextArrival = pending.length ? pending[0].arrival : Infinity
      const exec = Math.min(p.rem, Math.max(1, nextArrival - time))
      const start = time
      time += exec
      p.rem -= exec
      pushSegment(p.pid, start, time)
      if (p.rem === 0) {
        p.finish = time
        completed.push(...ready.splice(ready.indexOf(p),1))
      }
    }
    const metrics = computeStats(completed)
    return { timeline, metrics }
  }

  if (algo === 'Priority') {
    const pending = [...procs].sort((a,b)=>a.arrival-b.arrival)
    const ready = []
    time = 0
    while (pending.length || ready.length) {
      while (pending.length && pending[0].arrival <= time) ready.push(pending.shift())
      if (!ready.length) { time = pending[0].arrival; continue }
      ready.sort((a,b)=>a.priority - b.priority || a.arrival - b.arrival)
      const p = ready.shift()
      p.start = time
      p.finish = time + p.burst
      pushSegment(p.pid, p.start, p.finish)
      time = p.finish
      completed.push(p)
    }
    const metrics = computeStats(completed)
    return { timeline, metrics }
  }

  if (algo === 'RoundRobin' || algo === 'Round-Robin' || algo === 'RR') {
    const pending = [...procs].sort((a,b)=>a.arrival-b.arrival)
    const ready = []
    time = 0
    while (pending.length || ready.length) {
      while (pending.length && pending[0].arrival <= time) ready.push(pending.shift())
      if (!ready.length) { time = pending[0].arrival; continue }
      const p = ready.shift()
      const exec = Math.min(quantum, p.rem)
      const start = time
      time += exec
      p.rem -= exec
      pushSegment(p.pid, start, time)
      // if new arrivals during execution, enqueue them
      while (pending.length && pending[0].arrival <= time) ready.push(pending.shift())
      if (p.rem > 0) ready.push(p)
      else { p.finish = time; completed.push(p) }
    }
    const metrics = computeStats(completed)
    return { timeline, metrics }
  }

  // fallback
  return { timeline: [], metrics: { avgWaiting: 0, avgTurnaround: 0 } }
}

function computeStats(completed) {
  // compute waiting and turnaround based on segments in timeline: approximate start sum
  // For simplicity, compute waiting as (finish - arrival - burst)
  let totalWait = 0, totalTurn = 0
  for (const p of completed) {
    const turnaround = p.finish - p.arrival
    const waiting = turnaround - p.burst
    totalWait += waiting
    totalTurn += turnaround
  }
  const n = completed.length || 1
  return { avgWaiting: totalWait / n, avgTurnaround: totalTurn / n, completed }
}