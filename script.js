// Generate falling hearts
function createHeart() {
  const heart = document.createElement('div');
  heart.classList.add('heart');
  heart.innerText = '💜';
  heart.style.left = `${Math.random() * 100}vw`;
  document.getElementById('hearts-container').appendChild(heart);

  setTimeout(() => heart.remove(), 3000);
}

setInterval(createHeart, 200); // plus rapide

// Bougie soufflée avec micro
let blown = false;

navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
  const context = new AudioContext();
  const source = context.createMediaStreamSource(stream);
  const analyser = context.createAnalyser();
  analyser.fftSize = 256;
  source.connect(analyser);

  const data = new Uint8Array(analyser.frequencyBinCount);

  function checkVolume() {
    analyser.getByteFrequencyData(data);
    const volume = data.reduce((a, b) => a + b) / data.length;

    if (volume > 50 && !blown) {
      blown = true;
      document.querySelectorAll('.candle').forEach(c => c.style.boxShadow = 'none');
      showConfetti();
    }

    requestAnimationFrame(checkVolume);
  }

  checkVolume();
});

function showConfetti() {
  document.getElementById('confetti').style.display = 'block';
  setTimeout(() => {
    document.getElementById('confetti').style.display = 'none';
  }, 5000);
}

