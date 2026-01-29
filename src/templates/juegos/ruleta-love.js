export const RULETA_LOVE_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ruleta del Amor 💖 - {{name}}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        
        :root {
            --primary: #ff4d94;
            --secondary: #00f2ff;
            --accent: #7000ff;
            --bg: #050508;
        }

        body { 
            margin: 0; 
            background: var(--bg); 
            color: white; 
            font-family: 'Outfit', sans-serif; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center; 
            height: 100vh; 
            overflow: hidden;
            background-image: radial-gradient(circle at 50% 50%, rgba(255, 77, 148, 0.1) 0%, transparent 80%);
        }

        /* Floating Hearts Background */
        .hearts-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        }

        .heart-particle {
            position: absolute;
            color: var(--primary);
            opacity: 0.3;
            animation: float-heart 10s linear infinite;
        }

        @keyframes float-heart {
            0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
            20% { opacity: 0.3; }
            100% { transform: translateY(-20vh) rotate(360deg); opacity: 0; }
        }

        .game-header { text-align: center; margin-bottom: 2rem; position: relative; z-index: 10; }
        .game-header h1 { font-size: 2.5rem; font-weight: 900; color: white; margin: 0; text-shadow: 0 0 20px rgba(255, 77, 148, 0.5); }
        .game-header p { color: rgba(255,255,255,0.7); font-size: 1.1rem; margin-top: 0.5rem; }

        /* Wheel Styles */
        .wheel-outer {
            position: relative;
            width: 340px;
            height: 340px;
            padding: 15px;
            border-radius: 50%;
            background: linear-gradient(135deg, #1a1a2e, #0f0f1b);
            box-shadow: 0 0 50px rgba(0,0,0,0.8), inset 0 0 20px rgba(255,255,255,0.05);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
        }

        .wheel-neon-ring {
            position: absolute;
            top: -2px; left: -2px; right: -2px; bottom: -2px;
            border-radius: 50%;
            border: 2px solid var(--primary);
            box-shadow: 0 0 20px var(--primary);
            opacity: 0.5;
            animation: pulse-neon 2s ease-in-out infinite;
        }

        @keyframes pulse-neon {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.02); }
        }

        .pointer {
            position: absolute;
            top: -20px;
            left: 50%;
            transform: translateX(-50%);
            width: 40px;
            height: 50px;
            background: white;
            clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
            z-index: 100;
            filter: drop-shadow(0 5px 10px rgba(0,0,0,0.5));
            border-top: 5px solid var(--secondary);
        }

        .wheel-container { 
            width: 100%;
            height: 100%;
            border-radius: 50%;
            position: relative;
            overflow: hidden;
            transition: transform 5s cubic-bezier(0.15, 0, 0.15, 1);
            border: 8px solid #222;
        }

        .wheel {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            position: absolute;
            background: conic-gradient(
                #ff5e9e 0deg 45deg,
                #4db8ff 45deg 90deg,
                #9d5eff 90deg 135deg,
                #ffb84d 135deg 180deg,
                #ff5e9e 180deg 225deg,
                #4db8ff 225deg 270deg,
                #9d5eff 270deg 315deg,
                #ffb84d 315deg 360deg
            );
        }

        .segment-text {
            position: absolute;
            width: 50%;
            height: 50%;
            left: 50%;
            top: 50%;
            transform-origin: 0% 0%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 1.4rem;
            color: white;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
            padding-left: 60px;
        }

        .wheel-center {
            position: absolute;
            width: 70px;
            height: 70px;
            background: white;
            border-radius: 50%;
            z-index: 50;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            box-shadow: 0 0 30px rgba(255,255,255,0.5), inset 0 0 10px rgba(0,0,0,0.2);
            border: 4px solid var(--primary);
        }

        .spin-btn {
            margin-top: 3rem;
            padding: 1rem 3.5rem;
            background: linear-gradient(135deg, var(--primary), var(--accent));
            border: none;
            border-radius: 50px;
            color: white;
            font-weight: 800;
            font-size: 1.4rem;
            cursor: pointer;
            box-shadow: 0 10px 30px rgba(255, 77, 148, 0.4);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            text-transform: uppercase;
            letter-spacing: 2px;
            position: relative;
            z-index: 100;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .spin-btn:hover:not(:disabled) { transform: translateY(-5px) scale(1.05); box-shadow: 0 15px 40px rgba(255, 77, 148, 0.6); }
        .spin-btn:active:not(:disabled) { transform: scale(0.95); }
        .spin-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Success Card Styles */
        .success-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.85);
            backdrop-filter: blur(10px);
            z-index: 2000;
            display: none;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
            opacity: 0;
            transition: opacity 0.8s ease;
        }

        .success-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 2.5rem;
            border-radius: 30px;
            text-align: center;
            max-width: 450px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            transform: translateY(30px);
            transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .success-overlay.show { opacity: 1; display: flex; }
        .success-overlay.show .success-card { transform: translateY(0); }

        .photo-frame {
            width: 160px;
            height: 160px;
            margin: 0 auto 2rem;
            border-radius: 50%;
            padding: 8px;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            box-shadow: 0 0 30px rgba(255, 77, 148, 0.4);
            animation: float-photo 4s ease-in-out infinite;
        }

        @keyframes float-photo {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        .photo-frame img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 4px solid #fff; }

        .success-card h2 { font-size: 2.22rem; margin: 0 0 1rem; color: var(--primary); font-weight: 900; }
        .success-card p { font-size: 1.2rem; line-height: 1.6; color: rgba(255,255,255,0.8); margin-bottom: 2rem; }
        .sender-tag { font-size: 0.9rem; color: var(--secondary); font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }

        /* Intro Overlay */
        #intro-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: var(--bg); z-index: 3000; display: flex; justify-content: center; align-items: center; cursor: pointer; }
        #intro-overlay.hidden { opacity: 0; pointer-events: none; transition: 0.8s opacity ease; }

        /* Unified Audio Styles */
        .audio-controls { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); width: 85%; max-width: 350px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(15px); padding: 12px 20px; border-radius: 25px; border: 1px solid rgba(255, 255, 255, 0.15); display: flex; align-items: center; gap: 15px; z-index: 1000; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .play-btn { width: 40px; height: 40px; background: var(--primary); border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; flex-shrink: 0; color: white !important; font-weight: bold; }
        .progress-bar-container { flex-grow: 1; height: 4px; background: rgba(255, 255, 255, 0.1); border-radius: 2px; overflow: hidden; }
        .progress-bar { width: 0%; height: 100%; background: var(--primary); border-radius: 2px; }
        .time-text { font-size: 11px; color: rgba(255, 255, 255, 0.5); min-width: 35px; font-family: monospace; }
        .song-title { position: absolute; top: -22px; left: 50%; transform: translateX(-50%); font-size: 11px; font-weight: 800; color: var(--primary); white-space: nowrap; text-transform: uppercase; letter-spacing: 1px; }

    </style>
</head>
<body>
    <div class="hearts-bg" id="hearts-bg"></div>

    <div id="intro-overlay" onclick="startExperience()">
        <div style="text-align: center;">
            <div style="font-size: 100px; animation: bounce 2s infinite;">🎡</div>
            <div style="font-size: 1.8rem; font-weight: 900; color: white; margin-top: 1.5rem; letter-spacing: 2px;">RULETA DEL AMOR</div>
            <div style="font-size: 1rem; color: var(--primary); margin-top: 0.5rem; opacity: 0.8; letter-spacing: 4px;">TOCA PARA GIRAR EL DESTINO</div>
        </div>
    </div>

    <div class="game-header">
        <h1>{{name}}</h1>
        <p>✨ Deja que la ruleta decida nuestro destino...</p>
    </div>

    <div class="wheel-outer">
        <div class="wheel-neon-ring"></div>
        <div class="pointer"></div>
        <div class="wheel-center">❤️</div>
        <div class="wheel-container" id="wheel-container">
            <div class="wheel" id="wheel">
                <!-- Segments will be generated by JS -->
            </div>
        </div>
    </div>

    <button class="spin-btn" id="spin-btn" onclick="spinWheel()">
        ✨ GIRAR AHORA ✨
    </button>

    <!-- Success Screen -->
    <div class="success-overlay" id="success-overlay">
        <div class="success-card">
            <div class="photo-frame" id="photo-area">
                <img src="{{image_src}}" alt="{{name}}" onerror="this.parentElement.style.display='none'">
            </div>
            <div class="sender-tag">DE: {{sender}}</div>
            <h2>{{extra_text}}</h2>
            <p>{{message}}</p>
            <div style="font-size: 3rem;">💖✨💍</div>
        </div>
    </div>

    <!-- Audio Player -->
    <div class="audio-controls" id="audio-ui" style="display: none;">
        <div class="song-title">Audio Mágico</div>
        <div class="play-btn" id="play-btn">
            <div id="play-icon">▶</div>
            <div id="pause-icon" style="display:none">||</div>
        </div>
        <div class="progress-bar-container">
            <div class="progress-bar" id="progress-bar"></div>
        </div>
        <div class="time-display time-text" id="time-display">0:00</div>
    </div>

    <audio id="bg-audio" src="{{audio_src}}" loop></audio>
    <div id="yt-player-container" style="position:fixed; top:0; left:0; width:1px; height:1px; opacity:0.01; pointer-events:none;">
        <div id="youtube-player"></div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <script>
        const wheel = document.getElementById('wheel');
        const sections = [
            { text: "SÍ 💖", win: true },
            { text: "NO 🙊", win: false },
            { text: "TAL VEZ 🤔", win: false },
            { text: "NO 💔", win: false },
            { text: "SÍ 💕", win: true },
            { text: "NO 🙈", win: false },
            { text: "INTENTA ✨", win: false },
            { text: "NO 😢", win: false }
        ];

        // Generate Wheel Segments
        sections.forEach((section, i) => {
            const div = document.createElement('div');
            div.className = 'segment-text';
            div.style.transform = `rotate(${ i * 45 }deg)`;
            div.innerHTML = section.text;
            wheel.appendChild(div);
        });

        // Floating Hearts
        const heartsContainer = document.getElementById('hearts-bg');
        for(let i=0; i<20; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart-particle';
            heart.innerHTML = '❤️';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
            heart.style.animationDelay = Math.random() * 10 + 's';
            heartsContainer.appendChild(heart);
        }

        /* --- Audio Engine --- */
        const audio = document.getElementById('bg-audio');
        const youtubeId = "{{youtube_id}}";
        let ytPlayer = null;
        let activePlatform = youtubeId ? 'youtube' : 'native';
        let isPlaying = false;

        function onYouTubeIframeAPIReady() {
            if (youtubeId) {
                ytPlayer = new YT.Player('youtube-player', {
                    height: '0', width: '0', videoId: youtubeId,
                    playerVars: { 'autoplay': 0, 'controls': 0, 'loop': 1, 'playlist': youtubeId },
                    events: { 'onReady': () => console.log("YT Ready") }
                });
            }
        }

        if (activePlatform === 'youtube') {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(tag);
        }

        function startExperience() {
            document.getElementById('intro-overlay').classList.add('hidden');
            const hasAudio = '{{has_audio}}' === 'true';
            setTimeout(() => {
                if (hasAudio) {
                    document.getElementById('audio-ui').style.display = 'flex';
                    if (activePlatform === 'youtube' && ytPlayer) ytPlayer.playVideo();
                    else audio.play().catch(() => {});
                    updateUI(true);
                }
            }, 400);
        }

        function updateUI(playing) {
            isPlaying = playing;
            document.getElementById('play-icon').style.display = playing ? 'none' : 'block';
            document.getElementById('pause-icon').style.display = playing ? 'block' : 'none';
        }

        document.getElementById('play-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            if (isPlaying) {
                if (activePlatform === 'youtube') ytPlayer.pauseVideo();
                else audio.pause();
            } else {
                if (activePlatform === 'youtube') ytPlayer.playVideo();
                else audio.play();
            }
            updateUI(!isPlaying);
        });

        if (activePlatform === 'native') {
            audio.ontimeupdate = () => {
                const progress = (audio.currentTime / audio.duration) * 100;
                document.getElementById('progress-bar').style.width = progress + '%';
                const mins = Math.floor(audio.currentTime / 60);
                const secs = Math.floor(audio.currentTime % 60);
                document.getElementById('time-display').textContent = \`\${mins}:\${secs < 10 ? '0' : ''}\${secs}\`;
            };
        }

        /* --- Spin Logic --- */
        let canSpin = true;
        function spinWheel() {
            if (!canSpin) return;
            const btn = document.getElementById('spin-btn');
            const wheelContainer = document.getElementById('wheel-container');
            
            canSpin = false;
            btn.disabled = true;
            btn.innerHTML = "¡EL DESTINO DECIDE! 🎲";

            // RIGGED LOGIC: Always land on SÍ (index 0 or 4)
            // Sections: 
            // 0: SÍ (0-45deg)
            // 4: SÍ (180-225deg)
            // We want the TOP (pointer is at 0 rotation point relative to view)
            // The segments rotate CLOCKWISE.
            // Pointer is at TOP. 
            // Angle 0 is right. Top is -90deg? 
            // Let's simplify: 
            // To point to segment i (index i): 
            // segment i starts at i * 45deg. 
            // To be at the top center, the segment needs to be at -90deg.
            // Target Rotation = (360 - (i * 45) - 22.5) + (360 * rotations)
            
            const winningIndices = [0, 4];
            const targetIndex = winningIndices[Math.floor(Math.random() * winningIndices.length)];
            const rotations = 8; // Full spins
            const segmentAngle = 45;
            const offset = 22.5; // Center of segment
            
            // Note: pointer is at top (270deg in standard geometric circle where 0 is right)
            // So we want the winning segment i to ends up at 270deg.
            const targetRotation = (270 - (targetIndex * segmentAngle) - offset) + (360 * rotations);
            
            wheelContainer.style.transform = \`rotate(\${targetRotation}deg)\`;

            setTimeout(() => {
                showSuccess();
            }, 5500);
        }

        function showSuccess() {
            // Confetti Blast
            const duration = 5 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 3000 };

            function randomInRange(min, max) {
              return Math.random() * (max - min) + min;
            }

            const interval = setInterval(function() {
              const timeLeft = animationEnd - Date.now();
              if (timeLeft <= 0) { return clearInterval(interval); }
              const particleCount = 50 * (timeLeft / duration);
              confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
              confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
            }, 250);

            document.getElementById('success-overlay').classList.add('show');
        }

        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
    </script>
</body>
</html>\`;
