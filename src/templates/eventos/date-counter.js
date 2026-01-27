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
            background: #000; 
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
            filter: brightness(0.4) blur(2px);
            z-index: 0;
            display: {{image_display}};
        }

        .overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%);
            z-index: 1;
        }

        .container {
            position: relative;
            z-index: 10;
            text-align: center;
            width: 90%;
            max-width: 500px;
        }

        /* Neon Clock Style */
        .clock-container {
            width: 180px; height: 180px;
            border-radius: 50%;
            border: 4px solid #fff;
            margin: 0 auto 2rem;
            position: relative;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.2);
            background: rgba(255,255,255,0.05);
            backdrop-filter: blur(5px);
        }

        .hand {
            position: absolute;
            bottom: 50%;
            left: 50%;
            transform-origin: bottom center;
            border-radius: 4px;
        }
        .hour { width: 4px; height: 40px; background: #00f2ff; box-shadow: 0 0 10px #00f2ff; z-index: 3; }
        .min { width: 3px; height: 60px; background: #ff4d94; box-shadow: 0 0 10px #ff4d94; z-index: 2; }
        .sec { width: 1.5px; height: 75px; background: #ffeead; box-shadow: 0 0 5px #ffeead; z-index: 1; }
        .center-dot { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 10px; height: 10px; background: white; border-radius: 50%; z-index: 5; box-shadow: 0 0 10px white; }

        .title-neon {
            font-size: 2.8rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 4px;
            margin-bottom: 2rem;
            background: linear-gradient(to right, #ff4d94, #ff80bf, #ff4d94);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 20px rgba(255, 77, 148, 0.4);
            animation: pulse 2s infinite ease-in-out;
        }

        .message-box {
            font-family: 'Dancing Script', cursive;
            font-size: 1.4rem;
            margin-bottom: 2.5rem;
            color: rgba(255,255,255,0.9);
            line-height: 1.4;
        }

        /* Countdown Grid */
        .counter-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
        }

        .counter-item {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 1.2rem;
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }

        .counter-val { font-size: 2.2rem; font-weight: 900; display: block; margin-bottom: 2px; }
        .counter-label { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; opacity: 0.6; letter-spacing: 2px; color: #ff80bf; }

        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.9; transform: scale(1.02); } }

        /* Intro */
        #intro-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #000; z-index: 3000; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; transition: opacity 0.8s; }
        #intro-overlay.hidden { opacity: 0; pointer-events: none; }

        .audio-controls { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); width: 85%; max-width: 350px; background: rgba(0,0,0,0.8); backdrop-filter: blur(15px); padding: 12px 20px; border-radius: 30px; display: flex; align-items: center; gap: 15px; z-index: 1000; color: white; border: 1px solid rgba(255,255,255,0.1); }
        .play-btn { width: 40px; height: 40px; background: #ff4d94; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; color: white; }
        .progress-bar-container { flex-grow: 1; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; overflow: hidden; }
        .progress-bar { width: 0%; height: 100%; background: #ff4d94; }

        .particles { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 5; }
    </style>
</head>
<body>
    <div id="intro-overlay" onclick="openBox()">
        <div style="font-size: 80px; filter: drop-shadow(0 0 20px #00f2ff);">⏰</div>
        <div style="color: white; font-size: 1.8rem; font-weight: 900; margin-top: 2rem; letter-spacing: 2px; text-align: center;">NUESTRO TIEMPO JUNTOS</div>
        <div style="color: #ff4d94; margin-top: 1rem; font-weight: bold; letter-spacing: 5px; animation: pulse 1.5s infinite;">TOCA PARA VER ❤️</div>
    </div>

    <div class="background-photo"></div>
    <div class="overlay"></div>

    <div class="container">
        <div class="clock-container">
            <div class="center-dot"></div>
            <div class="hand hour" id="hour"></div>
            <div class="hand min" id="min"></div>
            <div class="hand sec" id="sec"></div>
        </div>

        <h1 class="title-neon">{{extra_text}}</h1>
        
        <div class="message-box" style="{{message_display}}">
            {{message}}
        </div>

        <div class="counter-grid">
            <div class="counter-item"><span class="counter-val" id="days">0</span><span class="counter-label">Días</span></div>
            <div class="counter-item"><span class="counter-val" id="hours">0</span><span class="counter-label">Horas</span></div>
            <div class="counter-item"><span class="counter-val" id="mins">0</span><span class="counter-label">Minutos</span></div>
            <div class="counter-item"><span class="counter-val" id="secs">0</span><span class="counter-label">Segundos</span></div>
        </div>

        <div style="margin-top: 3rem; font-weight: 900; color: #ff4d94; letter-spacing: 3px; font-size: 0.9rem; text-transform: uppercase;">
             De: {{sender}}
        </div>
    </div>

    <div class="audio-controls" style="display: none;" id="audio-ui">
        <div class="play-btn" id="play-btn">
            <span id="play-icon">▶</span><span id="pause-icon" style="display:none">||</span>
        </div>
        <div class="progress-bar-container"><div class="progress-bar" id="progress-bar"></div></div>
    </div>

    <canvas id="particles" class="particles"></canvas>

    <audio id="bg-audio" src="{{audio_src}}" loop></audio>
    <div id="yt-player" style="position:fixed; opacity:0; pointer-events:none;"></div>

    <script>
        const hasAudio = '{{has_audio}}' === 'true';
        const youtubeId = "{{ youtube_id }}".replace(/[{}]/g, '');
        let audio = document.getElementById('bg-audio');
        let ytPlayer = null;
        let ytReady = false;

        // Simple Clock Logic
        function updateClock() {
            const now = new Date();
            const h = now.getHours();
            const m = now.getMinutes();
            const s = now.getSeconds();
            
            document.getElementById('hour').style.transform = 'translate(-50%, 0) rotate(' + (h * 30 + m/2) + 'deg)';
            document.getElementById('min').style.transform = 'translate(-50%, 0) rotate(' + (m * 6) + 'deg)';
            document.getElementById('sec').style.transform = 'translate(-50%, 0) rotate(' + (s * 6) + 'deg)';
        }
        setInterval(updateClock, 1000);
        updateClock();

        // Date Counter Logic
        let userDate = '{{start_date}}';
        let startDate = new Date();
        
        if (userDate && userDate !== '') {
            startDate = new Date(userDate + 'T00:00:00');
        } else {
            startDate.setFullYear(startDate.getFullYear() - 1); // 1 year ago default
        }

        function updateCounter() {
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
        }
        setInterval(updateCounter, 1000);
        updateCounter();

        // Global Audio System
        window.onYouTubeIframeAPIReady = function() {
            if (youtubeId && youtubeId.length > 2) {
                ytPlayer = new YT.Player('yt-player', {
                    height: '0', width: '0', videoId: youtubeId,
                    playerVars: { 'autoplay': 0, 'controls': 0, 'loop': 1, 'playlist': youtubeId },
                    events: {
                        'onReady': () => { 
                            ytReady = true; 
                            if(window.playOnReady) { ytPlayer.playVideo(); updateUI(true); } 
                        },
                        'onStateChange': (e) => updateUI(e.data === 1)
                    }
                });
            }
        };

        if (youtubeId && youtubeId.length > 2) {
            const tag = document.createElement('script'); tag.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(tag);
        }

        function updateUI(playing) {
            document.getElementById('play-icon').style.display = playing ? 'none' : 'inline';
            document.getElementById('pause-icon').style.display = playing ? 'inline' : 'none';
        }

        window.openBox = function() {
            document.getElementById('intro-overlay').classList.add('hidden');
            if (hasAudio) {
                document.getElementById('audio-ui').style.display = 'flex';
                if (ytPlayer && ytReady) { 
                    ytPlayer.playVideo(); 
                    updateUI(true); 
                } 
                else if (audio && audio.src) { 
                    audio.play().catch(() => {}); 
                    updateUI(true); 
                }
                else { 
                    window.playOnReady = true; 
                }
            }
            startParticles();
        };

        function startParticles() {
            const canvas = document.getElementById('particles');
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const hearts = [];
            for(let i=0; i<30; i++) {
                hearts.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: 5 + Math.random() * 10,
                    speed: 0.5 + Math.random() * 1.5,
                    opacity: 0.2 + Math.random() * 0.5
                });
            }

            function draw() {
                ctx.clearRect(0,0,canvas.width, canvas.height);
                hearts.forEach(h => {
                    ctx.fillStyle = 'rgba(255, 77, 148, '+h.opacity+')';
                    ctx.font = h.size + 'px serif';
                    ctx.fillText('❤️', h.x, h.y);
                    h.y -= h.speed;
                    if(h.y < -20) h.y = canvas.height + 20;
                });
                requestAnimationFrame(draw);
            }
            draw();
        }

        document.getElementById('play-btn').onclick = () => {
            if (ytPlayer && ytReady) { 
                if (ytPlayer.getPlayerState() === 1) ytPlayer.pauseVideo(); else ytPlayer.playVideo(); 
            }
            else { 
                if (audio.paused) audio.play(); else audio.pause(); 
            }
        };

        if (audio) { 
            audio.onplay = () => updateUI(true);
            audio.onpause = () => updateUI(false);
            audio.ontimeupdate = () => { 
                document.getElementById('progress-bar').style.width = (audio.currentTime / audio.duration) * 100 + '%'; 
            }; 
        }
    </script>
</body>
</html>`;
