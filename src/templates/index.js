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

        .photo-result {
            width: 100%;
            border-radius: 12px;
            margin-bottom: 1.5rem;
            display: {{image_display}};
            overflow: hidden;
            box-shadow: 0 10px 20px rgba(0,0,0,0.3);
            border: 2px solid rgba(255, 77, 148, 0.3);
        }
        .photo-result img { width: 100%; height: auto; display: block; }
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
        <div class="photo-result">
            <img src="{{image_src}}" alt="Foto especial">
        </div>
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

// --- SPECIALIZED TEMPLATE BASES ---


export const BOOK_LOVE_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Libro del Amor - {{name}}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Outfit:wght@400;700;900&display=swap');
        body { margin: 0; background: #0a0514; color: #333; font-family: 'Outfit', sans-serif; height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; perspective: 2000px; }
        
        .book { width: 350px; height: 480px; position: relative; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); transform-style: preserve-3d; cursor: pointer; }
        .book.open { transform: translateX(25%); }
        
        .page { width: 100%; height: 100%; position: absolute; top: 0; left: 0; transform-origin: left; transform-style: preserve-3d; transition: transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1); }
        .page1 { z-index: 5; }
        .page2 { z-index: 4; }
        
        .front, .back { width: 100%; height: 100%; position: absolute; top: 0; left: 0; backface-visibility: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2.5rem; box-sizing: border-box; border-radius: 0 15px 15px 0; }
        .back { transform: rotateY(180deg); }
        
        .cover { background: linear-gradient(135deg, #800000 0%, #a00000 100%); color: white !important; border-left: 12px solid #5a0000; box-shadow: 10px 10px 30px rgba(0,0,0,0.6); }
        .cover h1 { font-family: 'Dancing Script', cursive; font-size: 2.8rem; text-align: center; margin-bottom: 0.5rem; text-shadow: 0 4px 10px rgba(0,0,0,0.3); color: white !important; }
        .cover .names { font-size: 1.2rem; font-weight: 900; color: #ffcc00 !important; text-transform: uppercase; letter-spacing: 2px; margin-top: 1rem; text-shadow: 0 2px 5px rgba(0,0,0,0.5); text-align: center; }
        .cover .emoji { font-size: 5.5rem; margin-bottom: 1.5rem; filter: drop-shadow(0 0 15px rgba(255,255,255,0.2)); }
        
        .inner-page { background: #fff9e6; color: #1a1a1a !important; box-shadow: inset 5px 0 15px rgba(0,0,0,0.15); border: 1px solid rgba(0,0,0,0.05); }
        .inner-page h2 { font-family: 'Dancing Script', cursive; color: #800000 !important; font-size: 2.2rem; margin-bottom: 1.5rem; }
        .inner-page p { font-size: 1.3rem; line-height: 1.7; text-align: center; font-style: italic; font-weight: 700; color: #000 !important; width: 100%; word-wrap: break-word; }
        
        .page.flipped { transform: rotateY(-180deg); z-index: 10 !important; }
        
        .floating-heart { position: absolute; color: #ff4d94; opacity: 0; pointer-events: none; z-index: 100; font-size: 24px; }
        
        /* Intro Overlay */
        #intro-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #0a0514; z-index: 2000; display: flex; justify-content: center; align-items: center; transition: opacity 0.8s ease; }
        #intro-overlay.hidden { opacity: 0; pointer-events: none; }
        .box-container { text-align: center; cursor: pointer; animation: float 3s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        
            .inner-page p { font-size: 1.1rem; }
            .photo-frame { width: 140px; height: 180px; }
        }

        /* Unified Audio and Overlay Styles */
        .audio-controls { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); width: 85%; max-width: 350px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(15px); padding: 12px 20px; border-radius: 25px; border: 1px solid rgba(255, 255, 255, 0.15); display: flex; align-items: center; gap: 15px; z-index: 1000; box-shadow: 0 10px 30px rgba(0,0,0,0.5); color: white; }
        .play-btn { width: 40px; height: 40px; background: #ff4d94; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; flex-shrink: 0; color: white !important; font-weight: bold; }
        .progress-bar-container { flex-grow: 1; height: 4px; background: rgba(255, 255, 255, 0.1); border-radius: 2px; overflow: hidden; }
        .progress-bar { width: 0%; height: 100%; background: #ff4d94; border-radius: 2px; }
        .time-text { font-size: 11px; color: rgba(255, 255, 255, 0.5); min-width: 35px; font-family: monospace; }
        .song-title { position: absolute; top: -22px; left: 50%; transform: translateX(-50%); font-size: 11px; font-weight: 800; color: #ff4d94; white-space: nowrap; text-transform: uppercase; letter-spacing: 1px; }

        .photo-frame { 
            width: 200px; 
            height: 250px; 
            background: white; 
            padding: 10px; 
            box-shadow: 0 10px 20px rgba(0,0,0,0.2); 
            transform: rotate(-3deg); 
            margin-bottom: 1.5rem;
            display: {{image_display}};
        }
        .photo-frame img { width: 100%; height: 100%; object-fit: cover; border: 1px solid #ddd; }
    </style>
</head>
<body>
    <div id="intro-overlay">
        <div class="box-container" onclick="openBox()">
            <div style="font-size: 90px; filter: drop-shadow(0 0 20px #800000);">📖</div>
            <div style="color: white; font-size: 26px; font-weight: 900; margin-top: 25px; letter-spacing: 2px;">TU LIBRO MÁGICO</div>
            <div style="color: #ff4d94; margin-top: 10px; font-weight: bold; letter-spacing: 3px; animation: pulse 2s infinite;">TOCA PARA ABRIR</div>
        </div>
    </div>

    <div class="book" id="book" onclick="flipPage()">
        <!-- Page 1: Cover -->
        <div class="page page1" id="page1">
            <div class="front cover">
                <div class="emoji">📖</div>
                <h1>Libro del Amor</h1>
                <div class="names">{{sender}} & {{name}}</div>
                <div style="margin-top: 2.5rem; opacity: 0.6; font-size: 0.8rem; letter-spacing: 3px; font-weight: 900; color: white !important;">UN VIAJE DE SENTIMIENTOS</div>
            </div>
            <div class="back inner-page" style="padding: 1.5rem;">
                <div class="photo-frame">
                    <img src="{{image_src}}" alt="Nuestra Foto">
                </div>
                <h2 style="margin-top: 0; font-size: 1.8rem;">Para: {{name}}</h2>
                <p style="font-size: 1.1rem;">Nuestra historia es mi favorita...</p>
            </div>
        </div>
        <!-- Page 2: Message -->
        <div class="page page2" id="page2">
            <div class="front inner-page">
                <p>{{message}}</p>
                <div style="margin-top: 3rem; font-family: 'Dancing Script', cursive; font-size: 1.8rem; color: #800000 !important; border-top: 1px solid rgba(128,0,0,0.1); padding-top: 1.5rem; font-weight: 700;">
                    Con amor, <br> {{sender}}
                </div>
            </div>
            <div class="back inner-page" style="background: #e8e1cf; display: flex; align-items: center; justify-content: center;">
                <div style="font-size: 5rem; opacity: 0.2;">❤️</div>
            </div>
        </div>
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
        let stage = 0;
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
                document.getElementById('time-display').textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;
            };
        }

        function flipPage() {
            const book = document.getElementById('book');
            if (stage === 0) {
                document.getElementById('page1').classList.add('flipped');
                book.classList.add('open');
                stage = 1;
                createHearts();
            } else if (stage === 1) {
                document.getElementById('page2').classList.add('flipped');
                stage = 2;
            } else {
                document.getElementById('page1').classList.remove('flipped');
                document.getElementById('page2').classList.remove('flipped');
                book.classList.remove('open');
                stage = 0;
            }
        }

        function createHearts() {
            for(let i=0; i<20; i++) {
                setTimeout(() => {
                    const h = document.createElement('div');
                    h.className = 'floating-heart';
                    const emojis = ['❤️', '💖', '✨', '💐'];
                    h.innerHTML = emojis[Math.floor(Math.random()*emojis.length)];
                    h.style.left = (Math.random() * 100) + 'vw';
                    h.style.top = '110vh';
                    document.body.appendChild(h);
                    h.animate([
                        { transform: 'translateY(0) scale(1) rotate(0deg)', opacity: 1 },
                        { transform: 'translateY(-120vh) scale(2.5) rotate(360deg)', opacity: 0 }
                    ], { duration: 4000 + Math.random() * 3000, easing: 'ease-out' }).onfinish = () => h.remove();
                }, i * 150);
            }
        }
    </script>
</body>
</html>\`;

export const BIRTHDAY_TEMPLATE = \`<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¡Feliz Cumpleaños, {{name}}!</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        body { margin: 0; background: #05020a; color: white; font-family: 'Outfit', sans-serif; height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .card { background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); padding: 2.5rem; border-radius: 24px; text-align: center; border: 1px solid rgba(255,255,255,0.1); width: 90%; max-width: 450px; box-shadow: 0 25px 50px rgba(0,0,0,0.5); z-index: 10; }
        h1 { background: linear-gradient(135deg, #ff4d94, #ffeead); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 2.5rem; font-weight: 900; margin-bottom: 1rem; }
        p { font-size: 1.2rem; line-height: 1.6; color: rgba(255,255,255,0.8); }
        .sender { margin-top: 2rem; font-weight: bold; color: #ff4d94; letter-spacing: 2px; text-transform: uppercase; font-size: 0.8rem; }
        
        #intro-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #05020a; z-index: 2000; display: flex; justify-content: center; align-items: center; transition: opacity 0.8s ease; }
        #intro-overlay.hidden { opacity: 0; pointer-events: none; }
        
        /* Unified Audio Styles */
        .audio-controls { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); width: 85%; max-width: 350px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(15px); padding: 12px 20px; border-radius: 25px; border: 1px solid rgba(255, 255, 255, 0.15); display: flex; align-items: center; gap: 15px; z-index: 1000; box-shadow: 0 10px 30px rgba(0,0,0,0.5); color: white; }
        .play-btn { width: 40px; height: 40px; background: #ff4d94; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; flex-shrink: 0; color: white !important; font-weight: bold; }
        .progress-bar-container { flex-grow: 1; height: 4px; background: rgba(255, 255, 255, 0.1); border-radius: 2px; overflow: hidden; }
        .progress-bar { width: 0%; height: 100%; background: #ff4d94; border-radius: 2px; }
        .time-text { font-size: 11px; color: rgba(255, 255, 255, 0.5); min-width: 35px; font-family: monospace; }
        .song-title { position: absolute; top: -22px; left: 50%; transform: translateX(-50%); font-size: 11px; font-weight: 800; color: #ff4d94; white-space: nowrap; text-transform: uppercase; letter-spacing: 1px; }

        .photo-result {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            margin: 0 auto 1.5rem auto;
            display: {{image_display}};
            overflow: hidden;
            border: 4px solid #ff4d94;
            box-shadow: 0 0 20px rgba(255, 77, 148, 0.4);
        }
        .photo-result img { width: 100%; height: 100%; object-fit: cover; }
    </style>
</head>
<body>
    <div id="intro-overlay">
        <div onclick="openBox()" style="text-align: center; cursor: pointer;">
            <div style="font-size: 80px; filter: drop-shadow(0 0 20px #ff4d94);">🎂</div>
            <div style="color: white; font-size: 26px; font-weight: 900; margin-top: 25px; letter-spacing: 2px;">¡MIRA TU REGALO!</div>
            <div style="color: #ff4d94; margin-top: 10px; font-weight: bold; letter-spacing: 3px;">TOCA PARA ABRIR ❤️</div>
        </div>
    </div>

    <div class="card">
        <div class="photo-result">
            <img src="{{image_src}}" alt="Foto de Cumpleaños">
        </div>
        <h1>¡Feliz Cumpleaños!</h1>
        <p>{{message}}</p>
        <div class="sender">DE PARTE DE: {{sender}}</div>
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
                document.getElementById('time-display').textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;
            };
        }
    </script>
</body>
</html>`;


export const PUZZLE_LOVE_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Puzzle Mágico - {{name}}</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
                body { margin: 0; background: #0a0514; color: white; font-family: 'Outfit', sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
                .puzzle-board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; background: rgba(255,255,255,0.1); padding: 10px; border-radius: 15px; width: 300px; height: 300px; margin-bottom: 2rem; }
                .puzzle-tile { width: 100%; height: 100%; background: #ff4d94; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 2rem; cursor: pointer; transition: transform 0.2s; color: white; font-weight: bold; position: relative; overflow: hidden; }
                        .puzzle-tile::before {content: ''; position: absolute; width: 100%; height: 100%; background: linear-gradient(45deg, transparent, rgba(255,255,255,0.3)); }
                        .message-box {display: none; text-align: center; padding: 2rem; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border-radius: 20px; border: 1px solid rgba(255,255,255,0.2); width: 90%; max-width: 400px; }
                        h1 {font - size: 1.8rem; color: #ff4d94; margin-bottom: 1rem; }

                        #intro-overlay {position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #0a0514; z-index: 2000; display: flex; justify-content: center; align-items: center; transition: opacity 0.8s ease; }
                        #intro-overlay.hidden {opacity: 0; pointer-events: none; }

                        /* Unified Audio Styles */
                        .audio-controls {position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); width: 85%; max-width: 350px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(15px); padding: 12px 20px; border-radius: 25px; border: 1px solid rgba(255, 255, 255, 0.15); display: flex; align-items: center; gap: 15px; z-index: 1000; box-shadow: 0 10px 30px rgba(0,0,0,0.5); color: white; }
                        .play-btn {width: 40px; height: 40px; background: #ff4d94; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; flex-shrink: 0; color: white !important; font-weight: bold; }
                        .progress-bar-container {flex - grow: 1; height: 4px; background: rgba(255, 255, 255, 0.1); border-radius: 2px; overflow: hidden; }
                        .progress-bar {width: 0%; height: 100%; background: #ff4d94; border-radius: 2px; }
                        .time-text {font - size: 11px; color: rgba(255, 255, 255, 0.5); min-width: 35px; font-family: monospace; }
                        .song-title {position: absolute; top: -22px; left: 50%; transform: translateX(-50%); font-size: 11px; font-weight: 800; color: #ff4d94; white-space: nowrap; text-transform: uppercase; letter-spacing: 1px; }

                        .photo-result {
                            width: 100%;
                        border-radius: 12px;
                        margin-bottom: 1.5rem;
                        display: {{ image_display }};
                        overflow: hidden;
                        box-shadow: 0 10px 20px rgba(0,0,0,0.3);
                        border: 2px solid rgba(255, 77, 148, 0.3);
        }
                        .photo-result img {width: 100%; height: auto; display: block; }
                    </style>
                </head>
                <body>
                    <div id="intro-overlay">
                        <div onclick="openBox()" style="text-align: center; cursor: pointer;">
                            <div style="font-size: 80px;">🧩</div>
                            <div style="color: white; font-size: 24px; font-weight: bold; margin-top: 20px;">¡Arma el Puzzle!</div>
                            <div style="color: rgba(255,255,255,0.6); margin-top: 10px;">TOCA PARA EMPEZAR</div>
                        </div>
                    </div>

    <div id="game-ui" style="text-align: center;">
        <h2 style="margin-bottom: 1rem; color: #ff4d94;">¡Ordena el Desorden! 🧩</h2>
        <div class="puzzle-board" id="board"></div>
        <p style="opacity: 0.6;">Toca las piezas para moverlas</p>
    </div>

    <div class="message-box" id="message-box">
        <div class="photo-result">
            <img src="{{image_src}}" alt="Nuestra Foto">
        </div>
        <h1>¡LOGRADO! ❤️</h1>
        <p style="font-size: 1.2rem; color: #fff;">{{message}}</p>
        <div style="margin-top: 1.5rem; color: rgba(255,255,255,0.6);">De: {{sender}}</div>
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
                document.getElementById('time-display').textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;
            };
        }

        const board = document.getElementById('board');
        let tiles = ['❤️', '💖', '✨', '⭐', '🎈', '🌹', '🦋', '💍', ' '];
        let state = [...tiles].sort(() => Math.random() - 0.5);
        
        function render() {
            board.innerHTML = '';
            state.forEach((char, i) => {
                const div = document.createElement('div');
                div.className = 'puzzle-tile';
                if (char === ' ') div.style.background = 'transparent';
                else div.textContent = char;
                div.onclick = () => move(i);
                board.appendChild(div);
            });
            checkWin();
        }

        function move(idx) {
            const empty = state.indexOf(' ');
            const valid = [idx-1, idx+1, idx-3, idx+3];
            if (valid.includes(empty)) {
                if (idx%3===0 && empty===idx-1) return;
                if (idx%3===2 && empty===idx+1) return;
                state[empty] = state[idx];
                state[idx] = ' ';
                render();
            }
        }

        function checkWin() {
            if (state.join('') === tiles.join('')) {
                document.getElementById('game-ui').style.display = 'none';
                document.getElementById('message-box').style.display = 'block';
            }
        }
        render();
    </script>
</body>
</html>`;

export const RULETA_LOVE_TEMPLATE = `<!DOCTYPE html>
            <html lang="es">
                <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Ruleta Mágica - {{ name }}</title>
                            <style>
                                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
                                body {margin: 0; background: #0a0514; color: white; font-family: 'Outfit', sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
                                .wheel-container {position: relative; width: 300px; height: 300px; margin-bottom: 2rem; transition: transform 4s cubic-bezier(0.1, 0, 0, 1); }
                                .wheel {width: 100%; height: 100%; border-radius: 50%; border: 8px solid white; background: conic-gradient(
                                #ff4d94 0% 12.5%, #7000ff 12.5% 25%, #00f2ff 25% 37.5%, #ffeead 37.5% 50%,
                                #ff4d94 50% 62.5%, #7000ff 62.5% 75%, #00f2ff 75% 87.5%, #ffeead 87.5% 100%
        ); position: relative; box-shadow: 0 0 30px rgba(0,0,0,0.5); }
                                .pointer {position: absolute; top: -10px; left: 50%; transform: translateX(-50%); width: 30px; height: 30px; background: white; clip-path: polygon(50% 100%, 0 0, 100% 0); z-index: 10; }
                                .spin-btn {padding: 15px 40px; background: #ff4d94; border: none; border-radius: 30px; color: white; font-weight: bold; font-size: 1.2rem; cursor: pointer; box-shadow: 0 5px 15px rgba(255, 77, 148, 0.4); }
                                .message-card {display: none; text-align: center; padding: 2.5rem; background: rgba(255,255,255,0.1); backdrop-filter: blur(15px); border-radius: 25px; width: 90%; max-width: 400px; border: 1px solid rgba(255,255,255,0.2); }

                                #intro-overlay {position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #0a0514; z-index: 2000; display: flex; justify-content: center; align-items: center; transition: opacity 0.8s ease; }
                                #intro-overlay.hidden {opacity: 0; pointer-events: none; }

                                /* Unified Audio Styles */
                                .audio-controls {position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); width: 85%; max-width: 350px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(15px); padding: 12px 20px; border-radius: 25px; border: 1px solid rgba(255, 255, 255, 0.15); display: flex; align-items: center; gap: 15px; z-index: 1000; box-shadow: 0 10px 30px rgba(0,0,0,0.5); color: white; }
                                .play-btn {width: 40px; height: 40px; background: #ff4d94; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; flex-shrink: 0; color: white !important; font-weight: bold; }
                                .progress-bar-container {flex - grow: 1; height: 4px; background: rgba(255, 255, 255, 0.1); border-radius: 2px; overflow: hidden; }
                                .progress-bar {width: 0%; height: 100%; background: #ff4d94; border-radius: 2px; }
                                .time-text {font - size: 11px; color: rgba(255, 255, 255, 0.5); min-width: 35px; font-family: monospace; }
                                .song-title {position: absolute; top: -22px; left: 50%; transform: translateX(-50%); font-size: 11px; font-weight: 800; color: #ff4d94; white-space: nowrap; text-transform: uppercase; letter-spacing: 1px; }

                                .photo-result {
                                    width: 100%;
                                border-radius: 12px;
                                margin-bottom: 1.5rem;
                                display: {{ image_display }};
                                overflow: hidden;
                                box-shadow: 0 10px 20px rgba(0,0,0,0.3);
                                border: 2px solid rgba(255, 77, 148, 0.3);
        }
                                .photo-result img {width: 100%; height: auto; display: block; }
                            </style>
                        </head>
                        <body>
                            <div id="intro-overlay">
                                <div onclick="openBox()" style="text-align: center; cursor: pointer;">
                                    <div style="font-size: 80px; filter: drop-shadow(0 0 20px rgba(255, 77, 148, 0.5));">🎡</div>
                                    <div style="color: white; font-size: 24px; font-weight: bold; margin-top: 20px;">Gira la Ruleta</div>
                                    <div style="color: rgba(255,255,255,0.6); margin-top: 10px;">TOCA PARA EMPEZAR</div>
                                </div>
                            </div>

                            <div id="game">
                                <div class="pointer"></div>
                                <div class="wheel-container" id="wheel">
                                    <div class="wheel"></div>
                                </div>
                                <button class="spin-btn" id="spinBtn" onclick="spin()">GIRAR RULETA 🎡</button>
                            </div>

                            <div class="message-card" id="result">
                                <div class="photo-result">
                                    <img src="{{image_src}}" alt="Regalo especial">
                                </div>
                                <h1 style="color: #ff4d94; font-size: 2.5rem; margin-bottom: 1rem;">🎰 ¡GANASTE!</h1>
                                <p style="font-size: 1.3rem;">{{ message }}</p>
                                <div style="margin-top: 1.5rem; font-style: italic; opacity: 0.6;">De: {{ sender }}</div>
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
                                const youtubeId = "{{ youtube_id }}";
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
                else audio.play().catch(() => { });
                                updateUI(true);
            }, 500);
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
                                        document.getElementById('time-display').textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;
                                    };
        }

                                function spin() {
            const wheel = document.getElementById('wheel');
                                const btn = document.getElementById('spinBtn');
                                const rand = 3600 + Math.random() * 3600;
                                wheel.style.transform = "rotate(" + rand + "deg)";
                                btn.disabled = true;
                                btn.style.opacity = 0.5;
            setTimeout(() => {
                                    document.getElementById('game').style.display = 'none';
                                document.getElementById('result').style.display = 'block';
            }, 4500);
        }
                            </script>
                        </body>
                    </html>`;

export const SCRATCH_MESSAGE_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Raspa y Gana - {{name}}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        body { margin: 0; background: #0a0514; color: white; font-family: 'Outfit', sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
        .scratch-container { position: relative; width: 320px; height: 400px; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        canvas { position: absolute; top: 0; left: 0; cursor: crosshair; z-index: 10; }
        .message-bg { width: 100%; height: 100%; background: #ff4d94; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem; box-sizing: border-box; }
        
        .photo-result {
            width: 140px;
            height: 140px;
            border-radius: 50%;
            margin-bottom: 1.5rem;
            display: {{image_display}};
            overflow: hidden;
            border: 3px solid white;
            box-shadow: 0 0 20px rgba(255,255,255,0.3);
        }
        .photo-result img { width: 100%; height: 100%; object-fit: cover; }

        #intro-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #0a0514; z-index: 2000; display: flex; justify-content: center; align-items: center; transition: opacity 0.8s ease; }
        #intro-overlay.hidden { opacity: 0; pointer-events: none; }

        .audio-controls { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); width: 85%; max-width: 350px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(15px); padding: 12px 20px; border-radius: 25px; border: 1px solid rgba(255, 255, 255, 0.15); display: flex; align-items: center; gap: 15px; z-index: 1000; box-shadow: 0 10px 30px rgba(0,0,0,0.5); color: white; }
        .play-btn { width: 40px; height: 40px; background: #ff4d94; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; flex-shrink: 0; color: white !important; font-weight: bold; }
        .progress-bar-container { flex-grow: 1; height: 4px; background: rgba(255, 255, 255, 0.1); border-radius: 2px; overflow: hidden; }
        .progress-bar { width: 0%; height: 100%; background: #ff4d94; border-radius: 2px; }
        .time-text { font-size: 11px; color: rgba(255, 255, 255, 0.5); min-width: 35px; font-family: monospace; }
        .song-title { position: absolute; top: -22px; left: 50%; transform: translateX(-50%); font-size: 11px; font-weight: 800; color: #ff4d94; white-space: nowrap; text-transform: uppercase; letter-spacing: 1px; }
    </style>
</head>
<body>
    <div id="intro-overlay">
        <div onclick="openBox()" style="text-align: center; cursor: pointer;">
            <div style="font-size: 80px;">🎫</div>
            <div style="color: white; font-size: 24px; font-weight: bold; margin-top: 20px;">¡Raspa tu Regalo!</div>
            <div style="color: rgba(255,255,255,0.6); margin-top: 10px;">TOCA PARA EMPEZAR</div>
        </div>
    </div>

    <h2 style="margin-bottom: 2rem; color: #ff4d94; text-shadow: 0 0 10px rgba(255,77,148,0.3);">¡Regalo a la vista! 🎰</h2>
    
    <div class="scratch-container">
        <div class="message-bg">
            <div class="photo-result">
                <img src="{{image_src}}" alt="Nuestra Foto">
            </div>
            <div style="font-weight: 900; font-size: 1.4rem;">{{message}}</div>
            <div style="margin-top: 1rem; opacity: 0.8; font-size: 0.9rem;">- {{sender}}</div>
        </div>
        <canvas id="scratchCanvas"></canvas>
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
                document.getElementById('time-display').textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;
            };
        }

        const canvas = document.getElementById('scratchCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 320;
        canvas.height = 400;

        ctx.fillStyle = '#C0C0C0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#888';
        ctx.font = '900 30px Outfit';
        ctx.textAlign = 'center';
        ctx.fillText('RASPA AQUÍ', 160, 180);

        let isDrawing = false;
        function scratch(e) {
            if (!isDrawing) return;
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
            const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 35, 0, Math.PI * 2);
            ctx.fill();
        }

        canvas.addEventListener('mousedown', () => isDrawing = true);
        canvas.addEventListener('mouseup', () => isDrawing = false);
        canvas.addEventListener('mousemove', scratch);
        canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); });
        canvas.addEventListener('touchend', () => isDrawing = false);
        canvas.addEventListener('touchmove', (e) => { e.preventDefault(); scratch(e); });
    </script>
</body>
</html>`;

// --- THEMATIC SPECIALIZATIONS ---
export const MARVEL_BOOK_TEMPLATE = LOVE_TEMPLATE.replace('#ff4d94', '#ed1d24').replace('🎁', '🦸‍♂️').replace('<h1>', '<h1>Avengers Love: ');
export const GALAXY_GENERATOR_TEMPLATE = GALAXY_TEMPLATE;
export const MUSICAL_SPHERE_TEMPLATE = GALAXY_TEMPLATE.replace('🎁', '🔮');
export const PROPOSAL_TEMPLATE = LOVE_TEMPLATE.replace('SÍ ❤️', '¡SÍ, ACEPTO! 💍');
export const FORGIVE_ME_CATS_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '🐱').replace('SÍ ❤️', 'SÍ, TE PERDONO ❤️').replace('p {', 'p {font - family: "Comic Sans MS", cursive; ');
export const FORGIVE_ME_PENGUINS_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '🐧').replace('background: #0a0514', 'background: #e3f2fd; color: #333;');
export const FLOWERS_RAMO_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '💐').replace('background: #0a0514', 'background: #fce4ec; color: #333;');
export const ENOJONA_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '😡');
export const DATE_COUNTER_TEMPLATE = BIRTHDAY_TEMPLATE.replace('🎂', '⏰').replace('¡Feliz Cumpleaños!', 'Nuestro Tiempo Juntos').replace('#00f2ff', '#00ff00');
export const LOVE_CERTIFICATE_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '📜').replace('background: rgba(255,255,255,0.1)', 'background: #f9f4e8; color: #444; border: 5px double #a67c52;');
export const COUPLE_INITIALS_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '👕');
export const ENCHANTED_LETTER_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '🎃').replace('#ff4d94', '#ff8000');
export const LOVE_VITAMINS_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '💊');
export const SOCCER_CARD_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '⚽').replace('#ff4d94', '#4caf50').replace('background: rgba(255,255,255,0.1)', 'background: linear-gradient(135deg, #ffd700, #b8860b); color: #000; font-weight: 900;');
export const BIRTHDAY_LAMP_TEMPLATE = BIRTHDAY_TEMPLATE;
export const DEDICATE_SONG_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '🎧');
export const POCOYO_DANCE_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '🕺').replace('background: #0a0514', 'background: #03a9f4;');
export const BE_MY_BOYFRIEND_TEMPLATE = LOVE_TEMPLATE.replace('SÍ ❤️', 'SÍ, ¡ACEPTO! 💍');
export const TE_AMO_TEMPLATE = GALAXY_TEMPLATE.replace('<h1>', '<h1>❤️ ');
export const BE_FRIENDS_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '🤝');
export const HEART_PHOTO_TEMPLATE = GALAXY_TEMPLATE.replace('🎁', '📸');
export const OUR_YEAR_TEMPLATE = BIRTHDAY_TEMPLATE.replace('🎂', '📅');
export const CHRISTMAS_TREE_TEMPLATE = BIRTHDAY_TEMPLATE.replace('🎂', '🎄').replace('#00f2ff', '#2e7d32').replace('background: #05020a', 'background: #002200;');
export const NEW_YEAR_TEMPLATE = BIRTHDAY_TEMPLATE.replace('🎂', '🥂').replace('¡Feliz Cumpleaños!', '¡Feliz Año Nuevo 2026!');
export const LAST_CHANCE_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '🔓').replace('SÍ ❤️', 'SÍ, UNA ÚLTIMA VEZ ❤️');
export const HIDDEN_MESSAGE_TEMPLATE = GALAXY_TEMPLATE.replace('🎁', '🕵️‍♀️');


