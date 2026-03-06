let time = 1500;
let timer = null;

function updateDisplay() {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    document.getElementById("timer").innerHTML =
        minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
}

function startTimer() {
    if (timer !== null) {
        return; 
    }

    timer = setInterval(function () {
        time--;
        updateDisplay();

        if (time <= 0) {
            clearInterval(timer);
            timer = null;
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    timer = null;
    time = 1500;
    updateDisplay();
}