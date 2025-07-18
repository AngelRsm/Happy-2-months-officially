const candleFlames = document.querySelectorAll(".flame");
const relightBtn = document.getElementById("relight");
const confettiContainer = document.getElementById("confetti-container");
const heartContainer = document.getElementById("heart-container");

// Microphone setup
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  source.connect(analyser);
  const data = new Uint8Array(analyser.frequencyBinCount);

  function detectBlow() {
    analyser.getByteFrequencyData(data);
    let volume = data.reduce((a, b) => a + b) / data.length;
    if (volume > 20) { // plus sensible
      extinguishCandles();
      triggerConfetti();
    }
    requestAnimationFrame(detectBlow);
  }
  detectBlow();
});

function extinguishCandles() {
  candleFlames.forEach(flame => flame.style.display = "none");
}

function relightCandles() {
  candleFlames.forEach(flame => flame.style.display = "block");
  confettiContainer.innerHTML = "";
}

relightBtn.addEventListener("click", relightCandles);

function triggerConfetti() {
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.backgroundColor = randomColor();
    confetti.style.animationDuration = (Math.random() * 2 + 2) + "s";
    confettiContainer.appendChild(confetti);

    setTimeout(() => confetti.remove(), 4000);
  }
}

function randomColor() {
  const colors = ["#f54291", "#42f554", "#f5e642", "#42d4f5", "#ffffff", "#a864a8"];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Floating hearts
function spawnHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.textContent = Math.random() < 0.5 ? "❤️" : "💜";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.animationDuration = (Math.random() * 3 + 2) + "s";
  heartContainer.appendChild(heart);

  setTimeout(() => heart.remove(), 5000);
}
setInterval(spawnHeart, 300);
