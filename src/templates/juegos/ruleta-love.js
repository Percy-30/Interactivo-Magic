export const RULETA_LOVE_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¿Quieres ser mi novia? 💖 - {{name}}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        
        :root {
            --primary: #ff4d94;
            --secondary: #4db8ff;
            --bg: #fff2f7;
            --text: #000000;
        }

        body { 
            margin: 0; 
            background: var(--bg); 
            color: var(--text); 
            font-family: 'Outfit', sans-serif; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center; 
            min-height: 100vh; 
            overflow-x: hidden;
            padding: 20px;
        }

        .game-header { text-align: center; margin-bottom: 2rem; position: relative; z-index: 10; max-width: 90%; }
        .game-header h1 { font-size: 2.2rem; font-weight: 900; color: var(--text); margin: 0; line-height: 1.2; }
        .game-header p { color: rgba(0,0,0,0.6); font-size: 1rem; margin-top: 1rem; font-weight: 500; }

        /* Roulette Design - Light Theme */
        .wheel-outer {
            position: relative;
            width: 320px;
            height: 320px;
            border-radius: 50%;
            background: white;
            padding: 8px;
            box-shadow: 0 15px 40px rgba(255, 77, 148, 0.15);
            z-index: 10;
        }

        /* Blue Diamond Pointer */
        .pointer {
            position: absolute;
            top: -15px;
            left: 50%;
            transform: translateX(-50%);
            width: 35px;
            height: 45px;
            background: var(--secondary);
            clip-path: polygon(50% 100%, 0% 50%, 50% 0%, 100% 50%);
            z-index: 100;
            border: 3px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .wheel-container { 
            width: 100%;
            height: 100%;
            border-radius: 50%;
            position: relative;
            overflow: visible;
            transition: transform 5s cubic-bezier(0.15, 0, 0.15, 1);
            border: 4px solid #fff;
            box-sizing: border-box;
        }

        .wheel {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            position: absolute;
            background: conic-gradient(
                #ff8da1 0deg 45deg,
                #8de6ff 45deg 90deg,
                #ff9c8d 90deg 135deg,
                #ffdf8d 135deg 180deg,
                #8da1ff 180deg 225deg,
                #faff8d 225deg 270deg,
                #8dffc4 270deg 315deg,
                #ff8db4 315deg 360deg
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
            font-weight: 800;
            font-size: 1.1rem;
            color: var(--text);
            padding-left: 55px;
            white-space: nowrap;
        }

        /* Decorative dots */
        .dot {
            position: absolute;
            width: 8px;
            height: 12px;
            background: #000;
            border-radius: 4px;
            left: 50%;
            top: -10px;
            transform-origin: 50% 170px;
            z-index: 20;
        }

        .wheel-center {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 70px;
            height: 70px;
            background: white;
            border-radius: 50%;
            z-index: 50;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .spin-btn {
            margin-top: 3rem;
            padding: 1rem 3.5rem;
            background: black;
            border: none;
            border-radius: 50px;
            color: white;
            font-weight: 800;
            font-size: 1.1rem;
            cursor: pointer;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .spin-btn:active:not(:disabled) { transform: scale(0.95); }
        .spin-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Toast Styles */
        .toast {
            position: fixed;
            top: 20px;
            background: white;
            padding: 12px 25px;
            border-radius: 50px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            color: var(--text);
            font-weight: 700;
            transform: translateY(-100px);
            transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: 5000;
            border: 1px solid rgba(0,0,0,0.05);
        }
        .toast.show { transform: translateY(0); }

        /* Success Card Styles */
        .success-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(255, 242, 247, 0.95);
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
            background: white;
            padding: 2.5rem;
            border-radius: 30px;
            text-align: center;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(255, 77, 148, 0.15);
            transform: translateY(30px);
            transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .success-overlay.show { opacity: 1; display: flex; }
        .success-overlay.show .success-card { transform: translateY(0); }

        .photo-frame {
            width: 180px;
            height: 180px;
            margin: 0 auto 2rem;
            border-radius: 50%;
            padding: 5px;
            background: white;
            box-shadow: 0 10px 30px rgba(255, 77, 148, 0.2);
        }
        .photo-frame img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }

        .success-card h2 { font-size: 2rem; margin: 0 0 1rem; color: var(--text); font-weight: 900; }
        .success-card p { font-size: 1.1rem; line-height: 1.6; color: rgba(0,0,0,0.7); margin-bottom: 2rem; }
        .sender-tag { font-size: 0.8rem; color: var(--primary); font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 0.5rem; }

        /* Unified Audio Styles */
        .audio-controls { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); width: 85%; max-width: 350px; background: white; padding: 12px 20px; border-radius: 25px; border: 1px solid rgba(0,0,0,0.05); display: flex; align-items: center; gap: 15px; z-index: 1000; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .play-btn { width: 40px; height: 40px; background: var(--primary); border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; flex-shrink: 0; color: white !important; }
        .progress-bar-container { flex-grow: 1; height: 4px; background: rgba(0,0,0,0.05); border-radius: 2px; overflow: hidden; }
        .progress-bar { width: 0%; height: 100%; background: var(--primary); border-radius: 2px; }
        .time-text { font-size: 11px; color: rgba(0,0,0,0.4); min-width: 35px; font-weight: bold; }
        .song-title { position: absolute; top: -22px; left: 50%; transform: translateX(-50%); font-size: 10px; font-weight: 900; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; }

        /* Intro Overlay */
        #intro-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: var(--bg); z-index: 3000; display: flex; justify-content: center; align-items: center; cursor: pointer; }
        #intro-overlay.hidden { opacity: 0; pointer-events: none; transition: 0.8s opacity ease; }

        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
    </style>
</head>
<body>
    <div class="hearts-bg" id="hearts-bg"></div>
    <div class="toast" id="toast">¡Casi! Inténtalo de nuevo... ✨</div>

    <div id="intro-overlay" onclick="startExperience()">
        <div style="text-align: center;">
            <div style="font-size: 90px; animation: bounce 2s infinite;">🎡</div>
            <div style="font-size: 1.8rem; font-weight: 900; color: var(--text); margin-top: 1.5rem;">RULETA DEL AMOR</div>
            <div style="font-size: 0.9rem; color: var(--primary); margin-top: 0.5rem; font-weight: 800; letter-spacing: 3px;">TOCA PARA EMPEZAR</div>
        </div>
    </div>

    <div class="game-header">
        <h1>{{name}}</h1>
        <p>✨ Gira la ruleta y deja que el destino decida...</p>
    </div>

    <div class="wheel-outer">
        <div class="pointer"></div>
        <div class="wheel-center">💓</div>
        <div class="wheel-container" id="wheel-container">
            <div class="wheel" id="wheel">
                <!-- Segments will be generated by JS -->
            </div>
            <!-- Decorative dots will be generated -->
            <div id="dots-container"></div>
        </div>
    </div>

    <button class="spin-btn" id="spin-btn" onclick="spinWheel()">
        💘 Girar ✨
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
        const dotsContainer = document.getElementById('dots-container');
        const sections = [
            { text: "No 💔", win: false },
            { text: "No 💔", win: false },
            { text: "SÍ 💖", win: true },
            { text: "No 💔", win: false },
            { text: "No 💔", win: false },
            { text: "No 💔", win: false },
            { text: "No 💔", win: false },
            { text: "SÍ 💖", win: true }
        ];

        // Generate Wheel Segments and Dots
        sections.forEach((section, i) => {
            const div = document.createElement('div');
            div.className = 'segment-text';
            div.style.transform = "rotate(" + (i * 45) + "deg)";
            div.innerHTML = section.text;
            wheel.appendChild(div);

            const dot = document.createElement('div');
            dot.className = 'dot';
            dot.style.transform = "rotate(" + (i * 45 + 22.5) + "deg)";
            dotsContainer.appendChild(dot);
        });

        // Floating Hearts Background
        const heartsContainer = document.getElementById('hearts-bg');
        for(let i=0; i<15; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart-particle';
            heart.innerHTML = '❤️';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.fontSize = (Math.random() * 15 + 10) + 'px';
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
                    events: { 
                        'onReady': () => console.log("YT Ready"),
                        'onStateChange': (event) => {
                            if (event.data === YT.PlayerState.PLAYING) updateUI(true);
                            if (event.data === YT.PlayerState.PAUSED) updateUI(false);
                        }
                    }
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
            
            // Audio initialization - Force interaction requirement
            if (hasAudio) {
                document.getElementById('audio-ui').style.display = 'flex';
                if (activePlatform === 'youtube' && ytPlayer) {
                    ytPlayer.playVideo();
                } else if (activePlatform === 'native') {
                    audio.play().catch(e => console.log("Audio play failed:", e));
                }
                updateUI(true);
            }
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
                updateUI(false);
            } else {
                if (activePlatform === 'youtube') ytPlayer.playVideo();
                else audio.play();
                updateUI(true);
            }
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
            btn.innerHTML = "GIRANDO...";
            toast.classList.remove('show');

            attemptCount++;
            
            // 1st try usually NO, 2nd usually SÍ.
            let targetIndex;
            if (attemptCount === 1) {
                const noIndices = [0, 1, 3, 4, 5, 6];
                targetIndex = noIndices[Math.floor(Math.random() * noIndices.length)];
            } else {
                const winIndices = [2, 7];
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
                    btn.innerHTML = "💘 Reintentar ✨";
                    canSpin = true;
                    setTimeout(() => toast.classList.remove('show'), 3500);
                }
            }, 5500);
        }

        function showSuccess() {
            const end = Date.now() + (5 * 1000);
            const colors = ['#ff4d94', '#4db8ff', '#ffffff'];

            (function frame() {
              confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors: colors });
              confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors: colors });
              if (Date.now() < end) { requestAnimationFrame(frame); }
            }());

            document.getElementById('success-overlay').classList.add('show');
        }
    </script>
</body>
</html>\`;
