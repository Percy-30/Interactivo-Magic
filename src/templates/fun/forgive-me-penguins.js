export const FORGIVE_ME_PENGUINS_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¿Me perdonas? 🐧💔 - {{name}}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        
        :root {
            --primary: #ff85a1;
            --secondary: #0080ff;
            --bg: #ffeef2;
            --card-bg: #fff;
        }

        body {
            margin: 0;
            padding: 0;
            background-color: var(--bg);
            font-family: 'Outfit', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            overflow: hidden;
        }

        .container {
            width: 90%;
            max-width: 400px;
            text-align: center;
            z-index: 10;
        }

        .main-title {
            font-size: 1.8rem;
            font-weight: 900;
            color: #333;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .card {
            background: var(--card-bg);
            padding: 2rem;
            border-radius: 35px;
            box-shadow: 0 15px 35px rgba(255, 133, 161, 0.15);
            position: relative;
            transition: transform 0.3s ease;
        }

        .penguin-img {
            width: 100%;
            max-width: 250px;
            border-radius: 20px;
            margin-bottom: 1.5rem;
            object-fit: cover;
        }

        .message {
            color: var(--primary);
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 2rem;
            line-height: 1.4;
        }

        .btns {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            height: 80px;
        }

        button {
            padding: 12px 35px;
            border-radius: 25px;
            border: none;
            font-family: 'Outfit', sans-serif;
            font-weight: 900;
            font-size: 1.2rem;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        #yesBtn {
            background-color: var(--primary);
            color: white;
            box-shadow: 0 8px 20px rgba(255, 133, 161, 0.3);
            min-width: 100px;
            justify-content: center;
            z-index: 100;
        }

        #noBtn {
            background-color: white;
            color: #ff4d4d;
            border: 2px solid #ffeded;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
            white-space: nowrap;
        }

        /* Success Screen */
        .success-screen {
            display: none;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }

        .success-screen.active {
            display: flex;
        }

        .victory-photo {
            width: 180px;
            height: 180px;
            border-radius: 50%;
            border: 6px solid white;
            box-shadow: 0 10px 30px rgba(255, 133, 161, 0.2);
            margin-bottom: 1.5rem;
            object-fit: cover;
        }

        .victory-msg {
            font-size: 2rem;
            font-weight: 900;
            color: var(--primary);
            margin-bottom: 1rem;
        }

        .sender-tag {
            font-size: 0.8rem;
            font-weight: 900;
            color: rgba(0,0,0,0.3);
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 0.5rem;
        }

        /* Hearts background */
        .hearts-bg {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 1;
        }
        .heart-bit {
            position: absolute;
            animation: float-up linear forwards;
        }
        @keyframes float-up {
            from { transform: translateY(100vh) rotate(0deg); opacity: 0; }
            20% { opacity: 0.7; }
            100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
        }

        /* Audio HUD */
        .audio-hud {
            position: fixed;
            bottom: 30px;
            width: 85%;
            max-width: 400px;
            background: white;
            padding: 10px 20px;
            border-radius: 50px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 1000;
        }
        .play-btn {
            width: 40px; height: 40px;
            background: var(--primary);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            color: white; cursor: pointer;
        }
        .progress { flex: 1; height: 4px; background: #f0f0f0; border-radius: 10px; overflow: hidden; }
        .progress-bar { height: 100%; background: var(--primary); width: 0%; }

        /* Intro wall */
        #wall {
            position: fixed;
            inset: 0;
            background: var(--bg);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: opacity 0.8s ease;
        }
        #wall.hide { opacity: 0; pointer-events: none; }
    </style>
</head>
<body>
    <div id="wall" onclick="startApp()">
        <div style="font-size: 80px; animation: bounce 2s infinite;">🐧</div>
        <h2 style="font-weight: 900; margin-top: 1rem;">¿Me perdonas?</h2>
        <p style="color: var(--primary); font-weight: 900; letter-spacing: 3px; font-size: 0.7rem;">TOCA PARA ABRIR</p>
    </div>

    <div class="hearts-bg" id="hearts-box"></div>

    <div class="container" id="game-ui">
        <h1 class="main-title">¿Me perdonas mi Amor? 💔</h1>
        <div class="card" id="main-card">
            <img id="penguin-gif" src="https://media.tenor.com/79yQ8hLzX_gAAAAd/mochi-mochi-mochi-peach-cat.gif" class="penguin-img" alt="Triste">
            <div class="message">Dame otra oportunidad 💐</div>
            <div class="btns">
                <button id="noBtn">No 💔</button>
                <button id="yesBtn">Sí 💖</button>
            </div>
        </div>
    </div>

    <div class="container success-screen" id="success-ui">
        <div class="card">
            <img id="happy-penguin" src="https://media.tenor.com/_q1fJ7eXRE8AAAAd/love-penguin.gif" class="penguin-img" alt="Feliz">
            <div class="sender-tag">De: {{sender}}</div>
            <h2 class="victory-msg">¡GRACIAS! ❤️</h2>
            <img src="{{image_src}}" class="victory-photo" alt="Foto" id="victory-photo" onerror="this.style.display='none'">
            <div class="message" style="color: #333;">{{extra_text}}</div>
            <p style="color: rgba(0,0,0,0.5); font-style: italic;">{{message}}</p>
        </div>
    </div>

    <div class="audio-hud" id="audio-panel" style="display: none;">
        <div class="play-btn" id="audio-trigger">▶</div>
        <div class="progress"><div class="progress-bar" id="p-bar"></div></div>
    </div>

    <audio id="player" src="{{audio_src}}" loop></audio>
    <div id="yt-wrap" style="display:none"><div id="yt-player"></div></div>

    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <script>
        const penguinGifs = {
            sad: "https://media.tenor.com/XU684T4zQ_4AAAAC/penguin-crying.gif",
            crying: "https://media.tenor.com/yO8_M8W_pBAAAAAC/penguin-cry.gif",
            happy: "https://media.tenor.com/_q1fJ7eXRE8AAAAd/love-penguin.gif"
        };

        const noBtn = document.getElementById('noBtn');
        const yesBtn = document.getElementById('yesBtn');
        const gif = document.getElementById('penguin-gif');
        const mainCard = document.getElementById('main-card');
        
        gif.src = penguinGifs.sad;

        let level = 0;
        let scale = 1;

        function moveNo() {
            level++;
            
            // Random teleport
            const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
            const y = Math.random() * (window.innerHeight - noBtn.offsetHeight - 50);
            
            noBtn.style.position = 'fixed';
            noBtn.style.left = x + 'px';
            noBtn.style.top = y + 'px';
            noBtn.style.zIndex = '9999';

            // Make Yes Button grow
            scale += 0.15;
            yesBtn.style.transform = "scale(" + scale + ")";

            // Change Penguin to more sad
            if(level > 3) gif.src = penguinGifs.crying;
        }

        noBtn.addEventListener('mouseenter', moveNo);
        noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveNo(); });

        yesBtn.onclick = () => {
            document.getElementById('game-ui').style.display = 'none';
            document.getElementById('success-ui').classList.add('active');
            
            // Celebration
            const duration = 15 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            function randomInRange(min, max) { return Math.random() * (max - min) + min; }

            const interval = setInterval(function() {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return clearInterval(interval);
                const particleCount = 50 * (timeLeft / duration);
                confetti({...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }});
                confetti({...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }});
            }, 250);

            // Audio trigger if not already
            toggleMusic(true);
        };

        // Standard logic for audio/splash
        const player = document.getElementById('player');
        let ytPlayer = null;

        function startApp() {
            document.getElementById('wall').classList.add('hide');
            if('{{has_audio}}' === 'true') {
                document.getElementById('audio-panel').style.display = 'flex';
                initializeAudio();
            }
        }

        function initializeAudio() {
            const yId = "{{youtube_id}}";
            if(yId) {
                const tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                document.body.appendChild(tag);
                window.onYouTubeIframeAPIReady = () => {
                    ytPlayer = new YT.Player('yt-player', {
                        videoId: yId, height: '0', width: '0',
                        playerVars: { autoplay: 1, loop: 1, playlist: yId },
                        events: { 'onReady': () => toggleMusic(true) }
                    });
                };
            } else {
                player.play().catch(() => {});
                toggleMusic(true);
            }
        }

        function toggleMusic(play) {
            const btn = document.getElementById('audio-trigger');
            if(play) {
                btn.textContent = '||';
                if(ytPlayer) ytPlayer.playVideo(); else player.play();
            } else {
                btn.textContent = '▶';
                if(ytPlayer) ytPlayer.pauseVideo(); else player.pause();
            }
        }

        document.getElementById('audio-trigger').onclick = () => {
            const current = document.getElementById('audio-trigger').textContent === '||';
            toggleMusic(!current);
        };

        if(!("{{youtube_id}}")) {
            player.ontimeupdate = () => {
                const perc = (player.currentTime / player.duration) * 100;
                document.getElementById('p-bar').style.width = perc + "%";
            };
        }

        // Floating hearts
        setInterval(() => {
            const h = document.createElement('div');
            h.className = 'heart-bit';
            h.innerHTML = ['❤️', '💖', '🐧', '🌸'][Math.floor(Math.random() * 4)];
            h.style.left = Math.random() * 100 + 'vw';
            h.style.fontSize = (Math.random() * 20 + 20) + 'px';
            h.style.animationDuration = (Math.random() * 3 + 3) + 's';
            document.getElementById('hearts-box').appendChild(h);
            setTimeout(() => h.remove(), 5000);
        }, 500);
    </script>
</body>
</html>`;
