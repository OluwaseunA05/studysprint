let time = 1500;
let timer = null;

function updateDisplay() {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;

  document.getElementById("timer").innerHTML =
    minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
}

function startTimer() {
  if (timer !== null) return;

  timer = setInterval(() => {
    time--;
    updateDisplay();

    if (time <= 0) {
      clearInterval(timer);
      timer = null;
      saveSession();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  timer = null;
}

function resetTimer() {
  clearInterval(timer);
  timer = null;
  time = 1500;
  updateDisplay();
}

function saveSession() {
  const input = document.getElementById("sessionName");
  const sessionName = input.value;

  fetch('http://localhost:3000/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: localStorage.getItem("username") || "guest",
      duration: time,
      name: sessionName
    })
  })
  .then(res => res.json())
  .then(() => {
    alert("Session saved!");
    input.value = "";
    loadSessions();
  })
  .catch(err => console.error(err));
}

function loadSessions() {
  fetch('http://localhost:3000/sessions')
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("sessionList");
      list.innerHTML = "";

      data.forEach(session => {
        const li = document.createElement("li");

        const minutes = Math.floor(session.duration / 60);
        const seconds = session.duration % 60;
        const formattedTime = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;

        const date = new Date(session.date);

        li.innerHTML = `
          <strong>${session.name || "Untitled Session"}</strong><br>
          Duration: ${formattedTime}<br>
          <small>${date.toLocaleString()}</small>

          <button onclick='editSession("${session._id}", ${session.duration})'>Edit</button>
          <button onclick='deleteSession("${session._id}")'>Delete</button>
        `;

        list.appendChild(li);
      });
    });
}

function deleteSession(id) {
  fetch(`http://localhost:3000/sessions/${id}`, {
    method: 'DELETE'
  })
  .then(() => loadSessions());
}

function editSession(id, currentDuration) {
  const newDuration = prompt("Enter new duration:", currentDuration);
  if (!newDuration) return;

  fetch(`http://localhost:3000/sessions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ duration: Number(newDuration) })
  })
  .then(() => loadSessions());
}

function searchSessions() {
  const query = document.getElementById("searchInput").value.toLowerCase();

  fetch('http://localhost:3000/sessions')
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("sessionList");
      list.innerHTML = "";

      const filtered = data.filter(session => {
        const date = new Date(session.date).toLocaleDateString();

        return (
          (session.name && session.name.toLowerCase().includes(query)) ||
          date.includes(query)
        );
      });

      filtered.forEach(session => {
        const li = document.createElement("li");

        const minutes = Math.floor(session.duration / 60);
        const seconds = session.duration % 60;
        const formattedTime = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;

        const date = new Date(session.date);

        li.innerHTML = `
          <strong>${session.name || "Untitled Session"}</strong><br>
          Duration: ${formattedTime}<br>
          <small>${date.toLocaleString()}</small>
        `;

        list.appendChild(li);
      });
    });
}

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  .then(res => {
    if (!res.ok) throw new Error();
    return res.json();
  })
  .then(() => {
    localStorage.setItem("username", username);
    alert("Login successful!");
    window.location.href = "index.html";
  })
  .catch(() => alert("Login failed"));
}

function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(data => alert(data.message));
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("sessionName");

  if (input) {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") saveSession();
    });
  }
});

updateDisplay();
