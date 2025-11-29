import { useEffect, useMemo, useRef, useState } from "react";
import * as Tone from "tone";

import "./SongGenerator.css";

/**
 * Ek Aur Khaali Notebook — Web Audio + Hindi/Urdu Voice Player
 * - Tone.js for chords + melody
 * - Web Speech API (TTS) speaking DEVANAGARI (hi/ur) ONLY — no Anglicized reading
 * - Play / Pause / Stop / Seek + lyric highlighting
 * - Voice controls: enable/disable, choose voice, rate, pitch, volume
 */

// ====== SONG DEFINITION ======
const TEMPO = 80; // BPM
const TIME_SIG: [number, number] = [4, 4]; // 4/4
const SECS_PER_BEAT = 60 / TEMPO;

// Chord dictionary (note names)
const CHORDS: Record<string, string[]> = {
  Am: ["A3", "C4", "E4"],
  F: ["F3", "A3", "C4"],
  C: ["C3", "E3", "G3"],
  G: ["G3", "B3", "D4"],
  Dm: ["D3", "F3", "A3"],
};

// Structure
const structure = [
  { name: "Intro", chords: ["Am", "F", "C", "G"], repeats: 2 },
  { name: "Verse 1", chords: ["Am", "F", "C", "G"], repeats: 2 },
  { name: "Chorus 1", chords: ["Am", "F", "C", "G"], repeats: 2 },
  { name: "Verse 2", chords: ["Am", "F", "C", "G"], repeats: 2 },
  { name: "Chorus 2", chords: ["Am", "F", "C", "G"], repeats: 2 },
  { name: "Bridge", chords: ["Dm", "F", "Am", "G"], repeats: 2 },
  { name: "Final Chorus", chords: ["Am", "F", "C", "G"], repeats: 2 },
  { name: "Outro", chords: ["Am", "F", "C", "G"], repeats: 2 },
] as const;

// ===== DEVANAGARI LYRICS (Hindi/Urdu) =====
const LYRICS: Record<string, { line: string; bars: number }[]> = {
  "Verse 1": [
    { line: "एक और खाली नोटबुक,", bars: 1 },
    { line: "फिर से ली बाज़ार से,", bars: 1 },
    { line: "कवर पर लिखा ‘ड्रीम बिग’,", bars: 1 },
    { line: "अंदर लिखा ‘कल से’…", bars: 1 },
    { line: "पेन भी बोला ‘चलो लिखते हैं’", bars: 1 },
    { line: "दिल बोला ‘रुक जा ज़रा’", bars: 1 },
    { line: "पेज पर घूमते रहे इरादे,", bars: 1 },
    { line: "पर लिखा कुछ भी न…", bars: 1 },
  ],
  "Chorus 1": [
    { line: "खाली नोटबुक, खाली मैं,", bars: 2 },
    { line: "दोनों में कुछ भी लिखा नहीं है।", bars: 2 },
    { line: "ज़िंदगी का ड्राफ़्ट बन रहा था,", bars: 2 },
    { line: "अब तो रीसायकल बिन में गया है।", bars: 2 },
  ],
  "Verse 2": [
    { line: "टेबल पे रखी ‘स्टार्टअप 2020’,", bars: 1 },
    { line: "‘वर्कआउट प्लैन’, ‘ग्रैटिट्यूड डे’,", bars: 1 },
    { line: "सब पे थोड़ा धूल जमा है,", bars: 1 },
    { line: "सब कह रहे — ‘सेम ओल्ड प्ले’।", bars: 1 },
    { line: "एक पेज पर लिखा था ‘आज से डिसिप्लिन आएगा’", bars: 2 },
    { line: "दूसरे पेज पर लिखा ‘नेटफ्लिक्स फिर देख आएगा’।", bars: 2 },
  ],
  "Chorus 2": [
    { line: "खाली नोटबुक, खाली मैं,", bars: 2 },
    { line: "दोनों में सपने अधूरे हैं।", bars: 2 },
    { line: "लिखा था ‘मैं दुनिया बदल दूँगा’,", bars: 2 },
    { line: "पर वाई‑फ़ाई ने प्लान्स चुरा लिए।", bars: 2 },
  ],
  Bridge: [
    { line: "मोहल्ले का स्टेशनरी वाला, अब मुझे नाम से जानता है,", bars: 2 },
    { line: "हर महीने एक नई उम्मीद लाता हूँ।", bars: 2 },
    { line: "और वो किताब कहती है धीरे से —", bars: 2 },
    { line: "‘तुझ में जज़्बा बचा है या सिर्फ़ शौक?’", bars: 2 },
  ],
  "Final Chorus": [
    { line: "खाली नोटबुक, तू रोई मत,", bars: 2 },
    { line: "एक दिन मैं लिख ही दूँगा ‘मत’।", bars: 2 },
    { line: "तेरा एक पेज इंस्टाग्राम पे जाएगा,", bars: 2 },
    { line: "कैप्शन में लिखा ‘राइटर वाइब्स’।", bars: 2 },
  ],
  Outro: [
    { line: "एक और खाली नोटबुक…", bars: 2 },
    { line: "लिख गई सिर्फ़ ‘आज नहीं यार’।", bars: 2 },
  ],
};

type MelodyEvent = {
  note: string | null;
  beats: number; // quarter-note units for spacing + duration
  velocity?: number;
};

// Verse tilts into a lifted chorus hook with syncopated eighths
const MELODY_SEQUENCE: MelodyEvent[] = [
  { note: "A3", beats: 0.5, velocity: 0.55 },
  { note: "C4", beats: 0.5, velocity: 0.62 },
  { note: "E4", beats: 1, velocity: 0.76 },
  { note: "G4", beats: 0.5, velocity: 0.8 },
  { note: "E4", beats: 0.5, velocity: 0.72 },
  { note: "C4", beats: 1, velocity: 0.64 },
  { note: "B3", beats: 0.5, velocity: 0.6 },
  { note: "C4", beats: 0.5, velocity: 0.68 },
  { note: "D4", beats: 1, velocity: 0.74 },
  { note: "E4", beats: 0.5, velocity: 0.72 },
  { note: "F4", beats: 0.5, velocity: 0.76 },
  { note: "G4", beats: 1, velocity: 0.8 },
  { note: "E4", beats: 0.5, velocity: 0.72 },
  { note: "D4", beats: 0.5, velocity: 0.68 },
  { note: "C4", beats: 1, velocity: 0.64 },
  { note: null, beats: 0.5 },
  { note: "E4", beats: 0.5, velocity: 0.72 },
  { note: "F4", beats: 0.5, velocity: 0.78 },
  { note: "G4", beats: 0.5, velocity: 0.8 },
  { note: "A4", beats: 1, velocity: 0.86 },
  { note: "C5", beats: 0.5, velocity: 0.92 },
  { note: "A4", beats: 0.5, velocity: 0.85 },
  { note: "G4", beats: 1, velocity: 0.8 },
  { note: "F4", beats: 0.5, velocity: 0.78 },
  { note: "E4", beats: 0.5, velocity: 0.74 },
  { note: "D4", beats: 1, velocity: 0.7 },
  { note: "E4", beats: 0.5, velocity: 0.74 },
  { note: "F4", beats: 0.5, velocity: 0.78 },
  { note: "G4", beats: 1, velocity: 0.82 },
  { note: "E4", beats: 0.5, velocity: 0.74 },
  { note: "D4", beats: 0.5, velocity: 0.7 },
  { note: "C4", beats: 1, velocity: 0.66 },
  { note: "B3", beats: 1, velocity: 0.6 },
];

const BASS_ROOTS: Record<string, string> = {
  Am: "A2",
  F: "F2",
  C: "C2",
  G: "G2",
  Dm: "D2",
};

const ARP_STEPS = [0, 1, 2, 1, 0, 2, 1, 2];

const raiseOctave = (note: string, octaves = 1) => {
  const match = note.match(/^([A-G][b#]?)(\d)$/);
  if (!match) return note;
  const [, pitch, octave] = match;
  return `${pitch}${Number(octave) + octaves}`;
};

const buildArpNotes = (chordNotes: string[]) => {
  if (!chordNotes.length) return [];
  const raised = chordNotes.map((note) => raiseOctave(note, 1));
  return ARP_STEPS.map((idx) => raised[idx % raised.length]);
};

const GUITAR_STRUM_BEAT_OFFSETS = [0, 0.12, 0.2, 0.32];

type TablaHit = {
  offsetBeats: number;
  target: "low" | "high";
  duration: string;
  velocity: number;
};

const TABLA_PATTERN: TablaHit[] = [
  { offsetBeats: 0, target: "low", duration: "8n", velocity: 0.95 },
  { offsetBeats: 0.5, target: "high", duration: "16n", velocity: 0.8 },
  { offsetBeats: 1.5, target: "high", duration: "16n", velocity: 0.75 },
  { offsetBeats: 2, target: "low", duration: "8n", velocity: 0.9 },
  { offsetBeats: 2.75, target: "high", duration: "16n", velocity: 0.78 },
  { offsetBeats: 3.25, target: "high", duration: "16n", velocity: 0.82 },
];

const TABLA_NOTES = {
  low: "A1",
  high: "E3",
};

const TABLA_HIGH_RATIO = 0.84;

function SongGenerator() {
  // Transport + UI state
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [nowSec, setNowSec] = useState(0);
  const [durationSec, setDurationSec] = useState(0);
  const [currentSection, setCurrentSection] = useState("Intro");
  const [currentLyric, setCurrentLyric] = useState("");

  // Voice state
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState("");
  const [voiceRate, setVoiceRate] = useState(0.95);
  const [voicePitch, setVoicePitch] = useState(1.0);
  const [voiceVolume, setVoiceVolume] = useState(1);

  // Instrument mix + rhythm state
  const [padEnabled, setPadEnabled] = useState(true);
  const [padLevel, setPadLevel] = useState(1.2);
  const [leadEnabled, setLeadEnabled] = useState(true);
  const [leadLevel, setLeadLevel] = useState(1.3);
  const [bassEnabled, setBassEnabled] = useState(true);
  const [bassLevel, setBassLevel] = useState(1.35);
  const [arpEnabled, setArpEnabled] = useState(true);
  const [arpLevel, setArpLevel] = useState(1.25);
  const [guitarEnabled, setGuitarEnabled] = useState(true);
  const [guitarLevel, setGuitarLevel] = useState(1.9);
  const [guitarSpread, setGuitarSpread] = useState(1);
  const [tablaEnabled, setTablaEnabled] = useState(true);
  const [tablaLevel, setTablaLevel] = useState(1.25);
  const [tablaDensity, setTablaDensity] = useState(1);
  const [tablaAccent, setTablaAccent] = useState(1);

  // Refs
  const chordSynthRef = useRef<Tone.PolySynth | null>(null);
  const leadSynthRef = useRef<Tone.FMSynth | null>(null);
  const bassSynthRef = useRef<Tone.MonoSynth | null>(null);
  const arpSynthRef = useRef<Tone.PluckSynth | null>(null);
  const guitarSynthRef = useRef<Tone.PluckSynth | null>(null);
  const guitarBodySynthRef = useRef<Tone.MonoSynth | null>(null);
  const tablaLowRef = useRef<Tone.MembraneSynth | null>(null);
  const tablaHighRef = useRef<Tone.MembraneSynth | null>(null);
  const tablaHighNoiseRef = useRef<Tone.NoiseSynth | null>(null);
  const padGainRef = useRef<Tone.Gain | null>(null);
  const leadGainRef = useRef<Tone.Gain | null>(null);
  const arpGainRef = useRef<Tone.Gain | null>(null);
  const guitarGainRef = useRef<Tone.Gain | null>(null);
  const bassGainRef = useRef<Tone.Gain | null>(null);
  const tablaLowGainRef = useRef<Tone.Gain | null>(null);
  const tablaHighGainRef = useRef<Tone.Gain | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);
  const timelineRef = useRef<
    { time: number; section: string; chord?: string }[]
  >([]);
  const lyricCuesRef = useRef<
    { start: number; end: number; text: string; section: string }[]
  >([]);

  // Enforce Hindi/Urdu only for TTS
  const HINDI_URDU_ONLY = true;
  const isHiUr = (v: SpeechSynthesisVoice) =>
    !!v.lang && /^(hi|ur)/i.test(v.lang);

  // Build timing helpers
  const barDur = useMemo(() => SECS_PER_BEAT * TIME_SIG[0], []);

  useEffect(() => {
    // Build chord timeline + lyric cues and compute duration
    const tl: { time: number; section: string; chord?: string }[] = [];
    const lyricCues: {
      start: number;
      end: number;
      text: string;
      section: string;
    }[] = [];

    let currentBar = 0;
    for (const sec of structure) {
      const secStartBar = currentBar;
      // chords
      for (let r = 0; r < sec.repeats; r++) {
        for (const ch of sec.chords) {
          const start = currentBar * barDur;
          tl.push({ time: start, section: sec.name, chord: ch });
          currentBar += 1;
        }
      }
      // lyrics
      const lines = LYRICS[sec.name];
      if (lines) {
        let cursorBar = secStartBar;
        for (const l of lines) {
          const start = cursorBar * barDur;
          const end = (cursorBar + l.bars) * barDur;
          lyricCues.push({ start, end, text: l.line, section: sec.name });
          cursorBar += l.bars;
        }
      }
    }

    timelineRef.current = tl;
    lyricCuesRef.current = lyricCues;
    setDurationSec(currentBar * barDur);
  }, [barDur]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        Tone.Transport.cancel();
        Tone.Transport.stop();
      } catch {}
      try {
        window.speechSynthesis && window.speechSynthesis.cancel();
      } catch {}
    };
  }, []);

  // Load voices (Hindi/Urdu mandatory)
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const load = () => {
      const all = window.speechSynthesis.getVoices();
      const filtered = HINDI_URDU_ONLY ? all.filter(isHiUr) : all;
      setVoices(filtered);
      if (!filtered.length) return; // keep selection empty to force user to install hi/ur voices
      if (!selectedVoiceURI) {
        const pref =
          filtered.find((v) => v.lang.toLowerCase().startsWith("hi")) ||
          filtered[0];
        if (pref) setSelectedVoiceURI(pref.voiceURI || pref.name || "");
      }
    };

    load();
    window.speechSynthesis.onvoiceschanged = load;
  }, [selectedVoiceURI]);

  const initAudio = async () => {
    await Tone.start();
    Tone.Transport.bpm.value = TEMPO;
    Tone.Transport.timeSignature = TIME_SIG as any;

    const reverb = new Tone.Reverb({ decay: 2.8, wet: 0.25 });
    const chorus = new Tone.Chorus(3.5, 2.5, 0.2).start();
    const delay = new Tone.FeedbackDelay("8n", 0.25);

    const chordSynth = new Tone.PolySynth(Tone.AMSynth, {
      harmonicity: 1.5,
      oscillator: { type: "triangle" },
      envelope: { attack: 0.05, decay: 0.3, sustain: 0.6, release: 1.4 },
      modulation: { type: "sine" },
      modulationEnvelope: {
        attack: 0.2,
        decay: 0.3,
        sustain: 0.4,
        release: 1,
      },
    });
    const leadSynth = new Tone.FMSynth({
      harmonicity: 2.5,
      modulationIndex: 8,
      oscillator: { type: "triangle" },
      envelope: { attack: 0.02, decay: 0.15, sustain: 0.5, release: 0.35 },
      modulation: { type: "sine" },
      modulationEnvelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0.3,
        release: 0.2,
      },
    });
    const bassSynth = new Tone.MonoSynth({
      oscillator: { type: "sawtooth" },
      envelope: { attack: 0.01, decay: 0.2, sustain: 0.65, release: 0.8 },
      filter: { type: "lowpass", rolloff: -24 },
      filterEnvelope: {
        attack: 0.02,
        decay: 0.2,
        sustain: 0.4,
        release: 0.6,
        baseFrequency: 60,
        octaves: 2,
      },
    });
    const arpSynth = new Tone.PluckSynth({
      dampening: 3600,
      resonance: 0.9,
      attackNoise: 1.1,
    });
    const guitarSynth = new Tone.PluckSynth({
      dampening: 3400,
      resonance: 0.9,
      attackNoise: 1.4,
    });
    const guitarBodySynth = new Tone.MonoSynth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.005, decay: 0.3, sustain: 0.3, release: 0.6 },
      filter: { type: "bandpass", Q: 0.9, frequency: 1600 },
      filterEnvelope: {
        attack: 0.003,
        decay: 0.3,
        sustain: 0.1,
        release: 0.2,
        baseFrequency: 500,
        octaves: 2,
      },
    });
    const tablaLow = new Tone.MembraneSynth({
      pitchDecay: 0.08,
      octaves: 3,
      oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.45, sustain: 0, release: 0.12 },
    });
    const tablaHigh = new Tone.MembraneSynth({
      pitchDecay: 0.01,
      octaves: 5,
      oscillator: { type: "triangle" },
      envelope: { attack: 0.001, decay: 0.18, sustain: 0, release: 0.08 },
    });
    const tablaHighNoise = new Tone.NoiseSynth({
      noise: { type: "pink" },
      envelope: { attack: 0.001, decay: 0.07, sustain: 0, release: 0.05 },
      volume: -6,
    });

    const masterBus = new Tone.Gain(1);
    const glue = new Tone.Compressor(-18, 3);
    const limiter = new Tone.Limiter(-1);
    masterBus.chain(glue, limiter, Tone.Destination);

    const chordGain = new Tone.Gain(padEnabled ? padLevel : 0);
    const leadGain = new Tone.Gain(leadEnabled ? leadLevel : 0);
    const arpGain = new Tone.Gain(arpEnabled ? arpLevel : 0);
    chordSynth.chain(chorus, chordGain, reverb, masterBus);
    leadSynth.chain(delay, leadGain, reverb, masterBus);
    arpSynth.chain(delay, arpGain, reverb, masterBus);
    const guitarGain = new Tone.Gain(guitarEnabled ? guitarLevel : 0);
    guitarSynth.chain(guitarGain, delay, reverb, masterBus);
    guitarBodySynth.chain(guitarGain, reverb, masterBus);
    const tablaLowGain = new Tone.Gain(tablaEnabled ? tablaLevel : 0);
    const tablaHighGain = new Tone.Gain(
      tablaEnabled ? tablaLevel * TABLA_HIGH_RATIO : 0
    );
    tablaLow.chain(tablaLowGain, reverb, masterBus);
    tablaHigh.chain(tablaHighGain, reverb, masterBus);
    tablaHighNoise.chain(tablaHighGain, masterBus);

    const bassFilter = new Tone.Filter(140, "lowpass");
    const bassGain = new Tone.Gain(bassEnabled ? bassLevel : 0);
    bassSynth.chain(bassFilter, bassGain, masterBus);

    chordSynthRef.current = chordSynth;
    leadSynthRef.current = leadSynth;
    bassSynthRef.current = bassSynth;
    arpSynthRef.current = arpSynth;
    guitarSynthRef.current = guitarSynth;
    guitarBodySynthRef.current = guitarBodySynth;
    tablaLowRef.current = tablaLow;
    tablaHighRef.current = tablaHigh;
    tablaHighNoiseRef.current = tablaHighNoise;
    padGainRef.current = chordGain;
    leadGainRef.current = leadGain;
    arpGainRef.current = arpGain;
    guitarGainRef.current = guitarGain;
    bassGainRef.current = bassGain;
    tablaLowGainRef.current = tablaLowGain;
    tablaHighGainRef.current = tablaHighGain;
    reverbRef.current = reverb;

    setIsReady(true);
  };

  useEffect(() => {
    if (!padGainRef.current) return;
    padGainRef.current.gain.rampTo(padEnabled ? padLevel : 0, 0.12);
  }, [padEnabled, padLevel]);

  useEffect(() => {
    if (!leadGainRef.current) return;
    leadGainRef.current.gain.rampTo(leadEnabled ? leadLevel : 0, 0.12);
  }, [leadEnabled, leadLevel]);

  useEffect(() => {
    if (!arpGainRef.current) return;
    arpGainRef.current.gain.rampTo(arpEnabled ? arpLevel : 0, 0.12);
  }, [arpEnabled, arpLevel]);

  useEffect(() => {
    if (!guitarGainRef.current) return;
    guitarGainRef.current.gain.rampTo(guitarEnabled ? guitarLevel : 0, 0.12);
  }, [guitarEnabled, guitarLevel]);

  useEffect(() => {
    if (!bassGainRef.current) return;
    bassGainRef.current.gain.rampTo(bassEnabled ? bassLevel : 0, 0.12);
  }, [bassEnabled, bassLevel]);

  useEffect(() => {
    const targetLow = tablaEnabled ? tablaLevel : 0;
    const targetHigh = tablaEnabled ? tablaLevel * TABLA_HIGH_RATIO : 0;
    if (tablaLowGainRef.current)
      tablaLowGainRef.current.gain.rampTo(targetLow, 0.12);
    if (tablaHighGainRef.current)
      tablaHighGainRef.current.gain.rampTo(targetHigh, 0.12);
  }, [tablaEnabled, tablaLevel]);

  const getSelectedVoice = (): SpeechSynthesisVoice | null => {
    if (!voices || !voices.length) return null;
    const v =
      voices.find((v) => (v.voiceURI || v.name) === selectedVoiceURI) ||
      voices[0];
    return v || null;
  };

  const speakLine = (text: string) => {
    if (
      !voiceEnabled ||
      typeof window === "undefined" ||
      !window.speechSynthesis
    )
      return;
    const v = getSelectedVoice();
    if (!v) return; // enforce Devanagari voices only
    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = v;
    // Force language to the chosen voice's lang (hi-IN/ur-PK) to avoid anglicized pronunciation
    utter.lang = v.lang || "hi-IN";
    utter.rate = voiceRate; // 0.1 – 10
    utter.pitch = voicePitch; // 0 – 2
    utter.volume = voiceVolume; // 0 – 1
    // small pause at line end
    window.speechSynthesis.speak(utter);
  };

  const scheduleSong = () => {
    if (
      !chordSynthRef.current ||
      !leadSynthRef.current ||
      !bassSynthRef.current ||
      !arpSynthRef.current ||
      !guitarSynthRef.current ||
      !tablaLowRef.current ||
      !tablaHighRef.current ||
      !guitarBodySynthRef.current
    )
      return;

    Tone.Transport.cancel();
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    let lastGuitarTime = -Infinity;

    // schedule chords
    for (const evt of timelineRef.current) {
      if (!evt.chord) continue;
      Tone.Transport.schedule((time) => {
        setCurrentSection(evt.section);
        if (padEnabled) {
          chordSynthRef.current!.triggerAttackRelease(
            CHORDS[evt.chord!] || [],
            "1m",
            time
          );
        }
      }, evt.time);

      const chordNotes = CHORDS[evt.chord] || [];

      if (guitarEnabled) {
        chordNotes.forEach((note, idx) => {
          const baseOffset = GUITAR_STRUM_BEAT_OFFSETS[idx] ?? idx * 0.12;
          const beatOffset = baseOffset * guitarSpread;
          const velocity = Math.max(0.55, 0.8 - idx * 0.1);
          let targetTime = evt.time + beatOffset * SECS_PER_BEAT;
          if (targetTime <= lastGuitarTime) {
            targetTime = lastGuitarTime + 0.001;
          }
          Tone.Transport.schedule((time) => {
            guitarSynthRef.current!.triggerAttackRelease(
              raiseOctave(note, 1),
              "8n",
              time,
              velocity
            );
            guitarBodySynthRef.current!.triggerAttackRelease(
              note,
              "8n",
              time,
              velocity * 0.65
            );
          }, targetTime);
          lastGuitarTime = targetTime;
        });
      }

      const bassNote = evt.chord ? BASS_ROOTS[evt.chord] : null;
      if (bassNote && bassEnabled) {
        Tone.Transport.schedule((time) => {
          bassSynthRef.current!.triggerAttackRelease(bassNote, "1m", time, 0.7);
        }, evt.time);
      }

      if (arpEnabled) {
        const arpNotes = buildArpNotes(
          evt.chord ? CHORDS[evt.chord] || [] : []
        );
        const arpStep = SECS_PER_BEAT / 2; // eighth-note pulse
        arpNotes.forEach((note, idx) => {
          if (!note) return;
          Tone.Transport.schedule(
            (time) => {
              arpSynthRef.current!.triggerAttackRelease(note, "16n", time, 0.4);
            },
            evt.time + idx * arpStep
          );
        });
      }

      if (tablaEnabled) {
        TABLA_PATTERN.forEach((hit) => {
          const tablaTime =
            evt.time + hit.offsetBeats * tablaDensity * SECS_PER_BEAT;
          Tone.Transport.schedule((time) => {
            const synth =
              hit.target === "low"
                ? tablaLowRef.current!
                : tablaHighRef.current!;
            const note =
              hit.target === "low" ? TABLA_NOTES.low : TABLA_NOTES.high;
            const velocity = Math.min(1, hit.velocity * tablaAccent);
            synth.triggerAttackRelease(note, hit.duration, time, velocity);
            if (hit.target === "high" && tablaHighNoiseRef.current) {
              tablaHighNoiseRef.current.triggerAttackRelease(
                hit.duration,
                time,
                velocity * 0.9
              );
            }
          }, tablaTime);
        });
      }
    }

    // schedule melody (starting at Verse 1 start)
    const verse1Start =
      timelineRef.current.find((e) => e.section === "Verse 1")?.time ?? 0;
    let cursor = verse1Start;
    if (leadEnabled) {
      MELODY_SEQUENCE.forEach((event) => {
        const note = event.note;
        if (note) {
          const duration = event.beats * SECS_PER_BEAT;
          Tone.Transport.schedule((time) => {
            leadSynthRef.current!.triggerAttackRelease(
              note,
              duration,
              time,
              event.velocity ?? 0.8
            );
          }, cursor);
        }
        cursor += event.beats * SECS_PER_BEAT;
      });
    }

    // schedule lyric highlighting + Hindi/Urdu speech
    lyricCuesRef.current.forEach((cue) => {
      Tone.Transport.schedule(() => {
        setCurrentLyric(cue.text);
        setCurrentSection(cue.section);
        speakLine(cue.text);
      }, cue.start);
    });

    // progress UI updater
    Tone.Transport.scheduleRepeat(() => {
      const t = Tone.Transport.seconds;
      setNowSec(t);
      setProgress(durationSec ? Math.min(1, t / durationSec) : 0);
      if (t > durationSec) setCurrentLyric("");
    }, "8n");
  };

  const onPlay = async () => {
    if (!isReady) await initAudio();
    scheduleSong();
    Tone.Transport.start("+0.05");
    setIsPlaying(true);
  };

  const onPause = () => {
    Tone.Transport.pause();
    try {
      window.speechSynthesis && window.speechSynthesis.pause();
    } catch {}
    setIsPlaying(false);
  };

  const onStop = () => {
    Tone.Transport.stop();
    Tone.Transport.seconds = 0;
    try {
      window.speechSynthesis && window.speechSynthesis.cancel();
    } catch {}
    setIsPlaying(false);
    setProgress(0);
    setCurrentLyric("");
    setCurrentSection("Intro");
  };

  // seek via progress bar drag
  const onSeek = (val: number) => {
    const t = val * durationSec;
    Tone.Transport.seconds = t;
    setProgress(val);
  };

  const speechSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;
  const hindiVoiceAvailable = voices && voices.length > 0;

  const formatSec = (s: number) => `${s.toFixed(1)}s`;

  return (
    <div className="song-generator-wrapper min-h-screen w-full bg-neutral-950 text-neutral-100 flex flex-col items-center px-4 py-8">
      <div className="max-w-4xl w-full">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-center">
          Ek Aur Khaali Notebook —{" "}
          <span className="text-emerald-300">हिंदी/اردو Voice</span>
        </h1>
        <p className="text-neutral-400 text-center mt-2">
          Indie · A minor · 80 BPM · WebAudio + Web Speech (hi/ur)
        </p>

        {/* Player Card */}
        <div className="mt-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 p-5 shadow-xl">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 justify-center">
            {!isPlaying ? (
              <button
                onClick={onPlay}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-semibold shadow"
              >
                {isReady ? "Play" : "Start Audio & Play"}
              </button>
            ) : (
              <button
                onClick={onPause}
                className="px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black font-semibold shadow"
              >
                Pause
              </button>
            )}
            <button
              onClick={onStop}
              className="px-5 py-2.5 rounded-xl bg-neutral-200/90 hover:bg-white text-black font-semibold rounded-xl"
            >
              Stop
            </button>
          </div>

          {/* Progress */}
          <div className="mt-5">
            <input
              type="range"
              min={0}
              max={1000}
              value={Math.floor(progress * 1000)}
              onChange={(e) => onSeek(Number(e.target.value) / 1000)}
              className="w-full accent-emerald-400"
            />
            <div className="flex justify-between text-xs text-neutral-400 mt-1">
              <span>{formatSec(nowSec)}</span>
              <span>{durationSec ? formatSec(durationSec) : ""}</span>
            </div>
          </div>

          {/* Voice Controls */}
          <div className="mt-6 grid gap-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-neutral-300 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={voiceEnabled}
                  onChange={(e) => setVoiceEnabled(e.target.checked)}
                />{" "}
                Enable Hindi/Urdu Voice
              </label>
              {speechSupported && !hindiVoiceAvailable && (
                <span className="text-xs text-red-300">
                  Install a Hindi/Urdu system voice to avoid English accent
                  (hi‑IN / ur‑PK).
                </span>
              )}
              {!speechSupported && (
                <span className="text-xs text-red-300">
                  TTS not supported in this browser
                </span>
              )}
            </div>

            {speechSupported && hindiVoiceAvailable && (
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-400">
                    Voice (hi/ur only)
                  </label>
                  <select
                    className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-sm"
                    value={selectedVoiceURI}
                    onChange={(e) => setSelectedVoiceURI(e.target.value)}
                  >
                    {voices.map((v, idx) => (
                      <option key={idx} value={v.voiceURI || v.name}>
                        {v.name} {v.lang ? `(${v.lang})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-neutral-400">Rate</label>
                    <input
                      type="range"
                      min={0.6}
                      max={1.2}
                      step={0.01}
                      value={voiceRate}
                      onChange={(e) => setVoiceRate(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400">Pitch</label>
                    <input
                      type="range"
                      min={0.8}
                      max={1.3}
                      step={0.01}
                      value={voicePitch}
                      onChange={(e) => setVoicePitch(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400">Volume</label>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={voiceVolume}
                      onChange={(e) => setVoiceVolume(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Instrument Controls */}
          <div className="mt-6">
            <div className="text-sm uppercase tracking-widest text-neutral-400">
              Instrument Mix
            </div>
            <div className="grid md:grid-cols-2 gap-3 mt-2">
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
                <div className="flex items-center justify-between text-sm text-neutral-200">
                  <span>Chords / Pad</span>
                  <label className="text-xs text-neutral-400 flex items-center gap-2">
                    <span>{padEnabled ? "On" : "Off"}</span>
                    <input
                      type="checkbox"
                      checked={padEnabled}
                      onChange={(e) => setPadEnabled(e.target.checked)}
                    />
                  </label>
                </div>
                <input
                  type="range"
                  min={0}
                  max={2}
                  step={0.01}
                  className="w-full accent-emerald-400 mt-2"
                  value={padLevel}
                  onChange={(e) => setPadLevel(Number(e.target.value))}
                  disabled={!padEnabled}
                />
                <div className="text-xs text-neutral-400 mt-1">
                  Level {padLevel.toFixed(2)}
                </div>
              </div>

              <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
                <div className="flex items-center justify-between text-sm text-neutral-200">
                  <span>Lead Melody</span>
                  <label className="text-xs text-neutral-400 flex items-center gap-2">
                    <span>{leadEnabled ? "On" : "Off"}</span>
                    <input
                      type="checkbox"
                      checked={leadEnabled}
                      onChange={(e) => setLeadEnabled(e.target.checked)}
                    />
                  </label>
                </div>
                <input
                  type="range"
                  min={0}
                  max={2}
                  step={0.01}
                  className="w-full accent-emerald-400 mt-2"
                  value={leadLevel}
                  onChange={(e) => setLeadLevel(Number(e.target.value))}
                  disabled={!leadEnabled}
                />
                <div className="text-xs text-neutral-400 mt-1">
                  Level {leadLevel.toFixed(2)}
                </div>
              </div>

              <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
                <div className="flex items-center justify-between text-sm text-neutral-200">
                  <span>Bass</span>
                  <label className="text-xs text-neutral-400 flex items-center gap-2">
                    <span>{bassEnabled ? "On" : "Off"}</span>
                    <input
                      type="checkbox"
                      checked={bassEnabled}
                      onChange={(e) => setBassEnabled(e.target.checked)}
                    />
                  </label>
                </div>
                <input
                  type="range"
                  min={0}
                  max={2}
                  step={0.01}
                  className="w-full accent-emerald-400 mt-2"
                  value={bassLevel}
                  onChange={(e) => setBassLevel(Number(e.target.value))}
                  disabled={!bassEnabled}
                />
                <div className="text-xs text-neutral-400 mt-1">
                  Level {bassLevel.toFixed(2)}
                </div>
              </div>

              <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
                <div className="flex items-center justify-between text-sm text-neutral-200">
                  <span>Guitar</span>
                  <label className="text-xs text-neutral-400 flex items-center gap-2">
                    <span>{guitarEnabled ? "On" : "Off"}</span>
                    <input
                      type="checkbox"
                      checked={guitarEnabled}
                      onChange={(e) => setGuitarEnabled(e.target.checked)}
                    />
                  </label>
                </div>
                <input
                  type="range"
                  min={0}
                  max={2}
                  step={0.01}
                  className="w-full accent-emerald-400 mt-2"
                  value={guitarLevel}
                  onChange={(e) => setGuitarLevel(Number(e.target.value))}
                  disabled={!guitarEnabled}
                />
                <div className="text-xs text-neutral-400 mt-1">
                  Level {guitarLevel.toFixed(2)}
                </div>
              </div>

              <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
                <div className="flex items-center justify-between text-sm text-neutral-200">
                  <span>Arp / Sparkles</span>
                  <label className="text-xs text-neutral-400 flex items-center gap-2">
                    <span>{arpEnabled ? "On" : "Off"}</span>
                    <input
                      type="checkbox"
                      checked={arpEnabled}
                      onChange={(e) => setArpEnabled(e.target.checked)}
                    />
                  </label>
                </div>
                <input
                  type="range"
                  min={0}
                  max={2}
                  step={0.01}
                  className="w-full accent-emerald-400 mt-2"
                  value={arpLevel}
                  onChange={(e) => setArpLevel(Number(e.target.value))}
                  disabled={!arpEnabled}
                />
                <div className="text-xs text-neutral-400 mt-1">
                  Level {arpLevel.toFixed(2)}
                </div>
              </div>

              <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
                <div className="flex items-center justify-between text-sm text-neutral-200">
                  <span>Tabla</span>
                  <label className="text-xs text-neutral-400 flex items-center gap-2">
                    <span>{tablaEnabled ? "On" : "Off"}</span>
                    <input
                      type="checkbox"
                      checked={tablaEnabled}
                      onChange={(e) => setTablaEnabled(e.target.checked)}
                    />
                  </label>
                </div>
                <input
                  type="range"
                  min={0}
                  max={2}
                  step={0.01}
                  className="w-full accent-emerald-400 mt-2"
                  value={tablaLevel}
                  onChange={(e) => setTablaLevel(Number(e.target.value))}
                  disabled={!tablaEnabled}
                />
                <div className="text-xs text-neutral-400 mt-1">
                  Level {tablaLevel.toFixed(2)} (use rhythm controls below)
                </div>
              </div>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-4 mt-5">
              <div className="text-sm uppercase tracking-wider text-neutral-400">
                Rhythm Controls
              </div>
              <div className="grid md:grid-cols-2 gap-3 mt-2">
                <div>
                  <label className="text-xs text-neutral-400">
                    Guitar Strum Spread
                  </label>
                  <input
                    type="range"
                    min={0.6}
                    max={1.6}
                    step={0.01}
                    value={guitarSpread}
                    onChange={(e) => setGuitarSpread(Number(e.target.value))}
                    className="w-full accent-emerald-400 mt-1"
                  />
                  <div className="text-xs text-neutral-400 mt-1">
                    Spread ×{guitarSpread.toFixed(2)}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-neutral-400">
                    Tabla Beat Density
                  </label>
                  <input
                    type="range"
                    min={0.6}
                    max={1.4}
                    step={0.01}
                    value={tablaDensity}
                    onChange={(e) => setTablaDensity(Number(e.target.value))}
                    className="w-full accent-emerald-400 mt-1"
                    disabled={!tablaEnabled}
                  />
                  <div className="text-xs text-neutral-400 mt-1">
                    Density ×{tablaDensity.toFixed(2)}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-neutral-400">
                    Tabla Accent
                  </label>
                  <input
                    type="range"
                    min={0.7}
                    max={1.5}
                    step={0.01}
                    value={tablaAccent}
                    onChange={(e) => setTablaAccent(Number(e.target.value))}
                    className="w-full accent-emerald-400 mt-1"
                    disabled={!tablaEnabled}
                  />
                  <div className="text-xs text-neutral-400 mt-1">
                    Accent ×{tablaAccent.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section + Lyric */}
          <div className="mt-6 grid gap-2">
            <div className="text-sm uppercase tracking-widest text-neutral-400">
              Now Playing
            </div>
            <div className="text-lg font-medium">{currentSection}</div>
            <div className="mt-1 text-2xl font-semibold text-emerald-300 min-h-[2.5rem]">
              {currentLyric || "‎"}
            </div>
          </div>
        </div>

        {/* Lyrics pane */}
        <div className="mt-8 grid gap-6">
          {Object.entries(LYRICS).map(([sec, lines]) => (
            <div
              key={sec}
              className="bg-neutral-900/50 rounded-2xl border border-neutral-800 p-4"
            >
              <div className="text-sm tracking-wider uppercase text-neutral-400 mb-2">
                {sec}
              </div>
              <ul className="grid gap-1">
                {lines.map((l, i) => (
                  <li
                    key={i}
                    className={`text-neutral-200 ${currentLyric === l.line ? "text-emerald-300 font-semibold" : ""}`}
                  >
                    {l.line}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* About */}
        <div className="mt-8 text-xs text-neutral-500 text-center">
          WebAudio: Tone.js · Voice: Web Speech API (hi/ur only) · A minor · 80
          BPM.
        </div>
      </div>
    </div>
  );
}

export { SongGenerator };
