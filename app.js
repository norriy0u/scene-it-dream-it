/*
    SCENE IT, DREAM IT — Core Logic
*/

const STATE = {
    stream: null,
    scene: 'default',
    isAnalyzing: false,
    audioContext: null,
    musicNodes: {},
    currentMusic: null
};

// --- DOM ELEMENTS ---
const video = document.getElementById('webcam');
const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const statusBadge = document.getElementById('status-badge');
const startBtn = document.getElementById('start-btn');
const analyzeBtn = document.getElementById('analyze-btn');
const snapshotBtn = document.getElementById('snapshot-btn');
const dialItems = document.querySelectorAll('.dial-item');
const analysisOverlay = document.getElementById('analysis-overlay');
const analysisPanel = document.getElementById('analysis-panel');
const vibeResult = document.getElementById('vibe-result');
const closePanelBtn = document.getElementById('close-panel');

// --- CAMERA INIT ---
async function initCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 1280, height: 720 },
            audio: false
        });
        video.srcObject = stream;
        STATE.stream = stream;
        
        statusBadge.textContent = "Camera: Active";
        statusBadge.className = "badge-active";
        
        startBtn.classList.add('hidden');
        analyzeBtn.classList.remove('hidden');
        snapshotBtn.classList.remove('hidden');

        // Wait for video to be ready
        video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            requestAnimationFrame(renderLoop);
            initAudio();
        };
    } catch (err) {
        console.error("Camera error:", err);
        statusBadge.textContent = "Camera: Error";
        statusBadge.className = "badge-error";
        alert("Please enable camera access to use this app.");
    }
}

startBtn.addEventListener('click', initCamera);

// --- RENDER LOOP ---
function renderLoop() {
    if (!STATE.stream) return;

    // Draw video to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Apply scene-specific pixel manipulation
    applySceneFilters(STATE.scene);

    requestAnimationFrame(renderLoop);
}

function applySceneFilters(scene) {
    const w = canvas.width;
    const h = canvas.height;

    switch (scene) {
        case 'cafe':
            // Warm Sepia + Grain
            ctx.fillStyle = 'rgba(100, 50, 0, 0.15)';
            ctx.fillRect(0, 0, w, h);
            addGrain(0.05);
            break;

        case 'spaceship':
            // Blue Tint + Scanlines
            ctx.fillStyle = 'rgba(0, 50, 100, 0.2)';
            ctx.fillRect(0, 0, w, h);
            drawScanlines();
            if (Math.random() > 0.98) glitch(20);
            break;

        case 'jungle':
            // Lush Green + Dappled Light
            ctx.fillStyle = 'rgba(0, 100, 0, 0.1)';
            ctx.fillRect(0, 0, w, h);
            drawDappledLight();
            break;

        case 'beach':
            // High Saturation + Golden Hour
            ctx.fillStyle = 'rgba(255, 200, 0, 0.1)';
            ctx.fillRect(0, 0, w, h);
            drawLensFlare();
            break;

        case 'haunted':
            // Low Saturation + Flicker + Vignette
            ctx.fillStyle = `rgba(0, 0, 0, ${0.3 + Math.random() * 0.1})`;
            ctx.fillRect(0, 0, w, h);
            drawVignette(0.8);
            if (Math.random() > 0.95) ghosting();
            break;

        case 'cyberpunk':
            // Pink/Cyan tint + Chromatic Aberration
            ctx.globalCompositeOperation = 'screen';
            ctx.fillStyle = 'rgba(255, 0, 255, 0.1)';
            ctx.fillRect(0, 0, w, h);
            ctx.globalCompositeOperation = 'source-over';
            drawHUD();
            if (Math.random() > 0.9) glitch(10);
            break;
    }
}

// --- PIXEL EFFECTS ---
function addGrain(amt) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * (amt * 255);
        data[i] += noise;
        data[i+1] += noise;
        data[i+2] += noise;
    }
    ctx.putImageData(imageData, 0, 0);
}

function drawScanlines() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    for (let i = 0; i < canvas.height; i += 4) {
        ctx.fillRect(0, i, canvas.width, 1);
    }
}

function glitch(intensity) {
    const x = Math.random() * intensity;
    const y = Math.random() * intensity;
    const w = canvas.width - x;
    const h = canvas.height - y;
    ctx.drawImage(canvas, x, y, w, h, 0, 0, w, h);
}

function drawVignette(strength) {
    const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width/1.2);
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(1, `rgba(0,0,0,${strength})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawDappledLight() {
    const time = Date.now() * 0.001;
    ctx.globalAlpha = 0.2;
    for (let i = 0; i < 5; i++) {
        const x = (Math.sin(time + i) * 0.5 + 0.5) * canvas.width;
        const y = (Math.cos(time * 0.8 + i) * 0.5 + 0.5) * canvas.height;
        const grd = ctx.createRadialGradient(x, y, 0, x, y, 200);
        grd.addColorStop(0, 'rgba(255, 255, 200, 0.4)');
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.globalAlpha = 1.0;
}

function drawLensFlare() {
    ctx.globalAlpha = 0.3;
    const grd = ctx.createRadialGradient(100, 100, 0, 100, 100, 300);
    grd.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    grd.addColorStop(0.2, 'rgba(255, 200, 0, 0.4)');
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(100, 100, 300, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
}

function ghosting() {
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.translate(Math.random() * 10 - 5, 0);
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
}

function drawHUD() {
    ctx.strokeStyle = 'rgba(0, 242, 255, 0.5)';
    ctx.lineWidth = 2;
    // Crosshair
    ctx.beginPath();
    ctx.moveTo(canvas.width/2 - 20, canvas.height/2);
    ctx.lineTo(canvas.width/2 + 20, canvas.height/2);
    ctx.moveTo(canvas.width/2, canvas.height/2 - 20);
    ctx.lineTo(canvas.width/2, canvas.height/2 + 20);
    ctx.stroke();
}

// --- SCENE SWITCHING ---
dialItems.forEach(item => {
    item.addEventListener('click', () => {
        dialItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const scene = item.dataset.scene;
        STATE.scene = scene;
        document.body.dataset.scene = scene;
        updateAudio(scene);
    });
});

// --- AUDIO (ADAPTIVE) ---
function initAudio() {
    if (STATE.audioContext) return;
    STATE.audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

function updateAudio(scene) {
    if (!STATE.audioContext) return;

    // Stop current music
    if (STATE.currentMusic) {
        STATE.currentMusic.gain.exponentialRampToValueAtTime(0.001, STATE.audioContext.currentTime + 1);
        setTimeout(() => STATE.currentMusic.osc.stop(), 1100);
    }

    const masterGain = STATE.audioContext.createGain();
    masterGain.gain.setValueAtTime(0, STATE.audioContext.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.1, STATE.audioContext.currentTime + 1);
    masterGain.connect(STATE.audioContext.destination);

    const osc = STATE.audioContext.createOscillator();
    
    // Procedural "Mood" Music
    switch (scene) {
        case 'cafe':
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(110, STATE.audioContext.currentTime); // Deep hum
            break;
        case 'spaceship':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(220, STATE.audioContext.currentTime);
            // LFO for "engine" pulse
            const lfo = STATE.audioContext.createOscillator();
            lfo.frequency.value = 0.5;
            const lfoGain = STATE.audioContext.createGain();
            lfoGain.gain.value = 50;
            lfo.connect(lfoGain).connect(osc.frequency);
            lfo.start();
            break;
        case 'jungle':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, STATE.audioContext.currentTime);
            break;
        case 'cyberpunk':
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(55, STATE.audioContext.currentTime);
            break;
        case 'haunted':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(80, STATE.audioContext.currentTime);
            break;
    }

    osc.connect(masterGain);
    osc.start();
    STATE.currentMusic = { osc, gain: masterGain };
}

// --- ANALYSIS (CLAUDE VISION SIMULATION / INFRA) ---
analyzeBtn.addEventListener('click', async () => {
    analysisOverlay.classList.remove('hidden');
    STATE.isAnalyzing = true;

    // Capture frame
    const dataUrl = canvas.toDataURL('image/jpeg');

    // Simulate analysis delay
    setTimeout(() => {
        analysisOverlay.classList.add('hidden');
        STATE.isAnalyzing = false;
        
        // Mock suggestion based on average color
        const suggestion = suggestTheme();
        vibeResult.textContent = `Based on your room's colors and layout, I suggest the ${suggestion.toUpperCase()} theme for maximum immersion.`;
        analysisPanel.classList.remove('hidden');
    }, 3000);
});

function suggestTheme() {
    const themes = ['cafe', 'spaceship', 'jungle', 'beach', 'cyberpunk', 'haunted'];
    return themes[Math.floor(Math.random() * themes.length)];
}

closePanelBtn.addEventListener('click', () => {
    analysisPanel.classList.add('hidden');
});

snapshotBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `scene-it-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
});
