# 🎬 Scene It, Dream It

> Transform your world in real time. Webcam-driven immersive transformations for your room.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Web Audio API](https://img.shields.io/badge/Web_Audio_API-FF6347?style=for-the-badge)

---

## 🌟 What Is This?

"Scene It, Dream It" is a real-time visual and auditory experience that uses your webcam to transform your physical environment into fantastical scenes. Using Canvas 2D pixel manipulation and adaptive procedural audio, the app reshapes your room into a cozy café, a high-tech spaceship, a lush jungle, and more.

---

## ✨ Features

### 🖼️ Thematic Frames
- **Spaceship**: A circular metallic porthole with industrial bolts.
- **Café**: A warm, wooden picture frame.
- **Jungle**: Lush vines and leaves framing the view.
- **Cyberpunk**: A neon-glowing HUD with digital corner brackets.
- **Haunted House**: A cracked stone frame with a spooky vibe.
- **Beach**: A bright, sandy-bordered perspective.

### 🎭 Real-Time Visual Filters
Each scene comes with a unique set of visual effects applied to every frame of the video:
- **Café**: Warm sepia tones with subtle film grain.
- **Spaceship**: Cool blue digital tint, scanlines, and occasional technical glitches.
- **Jungle**: Vibrant green contrast with dynamic "dappled light" radial overlays.
- **Beach**: High saturation, golden hour warmth, and a glowing lens flare.
- **Haunted**: Desaturated grayscale, flickering light, and a heavy dark vignette.
- **Cyberpunk**: Neon pink/cyan chromatic aberration and glitchy HUD overlays.

### 🎵 Adaptive Procedural Audio
- Powered by the **Web Audio API**.
- Each scene generates a unique "mood" hum or frequency loop.
- **Spaceship** features an LFO-driven engine pulse.
- **Cyberpunk** uses a gritty sawtooth bass.
- **Café** offers a warm, low-frequency triangle wave.

### ✨ Magic Analysis
- Captures a snapshot of your room and "analyzes" it (simulated) to suggest the best-fitting theme for your environment.

### 📸 Snapshots
- Take a high-resolution snapshot of your transformed world and download it instantly.

---

## 🚀 Quick Start

1. **Clone the repo:**
   ```bash
   git clone https://github.com/AmanKtyr/scene-it-dream-it.git
   ```
2. **Open `index.html`** in your browser.
3. Click **"Enable Camera"** and start dreaming.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+).
- **Video**: `getUserMedia` (MediaDevices API).
- **Visuals**: Canvas 2D API for real-time pixel processing.
- **Audio**: Web Audio API (Sine, Triangle, Sawtooth oscillators + LFOs).
- **Fonts**: Exo 2 + Playfair Display.

---

## 📁 Project Structure

```
sceneitdreamit/
├── index.html    # Core layout & frame UI
├── style.css     # Thematic styling & CSS transformations
├── app.js        # Camera logic, pixel filters, audio engine
└── README.md     # You are here
```

---

## 📄 License

MIT — Dream freely. 🎬✨
