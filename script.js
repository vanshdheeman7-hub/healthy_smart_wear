let badStartTime = null;
let history = JSON.parse(localStorage.getItem("postureHistory")) || [];

// Setup chart
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

function simulatePosture() {
  // Simulated posture angle
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

    alert("⚠️ Wrong Posture Detected! Please sit straight.");
  } else {
    statusEl.innerText = "GOOD POSTURE";
    statusEl.className = "good";

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
