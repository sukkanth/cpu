import React from 'react'
import Simulator from './components/Simulator'
import Background from './components/Background'

export default function App() {
  return (
    <div className="app">
      <Background />
      <header>
        <h1>
          CPU Scheduling Simulator
          <span className="header-badge">Built by Sukkanth</span>
        </h1>
        <p>FCFS · SJF · SRTF · Priority · Round Robin — animated Gantt chart</p>
      </header>
      <main>
        <Simulator />
      </main>
      <footer>
        <small>Ready to deploy: build and upload to Vercel. © Sukkanth</small>
      </footer>
    </div>
  )
}