const relightBtn = document.getElementById('relight');
const flames = document.querySelectorAll('.flame');
const confetti = document.querySelector('.confetti');
const heartsContainer = document.getElementById('hearts');

let mic;
let audioContext;
let analyser;
let source;
let dataArray;

// Always animate hearts
function generateHearts() {
  const heart = document.createElement('div');
  heart.className = 'heart';
  heart.style.left = Math.random() * 100 + 'vw';
  heart.textContent = Math.random() > 0.5 ? '💜' : '❤️';
  heartsContainer.appendChild(heart);
  setTimeout(() => heart.remove(), 3000);
}
setInterval(generateHearts, 300); // Faster heart fall

relightBtn.addEventListener('click', () => {
  flames.forEach(flame => flame.style.display = 'block');
  confetti.classList.add('hidden');
});

// Microphone detection
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    source = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    detectBlow();
  })
  .catch(err => {
    console.error("Microphone error:", err);
  });

function detectBlow() {
  setInterval(() => {
    analyser.getByteFrequencyData(dataArray);
    const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    if (volume > 100) {
      flames.forEach(flame => flame.style.display = 'none');
      confetti.classList.remove('hidden');
    }
  }, 300);
}
