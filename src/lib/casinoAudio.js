// Casino Audio Engine — Web Audio API, no external files
// All sounds synthesized programmatically

let ctx = null
const getCtx = () => {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

const master = (vol = 0.4) => {
  const g = getCtx().createGain()
  g.gain.value = vol
  g.connect(getCtx().destination)
  return g
}

// Coin insert click
export function playCoinInsert() {
  try {
    const ac = getCtx(), g = master(0.3)
    const buf = ac.createBuffer(1, ac.sampleRate * 0.15, ac.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ac.sampleRate * 0.02))
    }
    const src = ac.createBufferSource()
    src.buffer = buf
    const f = ac.createBiquadFilter()
    f.type = 'bandpass'; f.frequency.value = 3000; f.Q.value = 2
    src.connect(f); f.connect(g)
    src.start()
  } catch(e){}
}

// Claw mechanical descent
export function playClawDescend(duration = 2) {
  try {
    const ac = getCtx(), g = master(0.15)
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(120, ac.currentTime)
    osc.frequency.linearRampToValueAtTime(80, ac.currentTime + duration)
    gain.gain.setValueAtTime(0.1, ac.currentTime)
    gain.gain.linearRampToValueAtTime(0, ac.currentTime + duration)
    osc.connect(gain); gain.connect(g)
    osc.start(); osc.stop(ac.currentTime + duration)
  } catch(e){}
}

// Claw grab clunk
export function playClawGrab() {
  try {
    const ac = getCtx(), g = master(0.4)
    ;[0, 0.04, 0.09].forEach((t, i) => {
      const osc = ac.createOscillator()
      const gain = ac.createGain()
      osc.frequency.value = 180 - i * 30
      osc.type = 'square'
      gain.gain.setValueAtTime(0.3, ac.currentTime + t)
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + t + 0.12)
      osc.connect(gain); gain.connect(g)
      osc.start(ac.currentTime + t)
      osc.stop(ac.currentTime + t + 0.15)
    })
  } catch(e){}
}

// Drumroll — builds in intensity, tier controls length/complexity
export function playDrumroll(tier = 'CoreClaw', onEnd) {
  try {
    const ac = getCtx()
    const TIER_CFG = {
      CoreClaw:    { duration: 1.5, finalHits: 4, bpm: 180 },
      PremierClaw: { duration: 2.5, finalHits: 6, bpm: 220 },
      UltraClaw:   { duration: 3.5, finalHits: 8, bpm: 260 },
      QuantumClaw: { duration: 5.0, finalHits: 12, bpm: 300 },
    }
    const cfg = TIER_CFG[tier] || TIER_CFG.CoreClaw
    const g = master(0.5)

    const snare = (t, vol = 0.3) => {
      const buf = ac.createBuffer(1, ac.sampleRate * 0.08, ac.sampleRate)
      const d = buf.getChannelData(0)
      for (let i = 0; i < d.length; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ac.sampleRate * 0.015))
      }
      const src = ac.createBufferSource()
      src.buffer = buf
      const gain = ac.createGain()
      gain.gain.value = vol
      const f = ac.createBiquadFilter()
      f.type = 'highpass'; f.frequency.value = 200
      src.connect(f); f.connect(gain); gain.connect(g)
      src.start(ac.currentTime + t)
    }

    // Accelerating roll
    let t = 0, interval = 60 / cfg.bpm
    while (t < cfg.duration - 0.4) {
      snare(t, 0.15 + (t / cfg.duration) * 0.3)
      t += interval
      interval *= 0.97 // accelerate
    }
    // Final rapid hits
    for (let i = 0; i < cfg.finalHits; i++) {
      snare(cfg.duration - 0.35 + i * 0.03, 0.5)
    }
    if (onEnd) setTimeout(onEnd, cfg.duration * 1000)
  } catch(e){ if(onEnd) setTimeout(onEnd, 2000) }
}

// Fanfare — ascending notes, tier controls grandeur
export function playFanfare(tier = 'CoreClaw') {
  try {
    const ac = getCtx(), g = master(0.5)
    const PATTERNS = {
      CoreClaw:    { notes:[523,659,784,1047],   dur:0.12, wave:'triangle' },
      PremierClaw: { notes:[523,659,784,1047,1319], dur:0.14, wave:'sawtooth' },
      UltraClaw:   { notes:[392,523,659,784,1047,1319,1568], dur:0.13, wave:'square' },
      QuantumClaw: { notes:[261,329,392,523,659,784,1047,1319,1568,2093], dur:0.12, wave:'sawtooth' },
    }
    const pat = PATTERNS[tier] || PATTERNS.CoreClaw
    const reverb = ac.createConvolver()
    const revBuf = ac.createBuffer(2, ac.sampleRate * 1.5, ac.sampleRate)
    for (let ch = 0; ch < 2; ch++) {
      const d = revBuf.getChannelData(ch)
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ac.sampleRate * 0.3))
    }
    reverb.buffer = revBuf
    reverb.connect(g)

    pat.notes.forEach((freq, i) => {
      const osc = ac.createOscillator()
      const gain = ac.createGain()
      osc.type = pat.wave; osc.frequency.value = freq
      gain.gain.setValueAtTime(0, ac.currentTime + i * pat.dur)
      gain.gain.linearRampToValueAtTime(0.4, ac.currentTime + i * pat.dur + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + i * pat.dur + pat.dur * 2.5)
      osc.connect(gain); gain.connect(reverb)
      osc.start(ac.currentTime + i * pat.dur)
      osc.stop(ac.currentTime + (i + 3) * pat.dur)
    })
  } catch(e){}
}

// Quantum thunder boom
export function playThunder() {
  try {
    const ac = getCtx(), g = master(0.6)
    const buf = ac.createBuffer(1, ac.sampleRate * 1.5, ac.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ac.sampleRate * 0.3)) * (i < ac.sampleRate * 0.05 ? 1 : 0.4)
    }
    const src = ac.createBufferSource()
    src.buffer = buf
    const f = ac.createBiquadFilter()
    f.type = 'lowpass'; f.frequency.value = 300
    src.connect(f); f.connect(g)
    src.start()
  } catch(e){}
}

// Ambient casino loop (background hum)
let ambientNode = null
export function startAmbient() {
  try {
    stopAmbient()
    const ac = getCtx(), g = master(0.04)
    const osc1 = ac.createOscillator()
    const osc2 = ac.createOscillator()
    osc1.type = 'sine'; osc1.frequency.value = 55
    osc2.type = 'sine'; osc2.frequency.value = 110
    osc1.connect(g); osc2.connect(g)
    osc1.start(); osc2.start()
    ambientNode = [osc1, osc2]
  } catch(e){}
}
export function stopAmbient() {
  try { ambientNode?.forEach(n => n.stop()); ambientNode = null } catch(e){}
}

export function resumeAudio() {
  try { getCtx() } catch(e){}
}
