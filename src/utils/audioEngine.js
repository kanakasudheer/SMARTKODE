// A highly optimized synthesized audio engine using the native Web Audio API
// No assets/MP3s required!

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type, duration, vol = 0.1, slideFreq = null) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  if (slideFreq) {
    osc.frequency.exponentialRampToValueAtTime(slideFreq, audioCtx.currentTime + duration);
  }
  
  gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

export const sfx = {
  hover: () => playTone(300, 'sine', 0.1, 0.02),
  click: () => playTone(600, 'triangle', 0.1, 0.05, 800),
  correct: () => {
    playTone(440, 'square', 0.1, 0.05, 660); // A4 -> E5
    setTimeout(() => playTone(880, 'square', 0.2, 0.05), 100); // A5
  },
  wrong: () => playTone(150, 'sawtooth', 0.3, 0.1, 100),
  levelUp: () => {
    playTone(440, 'square', 0.2, 0.1, 554);
    setTimeout(() => playTone(554, 'square', 0.2, 0.1, 659), 150);
    setTimeout(() => playTone(659, 'square', 0.4, 0.1, 880), 300);
  },
  unlock: () => { // Trophy
    playTone(880, 'sine', 0.1, 0.05, 1200);
    setTimeout(() => playTone(1200, 'sine', 0.3, 0.05, 1760), 100);
  }
};
