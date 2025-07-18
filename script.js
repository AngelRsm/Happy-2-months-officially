const flames = document.querySelectorAll('.flame');
const relightBtn = document.getElementById('relight');
const confettiCanvas = document.getElementById('confetti-canvas');
const heartsContainer = document.getElementById('hearts-container');

function extinguishFlames() {
  flames.forEach(f => f.style.display = 'none');
  launchConfetti();
}

function relightFlames() {
  flames.forEach(f => f.style.display = 'block');
}

relightBtn.addEventListener('click', relightFlames);

// Microphone - plus sensible
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const mic = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    mic.connect(analyser);
    const data = new Uint8Array(analyser.fftSize);

    function listen() {
      analyser.getByteTimeDomainData(data);
      const volume = data.reduce((a, b) => a + Math.abs(b - 128), 0) / data.length;

      if (volume > 7) extinguishFlames(); // Seuil plus sensible
      requestAnimationFrame(listen);
    }
    listen();
  });

// Confetti générique (pas en gif)
function launchConfetti() {
  const ctx = confettiCanvas.getContext('2d');
  const confettis = [];

  for (let i = 0; i < 200; i++) {
    confettis.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 6 + 4,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      speed: Math.random() * 3 + 2
    });
  }

  function draw() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettis.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      p.y += p.speed;
      if (p.y > window.innerHeight) p.y = 0;
    });
    requestAnimationFrame(draw);
  }

  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  draw();
}

// Lancer des cœurs
function createHeart() {
  const heart = document.createElement('div');
  heart.classList.add('heart');
  if (Math.random() < 0.5) heart.classList.add('violet');

  heart.style.left = `${Math.random() * 100}%`;
  heartsContainer.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 5000);
}

setInterval(createHeart, 300);
