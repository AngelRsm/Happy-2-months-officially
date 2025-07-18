const flames = document.querySelectorAll('.flamme');
const canvas = document.getElementById('coeursCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let hearts = [];

function createHeart() {
  const x = Math.random() * canvas.width;
  const size = Math.random() * 20 + 10;
  const speed = Math.random() * 1 + 0.5;
  const color = Math.random() > 0.5 ? '#ff0000' : '#800080';
  hearts.push({ x, y: -10, size, speed, color });
}

function drawHearts() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hearts.forEach((h, i) => {
    ctx.fillStyle = h.color;
    ctx.beginPath();
    ctx.arc(h.x, h.y, h.size / 2, 0, Math.PI * 2);
    ctx.fill();
    h.y += h.speed;
    if (h.y > canvas.height) hearts.splice(i, 1);
  });
  requestAnimationFrame(drawHearts);
}

setInterval(createHeart, 200);
drawHearts();

function relight() {
  flames.forEach(f => f.style.display = 'block');
}

// Microphone pour souffler sur les bougies
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const context = new AudioContext();
    const mic = context.createMediaStreamSource(stream);
    const analyser = context.createAnalyser();
    mic.connect(analyser);
    analyser.fftSize = 256;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function detectBlow() {
      analyser.getByteFrequencyData(dataArray);
      let volume = dataArray.reduce((a, b) => a + b) / dataArray.length;
      if (volume > 60) {
        flames.forEach(f => f.style.display = 'none');
      }
      requestAnimationFrame(detectBlow);
    }

    detectBlow();
  });
