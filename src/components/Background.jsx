import React from 'react';
import './Background.css';

export default function Background() {
  const birdCount = 7;
  const bubbleCount = 12;
  const particleCount = 40;
  const fishCount = 6;

  return (
    <div className="subhiksha-bg" aria-hidden="true">
      <div className="stars" />
      <div className="orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <svg className="wave" viewBox="0 0 1200 200" preserveAspectRatio="none">
        <path d="M0,80 C300,150 900,0 1200,80 L1200,200 L0,200 Z" />
      </svg>

      {/* Birds (existing) */}
      <div className="birds" aria-hidden="true">
        {Array.from({ length: birdCount }).map((_, i) => (
          <div key={`b${i}`} className={`bird bird-${i + 1}`}>
            <svg viewBox="0 0 64 32" className="bird-svg" aria-hidden="true">
              <g fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path className="wing wing-left" d="M2 18 C10 6, 26 6, 34 18" />
                <path className="wing wing-right" d="M30 18 C38 6, 54 6, 62 18" />
              </g>
            </svg>
          </div>
        ))}
      </div>

      {/* Floating bubbles */}
      <div className="bubbles">
        {Array.from({ length: bubbleCount }).map((_, i) => (
          <div key={`bubble-${i}`} className={`bubble b-${i + 1}`} />
        ))}
      </div>

      {/* Bioluminescent particles */}
      <div className="particles">
        {Array.from({ length: particleCount }).map((_, i) => (
          <div key={`p-${i}`} className={`particle p-${i + 1}`} />
        ))}
      </div>

      {/* School of fish */}
      <div className="fish-school" aria-hidden="true">
        {Array.from({ length: fishCount }).map((_, i) => (
          <div key={`fish-${i}`} className={`fish fish-${i + 1}`}>
            <svg viewBox="0 0 64 24" className="fish-svg" aria-hidden="true">
              <path d="M2 12 C18 2, 46 2, 62 12 C46 22, 18 22, 2 12 Z" fill="rgba(255,255,255,0.07)"/>
              <path d="M14 12 C20 9, 28 9, 34 12" stroke="rgba(255,255,255,0.24)" strokeWidth="1.6" fill="none"/>
            </svg>
          </div>
        ))}
      </div>

      {/* Caustic overlay */}
      <div className="caustics" />
    </div>
  );
}