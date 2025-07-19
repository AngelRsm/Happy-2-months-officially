const flames = [document.getElementById("flame1"), document.getElementById("flame2")];
const confettiCanvas = document.getElementById("confetti-canvas");
const ctx = confettiCanvas.getContext("2d");

confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

let confetti = [], hearts = [];
let blowing = false;

function createConfetti() {
  const colors = ["#f94144", "#f3722c", "#f9c74f", "#90be6d", "#577590", "#9d4edd"];
  for (let i = 0; i < 200; i++) {
    confetti.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * -window.innerHeight,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 6 + 4,
      speed: Math.random() * 2 + 1
    });
  }
}

function drawConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confetti.forEach(c => {
    ctx.fillStyle = c.color;
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
    ctx.fill();
    c.y += c.speed;
    if (c.y > window.innerHeight) c.y = 0;
  });
}

function createHearts() {
  const heartTypes = ["❤️", "💜"];
  setInterval(() => {
    const heart = document.createElement("div");
    heart.textContent = heartTypes[Math.floor(Math.random() * 2)];
    heart.style.position = "absolute";
    heart.style.left = Math.random() * window.innerWidth + "px";
    heart.style.top = "-30px";
    heart.style.fontSize = Math.random() * 30 + 20 + "px";
    heart.style.animation = "fall 5s linear forwards";
    document.querySelector(".falling-hearts").appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
  }, 300);
}

function relightCandles() {
  flames.forEach(f => f.style.display = "block");
  blowing = false;
}

function extinguishCandles() {
  flames.forEach(f => f.style.display = "none");
  blowing = true;
  createConfetti();
}

function loop() {
  if (blowing) drawConfetti();
  requestAnimationFrame(loop);
}

window.addEventListener("resize", () => {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
});

navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();
  const mic = audioContext.createMediaStreamSource(stream);
  mic.connect(analyser);
  const data = new Uint8Array(analyser.frequencyBinCount);

  function detectBlow() {
    analyser.getByteFrequencyData(data);
    const volume = data.reduce((a, b) => a + b) / data.length;
    if (volume > 25 && !blowing) extinguishCandles();
    requestAnimationFrame(detectBlow);
  }

  detectBlow();
});

createHearts();
loop();
