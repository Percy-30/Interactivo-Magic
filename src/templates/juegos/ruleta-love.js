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
            --orange: #ffb44d;
            --cyan: #4db8ff;
            --purple: #9d5eff;
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
            opacity: 0.2;
            animation: float-heart 10s linear infinite;
        }

        @keyframes float-heart {
            0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
            20% { opacity: 0.2; }
            100% { transform: translateY(-20vh) rotate(360deg); opacity: 0; }
        }

        .game-header { text-align: center; margin-bottom: 2.5rem; position: relative; z-index: 10; padding: 0 20px; }
        .game-header h1 { font-size: 2.8rem; font-weight: 900; color: white; margin: 0; text-shadow: 0 0 20px rgba(255, 77, 148, 0.3); letter-spacing: -1px; }
        .game-header p { color: rgba(255,255,255,0.8); font-size: 1.1rem; margin-top: 0.5rem; font-weight: 400; }

        /* Elegant Wheel Design */
        .wheel-outer {
            position: relative;
            width: 320px;
            height: 320px;
            border-radius: 50%;
            background: #111;
            padding: 12px;
            box-shadow: 0 0 60px rgba(0,0,0,0.8), 0 0 20px rgba(255, 77, 148, 0.2);
            z-index: 10;
        }

        .pointer {
            position: absolute;
            top: -15px;
            left: 50%;
            transform: translateX(-50%);
            width: 45px;
            height: 45px;
            background: white;
            clip-path: polygon(20% 0%, 80% 0%, 50% 100%);
            z-index: 100;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
        }

        .wheel-container { 
            width: 100%;
            height: 100%;
            border-radius: 50%;
            position: relative;
            overflow: hidden;
            transition: transform 5s cubic-bezier(0.15, 0, 0.15, 1);
            border: 6px solid #1a1a1a;
        }

        .wheel {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            position: absolute;
            background: conic-gradient(
                var(--orange) 0deg 45deg,
                var(--primary) 45deg 90deg,
                var(--cyan) 90deg 135deg,
                var(--purple) 135deg 180deg,
                var(--orange) 180deg 225deg,
                var(--primary) 225deg 270deg,
                var(--cyan) 270deg 315deg,
                var(--purple) 315deg 360deg
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
            text-shadow: 0 1px 3px rgba(0,0,0,0.3);
            padding-left: 65px;
            letter-spacing: 1px;
            text-transform: lowercase;
        }

        .wheel-center {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 75px;
            height: 75px;
            background: white;
            border-radius: 50%;
            z-index: 50;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.2rem;
            box-shadow: 0 8px 20px rgba(0,0,0,0.3), inset 0 0 12px rgba(255, 77, 148, 0.2);
            border: 4px solid var(--primary);
        }

        .spin-btn {
            margin-top: 3.5rem;
            padding: 1.1rem 4rem;
            background: linear-gradient(135deg, var(--primary), var(--accent));
            border: none;
            border-radius: 50px;
            color: white;
            font-weight: 800;
            font-size: 1.3rem;
            cursor: pointer;
            box-shadow: 0 12px 30px rgba(255, 77, 148, 0.4);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            text-transform: uppercase;
            letter-spacing: 3px;
            position: relative;
            z-index: 100;
        }

        .spin-btn:hover:not(:disabled) { transform: translateY(-5px); box-shadow: 0 15px 40px rgba(255, 77, 148, 0.6); }
        .spin-btn:active:not(:disabled) { transform: scale(0.95); }
        .spin-btn:disabled { opacity: 0.6; cursor: not-allowed; filter: saturate(0.5); }

        /* Notification Toast */
        .toast {
            position: fixed;
            top: 30px;
            background: rgba(255, 255, 255, 0.1);
            padding: 14px 30px;
            border-radius: 50px;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.1);
            color: white;
            font-weight: 700;
            transform: translateY(-120px);
            transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: 5000;
            box-shadow: 0 15px 30px rgba(0,0,0,0.4);
            font-size: 1rem;
        }
        .toast.show { transform: translateY(0); }

        /* Success Card Styles */
        .success-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.9);
            backdrop-filter: blur(15px);
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
            padding: 3rem 2.5rem;
            border-radius: 35px;
            text-align: center;
            max-width: 440px;
            width: 90%;
            box-shadow: 0 30px 80px rgba(0,0,0,0.6);
            transform: translateY(40px);
            transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .success-overlay.show { opacity: 1; display: flex; }
        .success-overlay.show .success-card { transform: translateY(0); }

        .photo-frame {
            width: 180px;
            height: 180px;
            margin: 0 auto 2.5rem;
            border-radius: 50%;
            padding: 10px;
            background: linear-gradient(135deg, var(--orange), var(--primary), var(--purple));
            box-shadow: 0 15px 40px rgba(0,0,0,0.4);
            animation: float-photo 4s ease-in-out infinite;
        }

        @keyframes float-photo {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-12px); }
        }

        .photo-frame img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 4px solid #fff; }

        .success-card h2 { font-size: 2.5rem; margin: 0 0 1.2rem; color: white; font-weight: 900; text-transform: lowercase; }
        .success-card p { font-size: 1.25rem; line-height: 1.7; color: rgba(255,255,255,0.9); margin-bottom: 2.5rem; font-weight: 400; }
        .sender-tag { font-size: 0.95rem; color: var(--orange); font-weight: 700; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 0.5rem; }

        /* Unified Audio Styles */
        .audio-controls { position: fixed; bottom: 35px; left: 50%; transform: translateX(-50%); width: 85%; max-width: 380px; background: rgba(255, 255, 255, 0.06); backdrop-filter: blur(25px); padding: 14px 24px; border-radius: 30px; border: 1px solid rgba(255, 255, 255, 0.12); display: flex; align-items: center; gap: 18px; z-index: 1000; box-shadow: 0 15px 40px rgba(0,0,0,0.6); }
        .play-btn { width: 44px; height: 44px; background: var(--primary); border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; flex-shrink: 0; color: white; box-shadow: 0 4px 12px rgba(255, 77, 148, 0.3); }
        .progress-bar-container { flex-grow: 1; height: 5px; background: rgba(255, 255, 255, 0.1); border-radius: 3px; overflow: hidden; }
        .progress-bar { width: 0%; height: 100%; background: var(--primary); border-radius: 3px; transition: width 0.1s linear; }
        .time-text { font-size: 11px; color: rgba(255, 255, 255, 0.5); min-width: 35px; font-family: 'Outfit', sans-serif; font-weight: 700; }
        .song-title { position: absolute; top: -24px; left: 50%; transform: translateX(-50%); font-size: 10px; font-weight: 900; color: var(--primary); white-space: nowrap; text-transform: uppercase; letter-spacing: 2px; }

    </style>
</head>
<body>
    <div class="hearts-bg" id="hearts-bg"></div>
    <div class="toast" id="toast">¡ups! casi... intenta de nuevo ✨</div>

    <div id="intro-overlay" onclick="startExperience()">
        <div style="text-align: center;">
            <div style="font-size: 110px; animation: bounce 2.2s infinite; filter: drop-shadow(0 15px 30px rgba(255, 77, 148, 0.3));">🎡</div>
            <div style="font-size: 2.22rem; font-weight: 900; color: white; margin-top: 1.8rem; letter-spacing: -1px; text-transform: lowercase;">ruleta del amor</div>
            <div style="font-size: 1rem; color: var(--primary); margin-top: 0.6rem; opacity: 0.8; letter-spacing: 5px; font-weight: 700;">TOCA PARA EMPEZAR</div>
        </div>
    </div>

    <div class="game-header">
        <h1 style="text-transform: lowercase;">{{name}}</h1>
        <p>✨ deja que la ruleta decida nuestro destino...</p>
    </div>

    <div class="wheel-outer">
        <div class="pointer"></div>
        <div class="wheel-center">❤️</div>
        <div class="wheel-container" id="wheel-container">
            <div class="wheel" id="wheel">
                <!-- Segments will be generated by JS -->
            </div>
        </div>
    </div>

    <button class="spin-btn" id="spin-btn" onclick="spinWheel()">
        GIRAR RULETA
    </button>

    <!-- Success Screen -->
    <div class="success-overlay" id="success-overlay">
        <div class="success-card">
            <div class="photo-frame" id="photo-area">
                <img src="{{image_src}}" alt="{{name}}" onerror="this.parentElement.style.display='none'">
            </div>
            <div class="sender-tag">DE: {{sender}}</div>
            <h2 style="text-transform: lowercase;">{{extra_text}}</h2>
            <p>{{message}}</p>
            <div style="font-size: 3.5rem; filter: drop-shadow(0 10px 20px rgba(255, 77, 148, 0.4));">💖✨💍</div>
        </div>
    </div>

    <!-- Audio Player -->
    <div class="audio-controls" id="audio-ui" style="display: none;">
        <div class="song-title">Tu Audio Mágico</div>
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
    <div id="yt-player-container" style="position:fixed; top:0; left:0; width:1px; height:1px; opacity:0; pointer-events:none;">
        <div id="youtube-player"></div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <script>
        const wheel = document.getElementById('wheel');
        const sections = [
            { text: "no", win: false },
            { text: "intenta", win: false },
            { text: "no", win: false },
            { text: "sí", win: true },
            { text: "no", win: false },
            { text: "tal vez", win: false },
            { text: "no", win: false },
            { text: "sí", win: true }
        ];

        // Generate Wheel Segments
        sections.forEach((section, i) => {
            const div = document.createElement('div');
            div.className = 'segment-text';
            div.style.transform = "rotate(" + (i * 45) + "deg)";
            div.innerHTML = section.text;
            wheel.appendChild(div);
        });

        // Floating Hearts
        const heartsContainer = document.getElementById('hearts-bg');
        for(let i=0; i<15; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart-particle';
            heart.innerHTML = '❤️';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.fontSize = (Math.random() * 15 + 10) + 'px';
            heart.style.animationDelay = Math.random() * 8 + 's';
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
            }, 600);
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
                document.getElementById('time-display').textContent = mins + ":" + (secs < 10 ? '0' : "") + secs;
            };
        }

        /* --- Spin Logic --- */
        let canSpin = true;
        let attemptCount = 0;

        function spinWheel() {
            if (!canSpin) return;
            const btn = document.getElementById('spin-btn');
            const wheelContainer = document.getElementById('wheel-container');
            const toast = document.getElementById('toast');
            
            canSpin = false;
            btn.disabled = true;
            btn.innerHTML = "decidiendo...";
            toast.classList.remove('show');

            attemptCount++;
            
            // Logic: first time usually NO, second time usually SÍ.
            let targetIndex;
            if (attemptCount === 1) {
                // Land on "no" (index 0, 2, 4 or 6)
                const noIndices = [0, 2, 4, 6];
                targetIndex = noIndices[Math.floor(Math.random() * noIndices.length)];
            } else {
                // Land on "sí" (index 3 or 7)
                const winIndices = [3, 7];
                targetIndex = winIndices[Math.floor(Math.random() * winIndices.length)];
            }

            const isWin = sections[targetIndex].win;
            const rotations = 7 + attemptCount;
            const segmentAngle = 45;
            const offset = 22.5; 
            
            const targetRotation = (270 - (targetIndex * segmentAngle) - offset) + (360 * rotations);
            wheelContainer.style.transform = "rotate(" + targetRotation + "deg)";

            setTimeout(() => {
                if (isWin) {
                    showSuccess();
                } else {
                    toast.classList.add('show');
                    btn.disabled = false;
                    btn.innerHTML = "reintentar ✨";
                    canSpin = true;
                    setTimeout(() => toast.classList.remove('show'), 3500);
                }
            }, 5500);
        }

        function showSuccess() {
            const end = Date.now() + (5 * 1000);
            const colors = ['#ff4d94', '#ffb44d', '#ffffff'];

            (function frame() {
              confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: colors });
              confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: colors });

              if (Date.now() < end) { requestAnimationFrame(frame); }
            }());

            document.getElementById('success-overlay').classList.add('show');
        }

        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
    </script>
</body>
</html>`;
