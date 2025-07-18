const flames = document.querySelectorAll('.flame');
const relightBtn = document.getElementById('relightBtn');
const heartsContainer = document.getElementById('hearts-container');
const confettiContainer = document.getElementById('confetti-container');

let confettiTimeout = null;
let listening = true;

function extinguishCandles() {
  flames.forEach(f => f.style.display = 'none');
  showConfetti();
  listening = false;
}

function relightCandles() {
  flames.forEach(f => f.style.display = 'block');
  clearConfetti();
  listening = true;
  startListening();
}

// Coeurs qui tombent du haut
function createHeart() {
  const heart = document.createElement('div');
  heart.classList.add('heart');
  const isViolet = Math.random() < 0.5;
  heart.classList.add(isViolet ? 'violet' : 'red');
  heart.style.left = `${Math.random() * 100}vw`;
  heart.style.animationDuration = `${5 + Math.random() * 3}s`;
  heartsContainer.appendChild(heart);
  setTimeout(() => heart.remove(), 9000);
}

setInterval(createHeart, 350);

// Confettis qui tombent
function showConfetti() {
  clearConfetti();
  for(let i = 0; i < 150; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    if(Math.random() < 0.5) confetti.classList.add('violet');
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.animationDuration = `${3 + Math.random() * 2}s`;
    confetti.style.top = `-10px`;
    confettiContainer.appendChild(confetti);
  }
  // Nettoyer après 6 sec
  confettiTimeout = setTimeout(clearConfetti, 6000);
}

function clearConfetti() {
  confettiContainer.innerHTML = '';
  if(confettiTimeout) {
    clearTimeout(confettiTimeout);
    confettiTimeout = null;
  }
}

// Microphone - écoute sensible pour souffler
function startListening() {
  if (!listening) return;

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const mic = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      mic.connect(analyser);
      analyser.fftSize = 256;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      function detectBlow() {
        if (!listening) return;

        analyser.getByteTimeDomainData(dataArray);
        let volume = 0;
        for(let i=0; i < dataArray.length; i++) {
          volume += Math.abs(dataArray[i] - 128);
        }
        volume /= dataArray.length;

        // seuil sensible à souffle normal
        if(volume > 6) {
          extinguishCandles();
          return;
        }
        requestAnimationFrame(detectBlow);
      }
      detectBlow();
    })
    .catch(err => {
      console.error('Erreur micro:', err);
    });
}

relightBtn.addEventListener('click', relightCandles);

startListening();
