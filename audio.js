/*
  Generative ambient piano in a calm, nostalgic "blocky sandbox game" mood — Web Audio API, no files.
  Original music: sparse soft piano over slow major-seventh chords, a warm pad and a roomy reverb.
  Starts only after the visitor turns it on (browsers block autoplay with sound).
*/
(() => {
  const btn = document.getElementById("soundToggle");
  if (!btn || !(window.AudioContext || window.webkitAudioContext)) { if (btn) btn.hidden = true; return; }

  const KEY = "dk-sound";
  const store = {
    get: () => { try { return localStorage.getItem(KEY); } catch (_) { return null; } },
    set: (v) => { try { localStorage.setItem(KEY, v); } catch (_) {} },
  };

  const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Key of C major. Chords as MIDI notes (bass, then upper voices); melody uses chord tones + scale.
  const CHORDS = [
    { name: "Cmaj7", bass: 36, tones: [48, 52, 55, 59] },
    { name: "Fmaj7", bass: 41, tones: [48, 53, 57, 64] },
    { name: "Am7",   bass: 45, tones: [48, 52, 55, 57] },
    { name: "Em7",   bass: 40, tones: [47, 50, 55, 59] },
    { name: "Dm9",   bass: 38, tones: [50, 53, 57, 64] },
    { name: "G6",    bass: 43, tones: [47, 50, 52, 55] },
  ];
  const PROGRESSIONS = [
    [0, 1, 0, 1],       // Cmaj7 – Fmaj7
    [0, 1, 2, 1],       // Cmaj7 – Fmaj7 – Am7 – Fmaj7
    [2, 1, 0, 5],       // Am7 – Fmaj7 – Cmaj7 – G6
    [0, 3, 1, 4],       // Cmaj7 – Em7 – Fmaj7 – Dm9
  ];
  const SCALE = [0, 2, 4, 5, 7, 9, 11];
  const inScale = (m) => SCALE.includes(((m % 12) + 12) % 12);

  let ctx, master, dry, wet, delaySend, timers = [], playing = false;
  let prog = PROGRESSIONS[0], step = 0, chord = CHORDS[0], lastMel = 72;

  function impulse(seconds, decay) {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }

  function build() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0;
    const warm = ctx.createBiquadFilter(); warm.type = "lowpass"; warm.frequency.value = 5200;
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 2.5;
    master.connect(warm).connect(comp).connect(ctx.destination);

    dry = ctx.createGain(); dry.gain.value = 0.7; dry.connect(master);
    const verb = ctx.createConvolver(); verb.buffer = impulse(4.5, 2.8);
    wet = ctx.createGain(); wet.gain.value = 0.55; wet.connect(verb).connect(master);

    const delay = ctx.createDelay(2); delay.delayTime.value = 0.48;
    const fb = ctx.createGain(); fb.gain.value = 0.28;
    const dlp = ctx.createBiquadFilter(); dlp.type = "lowpass"; dlp.frequency.value = 1800;
    delay.connect(dlp).connect(fb).connect(delay); dlp.connect(wet);
    delaySend = ctx.createGain(); delaySend.gain.value = 0.22; delaySend.connect(delay);
  }

  /* — soft piano: sine partials, gentle hammer, long exponential decay — */
  function piano(m, when, vel = 0.7, send = 0) {
    const t = when, f = hz(m);
    const len = Math.max(2.2, 6.5 - (m - 48) * 0.06);          // low notes ring longer
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.24 * vel, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.1 * vel, t + 0.35);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass";
    lp.frequency.setValueAtTime(1400 + 2600 * vel, t);
    lp.frequency.exponentialRampToValueAtTime(700, t + len * 0.7);
    lp.connect(g); g.connect(dry); g.connect(wet); if (send) g.connect(delaySend);
    [[1, 1, 0], [1, 0.6, 4], [2, 0.32, -3], [3, 0.1, 2], [4, 0.04, 0]].forEach(([mult, amp, det]) => {
      const o = ctx.createOscillator(); o.type = "sine";
      o.frequency.value = f * mult; o.detune.value = det;
      const og = ctx.createGain(); og.gain.value = amp;
      o.connect(og).connect(lp); o.start(t); o.stop(t + len + 0.1);
    });
  }

  /* — warm pad under each chord — */
  function pad(c, t, dur) {
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 650;
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.035, t + 3);
    g.gain.linearRampToValueAtTime(0, t + dur + 2);
    lp.connect(g); g.connect(wet); g.connect(dry);
    c.tones.slice(0, 3).forEach((m) => [-5, 5].forEach((det) => {
      const o = ctx.createOscillator(); o.type = "triangle";
      o.frequency.value = hz(m); o.detune.value = det;
      o.connect(lp); o.start(t); o.stop(t + dur + 2.2);
    }));
  }

  /* — one bar: a chord (spread or arpeggiated), plus a few unhurried melody notes — */
  function bar() {
    if (step % prog.length === 0 && step > 0 && Math.random() < 0.5) prog = pick(PROGRESSIONS);
    chord = CHORDS[prog[step % prog.length]]; step++;
    const t = ctx.currentTime + 0.1, dur = pick([7, 8, 8, 9]);
    pad(chord, t, dur);

    // left hand: bass + gently rolled chord, sometimes a slow arpeggio
    piano(chord.bass, t, 0.55);
    if (Math.random() < 0.55) {
      chord.tones.forEach((m, i) => piano(m, t + 0.05 + i * 0.07, 0.38));
    } else {
      chord.tones.forEach((m, i) => piano(m, t + 0.4 + i * 0.55, 0.35));
    }

    // right hand: 0–4 notes, mostly stepwise, lots of space
    const notes = pick([0, 1, 2, 2, 3, 3, 4]);
    let at = t + rand(1.2, 2.2);
    const pool = [];
    for (let m = 64; m <= 84; m++) if (inScale(m)) pool.push(m);
    for (let i = 0; i < notes && at < t + dur - 1; i++) {
      const near = pool.filter((m) => Math.abs(m - lastMel) <= 4 && m !== lastMel);
      const chordy = near.filter((m) => chord.tones.some((c) => (c - m) % 12 === 0));
      lastMel = pick(chordy.length && Math.random() < 0.65 ? chordy : near.length ? near : pool);
      piano(lastMel, at, rand(0.5, 0.8), 1);
      if (Math.random() < 0.15) piano(lastMel - 12, at + 0.01, 0.3);   // soft octave
      at += pick([0.8, 1.1, 1.5, 2.0]);
    }
    later(bar, dur);
  }

  function later(fn, sec) { timers.push(setTimeout(() => playing && fn(), Math.max(0.2, sec) * 1000)); }

  async function start() {
    if (!ctx) build();
    await ctx.resume();
    playing = true;
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(0.9, t + 3);
    timers.forEach(clearTimeout); timers = [];
    step = 0; prog = PROGRESSIONS[Math.floor(Math.random() * 2)];
    later(bar, 0.2);
    setUI(true);
  }

  function stop() {
    playing = false;
    timers.forEach(clearTimeout); timers = [];
    if (ctx) {
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(0, t + 1.5);
      setTimeout(() => { if (!playing) ctx.suspend(); }, 1600);
    }
    setUI(false);
  }

  function setUI(on) {
    btn.classList.toggle("on", on);
    document.documentElement.classList.toggle("sound-on", on); // AirPods Max on the 3D model
    btn.setAttribute("aria-pressed", String(on));
    btn.setAttribute("aria-label", on ? "Turn sound off" : "Turn sound on");
  }

  btn.addEventListener("click", () => {
    if (playing) { stop(); store.set("off"); } else { start(); store.set("on"); }
  });

  // If the visitor turned sound on before, resume on their first interaction (autoplay rules)
  if (store.get() === "on") {
    const resume = (e) => {
      off();
      if (e.target.closest && e.target.closest("#soundToggle")) return; // the button handles itself
      if (!playing) start();
    };
    const off = () => ["pointerdown", "keydown"].forEach((ev) => window.removeEventListener(ev, resume));
    ["pointerdown", "keydown"].forEach((ev) => window.addEventListener(ev, resume, { once: true }));
  }
  // pause when the tab is hidden, continue when back
  document.addEventListener("visibilitychange", () => {
    if (!ctx || !playing) return;
    if (document.hidden) ctx.suspend(); else ctx.resume();
  });
  setUI(false);
})();
