const flames = document.querySelectorAll('.flamme');
const canvas = document.getElementById('coeursCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let hearts = [];
let confettis = [];
let animationActive = true;

function createHeart() {
  const x = Math.random() * canvas.width;
  const size = Math.random() * 24 + 16;
  const speed = Math.random() * 1.5 + 0.8;
  const color = Math.random() > 0.5 ? '❤️' : '💜';
  hearts.push({ x, y: -30, size, speed, color, opacity: 1, sway: Math.random() * 0.05 + 0.02, swayAngle: 0 });
}

function createConfetti() {
  const x = Math.random() * canvas.width;
  const y = -10;
  const size = Math.random() * 12 + 8;
  const speed = Math.random() * 2 + 1;
  const colors = ['#ff0055', '#00ff55', '#ffcc00', '#00ccff', '#ff00cc'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  confettis.push({ x, y, size, speed, color, rotation: Math.random() * 360, rotationSpeed: (Math.random() - 0.5) * 10, opacity: 1 });
}

function drawHeart(heart) {
  ctx.font = `${heart.size}px serif`;
  ctx.globalAlpha = heart.opacity;
  ctx.fillText(heart.color, heart.x, heart.y);
  ctx.globalAlpha = 1;
}

function drawConfetti(confetti) {
  ctx.save();
  ctx.translate(confetti.x, confetti.y);
  ctx.rotate((confetti.rotation * Math.PI) / 180);
  ctx.globalAlpha = confetti.opacity;
  ctx.fillStyle = confetti.color;
  ctx.fillRect(-confetti.size / 2, -confetti.size / 4, confetti.size, confetti.size / 2);
  ctx.restore();
  ctx.globalAlpha = 1;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  hearts.forEach((h, i) => {
    drawHeart(h);
    h.y += h.speed;
    h.swayAngle += h.sway;
    h.x += Math.sin(h.swayAngle) * 1.2;
    h.opacity -= 0.005;
    if (h.y > canvas.height || h.opacity <= 0) hearts.splice(i, 1);
  });

  confettis.forEach((c, i) => {
    drawConfetti(c);
    c.y += c.speed;
    c.rotation += c.rotationSpeed;
    c.opacity -= 0.01;
    if (c.y > canvas.height || c.opacity <= 0) confettis.splice(i, 1);
  });

  if(animationActive) requestAnimationFrame(draw);
}

setInterval(() => {
  if(animationActive) createHeart();
}, 200);

draw();

function relight() {
  flames.forEach(f => f.style.display = 'block');
  animationActive = true;
}

// Détection du souffle via micro
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const context = new AudioContext();
      const mic = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      mic.connect(analyser);
      analyser.fftSize = 256;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let lastBlowTime = 0;

      function detectBlow() {
        analyser.getByteFrequencyData(dataArray);
        let volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        if (volume > 60 && Date.now() - lastBlowTime > 2000 && flames[0].style.display !== 'none') {
          flames.forEach(f => f.style.display = 'none');
          lastBlowTime = Date.now();
          animationActive = false;
          for(let i = 0; i < 40; i++) createConfetti();
        }
        requestAnimationFrame(detectBlow);
      }

      detectBlow();
    })
    .catch(err => {
      console.warn('Microphone non accessible ou permission refusée.', err);
    });
} else {
  console.warn('getUserMedia non supporté sur ce navigateur.');
}
