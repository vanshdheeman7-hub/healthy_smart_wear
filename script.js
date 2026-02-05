let badStartTime = null;
let history = JSON.parse(localStorage.getItem("postureHistory")) || [];

/* ---------- CONTINUOUS BEEP SETUP ---------- */
let audioCtx = null;
let oscillator = null;

function startBeep() {
  if (oscillator) return; // already beeping

  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); // beep tone
  gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
}

function stopBeep() {
  if (oscillator) {
    oscillator.stop();
    oscillator.disconnect();
    oscillator = null;
  }
}

/* ---------- GRAPH ---------- */
const ctx = document.getElementById("chart").getContext("2d");
const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: history.map((_, i) => "Attempt " + (i + 1)),
    datasets: [{
      label: "Wrong Posture Duration (sec)",
      data: history,
      borderColor: "red",
      fill: false
    }]
  }
});

/* ---------- SIMULATION ---------- */
function simulatePosture() {
  const angle = Math.floor(Math.random() * 60); // simulated posture angle
  const threshold = 30;

  document.getElementById("angle").innerText = angle;

  const statusEl = document.getElementById("status");
  const durationEl = document.getElementById("duration");

  if (angle > threshold) {
    statusEl.innerText = "WRONG POSTURE";
    statusEl.className = "bad";

    if (!badStartTime) {
      badStartTime = Date.now();
    }

    const duration = Math.floor((Date.now() - badStartTime) / 1000);
    durationEl.innerText = duration;

    startBeep(); // 🔊 START CONTINUOUS BEEP
  } 
  else {
    statusEl.innerText = "GOOD POSTURE";
    statusEl.className = "good";

    stopBeep(); // 🔕 STOP BEEP

    if (badStartTime) {
      const duration = Math.floor((Date.now() - badStartTime) / 1000);
      history.push(duration);
      localStorage.setItem("postureHistory", JSON.stringify(history));

      chart.data.labels.push("Attempt " + history.length);
      chart.data.datasets[0].data.push(duration);
      chart.update();

      badStartTime = null;
    }

    durationEl.innerText = 0;
  }
}
