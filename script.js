body, html {
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family: 'Segoe UI', sans-serif;
}

.background {
  background-color: #b3d9ff; /* Bleu pastel */
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  text-align: center;
}

.cake-container {
  position: relative;
  top: 120px;
}

.cake {
  width: 300px;
  height: auto;
}

.candle {
  width: 10px;
  height: 30px;
  background: white;
  position: absolute;
  top: 30px;
  border-radius: 2px;
}

#candle1 {
  left: 115px;
}

#candle2 {
  right: 115px;
}

.flame {
  width: 10px;
  height: 20px;
  background: orange;
  border-radius: 50% 50% 0 0;
  position: absolute;
  top: -20px;
  animation: flicker 0.2s infinite;
}

@keyframes flicker {
  0% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.2) rotate(5deg); }
  100% { transform: scale(1) rotate(-5deg); }
}

.couple {
  position: absolute;
  bottom: 30px;
  right: 30px;
  width: 160px;
  height: auto;
}

.message {
  margin-top: 20px;
  color: #5a0099;
  font-size: 28px;
}

.verse {
  color: #444;
  font-size: 18px;
}

canvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  pointer-events: none;
}
