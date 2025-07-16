// Hearts falling
const heartsContainer = document.querySelector(".hearts-container");
const colors = ["❤️","💜"];
function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.style.left = Math.random()*100 + "vw";
  heart.style.fontSize = 16 + Math.random()*14 + "px";
  heart.textContent = colors[Math.floor(Math.random()*colors.length)];
  heartsContainer.appendChild(heart);
  setTimeout(()=>heart.remove(),5000);
}
setInterval(createHeart,300);

// Candle blow detection
let flames = [];
function blowCandles() {
  flames.forEach(f => f.style.display="none");
  document.getElementById("loveMessage").textContent = "💨 Tu as soufflé les bougies... Joyeux 2 mois mon cœur 💕";
}
function relightCandles() {
  flames.forEach(f => f.style.display="block");
  document.getElementById("loveMessage").textContent = "🕯️ Bougies rallumées ! Souffle encore !";
}
async function startMic() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({audio:true});
    const ctx = new (window.AudioContext||window.webkitAudioContext)();
    const mic = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    const data = new Uint8Array(analyser.fftSize);
    mic.connect(analyser);
    function detect(){
      analyser.getByteTimeDomainData(data);
      let sum=0;
      for(let v of data) sum += Math.abs(v-128);
      if(sum/data.length>10) blowCandles();
      requestAnimationFrame(detect);
    }
    detect();
  } catch(e) { alert("Autorise le micro pour souffler !"); }
}
// Initialize candles
window.onload = ()=>{
  document.querySelectorAll(".candle").forEach(c=>{
    const flame = document.createElement("div");
    flame.classList.add("flame");
    c.appendChild(flame);
    flames.push(flame);
  });
  startMic();
};
