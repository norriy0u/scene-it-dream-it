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
const settingsBtn = document.getElementById('settings-btn');
const apiModal = document.getElementById('api-modal');
const apiKeyInput = document.getElementById('api-key-input');
const saveKeyBtn = document.getElementById('save-key-btn');
const closeModalBtn = document.getElementById('close-modal-btn');

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

// --- ANALYSIS (CLAUDE VISION & PIXEL MATH) ---
analyzeBtn.addEventListener('click', async () => {
    analysisOverlay.classList.remove('hidden');
    STATE.isAnalyzing = true;

    // Capture frame and resize for API (Claude likes smaller images)
    const offscreen = document.createElement('canvas');
    offscreen.width = 640;
    offscreen.height = 360;
    offscreen.getContext('2d').drawImage(canvas, 0, 0, 640, 360);
    const base64Image = offscreen.toDataURL('image/jpeg', 0.8).split(',')[1];

    const apiKey = localStorage.getItem('claude_api_key');

    if (apiKey && apiKey.startsWith('sk-ant-')) {
        await analyzeRoomWithAI(apiKey, base64Image);
    } else {
        // Pixel-based fallback
        const suggestion = suggestThemeByPixels();
        setTimeout(() => {
            finishAnalysis(suggestion, "I've analyzed the lighting and color complexity of your room.");
        }, 2500);
    }
});

async function analyzeRoomWithAI(key, base64) {
    const prompt = "Describe the lighting, colors, and objects in this room in 20 words. Then suggest one of these themes: cafe, spaceship, jungle, beach, cyberpunk, haunted. Format: [Description] Suggestion: [Theme]";
    
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': key,
                'anthropic-version': '2023-06-01',
                'dangerously-allow-browser': 'true'
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 100,
                messages: [{
                    role: 'user',
                    content: [
                        { type: 'text', text: prompt },
                        { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64 } }
                    ]
                }]
            })
        });

        if (!response.ok) throw new Error("AI analysis failed.");
        const data = await response.json();
        const text = data.content[0].text;
        
        const themeMatch = text.match(/Suggestion: (\w+)/i);
        const theme = themeMatch ? themeMatch[1].toLowerCase() : 'spaceship';
        finishAnalysis(theme, text.split('Suggestion:')[0]);
    } catch (err) {
        console.error(err);
        finishAnalysis(suggestThemeByPixels(), "AI Analysis failed, but my sensors detected a vibe...");
    }
}

function suggestThemeByPixels() {
    // Sample pixels to get average color and brightness
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let r = 0, g = 0, b = 0, brightness = 0;
    
    // Sample every 10th pixel for performance
    for (let i = 0; i < data.length; i += 40) {
        r += data[i];
        g += data[i+1];
        b += data[i+2];
        brightness += (data[i] + data[i+1] + data[i+2]) / 3;
    }
    
    const count = data.length / 40;
    r /= count; g /= count; b /= count; brightness /= count;

    // Logic for suggestion
    if (brightness < 60) return 'haunted'; // Very dark
    if (brightness > 200) return 'beach';  // Very bright
    if (g > r && g > b) return 'jungle';   // Greenish
    if (b > r && b > g) return 'spaceship'; // Blueish
    if (r > g && r > b && brightness < 120) return 'cafe'; // Warm/dark
    return 'cyberpunk'; // Default to cyberpunk for anything else
}

function finishAnalysis(theme, description) {
    analysisOverlay.classList.add('hidden');
    STATE.isAnalyzing = false;
    vibeResult.innerHTML = `<strong>Sensors:</strong> ${description}<br><br>I suggest the <strong>${theme.toUpperCase()}</strong> theme.`;
    analysisPanel.classList.remove('hidden');
}

// --- API MODAL HANDLERS ---
settingsBtn.addEventListener('click', () => apiModal.classList.remove('hidden'));
closeModalBtn.addEventListener('click', () => apiModal.classList.add('hidden'));
saveKeyBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key.startsWith('sk-ant-')) {
        localStorage.setItem('claude_api_key', key);
        apiModal.classList.add('hidden');
        alert("API Key saved! Real analysis enabled.");
    } else {
        alert("Invalid API key format.");
    }
});

snapshotBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `scene-it-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
});
