const bougies = [document.getElementById("bougie1"), document.getElementById("bougie2")];
const canvas = document.getElementById("confetti-canvas");
const ctx = canvas.getContext("2d");
let blowing = false;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let confetti = [];

function createConfetti() {
  for (let i = 0; i < 100; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      size: Math.random() * 8 + 2,
      speed: Math.random() * 3 + 2
    });
  }
}

function drawConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confetti.forEach(c => {
    ctx.fillStyle = c.color;
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
    ctx.fill();
    c.y += c.speed;
    if (c.y > canvas.height) {
      c.y = -20;
      c.x = Math.random() * canvas.width;
    }
  });
  if (blowing) requestAnimationFrame(drawConfetti);
}

function startHearts() {
  setInterval(() => {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.color = Math.random() > 0.5 ? "red" : "purple";
    heart.innerText = Math.random() > 0.5 ? "❤️" : "💜";
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 4000);
  }, 300);
}

function extinguish() {
  blowing = true;
  createConfetti();
  drawConfetti();
  bougies.forEach(b => b.style.visibility = "hidden");
}

function relight() {
  blowing = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confetti = [];
  bougies.forEach(b => b.style.visibility = "visible");
}

document.getElementById("relight").addEventListener("click", relight);

function listenToBlow() {
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    const audioContext = new AudioContext();
    const mic = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    mic.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);

    function detectSound() {
      analyser.getByteFrequencyData(data);
      let volume = data.reduce((a, b) => a + b, 0) / data.length;
      if (volume > 15 && !blowing) {
        extinguish();
      }
      requestAnimationFrame(detectSound);
    }

    detectSound();
  });
}

listenToBlow();
startHearts();
