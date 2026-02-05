const ESP32_IP = "http://192.168.4.1/data";

let history = JSON.parse(localStorage.getItem("history")) || [];
let labels = history.map((_, i) => "Attempt " + (i + 1));

const ctx = document.getElementById("chart").getContext("2d");

const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: labels,
    datasets: [{
      label: "Wrong Posture Duration (sec)",
      data: history,
      borderColor: "red",
      fill: false
    }]
  }
});

async function getData() {
  try {
    const res = await fetch(ESP32_IP);
    const data = await res.json();

    document.getElementById("flex").innerText = data.flex;
    document.getElementById("duration").innerText = data.duration;

    const statusEl = document.getElementById("status");

    if (data.status === "WRONG") {
      statusEl.innerText = "WRONG POSTURE";
      statusEl.className = "bad";
    } else {
      statusEl.innerText = "GOOD POSTURE";
      statusEl.className = "good";

      if (data.duration > 0) {
        history.push(data.duration);
        localStorage.setItem("history", JSON.stringify(history));

        chart.data.labels.push("Attempt " + history.length);
        chart.data.datasets[0].data.push(data.duration);
        chart.update();
      }
    }
  } catch (e) {
    console.log("Waiting for ESP32...");
  }
}

setInterval(getData, 1000);
