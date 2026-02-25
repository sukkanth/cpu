import React, { useState, useEffect, useRef } from 'react';
import './ProcessForm.css';

export default function ProcessForm({ onAdd, existing = [] }) {
  const [pid, setPid] = useState(() => `P${existing.length + 1}`);
  const [arrival, setArrival] = useState(0);
  const [burst, setBurst] = useState(1);
  const [priority, setPriority] = useState(1);
  const [preview, setPreview] = useState([]);
  const [error, setError] = useState('');
  const invalidRef = useRef(false);

  useEffect(() => setPid(`P${existing.length + 1}`), [existing.length]);

  function clearError() {
    setError('');
    invalidRef.current = false;
  }

  function validateSingle() {
    if (!pid.trim()) return 'PID required';
    if (isNaN(burst) || Number(burst) <= 0) return 'Burst must be > 0';
    if (isNaN(arrival) || Number(arrival) < 0) return 'Arrival must be ≥ 0';
    return '';
  }

  function add(e) {
    e && e.preventDefault();
    clearError();
    const v = validateSingle();
    if (v) {
      setError(v);
      invalidRef.current = true;
      return;
    }
    const proc = { pid: pid.trim(), arrival: Number(arrival), burst: Number(burst), priority: Number(priority) };
    onAdd(proc);
    setPreview(prev => [proc, ...prev].slice(0, 6));
    // bump next pid
    setPid(prev => {
      const match = prev.match(/\d+$/);
      const next = match ? Number(match[0]) + 1 : existing.length + 2;
      return `P${next}`;
    });
    setArrival(0); setBurst(1); setPriority(1);
  }

  function resetForm() {
    setPid(`P${existing.length + 1}`);
    setArrival(0);
    setBurst(1);
    setPriority(1);
    clearError();
  }

  function removePreview(index) {
    setPreview(prev => prev.filter((_, i) => i !== index));
  }

  return (
    <div className={`proc-form-wrap modern ${invalidRef.current ? 'invalid' : ''}`}>
      <div className="pf-header">
        <div className="title">Add Process</div>
        <div className="preview-title">Recent</div>
      </div>

      <div className="pf-body">
        <form className="proc-form" onSubmit={add} noValidate>
          <label className="field">
            <div className="label">PID</div>
            <input value={pid} onChange={e => setPid(e.target.value)} placeholder="P1" />
          </label>

          <label className="field small">
            <div className="label">Arrival</div>
            <div className="stepper">
              <button type="button" onClick={() => setArrival(a => Math.max(0, Number(a) - 1))}>−</button>
              <input type="number" value={arrival} onChange={e => setArrival(e.target.value)} />
              <button type="button" onClick={() => setArrival(a => Number(a) + 1)}>+</button>
            </div>
          </label>

          <label className="field small">
            <div className="label">Burst</div>
            <div className="stepper">
              <button type="button" onClick={() => setBurst(b => Math.max(1, Number(b) - 1))}>−</button>
              <input type="number" min="1" value={burst} onChange={e => setBurst(e.target.value)} />
              <button type="button" onClick={() => setBurst(b => Number(b) + 1)}>+</button>
            </div>
          </label>

          <label className="field small">
            <div className="label">Priority</div>
            <div className="stepper">
              <button type="button" onClick={() => setPriority(p => Math.max(0, Number(p) - 1))}>−</button>
              <input type="number" value={priority} onChange={e => setPriority(e.target.value)} />
              <button type="button" onClick={() => setPriority(p => Number(p) + 1)}>+</button>
            </div>
          </label>

          <div className="form-actions">
            <button type="submit" className="btn btn-add animated start-btn">Add</button>
            <button type="button" className="btn btn-clear reset-btn" onClick={resetForm}>Reset</button>
          </div>
        </form>

        <div className="live-preview" aria-hidden={false}>
          {preview.length === 0 ? (
            <div className="empty">No recent processes</div>
          ) : (
            preview.map((p, i) => (
              <div className="chip" key={`${p.pid}-${i}`}>
                <div className="chip-left">
                  <strong>{p.pid}</strong>
                  <span className="meta">A:{p.arrival} B:{p.burst} P:{p.priority}</span>
                </div>
                <button className="chip-remove" onClick={() => removePreview(i)} aria-label={`Remove ${p.pid}`}>✕</button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className={`pf-footer ${error ? 'show-error' : ''}`}>
        <div className="hint">Tip: Use the steppers to fine-tune values quickly.</div>
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}