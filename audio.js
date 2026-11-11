/*
  Generative "cosmic" ambient in a Japanese mood — built with the Web Audio API, no audio files.
  Layers: low drone · slow breathing pads · koto-like plucks · glassy bells · soft "space wind",
  all on the In (Miyako-bushi) pentatonic scale, through a long reverb and a soft delay.
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

  // In scale on D: D Eb G A Bb (semitones from root)
  const ROOT = 62; // D4 (MIDI)
  const SCALE = [0, 1, 5, 7, 8];
  const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
  const note = (deg, oct = 0) => {
    const n = SCALE.length;
    const o = Math.floor(deg / n) + oct;
    return ROOT + SCALE[((deg % n) + n) % n] + 12 * o;
  };
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  let ctx, master, dry, wet, timers = [], playing = false, drones = [];

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
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.ratio.value = 3;
    master.connect(comp).connect(ctx.destination);

    // dry bus + big reverb + soft feedback delay
    dry = ctx.createGain(); dry.gain.value = 0.55; dry.connect(master);
    const verb = ctx.createConvolver(); verb.buffer = impulse(7, 2.6);
    wet = ctx.createGain(); wet.gain.value = 0.9;
    wet.connect(verb).connect(master);

    const delay = ctx.createDelay(2); delay.delayTime.value = 0.62;
    const fb = ctx.createGain(); fb.gain.value = 0.38;
    const dlp = ctx.createBiquadFilter(); dlp.type = "lowpass"; dlp.frequency.value = 2200;
    delay.connect(dlp).connect(fb).connect(delay);
    dlp.connect(wet);
    const delaySend = ctx.createGain(); delaySend.gain.value = 0.35; delaySend.connect(delay);
    build.delaySend = delaySend;

    startDrone();
    startWind();
  }

  /* — low drone: root + fifth, slowly breathing filter — */
  function startDrone() {
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 380; lp.Q.value = 0.7;
    const g = ctx.createGain(); g.gain.value = 0.11;
    lp.connect(g); g.connect(dry); g.connect(wet);
    [[note(0, -2), -6], [note(0, -2), 5], [note(3, -2), 0]].forEach(([m, det]) => {
      const o = ctx.createOscillator(); o.type = "triangle";
      o.frequency.value = hz(m); o.detune.value = det;
      o.connect(lp); o.start(); drones.push(o);
    });
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.035;
    const depth = ctx.createGain(); depth.gain.value = 180;
    lfo.connect(depth).connect(lp.frequency); lfo.start(); drones.push(lfo);
  }

  /* — very quiet filtered noise, like distant cosmic wind — */
  function startWind() {
    const len = ctx.sampleRate * 4, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 900; bp.Q.value = 1.4;
    const g = ctx.createGain(); g.gain.value = 0.012;
    src.connect(bp).connect(g).connect(wet);
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.05;
    const depth = ctx.createGain(); depth.gain.value = 600;
    lfo.connect(depth).connect(bp.frequency);
    src.start(); lfo.start(); drones.push(src, lfo);
  }

  /* — pads: 3-note chords from the scale, slow attack and release — */
  function pad() {
    const t = ctx.currentTime, dur = rand(9, 13);
    const base = pick([0, 2, 3, 5, -2]);
    [base, base + 2, base + 4].forEach((deg, i) => {
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 900 + i * 150;
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.035, t + 4);
      g.gain.linearRampToValueAtTime(0, t + dur);
      lp.connect(g); g.connect(dry); g.connect(wet);
      [-7, 7].forEach((det) => {
        const o = ctx.createOscillator(); o.type = "sawtooth";
        o.frequency.value = hz(note(deg, -1)); o.detune.value = det;
        o.connect(lp); o.start(t); o.stop(t + dur + 0.1);
      });
    });
    later(pad, dur - rand(2, 4));
  }

  /* — koto-like pluck: bright attack, tiny pitch drop, quick decay — */
  function pluck(m, when, vel = 1) {
    const t = when, f = hz(m);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.09 * vel, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass";
    lp.frequency.setValueAtTime(4200, t); lp.frequency.exponentialRampToValueAtTime(700, t + 1.2);
    lp.connect(g); g.connect(dry); g.connect(wet); g.connect(build.delaySend);
    [["triangle", 1, 1], ["sine", 2, 0.35], ["sine", 3, 0.12]].forEach(([type, mult, amp]) => {
      const o = ctx.createOscillator(); o.type = type;
      o.frequency.setValueAtTime(f * mult * 1.012, t);
      o.frequency.exponentialRampToValueAtTime(f * mult, t + 0.08);
      const og = ctx.createGain(); og.gain.value = amp;
      o.connect(og).connect(lp); o.start(t); o.stop(t + 2.4);
    });
  }

  function phrase() {
    const t = ctx.currentTime + 0.05;
    let deg = Math.floor(rand(2, 9));
    const count = pick([1, 2, 3, 3, 4, 5]);
    let at = t;
    for (let i = 0; i < count; i++) {
      pluck(note(deg, 0), at, rand(0.55, 1));
      if (Math.random() < 0.18) pluck(note(deg - 5, 0), at + 0.02, 0.4); // octave below
      deg += pick([-2, -1, -1, 1, 1, 2]);
      at += pick([0.32, 0.45, 0.6, 0.9]);
    }
    later(phrase, at - t + rand(2.5, 7));
  }

  /* — glassy bell (simple FM), rare and high — */
  function bell() {
    const t = ctx.currentTime, f = hz(note(Math.floor(rand(0, 6)), 1));
    const car = ctx.createOscillator(); car.frequency.value = f;
    const mod = ctx.createOscillator(); mod.frequency.value = f * 3.5;
    const mg = ctx.createGain(); mg.gain.setValueAtTime(f * 1.6, t); mg.gain.exponentialRampToValueAtTime(1, t + 3);
    mod.connect(mg).connect(car.frequency);
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.03, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 5);
    car.connect(g); g.connect(wet); g.connect(build.delaySend);
    car.start(t); mod.start(t); car.stop(t + 5.2); mod.stop(t + 5.2);
    later(bell, rand(9, 18));
  }

  function later(fn, sec) { timers.push(setTimeout(() => playing && fn(), Math.max(0.2, sec) * 1000)); }

  async function start() {
    if (!ctx) build();
    await ctx.resume();
    playing = true;
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(0.85, t + 3);
    timers.forEach(clearTimeout); timers = [];
    later(pad, 0.2); later(phrase, 2.5); later(bell, 6);
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
