/* ---------- USER NAME (OPTION 2) ---------- */
let userName = localStorage.getItem("userName");

if (!userName) {
  userName = prompt("Enter your name:");
  if (!userName) userName = "User";
  localStorage.setItem("userName", userName);
}

document.getElementById("welcome").innerText =
  "Welcome, " + userName + " 👋";

function changeUser() {
  localStorage.removeItem("userName");
  location.reload();
}

/* ---------- HISTORY ---------- */
let badStartTime = null;
let history = JSON.parse(localStorage.getItem("postureHistory")) || [];

/* ---------- CONTINUOUS BEEP ---------- */
let audioCtx = null;
let oscillator = null;

function startBeep() {
  if (oscillator) return;

  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
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
/*const ctx = document.getElementById("chart").getContext("2d");
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
*/
const ctx = document.getElementById("chart").getContext("2d");

const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: history.map((_, i) => "Attempt " + (i + 1)),
    datasets: [{
      label: "Wrong Posture Duration (seconds)",
      data: history,
      borderColor: "red",
      fill: false,
      tension: 0.3
    }]
  },
  options: {
    scales: {
      x: {
        title: {
          display: true,
          text: "Posture Attempt Number"
        }
      },
      y: {
        title: {
          display: true,
          text: "Wrong Posture Duration (seconds)"
        },
        beginAtZero: true
      }
    }
  }
});




/* ---------- SIMULATION ---------- */
function simulatePosture() {
  const angle = Math.floor(Math.random() * 60);
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

    startBeep();
  } else {
    statusEl.innerText = "GOOD POSTURE";
    statusEl.className = "good";

    stopBeep();

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

/* ---------- CLEAR HISTORY ---------- */
function clearHistory() {
  stopBeep();

  history = [];
  localStorage.removeItem("postureHistory");

  chart.data.labels = [];
  chart.data.datasets[0].data = [];
  chart.update();

  document.getElementById("status").innerText = "---";
  document.getElementById("status").className = "";
  document.getElementById("angle").innerText = "---";
  document.getElementById("duration").innerText = "0";

  badStartTime = null;

  alert("History cleared successfully!");
}

