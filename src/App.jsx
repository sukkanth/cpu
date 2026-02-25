import React from 'react';
import Simulator from './components/Simulator';
import Background from './components/Background';

export default function App() {
  return (
    <div className="app subhiksha-app">
      <Background />
      <div className="content">
        <header>
          <h1>
            CPU Scheduling Simulator
            <span className="header-badge">Built by Subhiksha</span>
          </h1>
          <p>Explore FCFS, SJF, SRTF, Priority, and Round Robin with animations.</p>
        </header>
        <main>
          <Simulator />
        </main>
        <footer>
          <small>Deploy-ready: Build and upload to Vercel. © Subhiksha</small>
        </footer>
      </div>
    </div>
  );
}