export const DATE_COUNTER_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{name}} - Nuestro Tiempo</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Dancing+Script:wght@700&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
            background: #0a0a12; 
            color: white; 
            font-family: 'Outfit', sans-serif; 
            height: 100vh; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            overflow: hidden;
            position: relative;
        }

        .background-photo {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background-image: url('{{image_src}}');
            background-size: cover;
            background-position: center;
            filter: brightness(0.5) blur(8px); /* Higher blur for premium feel */
            z-index: 0;
            transform: scale(1.1); /* Prevent white edges from blur */
        }

        .overlay {
            position: fixed;
            inset: 0;
            background: radial-gradient(circle at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%);
            z-index: 1;
        }

        .container {
            position: relative;
            z-index: 10;
            text-align: center;
            width: 90%;
            max-width: 450px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        /* Premium Clock Style */
        .clock-ring {
            width: 200px; height: 200px;
            border-radius: 50%;
            border: 2px solid rgba(255,255,255,0.1);
            margin: 0 auto 2.5rem;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(10px);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.05);
        }

        .clock-ring::before {
            content: "";
            position: absolute;
            inset: -5px;
            border-radius: 50%;
            border: 2px solid transparent;
            background: linear-gradient(45deg, #00f2ff, #ff4d94, #ffeead) border-box;
            -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: destination-out;
            mask-composite: exclude;
            animation: rotate-border 4s linear infinite;
        }
        @keyframes rotate-border { 100% { transform: rotate(360deg); } }

        .clock-inner-photo {
            width: 170px; height: 170px;
            border-radius: 50%;
            background-image: url('{{image_src}}');
            background-size: cover;
            background-position: center;
            border: 3px solid white;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
            z-index: 2;
        }

        .hand {
            position: absolute;
            bottom: 50%;
            left: 50%;
            transform-origin: bottom center;
            background: white;
            border-radius: 4px;
            z-index: 10;
        }
        .hour { width: 4px; height: 40px; }
        .min { width: 3px; height: 60px; }
        .sec { width: 1.5px; height: 75px; background: #ff4d94; box-shadow: 0 0 10px #ff4d94; }
        .center-dot { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 12px; height: 12px; background: white; border-radius: 50%; z-index: 15; box-shadow: 0 0 15px white; }

        .title-neon {
            font-size: 2.2rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 6px;
            margin-bottom: 2rem;
            color: #fff;
            text-shadow: 0 0 10px rgba(255,255,255,0.5), 0 0 20px #ff4d94;
            animation: pulse-light 2s infinite ease-in-out;
        }
        @keyframes pulse-light { 0%, 100% { opacity: 1; text-shadow: 0 0 10px rgba(255,255,255,0.5), 0 0 20px #ff4d94; } 50% { opacity: 0.8; text-shadow: 0 0 20px rgba(255,255,255,0.8), 0 0 40px #ff4d94; } }

        /* Counter Grid */
        .counter-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            width: 100%;
        }

        .counter-item {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(15px);
            padding: 20px;
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            text-align: center;
        }

        .counter-val { font-size: 2.5rem; font-weight: 900; display: block; margin-bottom: 5px; color: #fff; }
        .counter-label { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: #ff80bf; letter-spacing: 3px; }

        .sender-tag { margin-top: 3rem; font-weight: 800; color: rgba(255,255,255,0.5); letter-spacing: 4px; font-size: 0.8rem; text-transform: uppercase; }

        /* Intro Overlay */
        #intro-overlay { position: fixed; inset: 0; background: #000; z-index: 5000; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; transition: opacity 1s cubic-bezier(0.4, 0, 0.2, 1); }
        #intro-overlay.hidden { opacity: 0; pointer-events: none; }

        .intro-icon { font-size: 100px; filter: drop-shadow(0 0 30px #00f2ff); animation: float 3s infinite ease-in-out; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }

        /* HUD Music */
        .music-hud { position: fixed; bottom: 30px; width: 90%; max-width: 380px; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(20px); padding: 15px 25px; border-radius: 50px; border: 1px solid rgba(255, 255, 255, 0.1); display: flex; align-items: center; gap: 20px; z-index: 1000; transition: opacity 2s; opacity: 0; }
        body.ready .music-hud { opacity: 1; }
        .play-toggle { width: 50px; height: 50px; background: #ff4d94; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; color: white; font-size: 1.2rem; }
        .progress-bg { flex: 1; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; }
        .progress-fill { height: 100%; background: #ff4d94; width: 0%; border-radius: 2px; transition: width 0.1s linear; }

        @media (max-width: 500px) {
            .clock-ring { width: 160px; height: 160px; margin-bottom: 2rem; }
            .clock-inner-photo { width: 130px; height: 130px; }
            .counter-val { font-size: 1.8rem; }
            .title-neon { font-size: 1.8rem; }
        }
    </style>
</head>
<body class="is-loading">
    <div id="intro-overlay" onclick="startExperience()">
        <div class="intro-icon">📅</div>
        <div style="color: white; font-size: 1.8rem; font-weight: 900; margin-top: 2rem; letter-spacing: 4px; text-align: center;">NUESTRO CONTADOR</div>
        <div style="color: #ff4d94; margin-top: 1.5rem; font-weight: 900; letter-spacing: 6px; animation: pulse-light 1.5s infinite;">TOCA PARA VER ❤️</div>
    </div>

    <div class="background-photo"></div>
    <div class="overlay"></div>

    <div class="container">
        <div class="clock-ring">
            <div class="center-dot"></div>
            <div class="hand hour" id="hour"></div>
            <div class="hand min" id="min"></div>
            <div class="hand sec" id="sec"></div>
            <div class="clock-inner-photo"></div>
        </div>

        <h1 class="title-neon">{{extra_text}}</h1>
        
        <div class="counter-grid">
            <div class="counter-item"><span class="counter-val" id="days">0</span><span class="counter-label">Días</span></div>
            <div class="counter-item"><span class="counter-val" id="hours">0</span><span class="counter-label">Horas</span></div>
            <div class="counter-item"><span class="counter-val" id="mins">0</span><span class="counter-label">Min</span></div>
            <div class="counter-item"><span class="counter-val" id="secs">0</span><span class="counter-label">Seg</span></div>
        </div>

        <div class="sender-tag">De: {{sender}} ❤️</div>
    </div>

    <div class="music-hud" id="music-ui">
        <div class="play-toggle" id="play-btn">▶</div>
        <div class="progress-bg"><div class="progress-fill" id="progress-bar"></div></div>
    </div>

    <audio id="player" src="{{audio_src}}" loop></audio>
    <div id="yt-wrap" style="display:none"><div id="yt-player"></div></div>

    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <script>
        const hasAudio = '{{has_audio}}' === 'true';
        const youtubeId = "{{ youtube_id }}".replace(/[{}]/g, '');
        const startDateString = '{{start_date}}';
        
        const player = document.getElementById('player');
        let ytPlayer = null;

        // Counter Logic
        const startDate = startDateString ? new Date(startDateString + 'T00:00:00') : new Date();

        function updateContent() {
            const now = new Date();
            const diff = now - startDate;
            
            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const m = Math.floor((diff / (1000 * 60)) % 60);
            const s = Math.floor((diff / 1000) % 60);
            
            document.getElementById('days').textContent = d;
            document.getElementById('hours').textContent = h;
            document.getElementById('mins').textContent = m;
            document.getElementById('secs').textContent = s;

            // Clock hands
            const ch = now.getHours();
            const cm = now.getMinutes();
            const cs = now.getSeconds();
            document.getElementById('hour').style.transform = 'translate(-50%, 0) rotate(' + (ch * 30 + cm/2) + 'deg)';
            document.getElementById('min').style.transform = 'translate(-50%, 0) rotate(' + (cm * 6) + 'deg)';
            document.getElementById('sec').style.transform = 'translate(-50%, 0) rotate(' + (cs * 6) + 'deg)';
        }

        setInterval(updateContent, 1000);
        updateContent();

        function startExperience() {
            document.getElementById('intro-overlay').classList.add('hidden');
            document.body.classList.add('ready');
            
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#ff4d94', '#00f2ff', '#ffffff'] });

            if(hasAudio) {
                if(youtubeId && youtubeId.length > 5) {
                    const tag = document.createElement('script');
                    tag.src = "https://www.youtube.com/iframe_api";
                    document.body.appendChild(tag);
                    window.onYouTubeIframeAPIReady = () => {
                        ytPlayer = new YT.Player('yt-player', {
                            videoId: youtubeId, height: '0', width: '0',
                            playerVars: { autoplay: 1, loop: 1, playlist: youtubeId },
                            events: { 'onReady': () => toggleMusic(true) }
                        });
                    };
                } else {
                    player.play().catch(() => {});
                    toggleMusic(true);
                }
            }
        }

        function toggleMusic(play) {
            const btn = document.getElementById('play-btn');
            if(play) {
                btn.textContent = '||';
                if(ytPlayer) ytPlayer.playVideo(); else player.play();
            } else {
                btn.textContent = '▶';
                if(ytPlayer) ytPlayer.pauseVideo(); else player.pause();
            }
        }

        document.getElementById('play-btn').onclick = () => {
            const btn = document.getElementById('play-btn');
            toggleMusic(btn.textContent === '▶');
        };

        if(!youtubeId || youtubeId.length < 5) {
            player.ontimeupdate = () => {
                const pct = (player.currentTime / player.duration) * 100;
                document.getElementById('progress-bar').style.width = pct + '%';
            };
        }
    </script>
</body>
</html>\`;
