/**
 * Play_time - Web Audio API Synthesized Sound Effects
 * High performance, zero latency, no external audio files required!
 */

class SoundEffectsManager {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.init();
    }

    init() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        } catch (e) {
            console.warn("Web Audio API not supported", e);
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

    // Playful bubble pop
    playPop(freq = 440) {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.8, this.ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
    }

    // Boing sound for the runaway button
    playBoing() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(330, now + 0.22);
        osc.frequency.exponentialRampToValueAtTime(550, now + 0.32);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(now + 0.35);
    }

    // Camera shutter snapshot
    playShutter() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;

        const bufferSize = this.ctx.sampleRate * 0.05;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1200;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(now);

        const noise2 = this.ctx.createBufferSource();
        noise2.buffer = buffer;
        const gain2 = this.ctx.createGain();
        gain2.gain.setValueAtTime(0.35, now + 0.07);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

        noise2.connect(filter);
        filter.connect(gain2);
        gain2.connect(this.ctx.destination);
        noise2.start(now + 0.07);
    }

    // Party fanfare arpeggio
    playFanfare() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const notes = [392.00, 523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            const now = this.ctx.currentTime + (idx * 0.08);
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.35);
        });
    }

    // Comedy buzzer
    playBuzzer() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.setValueAtTime(120, now + 0.1);

        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.28);
    }

    // Sad trombone for rejection
    playSadTrombone() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const notes = [293.66, 277.18, 261.63, 246.94]; // D4, C#4, C4, B3
        notes.forEach((freq, idx) => {
            const now = this.ctx.currentTime + (idx * 0.26);
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now);
            if (idx === 3) {
                osc.frequency.linearRampToValueAtTime(freq * 0.88, now + 0.65);
            }

            gain.gain.setValueAtTime(0.22, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + (idx === 3 ? 0.7 : 0.24));

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + (idx === 3 ? 0.7 : 0.24));
        });
    }

    // Royal supreme triumph fanfare
    playEventsCommTriumph() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const chords = [
            { notes: [523.25, 659.25, 783.99], time: 0, dur: 0.2 },
            { notes: [587.33, 739.99, 880.00], time: 0.22, dur: 0.2 },
            { notes: [659.25, 830.61, 987.77], time: 0.44, dur: 0.2 },
            { notes: [783.99, 987.77, 1174.66, 1567.98], time: 0.68, dur: 0.65 }
        ];

        chords.forEach(chord => {
            chord.notes.forEach(freq => {
                const now = this.ctx.currentTime + chord.time;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now);

                gain.gain.setValueAtTime(0.14, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + chord.dur);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now);
                osc.stop(now + chord.dur);
            });
        });
    }

    // Celestial Past Lives Chime
    playPastLivesChime() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
        notes.forEach((freq, idx) => {
            const now = this.ctx.currentTime + (idx * 0.1);
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.6);
        });
    }

    // Sparkle dust chime
    playSparkle() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const freqs = [1200, 1500, 1800, 2100, 2400];
        freqs.forEach((freq, idx) => {
            const now = this.ctx.currentTime + (idx * 0.05);
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.18);
        });
    }
}

window.soundFx = new SoundEffectsManager();
