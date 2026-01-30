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
            --bg: #fff5f8;
            --text: #1a1a1a;
            --shadow: rgba(255, 77, 148, 0.15);
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
            overflow: hidden;
            padding: 15px;
        }

        /* Hearts Animation */
        .hearts-flow {
            position: fixed;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            z-index: 0;
            pointer-events: none;
        }

        .floating-heart {
            position: absolute;
            animation: fall-hearts 8s linear infinite;
            opacity: 0.6;
        }

        @keyframes fall-hearts {
            0% { transform: translateY(-20px) scale(0); opacity: 0; }
            50% { opacity: 0.8; }
            100% { transform: translateY(100vh) scale(1.5); opacity: 0; }
        }

        .content-wrapper {
            position: relative;
            z-index: 10;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            max-width: 500px;
        }

        .game-header { text-align: center; margin-bottom: 2rem; }
        .game-header h1 { font-size: 2.22rem; font-weight: 900; margin: 0; color: #000; letter-spacing: -0.5px; }
        .game-header p { color: rgba(0,0,0,0.5); font-size: 1rem; margin-top: 0.5rem; }

        /* Perfect Roulette UI */
        .wheel-box {
            position: relative;
            width: 340px;
            height: 340px;
            padding: 10px;
            background: white;
            border-radius: 50%;
            box-shadow: 0 20px 50px var(--shadow);
            margin: 1rem 0;
        }

        .pointer-diamond {
            position: absolute;
            top: -12px;
            left: 50%;
            transform: translateX(-50%);
            width: 32px;
            height: 42px;
            background: var(--secondary);
            clip-path: polygon(50% 100%, 0% 50%, 50% 0%, 100% 50%);
            z-index: 100;
            border: 3px solid white;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
        }

        .wheel-rim {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            overflow: hidden;
            position: relative;
            border: 6px solid #fff;
            box-shadow: inset 0 0 15px rgba(0,0,0,0.05);
            transition: transform 5s cubic-bezier(0.15, 0, 0.15, 1);
        }

        .wheel-segments {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: conic-gradient(
                #ff9aaf 0deg 45deg,
                #9ae0ff 45deg 90deg,
                #ffaf9a 90deg 135deg,
                #ffe69a 135deg 180deg,
                #af9aff 180deg 225deg,
                #faff9a 225deg 270deg,
                #9affd0 270deg 315deg,
                #ff9abf 315deg 360deg
            );
        }

        .label {
            position: absolute;
            width: 50%;
            height: 50%;
            left: 50%;
            top: 50%;
            transform-origin: 0% 0%;
            padding-left: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 1.15rem;
            color: #000;
        }

        .rim-dot {
            position: absolute;
            width: 8px;
            height: 12px;
            background: #000;
            border-radius: 10px;
            left: 50%;
            top: -6px;
            transform-origin: 50% 170px;
            z-index: 50;
        }

        .center-btn {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 75px;
            height: 75px;
            background: white;
            border-radius: 50%;
            z-index: 60;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.2rem;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }

        /* Interaction Elements */
        .spin-action-btn {
            margin-top: 3rem;
            background: #000;
            color: #fff;
            padding: 14px 50px;
            border-radius: 50px;
            border: none;
            font-size: 1.1rem;
            font-weight: 900;
            cursor: pointer;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 100;
        }

        .spin-action-btn:active { transform: scale(0.95); }
        .spin-action-btn:disabled { opacity: 0.5; filter: grayscale(1); }

        .custom-toast {
            position: fixed;
            top: 30px;
            background: white;
            padding: 15px 30px;
            border-radius: 50px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            font-weight: 800;
            transform: translateY(-150px);
            transition: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: 2000;
        }
        .custom-toast.visible { transform: translateY(0); }

        /* Results Overlay */
        .gift-overlay {
            position: fixed;
            inset: 0;
            background: white;
            z-index: 5000;
            display: none;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2.5rem;
            text-align: center;
            opacity: 0;
            transition: 0.8s opacity ease;
        }

        .gift-overlay.active { display: flex; opacity: 1; }

        .result-image {
            width: 180px;
            height: 180px;
            border-radius: 50%;
            border: 6px solid #fff;
            box-shadow: 0 15px 45px var(--shadow);
            margin-bottom: 2rem;
            object-fit: cover;
        }

        .result-title { font-size: 2rem; font-weight: 900; margin-bottom: 1rem; color: #000; }
        .result-message { font-size: 1.1rem; color: rgba(0,0,0,0.6); line-height: 1.6; max-width: 320px; }

        /* Intro Section */
        #splash-screen {
            position: fixed;
            inset: 0;
            background: var(--bg);
            z-index: 9000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }
        #splash-screen.fade-out { opacity: 0; pointer-events: none; transition: 0.6s all ease; }

        /* Clean Audio Player */
        .audio-wrapper {
            position: fixed;
            bottom: 40px;
            width: 85%;
            max-width: 380px;
            background: white;
            padding: 12px 25px;
            border-radius: 50px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.08);
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 1000;
        }

        .player-btn {
            width: 45px;
            height: 45px;
            background: var(--primary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: white;
        }

        .slider-bar {
            flex-grow: 1;
            height: 5px;
            background: rgba(0,0,0,0.05);
            border-radius: 10px;
            overflow: hidden;
            position: relative;
        }

        .slider-progress {
            position: absolute;
            height: 100%;
            background: var(--primary);
            width: 0%;
        }

        .audio-label {
            position: absolute;
            top: -22px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 10px;
            font-weight: 900;
            color: var(--primary);
            text-transform: uppercase;
            letter-spacing: 2px;
        }
    </style>
</head>
<body>
    <div id="splash-screen" onclick="initExperience()">
        <div style="font-size: 100px; animation: bounce 2s infinite;">🎡</div>
        <div style="font-size: 2rem; font-weight: 900; margin-top: 2rem;">ruleta del amor</div>
        <div style="color: var(--primary); font-weight: 900; letter-spacing: 4px; margin-top: 1rem;">TOCA PARA EMPEZAR</div>
    </div>

    <div class="hearts-flow" id="hearts-flow"></div>
    <div class="custom-toast" id="custom-toast">¡ups! intenta de nuevo ✨</div>

    <div class="content-wrapper">
        <div class="game-header">
            <h1>{{name}}</h1>
            <p>✨ gira la ruleta y deja que el destino decida...</p>
        </div>

        <div class="wheel-box">
            <div class="pointer-diamond"></div>
            <div class="center-btn">💓</div>
            <div class="wheel-rim" id="wheel-rim">
                <div class="wheel-segments" id="wheel-segments"></div>
                <div id="dots-anchor"></div>
            </div>
        </div>

        <button class="spin-action-btn" id="spin-main-btn" onclick="executeSpin()">
            <span>💘 girar</span> ✨
        </button>
    </div>

    <div class="gift-overlay" id="gift-overlay">
        <img src="{{image_src}}" class="result-image" alt="Premio" onerror="this.style.display='none'">
        <div style="color: var(--primary); font-weight: 900; letter-spacing: 3px; margin-bottom: 0.5rem;">DE: {{sender}}</div>
        <div class="result-title">{{extra_text}}</div>
        <div class="result-message">{{message}}</div>
        <div style="font-size: 3rem; margin-top: 2rem;">💖✨💍</div>
    </div>

    <div class="audio-wrapper" id="audio-panel" style="display: none;">
        <div class="audio-label">Tu Audio Mágico</div>
        <div class="player-btn" id="toggle-audio">
            <span id="p-ic">▶</span>
            <span id="s-ic" style="display:none">||</span>
        </div>
        <div class="slider-bar">
            <div class="slider-progress" id="s-progress"></div>
        </div>
        <div style="font-size: 12px; font-weight: 900; min-width: 35px; color: rgba(0,0,0,0.3);" id="t-disp">0:00</div>
    </div>

    <audio id="core-audio" src="{{audio_src}}" loop></audio>
    <div id="yt-api-box" style="visibility:hidden; width:1px; height:1px;">
        <div id="yt-player-instance"></div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <script>
        const segmentsData = [
            { text: "no", win: false }, { text: "no", win: false }, { text: "sí", win: true },
            { text: "no", win: false }, { text: "no", win: false }, { text: "no", win: false },
            { text: "no", win: false }, { text: "sí", win: true }
        ];

        const segContainer = document.getElementById('wheel-segments');
        const dotsAnchor = document.getElementById('dots-anchor');

        segmentsData.forEach((s, i) => {
            const label = document.createElement('div');
            label.className = 'label';
            label.style.transform = "rotate(" + (i * 45) + "deg)";
            label.textContent = s.text;
            segContainer.appendChild(label);

            const dot = document.createElement('div');
            dot.className = 'rim-dot';
            dot.style.transform = "rotate(" + (i * 45 + 22.5) + "deg)";
            dotsAnchor.appendChild(dot);
        });

        const flow = document.getElementById('hearts-flow');
        for(let x=0; x<12; x++) {
            const h = document.createElement('div');
            h.className = 'floating-heart';
            h.innerHTML = '❤️';
            h.style.left = (Math.random() * 80 - 40) + 'px';
            h.style.animationDelay = (Math.random() * 8) + 's';
            flow.appendChild(h);
        }

        const audioCore = document.getElementById('core-audio');
        let ytPlayer = null;
        let isStarted = false;
        let currentStatus = 'stop';

        function initExperience() {
            document.getElementById('splash-screen').classList.add('fade-out');
            if('{{has_audio}}' === 'true') {
                document.getElementById('audio-panel').style.display = 'flex';
                startMusic();
            }
            isStarted = true;
        }

        function startMusic() {
            const ytId = "{{youtube_id}}";
            if(ytId) {
                const tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                document.body.appendChild(tag);
                window.onYouTubeIframeAPIReady = () => {
                    ytPlayer = new YT.Player('yt-player-instance', {
                        videoId: ytId, height: '0', width: '0',
                        playerVars: { autoplay: 1, loop: 1, playlist: ytId },
                        events: { 'onReady': () => { ytPlayer.playVideo(); statusUI(true); } }
                    });
                };
            } else {
                audioCore.play().then(() => statusUI(true)).catch(() => {});
            }
        }

        function statusUI(active) {
            currentStatus = active ? 'play' : 'pause';
            document.getElementById('p-ic').style.display = active ? 'none' : 'block';
            document.getElementById('s-ic').style.display = active ? 'block' : 'none';
        }

        document.getElementById('toggle-audio').onclick = () => {
            if(currentStatus === 'play') {
                if(ytPlayer) ytPlayer.pauseVideo(); else audioCore.pause();
                statusUI(false);
            } else {
                if(ytPlayer) ytPlayer.playVideo(); else audioCore.play();
                statusUI(true);
            }
        };

        if(!("{{youtube_id}}")) {
            audioCore.ontimeupdate = () => {
                const p = (audioCore.currentTime / audioCore.duration) * 100;
                document.getElementById('s-progress').style.width = p + "%";
                const m = Math.floor(audioCore.currentTime / 60);
                const s = Math.floor(audioCore.currentTime % 60);
                document.getElementById('t-disp').textContent = m + ":" + (s<10?'0':'') + s;
            };
        }

        let spins = 0;
        let locked = false;

        function executeSpin() {
            if(locked) return;
            locked = true;
            spins++;
            
            const btn = document.getElementById('spin-main-btn');
            const wheel = document.getElementById('wheel-rim');
            const toast = document.getElementById('custom-toast');
            
            btn.disabled = true;
            toast.classList.remove('visible');

            let winner;
            if(spins === 1) winner = [0,1,3,4,5,6][Math.floor(Math.random() * 6)];
            else winner = [2,7][Math.floor(Math.random() * 2)];

            const offset = 22.5;
            const target = (270 - (winner * 45) - offset) + (360 * (7 + spins));
            wheel.style.transform = "rotate(" + target + "deg)";

            setTimeout(() => {
                if(segmentsData[winner].win) {
                    launchCelebration();
                } else {
                    toast.classList.add('visible');
                    btn.disabled = false;
                    btn.innerHTML = "<span>💘 reintentar</span> ✨";
                    locked = false;
                }
            }, 5500);
        }

        function launchCelebration() {
            const end = Date.now() + 4000;
            const colors = ['#ff4d94', '#4db8ff', '#ffffff'];
            (function f() {
                confetti({ particleCount: 5, angle: 60, spread: 60, origin: { x: 0 }, colors: colors });
                confetti({ particleCount: 5, angle: 120, spread: 60, origin: { x: 1 }, colors: colors });
                if(Date.now() < end) requestAnimationFrame(f);
            })();
            document.getElementById('gift-overlay').classList.add('active');
        }
    </script>
</body>
</html>`;
