const flame1 = document.getElementById('flame1');
const flame2 = document.getElementById('flame2');
let audioContext;
let mic;

function startMic() {
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    mic = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    mic.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);

    function checkVolume() {
      analyser.getByteFrequencyData(data);
      const volume = data.reduce((a, b) => a + b, 0) / data.length;

      if (volume > 30) {
        flame1.style.display = 'none';
        flame2.style.display = 'none';
        launchConfetti();
        launchHearts();
      }

      requestAnimationFrame(checkVolume);
    }

    checkVolume();
  });
}

function relight() {
  flame1.style.display = 'block';
  flame2.style.display = 'block';
}

startMic();

function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#ff0', '#f0f', '#0ff', '#f88', '#8f8', '#88f'];
  const confettis = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    r: Math.random() * 6 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    speed: Math.random() * 3 + 2
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettis.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fillStyle = c.color;
      ctx.fill();
      c.y += c.speed;
      if (c.y > canvas.height) {
        c.y = -10;
        c.x = Math.random() * canvas.width;
      }
    });
    requestAnimationFrame(draw);
  }

  draw();
}

function launchHearts() {
  const container = document.getElementById('hearts-container');
  for (let i = 0; i < 60; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.top = `-${Math.random() * 100}px`;
    heart.textContent = Math.random() > 0.5 ? '❤️' : '💜';
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 4000);
  }
}
