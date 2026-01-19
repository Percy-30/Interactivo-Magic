export const LOVE_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tengo algo que decirte, {{name}}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        body { margin: 0; background: #0a0514; color: white; font-family: 'Outfit', sans-serif; height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .card { background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 2.5rem; border-radius: 20px; text-align: center; border: 1px solid rgba(255,255,255,0.1); width: 90%; max-width: 400px; box-shadow: 0 15px 35px rgba(0,0,0,0.5); z-index: 10; }
        h1 { color: #ff4d94; font-size: 2.2rem; font-weight: 900; margin-bottom: 1rem; }
        p { font-size: 1.1rem; line-height: 1.5; color: rgba(255,255,255,0.9); }
        .btns { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; }
        button { padding: 12px 30px; border-radius: 12px; border: none; font-size: 1.1rem; font-weight: bold; cursor: pointer; transition: 0.3s; font-family: 'Outfit', sans-serif; }
        #yesBtn { background: #ff4d94; color: white; box-shadow: 0 5px 15px rgba(255, 77, 148, 0.4); }
        #noBtn { background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); }
        #success { display: none; }
        .sender { margin-top: 1.5rem; font-style: italic; color: rgba(255,255,255,0.6); font-size: 0.9rem; }

        /* Unified Audio and Overlay Styles */
        #intro-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #0a0514; z-index: 2000; display: flex; justify-content: center; align-items: center; transition: opacity 0.8s ease; }
        #intro-overlay.hidden { opacity: 0; pointer-events: none; }
        .box-container { text-align: center; cursor: pointer; animation: float-box 3s ease-in-out infinite; }
        @keyframes float-box { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .box-emoji { font-size: 80px; margin-bottom: 20px; filter: drop-shadow(0 0 20px rgba(255, 77, 148, 0.5)); }
        .box-text { font-size: 24px; font-weight: bold; color: white; margin-bottom: 10px; }
        .tap-to-open { font-size: 16px; color: rgba(255,255,255,0.6); letter-spacing: 2px; text-transform: uppercase; }
        
        .audio-controls { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); width: 85%; max-width: 350px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(15px); padding: 12px 20px; border-radius: 25px; border: 1px solid rgba(255, 255, 255, 0.15); display: flex; align-items: center; gap: 15px; z-index: 1000; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .play-btn { width: 40px; height: 40px; background: #ff4d94; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; flex-shrink: 0; }
        .progress-bar-container { flex-grow: 1; height: 4px; background: rgba(255, 255, 255, 0.1); border-radius: 2px; overflow: hidden; }
        .progress-bar { width: 0%; height: 100%; background: #ff4d94; border-radius: 2px; }
        .time-text { font-size: 11px; color: rgba(255, 255, 255, 0.5); min-width: 35px; }
        .song-title { position: absolute; top: -22px; left: 50%; transform: translateX(-50%); font-size: 11px; font-weight: 800; color: #ff4d94; white-space: nowrap; text-transform: uppercase; letter-spacing: 1px; }
    </style>
</head>
<body>
    <div id="intro-overlay">
        <div class="box-container" onclick="openBox()">
            <div class="box-emoji">🎁</div>
            <div class="box-text">¡Tienes una sorpresa!</div>
            <div class="tap-to-open">Haz clic para abrir</div>
        </div>
    </div>

    <div class="card" id="mainCard">
        <h1>Para: {{name}}</h1>
        <p>{{message}}</p>
        <div class="btns">
            <button id="yesBtn">SÍ ❤️</button>
            <button id="noBtn">NO 😢</button>
        </div>
        <div class="sender">De: {{sender}}</div>
    </div>

    <div class="card" id="success">
        <h1>¡SABÍA QUE DIRÍAS QUE SÍ! ❤️</h1>
        <p>Te quiero mucho, {{name}}.</p>
    </div>

    <div class="audio-controls" style="{{audio_display}}">
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

    <script>
        const audio = document.getElementById('bg-audio');
        const youtubeId = "{{youtube_id}}";
        let ytPlayer = null;
        let activePlatform = youtubeId ? 'youtube' : 'native';
        let isPlaying = false;

        if (activePlatform === 'youtube') {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(tag);
        }

        function onYouTubeIframeAPIReady() {
            if (youtubeId) {
                ytPlayer = new YT.Player('youtube-player', {
                    height: '0', width: '0', videoId: youtubeId,
                    playerVars: { 'autoplay': 0, 'controls': 0, 'loop': 1, 'playlist': youtubeId },
                    events: { 'onReady': () => console.log("YT Ready") }
                });
            }
        }

        function openBox() {
            document.getElementById('intro-overlay').classList.add('hidden');
            setTimeout(() => {
                if (activePlatform === 'youtube' && ytPlayer) ytPlayer.playVideo();
                else audio.play().catch(() => {});
                updateUI(true);
            }, 500);
        }

        function updateUI(playing) {
            isPlaying = playing;
            document.getElementById('play-icon').style.display = playing ? 'none' : 'block';
            document.getElementById('pause-icon').style.display = playing ? 'block' : 'none';
        }

        document.getElementById('play-btn').addEventListener('click', () => {
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
                document.getElementById('time-display').textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;
            };
        }

        // Proposal Logic
        const noBtn = document.getElementById('noBtn');
        const yesBtn = document.getElementById('yesBtn');
        const mainCard = document.getElementById('mainCard');
        const success = document.getElementById('success');

        const moveNo = () => {
            const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
            const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);
            noBtn.style.position = 'fixed';
            noBtn.style.left = x + 'px';
            noBtn.style.top = y + 'px';
        };
        noBtn.addEventListener('mouseover', moveNo);
        noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveNo(); });

        yesBtn.addEventListener('click', () => {
            mainCard.style.display = 'none';
            success.style.display = 'block';
            for(let i=0; i<80; i++) setTimeout(createConfetti, i * 20);
        });

        function createConfetti() {
            const isHeart = Math.random() > 0.4;
            const c = document.createElement('div');
            c.style.position = 'fixed';
            c.style.left = Math.random() * 100 + 'vw';
            c.style.top = '-25px';
            
            let duration;
            if (isHeart) {
                c.innerHTML = '❤️';
                c.style.fontSize = (Math.random() * 12 + 12) + 'px';
                duration = Math.random() * 3000 + 3000; // 3-6s for hearts (slower)
                c.style.filter = 'drop-shadow(0 0 5px rgba(255,0,0,0.3))';
            } else {
                c.style.width = '10px';
                c.style.height = '10px';
                c.style.background = ['#ff4d94','#7000ff','#00f2ff','#ffeead'][Math.floor(Math.random()*4)];
                c.style.borderRadius = '2px';
                duration = Math.random() * 2000 + 2000; // 2-4s for confetti (medium)
            }
            
            c.style.zIndex = '100';
            c.style.pointerEvents = 'none';
            document.body.appendChild(c);
            
            const spin = Math.random() * 1440 - 720;
            const drift = (Math.random() - 0.5) * 200; // Lateral movement
            
            c.animate([
                { transform: 'translateY(0) translateX(0) rotate(0)', opacity: 1 }, 
                { transform: 'translateY(110vh) translateX(' + drift + 'px) rotate(' + spin + 'deg)', opacity: 0 }
            ], { 
                duration: duration,
                easing: isHeart ? 'ease-in-out' : 'cubic-bezier(.17,.67,.83,.67)'
            }).onfinish = () => c.remove();
        }
    </script>
</body>
</html>`;

export const GALAXY_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Un mensaje especial para {{name}}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        
        body { 
            margin: 0; 
            background: #05020a; 
            color: white; 
            font-family: 'Outfit', sans-serif; 
            overflow: hidden; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            height: 100vh; 
            perspective: 1000px;
        }

        /* Space Background with Nebulas */
        .universe {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 50% 50%, rgba(255, 100, 50, 0.15) 0%, transparent 60%),
                radial-gradient(circle at 20% 30%, rgba(100, 50, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(255, 50, 150, 0.1) 0%, transparent 50%);
            z-index: -1;
        }

        .stars {
            position: absolute;
            width: 100%;
            height: 100%;
            background-image: 
                radial-gradient(1px 1px at 20px 30px, #eee, rgba(0,0,0,0)),
                radial-gradient(1px 1px at 40px 70px, #fff, rgba(0,0,0,0)),
                radial-gradient(2px 2px at 90px 40px, #ddd, rgba(0,0,0,0));
            background-repeat: repeat;
            background-size: 200px 200px;
            opacity: 0.5;
            animation: move-stars 100s linear infinite;
        }

        @keyframes move-stars {
            from { transform: translateY(0); }
            to { transform: translateY(-1000px); }
        }

        /* Galaxy Core */
        .galaxy-center {
            position: relative;
            width: 300px;
            height: 300px;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10;
        }

        .core-glow {
            position: absolute;
            width: 250px;
            height: 250px;
            background: radial-gradient(circle, rgba(255,100,0,0.4) 0%, rgba(255,50,0,0.1) 50%, transparent 70%);
            border-radius: 50%;
            filter: blur(20px);
            animation: pulse-glow 4s ease-in-out infinite;
        }

        .hearts-origin {
            position: absolute;
            width: 10px;
            height: 10px;
            z-index: 5;
        }

        .black-hole {
            position: absolute;
            width: 120px;
            height: 120px;
            background: #000;
            border-radius: 50%;
            box-shadow: 0 0 40px rgba(255, 100, 0, 0.8), inset 0 0 20px rgba(255, 100, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid rgba(255, 100, 0, 0.3);
        }

        @keyframes pulse-glow {
            0%, 100% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.2); opacity: 0.9; }
        }

        .crown {
            position: absolute;
            top: -60px;
            font-size: 3.5rem;
            filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8));
            animation: float-crown 3s ease-in-out infinite;
            z-index: 30;
        }

        @keyframes float-crown {
            0%, 100% { transform: translateY(0) rotate(-5deg); }
            50% { transform: translateY(-10px) rotate(5deg); }
        }

        .content {
            text-align: center;
            z-index: 20;
            pointer-events: none;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        h1 {
            font-size: 2.5rem;
            margin: 0;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
            background: linear-gradient(to bottom, #fff, #ffcc00);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .message-card {
            position: fixed;
            bottom: 110px;
            width: 90%;
            max-width: 450px;
            background: rgba(10, 5, 20, 0.85);
            backdrop-filter: blur(20px);
            padding: 1.5rem 2rem;
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            text-align: center;
            box-shadow: 0 20px 50px rgba(0,0,0,0.6);
            z-index: 100;
        }

        .message-text {
            font-size: 1.25rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 0.5rem;
            color: #fff;
        }

        .sender-name {
            font-size: 0.95rem;
            color: #ff9d00;
            font-weight: 800;
            letter-spacing: 2px;
            margin-bottom: 1rem;
            text-shadow: 0 0 10px rgba(255, 157, 0, 0.4);
        }

        .sender-label {
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.5);
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 0.2rem;
        }

        .create-btn {
            display: inline-block;
            background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
            padding: 8px 20px;
            border-radius: 20px;
            color: #fff;
            text-decoration: none;
            font-size: 0.85rem;
            font-weight: 600;
            border: 1px solid rgba(255,255,255,0.1);
            transition: all 0.3s ease;
        }

        .create-btn:hover {
            background: rgba(255,255,255,0.2);
            transform: translateY(-2px);
        }

        /* Intro Surprise Box Styles */
        #intro-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #05020a;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            transition: opacity 1s ease, visibility 1s;
        }

        .box-container {
            cursor: pointer;
            text-align: center;
            animation: box-float 3s ease-in-out infinite;
        }

        .box-emoji {
            font-size: 8rem;
            filter: drop-shadow(0 0 30px rgba(255, 77, 148, 0.6));
        }

        .box-text {
            margin-top: 2rem;
            font-size: 1.5rem;
            font-weight: 700;
            letter-spacing: 2px;
            color: #ff4d94;
            text-transform: uppercase;
            text-shadow: 0 0 10px rgba(255, 77, 148, 0.4);
        }

        @keyframes box-float {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-20px) scale(1.05); }
        }

        .tap-to-open {
            margin-top: 1rem;
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.5);
            letter-spacing: 4px;
            text-transform: uppercase;
            animation: pulse-text 2s infinite;
        }

        @keyframes pulse-text {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }

        .hidden {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
        }

        /* Orbiting Words */
        .orbit-container {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            pointer-events: none;
        }

        .word {
            position: absolute;
            font-size: 1rem;
            font-weight: bold;
            color: rgba(255, 255, 255, 0.7);
            white-space: nowrap;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
            animation: float-word var(--duration) linear infinite;
        }

        @keyframes float-word {
            from { transform: translate(var(--start-x), var(--start-y)) scale(var(--scale)); opacity: 0; }
            10% { opacity: var(--opacity); }
            90% { opacity: var(--opacity); }
            to { transform: translate(var(--end-x), var(--end-y)) scale(var(--scale)); opacity: 0; }
        }

        /* Player Bar Mockup */
        .audio-controls {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            width: 85%;
            max-width: 350px;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(15px);
            padding: 12px 20px;
            border-radius: 25px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            display: flex; /* Updated flex logic */
            align-items: center;
            gap: 15px;
            z-index: 1000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .play-btn {
            width: 40px;
            height: 40px;
            background: #ff9d00;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            flex-shrink: 0;
            box-shadow: 0 0 15px rgba(255, 157, 0, 0.4);
        }

        .play-icon, .pause-icon {
            color: #000;
            font-size: 18px;
            font-weight: bold;
        }

        .progress-bar-container {
            flex-grow: 1;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            overflow: hidden;
        }

        .progress-bar {
            width: 0%;
            height: 100%;
            background: #ff9d00;
            border-radius: 2px;
            box-shadow: 0 0 10px #ff9d00;
        }

        .time-display {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.5);
            min-width: 35px;
            text-align: right;
        }

        .song-title {
            position: absolute;
            top: -22px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 11px;
            font-weight: 800;
            color: #ff9d00;
            white-space: nowrap;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
    </style>
</head>
<body>
    <div id="intro-overlay">
        <div class="box-container" onclick="openBox()">
            <div class="box-emoji">🎁</div>
            <div class="box-text">¡Tienes una sorpresa!</div>
            <div class="tap-to-open">Haz clic para abrir</div>
        </div>
    </div>

    <div class="universe">
        <div class="stars"></div>
    </div>

    <div class="galaxy-center">
        <div class="core-glow"></div>
        <div class="hearts-origin" id="hearts-container"></div>
        <div class="black-hole">
            <div class="content">
                <div class="crown">👑</div>
                <h1>{{name}}</h1>
            </div>
        </div>
        <div class="message-card">
            <div class="message-text">{{message}}</div>
            <div class="sender-label">Enviado con ❤️ por:</div>
            <div class="sender-name">{{sender}}</div>
            <a href="/" class="create-btn">Crea tu propio mensaje ✨</a>
        </div>
    </div>

    <div class="orbit-container" id="orbit"></div>

    <div class="audio-controls" style="{{audio_display}}">
        <div class="song-title" id="song-title">Cargando Audio...</div>
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

    <script>
        const audio = document.getElementById('bg-audio');
        const youtubeId = "{{youtube_id}}";
        const songTitle = document.getElementById('song-title');
        
        let ytPlayer = null;
        let activePlatform = youtubeId ? 'youtube' : 'native';
        let isPlaying = false;

        if (activePlatform === 'youtube') {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(tag);
        }

        function onYouTubeIframeAPIReady() {
            if (youtubeId) {
                ytPlayer = new YT.Player('youtube-player', {
                    height: '0', width: '0', videoId: youtubeId,
                    playerVars: { 'autoplay': 0, 'controls': 0, 'loop': 1, 'playlist': youtubeId },
                    events: { 'onReady': () => console.log("YT Ready") }
                });
            }
        }

        function openBox() {
            document.getElementById('intro-overlay').classList.add('hidden');
            setTimeout(() => {
                if (activePlatform === 'youtube' && ytPlayer) ytPlayer.playVideo();
                else audio.play().catch(() => {});
                updateUI(true);
                
                // Initial burst of orbiting elements
                for (let i = 0; i < 50; i++) setTimeout(createFloatingElement, i * 50);
                // Continuous creation of center hearts
                setInterval(createCenterHeart, 300);
            }, 500);
        }

        function updateUI(playing) {
            isPlaying = playing;
            document.getElementById('play-icon').style.display = playing ? 'none' : 'block';
            document.getElementById('pause-icon').style.display = playing ? 'block' : 'none';
            if (playing && songTitle) songTitle.textContent = "Audio Mágico";
        }

        document.getElementById('play-btn').addEventListener('click', () => {
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
                document.getElementById('time-display').textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;
            };
        }

// Center Hearts Logic
function createCenterHeart() {
    const heart = document.createElement('div');
    heart.textContent = '❤️';
    heart.style.position = 'absolute';
    heart.style.fontSize = Math.random() * 20 + 10 + 'px';
    heart.style.color = '#ff4d94';
    heart.style.opacity = '1';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '5';

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 100 + 50;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;

    heartsContainer.appendChild(heart);

    const anim = heart.animate([
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
        { transform: "translate(calc(-50% + " + vx + "px), calc(-50% + " + vy + "px)) scale(1.5)", opacity: 0 }
    ], {
        duration: Math.random() * 2000 + 1000,
        easing: 'ease-out'
    });

    anim.onfinish = () => heart.remove();
}

const orbit = document.getElementById('orbit');
const elements = [
    '❤️', '💖', '✨', '⭐', '🚀', '🌌', '💍', '🔥', '💎', '🌈', '💌', '💘', '💝', '🌹', '🦋', '🎈',
    'Pasión', 'Libertad', 'Magia', 'Eres todo', 'Contigo',
    'Eternidad', 'Felicidad', 'Gracias', 'Mi mundo', 'Sueños',
    'Mi fortuna', 'Amor eterno', 'Mi paz', 'Mi luz', 'Cariño',
    'Mi estrella', 'Inspiración', 'Mi razón', 'Mi vida', 'Mi cielo',
    'Corazón', 'Destino', 'Ternura', 'Abrazos', 'Sonrisas', 'Tesoro',
    'Mágico', 'Siempre', 'Infinito', 'Tú y Yo', 'Pasión', 'Delirio',
    'Adoración', 'Encanto', 'Ensueño', 'Hechizo', 'Latido', 'Pasión',
    'Mi Vida', 'Mi Rey', 'Mi Reina', 'Para Siempre', 'Inolvidable', 'Dicha',
    'Lealtad', 'Confianza', 'Alma Gemela', 'Destino', 'Pasión'
];

function createFloatingElement() {
    const el = document.createElement('div');
    el.className = 'word';
    const content = elements[Math.floor(Math.random() * elements.length)];
    el.textContent = content;

    if (content.length <= 2) {
        el.style.fontSize = (Math.random() * 30 + 15) + 'px';
    } else {
        el.style.fontSize = (Math.random() * 12 + 14) + 'px';
    }

    const startX = Math.random() * 100 + 'vw';
    const startY = Math.random() * 100 + 'vh';
    const endX = (Math.random() * 200 - 50) + 'vw';
    const endY = (Math.random() * 200 - 50) + 'vh';

    el.style.setProperty('--start-x', startX);
    el.style.setProperty('--start-y', startY);
    el.style.setProperty('--end-x', endX);
    el.style.setProperty('--end-y', endY);
    el.style.setProperty('--duration', (Math.random() * 12 + 8) + 's');
    el.style.setProperty('--opacity', (Math.random() * 0.7 + 0.3));
    el.style.setProperty('--scale', (Math.random() * 1.5 + 0.5));

    orbit.appendChild(el);
    setTimeout(() => el.remove(), 20000);
}

function createCenterHeart() {
    const heart = document.createElement('div');
    const icons = ['❤️', '💖', '💘', '💝', '✨'];
    heart.textContent = icons[Math.floor(Math.random() * icons.length)];
    heart.style.position = 'absolute';
    heart.style.fontSize = Math.random() * 30 + 15 + 'px';
    heart.style.opacity = '1';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '5';

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 200 + 150;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;

    heartsContainer.appendChild(heart);

    const anim = heart.animate([
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
        { transform: "translate(calc(-50% + " + vx + "px), calc(-50% + " + vy + "px)) scale(2.5)", opacity: 0 }
    ], {
        duration: Math.random() * 2500 + 1500,
        easing: 'ease-out'
    });

    anim.onfinish = () => heart.remove();
}

// Expanded Initial burst for immediate impact
for (let i = 0; i < 120; i++) {
    setTimeout(createFloatingElement, Math.random() * 8000);
}

setInterval(createFloatingElement, 200); // Super frequent elements
setInterval(createCenterHeart, 300); // More frequent hearts
    </script >
</body >
</html > `;

export const BIRTHDAY_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¡Feliz Cumpleaños {{name}}!</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        body { margin: 0; background: #05020a; color: white; font-family: 'Outfit', sans-serif; height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .card { background: rgba(255,255,255,0.05); backdrop-filter: blur(15px); padding: 3rem; border-radius: 30px; text-align: center; border: 2px solid #00f2ff; box-shadow: 0 0 30px rgba(0, 242, 255, 0.3); z-index: 10; width: 90%; max-width: 450px; }
        h1 { color: #00f2ff; font-size: 2.5rem; text-shadow: 0 0 15px rgba(0, 242, 255, 0.6); font-weight: 900; margin: 0.5rem 0; }
        .cake { font-size: 5rem; margin-bottom: 1rem; filter: drop-shadow(0 0 15px rgba(255,255,255,0.4)); }
        p { font-size: 1.2rem; line-height: 1.6; color: rgba(255,255,255,0.9); }
        .sender { margin-top:2rem; color: #00f2ff; font-weight: bold; letter-spacing: 1px; }

        /* Unified Audio and Overlay Styles */
        #intro-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #05020a; z-index: 2000; display: flex; justify-content: center; align-items: center; transition: opacity 0.8s ease; }
        #intro-overlay.hidden { opacity: 0; pointer-events: none; }
        .box-container { text-align: center; cursor: pointer; animation: float-box 3s ease-in-out infinite; }
        @keyframes float-box { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .box-emoji { font-size: 80px; margin-bottom: 20px; filter: drop-shadow(0 0 20px rgba(0, 242, 255, 0.5)); }
        .box-text { font-size: 24px; font-weight: bold; color: white; margin-bottom: 10px; }
        .tap-to-open { font-size: 16px; color: rgba(255,255,255,0.6); letter-spacing: 2px; text-transform: uppercase; }
        
        .audio-controls { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); width: 85%; max-width: 350px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(15px); padding: 12px 20px; border-radius: 25px; border: 1px solid rgba(255, 255, 255, 0.15); display: flex; align-items: center; gap: 15px; z-index: 1000; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .play-btn { width: 40px; height: 40px; background: #00f2ff; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; flex-shrink: 0; }
        .progress-bar-container { flex-grow: 1; height: 4px; background: rgba(255, 255, 255, 0.1); border-radius: 2px; overflow: hidden; }
        .progress-bar { width: 0%; height: 100%; background: #00f2ff; border-radius: 2px; }
        .time-text { font-size: 11px; color: rgba(255, 255, 255, 0.5); min-width: 35px; }
        .song-title { position: absolute; top: -22px; left: 50%; transform: translateX(-50%); font-size: 11px; font-weight: 800; color: #00f2ff; white-space: nowrap; text-transform: uppercase; letter-spacing: 1px; }
    </style>
</head>
<body>
    <div id="intro-overlay">
        <div class="box-container" onclick="openBox()">
            <div class="box-emoji">🎁</div>
            <div class="box-text">¡Tienes una sorpresa!</div>
            <div class="tap-to-open">Haz clic para abrir</div>
        </div>
    </div>

    <div class="card">
        <div class="cake">🎂</div>
        <h1>¡Feliz Cumpleaños!</h1>
        <p>Querid@ {{name}},</p>
        <p>{{message}}</p>
        <div class="sender">De: {{sender}}</div>
    </div>

    <div class="audio-controls" style="{{audio_display}}">
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

    <script>
        const audio = document.getElementById('bg-audio');
        const youtubeId = "{{youtube_id}}";
        let ytPlayer = null;
        let activePlatform = youtubeId ? 'youtube' : 'native';
        let isPlaying = false;

        if (activePlatform === 'youtube') {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(tag);
        }

        function onYouTubeIframeAPIReady() {
            if (youtubeId) {
                ytPlayer = new YT.Player('youtube-player', {
                    height: '0', width: '0', videoId: youtubeId,
                    playerVars: { 'autoplay': 0, 'controls': 0, 'loop': 1, 'playlist': youtubeId },
                    events: { 'onReady': () => console.log("YT Ready") }
                });
            }
        }

        function openBox() {
            document.getElementById('intro-overlay').classList.add('hidden');
            setTimeout(() => {
                if (activePlatform === 'youtube' && ytPlayer) ytPlayer.playVideo();
                else audio.play().catch(() => {});
                updateUI(true);
            }, 500);
        }

        function updateUI(playing) {
            isPlaying = playing;
            document.getElementById('play-icon').style.display = playing ? 'none' : 'block';
            document.getElementById('pause-icon').style.display = playing ? 'block' : 'none';
        }

        document.getElementById('play-btn').addEventListener('click', () => {
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
                document.getElementById('time-display').textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;
            };
        }

        function createStar() {
            const s = document.createElement('div');
            s.innerHTML = '✨';
            s.style.position = 'fixed';
            s.style.left = Math.random() * 100 + 'vw';
            s.style.top = Math.random() * 100 + 'vh';
            s.style.fontSize = '20px';
            s.style.opacity = '0';
            s.style.zIndex = '5';
            document.body.appendChild(s);
            s.animate([{ opacity: 0, scale: 0 }, { opacity: 1, scale: 1.5 }, { opacity: 0, scale: 0 }], { duration: 1500 });
            setTimeout(() => s.remove(), 1500);
        }
        setInterval(createStar, 200);
    </script>
</body>
</html>`;

// Export all templates for the massive catalog expansion
export const BOOK_LOVE_TEMPLATE = LOVE_TEMPLATE.replace('<h1>', '<h1 style="transform: rotateX(10deg); text-shadow: 0 5px 15px rgba(0,0,0,0.5);">📖 Libro del Amor: ');
export const MARVEL_BOOK_TEMPLATE = LOVE_TEMPLATE.replace('#ff4d94', '#ed1d24').replace('🎁', '🦸‍♂️');
export const GALAXY_GENERATOR_TEMPLATE = GALAXY_TEMPLATE;
export const MUSICAL_SPHERE_TEMPLATE = GALAXY_TEMPLATE.replace('🎁', '🔮');
export const PROPOSAL_TEMPLATE = LOVE_TEMPLATE;
export const FORGIVE_ME_CATS_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '🐱').replace('SÍ ❤️', 'SÍ, TE PERDONO ❤️');
export const PUZZLE_LOVE_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '🧩');
export const RULETA_LOVE_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '🎡');
export const FORGIVE_ME_PENGUINS_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '🐧');
export const FLOWERS_RAMO_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '💐');
export const ENOJONA_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '😡');
export const DATE_COUNTER_TEMPLATE = BIRTHDAY_TEMPLATE.replace('🎂', '⏰').replace('¡Feliz Cumpleaños!', 'Nuestro Tiempo Juntos');
export const LOVE_CERTIFICATE_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '📜');
export const COUPLE_INITIALS_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '👕');
export const ENCHANTED_LETTER_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '🎃').replace('#ff4d94', '#ff8000');
export const LOVE_VITAMINS_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '💊');
export const SCRATCH_MESSAGE_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '🎫');
export const SOCCER_CARD_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '⚽').replace('#ff4d94', '#4caf50');
export const BIRTHDAY_LAMP_TEMPLATE = BIRTHDAY_TEMPLATE;
export const DEDICATE_SONG_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '🎧');
export const POCOYO_DANCE_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '🕺');
export const BE_MY_BOYFRIEND_TEMPLATE = LOVE_TEMPLATE.replace('SÍ ❤️', 'SÍ, ¡ACEPTO! 💍');
export const TE_AMO_TEMPLATE = GALAXY_TEMPLATE.replace('<h1>', '<h1>❤️ ');
export const BE_FRIENDS_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '🤝');
export const HEART_PHOTO_TEMPLATE = GALAXY_TEMPLATE.replace('🎁', '📸');
export const OUR_YEAR_TEMPLATE = BIRTHDAY_TEMPLATE.replace('🎂', '📅');
export const CHRISTMAS_TREE_TEMPLATE = BIRTHDAY_TEMPLATE.replace('🎂', '🎄').replace('#00f2ff', '#2e7d32');
export const NEW_YEAR_TEMPLATE = BIRTHDAY_TEMPLATE.replace('🎂', '🥂').replace('¡Feliz Cumpleaños!', '¡Feliz Año Nuevo 2026!');
export const LAST_CHANCE_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '🔓').replace('SÍ ❤️', 'SÍ, UNA ÚLTIMA VEZ ❤️');
export const HIDDEN_MESSAGE_TEMPLATE = GALAXY_TEMPLATE.replace('🎁', '🕵️‍♀️');
