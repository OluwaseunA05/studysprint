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

    timer = setInterval(function () {
        time--;
        updateDisplay();

        if (time <= 0) {
            clearInterval(timer);
            timer = null;

            saveSession(); 
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    timer = null;
    time = 1500;
    updateDisplay();
}

function saveSession() {
    console.log("clicked");

    fetch('http://localhost:3000/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
  user_id: 1,
  duration: time
})
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        alert("Session saved!");
    })
    .catch(err => console.error(err));
}

updateDisplay();

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

        li.innerHTML = `
          User: ${session.user_id} | Duration: ${formattedTime}
          <button type="button" onclick='editSession("${session._id}", ${session.duration})'>Edit</button>
          <button type="button" onclick='deleteSession("${session._id}")'>Delete</button>
        `;

        list.appendChild(li);
      });
    })
    .catch(err => console.error(err));
}

function pauseTimer() {
    clearInterval(timer);
    timer = null;
}

function deleteSession(id) {
  console.log("DELETE CLICKED:", id);

  fetch(`http://localhost:3000/sessions/${id}`, {
    method: 'DELETE'
  })
  .then(res => res.json())
  .then(data => {
    console.log(data);
    alert("Session deleted!");
    loadSessions();
  })
  .catch(err => console.error(err));
}

function editSession(id, currentDuration) {
  const newDuration = prompt("Enter new duration:", currentDuration);

  if (newDuration === null || newDuration === "") return;

  fetch(`http://localhost:3000/sessions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      duration: Number(newDuration) 
    })
  })
  .then(res => res.json())
  .then(data => {
    console.log("UPDATED:", data);
    alert("Session updated!");
    loadSessions();
  })
  .catch(err => console.error(err));
}

function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(data => alert(data.message));
}

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(data => alert(data.message))
  .catch(() => alert("Login failed"));
}


function searchSessions() {
  const query = document.getElementById("searchInput").value.toLowerCase();

  fetch('http://localhost:3000/sessions')
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("sessionList");
      list.innerHTML = "";

      const filtered = data.filter(session => {
        return (
          session.user_id.toString().includes(query) ||
          session.duration.toString().includes(query)
        );
      });

      filtered.forEach(session => {
        const li = document.createElement("li");

        const minutes = Math.floor(session.duration / 60);
        const seconds = session.duration % 60;
        const formattedTime = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;

        li.innerHTML = `
          User: ${session.user_id} | Duration: ${formattedTime}
        `;

        list.appendChild(li);
      });
    })
    .catch(err => console.error(err));
}
