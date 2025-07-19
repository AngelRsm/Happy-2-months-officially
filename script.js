// FLAMMES
const flamme1 = document.getElementById("flamme1");
const flamme2 = document.getElementById("flamme2");
const relightBtn = document.getElementById("relightBtn");

relightBtn.addEventListener("click", () => {
  flamme1.style.display = "block";
  flamme2.style.display = "block";
});

// MICROPHONE + CONFETTIS
navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
  const context = new AudioContext();
  const analyser = context.createAnalyser();
  const source = context.createMediaStreamSource(stream);
  source.connect(analyser);
  analyser.fftSize = 256;
  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  function detectSound() {
    analyser.getByteFrequencyData(dataArray);
    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

    if (average > 60) { // seuil de souffle
      flamme1.style.display = "none";
      flamme2.style.display = "none";
      launchConfetti();
    }

    requestAnimationFrame(detectSound);
  }

  detectSound();
});

// COEURS QUI TOMBENT
function spawnHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.innerText = Math.random() > 0.5 ? "❤️" : "💜";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.animationDuration = (3 + Math.random() * 3) + "s";
  document.querySelector(".hearts-container").appendChild(heart);

  setTimeout(() => heart.remove(), 6000);
}

setInterval(spawnHeart, 400);

// CONFETTIS
const confettiCanvas = document.getElementById('confetti-canvas');
const ctx = confettiCanvas.getContext('2d');
let confettis = [];

function launchConfetti() {
  for (let i = 0; i < 100; i++) {
    confettis.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * -100,
      r: Math.random() * 6 + 4,
      d: Math.random() * 10 + 10,
      color: `hsl(${Math.random() * 360}, 100%, 60%)`,
      tilt: Math.random() * 10 - 10,
      tiltAngleIncremental: Math.random() * 0.1 + 0.05,
      tiltAngle: 0
    });
  }
}

function drawConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  confettis.forEach(c => {
    ctx.beginPath();
    ctx.lineWidth = c.r;
    ctx.strokeStyle = c.color;
    ctx.moveTo(c.x + c.tilt + c.r / 2, c.y);
    ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 2);
    ctx.stroke();
  });

  updateConfetti();
  requestAnimationFrame(drawConfetti);
}

function updateConfetti() {
  confettis.forEach(c => {
    c.tiltAngle += c.tiltAngleIncremental;
    c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
    c.x += Math.sin(c.d);
    c.tilt = Math.sin(c.tiltAngle) * 15;
  });
}

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);
drawConfetti();
