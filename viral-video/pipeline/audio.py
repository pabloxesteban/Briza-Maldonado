"""Pista y SFX sintetizados (sin samples de terceros).

La música del trend se agrega in-app al publicar; esta pista replica sólo la
forma (≈123 BPM, intro baja, drop) para que el timing del video sea compatible.
"""
import numpy as np

SR = 44100
BPM = 123
BEAT = 60 / BPM


def _t(dur):
    return np.arange(int(dur * SR)) / SR


def _env(n, a=0.005, r=0.1):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / max(r, 1e-4))
    return e


def _place(buf, x, start):
    i = int(start * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(x))
    buf[i:j] += x[: j - i]


def kick():
    t = _t(0.35)
    f = 50 + 110 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * 0.9


def hat(rng):
    n = rng.standard_normal(int(0.06 * SR))
    n = np.diff(n, prepend=0)  # high-pass casero
    return lowpass(n, 0.6) * _env(len(n), 0.001, 0.015) * 0.07


def clap(rng):
    n = rng.standard_normal(int(0.18 * SR))
    e = sum(_env(len(n), 0.001, 0.012) * (np.arange(len(n)) >= int(k * 0.011 * SR)) for k in range(3))
    return lowpass(np.diff(n, prepend=0), 0.35) * (e + _env(len(n), 0.001, 0.06)) * 0.12


def saw(freq, dur, detune=0.006):
    t = _t(dur)
    out = 0
    for d in (-detune, 0, detune):
        ph = (t * freq * (1 + d)) % 1
        out = out + (2 * ph - 1)
    return out / 3


def lowpass(x, alpha):
    """Filtro de un polo (alpha 0..1, más chico = más oscuro)."""
    from scipy.signal import lfilter
    if np.ndim(alpha):
        # alpha variable: aproximación por bloques
        y = np.empty_like(x); zi = np.zeros(1)
        for i in range(0, len(x), 512):
            a = float(np.mean(alpha[i:i + 512]))
            y[i:i + 512], zi = lfilter([a], [1, a - 1], x[i:i + 512], zi=zi)
        return y
    return lfilter([alpha], [1, alpha - 1], x)


NOTE = lambda m: 440 * 2 ** ((m - 69) / 12)

# Progresión pop-house "de aeróbic": Am F C G
CHORDS = [(57, 60, 64), (53, 57, 60), (48, 52, 55), (55, 59, 62)]
BASS = [45, 41, 48, 43]
LEAD = [76, 74, 72, 74, 76, 76, 76, None, 74, 74, 74, None, 76, 79, 79, None]


def track(duration, drop_at, seed=1):
    """Pista completa. Antes del drop: pad filtrado bajito + lead suelto. Después: four-on-the-floor."""
    rng = np.random.default_rng(seed)
    L = np.zeros(int((duration + 1) * SR))
    bar = BEAT * 4
    nbars = int(duration / bar) + 2
    K, C = kick(), clap(rng)
    for b in range(nbars):
        t0 = b * bar
        ci = b % 4
        # pad de acordes
        pad = sum(saw(NOTE(n), bar) for n in CHORDS[ci]) / 3
        pad *= np.minimum(1, _t(bar) / 0.05) * np.minimum(1, (bar - _t(bar)) / 0.05)
        post = t0 >= drop_at - 1e-6
        _place(L, lowpass(pad, 0.06 if not post else 0.18) * (0.30 if not post else 0.16), t0)
        if post:
            for q in range(4):
                tb = t0 + q * BEAT
                _place(L, K, tb)
                _place(L, hat(rng), tb + BEAT / 2)
                if q in (1, 3):
                    _place(L, C, tb)
                # bajo en corcheas a contratiempo
                bs = saw(NOTE(BASS[ci]), BEAT / 2 * 0.9)
                bs = lowpass(bs, 0.08) * _env(len(bs), 0.003, 0.18) * 0.35
                _place(L, bs, tb + BEAT / 2)
        # lead (siempre, más fuerte post drop)
        for s, n in enumerate(LEAD):
            if n is None:
                continue
            tn = t0 + s * BEAT / 4
            v = saw(NOTE(n), BEAT / 4 * 0.85, 0.003)
            v = lowpass(v, 0.25) * _env(len(v), 0.004, 0.09)
            _place(L, v * (0.10 if not post else 0.10), tn)
    # riser antes del drop
    rl = min(2 * bar, drop_at)
    if rl > 0:
        n = rng.standard_normal(int(rl * SR))
        n = np.diff(n, prepend=0) * np.linspace(0, 1, len(n)) ** 2 * 0.06
        _place(L, n, drop_at - rl)
    return L[: int(duration * SR)]


# ---------- SFX ----------

def sfx_boom():
    t = _t(1.2)
    f = 55 * np.exp(-t * 0.8) + 20
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.5)
    x = np.tanh(x * 4) * 0.8
    click = np.random.default_rng(3).standard_normal(int(0.01 * SR)) * 0.4
    x[: len(click)] += click
    return x


def sfx_pop(pitch=1.0):
    t = _t(0.09)
    f = (900 * pitch) * np.exp(-t * 40) + 300
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 45) * 0.45


def sfx_ding():
    t = _t(1.0)
    x = sum(np.sin(2 * np.pi * f * t) * a for f, a in ((1568, 1), (3136, 0.4), (4705, 0.2)))
    return x * np.exp(-t * 4) * 0.35


def sfx_scratch():
    t = _t(0.45)
    rng = np.random.default_rng(7)
    n = rng.standard_normal(len(t))
    mod = np.sin(2 * np.pi * 7 * t) * 0.5 + 0.5
    x = lowpass(n, 0.05 + 0.25 * mod) * np.exp(-t * 3) * 0.9
    return np.tanh(x * 3) * 0.6


def sfx_whoosh():
    t = _t(0.5)
    n = np.random.default_rng(11).standard_normal(len(t))
    x = lowpass(n, 0.02 + 0.3 * np.sin(np.pi * t / 0.5) ** 2) * np.sin(np.pi * t / 0.5) ** 2
    return x * 0.5


def sfx_cash():
    x = sfx_ding()
    t = _t(0.25)
    rng = np.random.default_rng(5)
    rattle = rng.standard_normal(len(t)) * (np.sin(2 * np.pi * 30 * t) > 0.6) * np.exp(-t * 10) * 0.25
    out = np.zeros(int(1.1 * SR))
    _place(out, rattle, 0)
    _place(out, x, 0.12)
    return out


def sfx_tape_stop(src, at, dur=0.8):
    """Efecto 'se cortó la música': devuelve la porción resampleada con pitch cayendo."""
    i = int(at * SR)
    seg = src[i:i + int(dur * 1.6 * SR)]
    if len(seg) < 10:
        return np.zeros(int(dur * SR))
    rate = np.linspace(1, 0.05, int(dur * SR))
    pos = np.cumsum(rate)
    pos = pos[pos < len(seg) - 1]
    return np.interp(pos, np.arange(len(seg)), seg) * np.linspace(1, 0, len(pos))


SFX = {
    "boom": sfx_boom, "pop": sfx_pop, "ding": sfx_ding, "scratch": sfx_scratch,
    "whoosh": sfx_whoosh, "cash": sfx_cash,
}


def mix(duration, drop_at, events, music_cuts=(), seed=1, music_gain=1.0, base=None):
    """events: [(t, nombre, gain, kwargs)]. music_cuts: [(t0, t1)] silencios deliberados
    (con tape-stop en t0 si se pide con ('tapestop', t0, t1))."""
    if base is not None:
        music = np.zeros(int(duration * SR), np.float32)
        music[: min(len(base), len(music))] = base[: len(music)]
        music *= music_gain
    else:
        music = track(duration, drop_at, seed) * music_gain
    for cut in music_cuts:
        kind, t0, t1 = cut if len(cut) == 3 else ("cut", *cut)
        i0, i1 = int(t0 * SR), int(t1 * SR)
        if kind == "tapestop":
            ts = sfx_tape_stop(music.copy(), t0, min(0.7, t1 - t0))
            music[i0:i1] = 0
            _place(music, ts, t0)
        else:
            music[i0:i1] = 0
    out = music.copy()
    for ev in events:
        t, name, gain = ev[:3]
        kw = ev[3] if len(ev) > 3 else {}
        _place(out, SFX[name](**kw) * gain, t)
    if base is None:
        out = np.tanh(out * 1.2) / np.tanh(1.2)
    peak = np.max(np.abs(out)) or 1
    return (out / max(peak, 0.89) * 0.89).astype(np.float32)


def write_wav(path, x):
    import wave
    pcm = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    st = np.stack([pcm, pcm], 1).tobytes()
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(st)
