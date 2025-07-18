function relight() {
  document.getElementById("flame1").style.display = "block";
  document.getElementById("flame2").style.display = "block";
}

function createHeart() {
  const heart = document.createElement("div");
  heart.innerText = "💜";
  heart.style.position = "absolute";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.top = "0px";
  heart.style.fontSize = Math.random() * 20 + 20 + "px";
  heart.style.animation = "fall 4s linear forwards";
  document.getElementById("hearts").appendChild(heart);

  setTimeout(() => heart.remove(), 4000);
}

setInterval(createHeart, 300);

document.addEventListener("click", () => {
  // Éteindre les flammes quand on clique dessus
  document.getElementById("flame1").style.display = "none";
  document.getElementById("flame2").style.display = "none";
});

// Animation CSS ajoutée dynamiquement
const style = document.createElement('style');
style.innerHTML = `
@keyframes fall {
  to {
    transform: translateY(100vh);
    opacity: 0;
  }
}`;
document.head.appendChild(style);
