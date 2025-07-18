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

function createHeart() {
  const x = Math.random() * canvas.width;
  const size = Math.random() * 20 + 15;
  const speed = Math.random() * 1.5 + 0.8;
  const color = Math.random() > 0.5 ? '#ff0000' : '#800080';
  hearts.push({ x, y: -20, size, speed, color, opacity: 1, sway: Math.random() * 0.05 + 0.02, swayAngle: 0 });
}

// Fonction dessin cœur avec Bézier (plus doux)
function drawHeart(x, y, size, color, opacity) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 20, size / 20);
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(0, -3, -5, -10, -10, -10);
  ctx.bezierCurveTo(-20, -10, -20, 5, -20, 5);
  ctx.bezierCurveTo(-20, 15, -10, 20, 0, 30);
  ctx.bezierCurveTo(10, 20, 20, 15, 20, 5);
  ctx.bezierCurveTo(20, 5, 20, -10, 10, -10);
  ctx.bezierCurveTo(5, -10, 0, -3, 0, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawHearts() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hearts.forEach((h, i) => {
    drawHeart(h.x, h.y, h.size, h.color, h.opacity);
    h.y += h.speed;
    h.swayAngle += h.sway;
    h.x += Math.sin(h.swayAngle) * 1.2; // balancement gauche-droite
    h.opacity -= 0.005;
    if (h.opacity <= 0) hearts.splice(i, 1);
  });
  requestAnimationFrame(drawHearts);
}

setInterval(createHeart, 200);
drawHearts();

function relight() {
  flames.forEach(f => f.style.display = 'block');
}

// Microphone pour souffler sur les bougies
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
        if (volume > 60 && Date.now() - lastBlowTime > 2000) {
          flames.forEach(f => f.style.display = 'none');
          lastBlowTime = Date.now();
          // Rallumer après 5s
          setTimeout(() => relight(), 5000);
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
