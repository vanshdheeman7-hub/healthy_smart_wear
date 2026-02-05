// ---------- USER NAME ----------
let userName = localStorage.getItem("userName");

if (!userName) {
  userName = prompt("Enter your name:");
  if (!userName) userName = "User";
  localStorage.setItem("userName", userName);
}

document.getElementById("welcome").innerText =
  "Welcome, " + userName + " 👋";
