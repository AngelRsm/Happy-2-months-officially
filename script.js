const candles = document.querySelectorAll(".flame");
const canvas = document.getElementById("confetti-canvas");
const ctx = canvas.getContext("2d");
let confetti = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Microphone detection
navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
  const context = new AudioContext();
  const mic = context.createMediaStreamSource(stream);
  const analyser = context.createAnalyser();
  mic.connect(analyser);
  analyser.fftSize = 512;
  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  function detectBlow() {
    analyser.getByteFrequencyData(dataArray);
    const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;
    if (volume > 40) blowCandles();
    requestAnimationFrame(detectBlow);
  }

  detectBlow();
});

// Blow candles
function blowCandles() {
  candles.forEach(f => f.style.display = "none");
  launchConfetti();
}

// Relight candles
function relight() {
  candles.forEach(f => f.style.display = "block");
  confetti = []; // clear confetti
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Confetti logic
function launchConfetti() {
  confetti = Array.from({ length: 100 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    r: Math.random() * 6 + 4,
    d: Math.random() * 5 + 2,
    color: ["#ffcc00", "#00ccff", "#ff66cc", "#ccff33", "#ff6666", "#66ffcc"][Math.floor(Math.random() * 6)],
    tilt: Math.random() * 10 - 10
  }));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confetti.forEach(c => {
    ctx.beginPath();
    ctx.fillStyle = c.color;
    ctx.ellipse(c.x, c.y, c.r, c.r / 2, c.tilt, 0, 2 * Math.PI);
    ctx.fill();
    c.y += c.d;
    c.tilt += 0.1;
    if (c.y > canvas.height) c.y = -10;
  });
  requestAnimationFrame(draw);
}

draw();
