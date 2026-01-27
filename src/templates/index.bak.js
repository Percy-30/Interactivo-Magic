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
            <div class="box-emoji">ðŸŽ</div>
            <div class="box-text">Â¡Tienes una sorpresa!</div>
            <div class="tap-to-open">Haz clic para abrir</div>
        </div>
    </div>

    <div class="card" id="mainCard">
        <h1>Para: {{name}}</h1>
        <p>{{message}}</p>
        <div class="btns">
            <button id="yesBtn">SÃ â¤ï¸</button>
            <button id="noBtn">NO ðŸ˜¢</button>
        </div>
        <div class="sender">De: {{sender}}</div>
    </div>

    <div class="card" id="success">
        <div class="photo-result">
            <img src="{{image_src}}" alt="Foto especial" onerror="this.parentElement.style.display='none'">
        </div>
        <div style="font-size: 1.4rem; font-weight: 800; color: #ff4d94; margin-bottom: 1.5rem; line-height: 1.4; white-space: pre-wrap;">{{extra_text}}</div>
        <p>Te quiero mucho, {{name}}.</p>
    </div>

    <div class="audio-controls" style="display: {{audio_display}}">
        <div class="song-title">Audio MÃ¡gico</div>
        <div class="play-btn" id="play-btn">
            <div id="play-icon">â–¶</div>
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
        let activePlatform = youtubeId && !youtubeId.includes('{{') ? 'youtube' : 'native';
        let isPlaying = false;
        let ytReady = false;
        let playOnReady = false;

        window.onYouTubeIframeAPIReady = function() {
            if (youtubeId && !youtubeId.includes('{{')) {
                ytPlayer = new YT.Player('youtube-player', {
                    height: '0', width: '0', videoId: youtubeId,
                    playerVars: { 'autoplay': 0, 'controls': 0, 'loop': 1, 'playlist': youtubeId },
                    events: { 
                        'onReady': () => {
                            ytReady = true;
                            if (playOnReady) {
                                ytPlayer.playVideo();
                                updateUI(true);
                            }
                        }
                    }
                });
            }
        };

        if (activePlatform === 'youtube') {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(tag);
        }

        function openBox() {
            document.getElementById('intro-overlay').classList.add('hidden');
            setTimeout(() => {
                if (activePlatform === 'youtube') {
                    if (ytReady && ytPlayer && ytPlayer.playVideo) {
                        ytPlayer.playVideo();
                        updateUI(true);
                    } else {
                        playOnReady = true;
                    }
                } else {
                    audio.play().catch(() => {});
                    updateUI(true);
                }
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
                c.innerHTML = 'â¤ï¸';
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
            <div class="box-emoji">ðŸŽ</div>
            <div class="box-text">Â¡Tienes una sorpresa!</div>
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
                <div class="crown">ðŸ‘‘</div>
                <h1>{{name}}</h1>
            </div>
        </div>
        <div class="message-card">
            <div class="message-text">{{message}}</div>
            <div style="font-size: 0.9rem; margin-top: 5px; opacity: 0.8; font-weight: 800;">{{extra_text}}</div>
            <div class="sender-label">Enviado con â¤ï¸ por:</div>
            <div class="sender-name">{{sender}}</div>
            <a href="/" class="create-btn">Crea tu propio mensaje âœ¨</a>
        </div>
    </div>

    <div class="orbit-container" id="orbit"></div>

    <div class="audio-controls" style="display: {{audio_display}}">
        <div class="song-title" id="song-title">Cargando Audio...</div>
        <div class="play-btn" id="play-btn">
            <div id="play-icon">â–¶</div>
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
        let activePlatform = youtubeId && !youtubeId.includes('{{') ? 'youtube' : 'native';
        let isPlaying = false;
        let ytReady = false;
        let playOnReady = false;

        window.onYouTubeIframeAPIReady = function() {
            if (youtubeId && !youtubeId.includes('{{')) {
                ytPlayer = new YT.Player('youtube-player', {
                    height: '0', width: '0', videoId: youtubeId,
                    playerVars: { 'autoplay': 0, 'controls': 0, 'loop': 1, 'playlist': youtubeId },
                    events: { 
                        'onReady': () => {
                            ytReady = true;
                            if (playOnReady) {
                                ytPlayer.playVideo();
                                updateUI(true);
                            }
                        }
                    }
                });
            }
        };

        if (activePlatform === 'youtube') {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(tag);
        }

        function openBox() {
            document.getElementById('intro-overlay').classList.add('hidden');
            setTimeout(() => {
                if (activePlatform === 'youtube') {
                    if (ytReady && ytPlayer && ytPlayer.playVideo) {
                        ytPlayer.playVideo();
                        updateUI(true);
                    } else {
                        playOnReady = true;
                    }
                } else {
                    audio.play().catch(() => {});
                    updateUI(true);
                }
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
            const pages = Array.from(document.querySelectorAll('.page'));
            
            if (stage < pages.length) {
                const currentPage = pages[stage];
                currentPage.classList.add('flipped');
                // Adjust z-index of previous pages so they don't overlap the current one
                pages.forEach((p, idx) => {
                    if (idx < stage) p.style.zIndex = idx + 1;
                    else if (idx === stage) p.style.zIndex = 50;
                    else p.style.zIndex = pages.length - idx;
                });

                if (stage === 0) book.classList.add('open');
                stage++;
                if (stage === 1) createHearts();
            } else {
                pages.forEach((p, idx) => {
                    p.classList.remove('flipped');
                    p.style.zIndex = pages.length - idx;
                });
                book.classList.remove('open');
                stage = 0;
            }
        }

        function createHearts() {
            for(let i=0; i<20; i++) {
                setTimeout(() => {
                    const h = document.createElement('div');
                    h.className = 'floating-heart';
                    const emojis = ['â¤ï¸', 'ðŸ’–', 'âœ¨', 'ðŸ’'];
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

        function closeBook() {
            document.getElementById('intro-overlay').classList.remove('hidden');
            // Reset book
            document.getElementById('book').classList.remove('open');
            stage = 0;
            // Reset all pages
            const pages = document.querySelectorAll('.page');
            pages.forEach((p, idx) => {
                p.classList.remove('flipped');
                p.style.zIndex = pages.length - idx;
            });
        }

        // Initialize page stacking immediately
        (function initPages() {
            const pages = document.querySelectorAll('.page');
            pages.forEach((p, idx) => {
                p.style.zIndex = pages.length - idx;
            });
        })();
    </script>
</body>
</html>`;

export const BIRTHDAY_TEMPLATE = `< !DOCTYPE html>
    <html lang="es">
        <head>
            <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Â¡Feliz CumpleaÃ±os, {{ name }}!</title>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
                        body {margin: 0; background: #05020a; color: white; font-family: 'Outfit', sans-serif; height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; }
                        .card {background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); padding: 2.5rem; border-radius: 24px; text-align: center; border: 1px solid rgba(255,255,255,0.1); width: 90%; max-width: 450px; box-shadow: 0 25px 50px rgba(0,0,0,0.5); z-index: 10; }
                        h1 {background: linear-gradient(135deg, #ff4d94, #ffeead); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 2.5rem; font-weight: 900; margin-bottom: 1rem; }
                        p {font - size: 1.2rem; line-height: 1.6; color: rgba(255,255,255,0.8); }
                        .sender {margin - top: 2rem; font-weight: bold; color: #ff4d94; letter-spacing: 2px; text-transform: uppercase; font-size: 0.8rem; }

                        #intro-overlay {position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #05020a; z-index: 2000; display: flex; justify-content: center; align-items: center; transition: opacity 0.8s ease; }
                        #intro-overlay.hidden {opacity: 0; pointer-events: none; }

                        /* Unified Audio Styles */
                        .audio-controls {position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); width: 85%; max-width: 350px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(15px); padding: 12px 20px; border-radius: 25px; border: 1px solid rgba(255, 255, 255, 0.15); display: flex; align-items: center; gap: 15px; z-index: 1000; box-shadow: 0 10px 30px rgba(0,0,0,0.5); color: white; }
                        .play-btn {width: 40px; height: 40px; background: #ff4d94; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; flex-shrink: 0; color: white !important; font-weight: bold; }
                        .progress-bar-container {flex - grow: 1; height: 4px; background: rgba(255, 255, 255, 0.1); border-radius: 2px; overflow: hidden; }
                        .progress-bar {width: 0%; height: 100%; background: #ff4d94; border-radius: 2px; }
                        .time-text {font - size: 11px; color: rgba(255, 255, 255, 0.5); min-width: 35px; font-family: monospace; }
                        .song-title {position: absolute; top: -22px; left: 50%; transform: translateX(-50%); font-size: 11px; font-weight: 800; color: #ff4d94; white-space: nowrap; text-transform: uppercase; letter-spacing: 1px; }

                        .photo-result {
                            width: 120px;
                        height: 120px;
                        border-radius: 50%;
                        margin: 0 auto 1.5rem auto;
                        display: {{ image_display }};
                        overflow: hidden;
                        border: 4px solid #ff4d94;
                        box-shadow: 0 0 20px rgba(255, 77, 148, 0.4);
        }
                        .photo-result img {width: 100%; height: 100%; object-fit: cover; }
                    </style>
                </head>
                <body>
                    <div id="intro-overlay">
                        <div onclick="openBox()" style="text-align: center; cursor: pointer;">
                            <div style="font-size: 80px; filter: drop-shadow(0 0 20px #ff4d94);">ðŸŽ‚</div>
                            <div style="color: white; font-size: 26px; font-weight: 900; margin-top: 25px; letter-spacing: 2px;">Â¡MIRA TU REGALO!</div>
                            <div style="color: #ff4d94; margin-top: 10px; font-weight: bold; letter-spacing: 3px;">TOCA PARA ABRIR â¤ï¸</div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="photo-result">
                            <img src="{{image_src}}" alt="Foto de CumpleaÃ±os" onerror="this.parentElement.style.display='none'">
                        </div>
                        <div style="color: #ff4d94; font-size: 1.6rem; font-weight: 900; margin-bottom: 1rem; line-height: 1.3; white-space: pre-wrap;">{{extra_text}}</div>
                        <p>{{ message }}</p>
                        <div class="sender">DE PARTE DE: {{ sender }}</div>
                    </div>

                    <div class="audio-controls" style="display: {{audio_display}}">
                        <div class="song-title">Audio MÃ¡gico</div>
                        <div class="play-btn" id="play-btn">
                            <div id="play-icon">â–¶</div>
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
                        let activePlatform = youtubeId && !youtubeId.includes('{{') ? 'youtube' : 'native';
                        let isPlaying = false;
        let ytReady = false;
        let playOnReady = false;

        window.onYouTubeIframeAPIReady = function() {
            if (youtubeId && !youtubeId.includes('{{')) {
                ytPlayer = new YT.Player('youtube-player', {
                    height: '0', width: '0', videoId: youtubeId,
                    playerVars: { 'autoplay': 0, 'controls': 0, 'loop': 1, 'playlist': youtubeId },
                    events: { 
                        'onReady': () => {
                            ytReady = true;
                            if (playOnReady) {
                                ytPlayer.playVideo();
                                updateUI(true);
                            }
                        }
                    }
                });
            }
        };

        if (activePlatform === 'youtube') {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(tag);
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
                    </script>
                </body>
            </html>`;


export const PUZZLE_LOVE_TEMPLATE = `<!DOCTYPE html>
            <html lang="es">
                <head>
                    <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Puzzle MÃ¡gico - {{ name }}</title>
                            <style>
                                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
                                body {margin: 0; background: #0a0514; color: white; font-family: 'Outfit', sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
                                .puzzle-board {display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; background: rgba(255,255,255,0.1); padding: 10px; border-radius: 15px; width: 300px; height: 300px; margin-bottom: 2rem; }
                                .puzzle-tile {width: 100%; height: 100%; background: #ff4d94; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 2rem; cursor: pointer; transition: transform 0.2s; color: white; font-weight: bold; position: relative; overflow: hidden; }
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
                                    <div style="font-size: 80px;">ðŸ§©</div>
                                    <div style="color: white; font-size: 24px; font-weight: bold; margin-top: 20px;">Â¡Arma el Puzzle!</div>
                                    <div style="color: rgba(255,255,255,0.6); margin-top: 10px;">TOCA PARA EMPEZAR</div>
                                </div>
                            </div>

                            <div id="game-ui" style="text-align: center;">
                                <h2 style="margin-bottom: 1rem; color: #ff4d94;">Â¡Ordena el Desorden! ðŸ§©</h2>
                                <div class="puzzle-board" id="board"></div>
                                <p style="opacity: 0.6;">Toca las piezas para moverlas</p>
                            </div>

                            <div class="message-box" id="message-box">
                                <div class="photo-result">
                                    <img src="{{image_src}}" alt="Nuestra Foto">
                                </div>
                                <h1>{{extra_text}}</h1>
                                <p style="font-size: 1.2rem; color: #fff;">{{ message }}</p>
                                <div style="margin-top: 1.5rem; color: rgba(255,255,255,0.6);">De: {{ sender }}</div>
                            </div>

                            <div class="audio-controls" style="display: {{audio_display}}">
                                <div class="song-title">Audio MÃ¡gico</div>
                                <div class="play-btn" id="play-btn">
                                    <div id="play-icon">â–¶</div>
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
                                let activePlatform = youtubeId && !youtubeId.includes('{{') ? 'youtube' : 'native';
                                let isPlaying = false;
        let ytReady = false;
        let playOnReady = false;

        window.onYouTubeIframeAPIReady = function() {
            if (youtubeId && !youtubeId.includes('{{')) {
                ytPlayer = new YT.Player('youtube-player', {
                    height: '0', width: '0', videoId: youtubeId,
                    playerVars: { 'autoplay': 0, 'controls': 0, 'loop': 1, 'playlist': youtubeId },
                    events: { 
                        'onReady': () => {
                            ytReady = true;
                            if (playOnReady) {
                                ytPlayer.playVideo();
                                updateUI(true);
                            }
                        }
                    }
                });
            }
        };

        if (activePlatform === 'youtube') {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(tag);
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

                                const board = document.getElementById('board');
                                let tiles = ['â¤ï¸', 'ðŸ’–', 'âœ¨', 'â­', 'ðŸŽˆ', 'ðŸŒ¹', 'ðŸ¦‹', 'ðŸ’', ' '];
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
                                    <title>Ruleta MÃ¡gica - {{ name }}</title>
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
                                            <div style="font-size: 80px; filter: drop-shadow(0 0 20px rgba(255, 77, 148, 0.5));">ðŸŽ¡</div>
                                            <div style="color: white; font-size: 24px; font-weight: bold; margin-top: 20px;">Gira la Ruleta</div>
                                            <div style="color: rgba(255,255,255,0.6); margin-top: 10px;">TOCA PARA EMPEZAR</div>
                                        </div>
                                    </div>

                                    <div id="game">
                                        <div class="pointer"></div>
                                        <div class="wheel-container" id="wheel">
                                            <div class="wheel"></div>
                                        </div>
                                        <button class="spin-btn" id="spinBtn" onclick="spin()">GIRAR RULETA ðŸŽ¡</button>
                                    </div>

                                    <div class="message-card" id="result">
                                        <div class="photo-result">
                                            <img src="{{image_src}}" alt="Regalo especial">
                                        </div>
                                        <h1 style="color: #ff4d94; font-size: 2.5rem; margin-bottom: 1rem;">{{extra_text}}</h1>
                                        <p style="font-size: 1.3rem;">{{ message }}</p>
                                        <div style="margin-top: 1.5rem; font-style: italic; opacity: 0.6;">De: {{ sender }}</div>
                                    </div>

                                    <div class="audio-controls" style="display: {{audio_display}}">
                                        <div class="song-title">Audio MÃ¡gico</div>
                                        <div class="play-btn" id="play-btn">
                                            <div id="play-icon">â–¶</div>
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
                                        let activePlatform = youtubeId && !youtubeId.includes('{{') ? 'youtube' : 'native';
                                        let isPlaying = false;
        let ytReady = false;
        let playOnReady = false;

        window.onYouTubeIframeAPIReady = function() {
            if (youtubeId && !youtubeId.includes('{{')) {
                ytPlayer = new YT.Player('youtube-player', {
                    height: '0', width: '0', videoId: youtubeId,
                    playerVars: { 'autoplay': 0, 'controls': 0, 'loop': 1, 'playlist': youtubeId },
                    events: { 
                        'onReady': () => {
                            ytReady = true;
                            if (playOnReady) {
                                ytPlayer.playVideo();
                                updateUI(true);
                            }
                        }
                    }
                });
            }
        };

        if (activePlatform === 'youtube') {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(tag);
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
                                            <title>Raspa y Gana - {{ name }}</title>
                                            <style>
                                                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
                                                body {margin: 0; background: #0a0514; color: white; font-family: 'Outfit', sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
                                                .scratch-container {position: relative; width: 320px; height: 400px; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
                                                canvas {position: absolute; top: 0; left: 0; cursor: crosshair; z-index: 10; }
                                                .message-bg {width: 100%; height: 100%; background: #ff4d94; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem; box-sizing: border-box; }

                                                .photo-result {
                                                    width: 140px;
                                                height: 140px;
                                                border-radius: 50%;
                                                margin-bottom: 1.5rem;
                                                display: {{ image_display }};
                                                overflow: hidden;
                                                border: 3px solid white;
                                                box-shadow: 0 0 20px rgba(255,255,255,0.3);
        }
                                                .photo-result img {width: 100%; height: 100%; object-fit: cover; }

                                                #intro-overlay {position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #0a0514; z-index: 2000; display: flex; justify-content: center; align-items: center; transition: opacity 0.8s ease; }
                                                #intro-overlay.hidden {opacity: 0; pointer-events: none; }

                                                .audio-controls {position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); width: 85%; max-width: 350px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(15px); padding: 12px 20px; border-radius: 25px; border: 1px solid rgba(255, 255, 255, 0.15); display: flex; align-items: center; gap: 15px; z-index: 1000; box-shadow: 0 10px 30px rgba(0,0,0,0.5); color: white; }
                                                .play-btn {width: 40px; height: 40px; background: #ff4d94; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; flex-shrink: 0; color: white !important; font-weight: bold; }
                                                .progress-bar-container {flex - grow: 1; height: 4px; background: rgba(255, 255, 255, 0.1); border-radius: 2px; overflow: hidden; }
                                                .progress-bar {width: 0%; height: 100%; background: #ff4d94; border-radius: 2px; }
                                                .time-text {font - size: 11px; color: rgba(255, 255, 255, 0.5); min-width: 35px; font-family: monospace; }
                                                .song-title {position: absolute; top: -22px; left: 50%; transform: translateX(-50%); font-size: 11px; font-weight: 800; color: #ff4d94; white-space: nowrap; text-transform: uppercase; letter-spacing: 1px; }
                                            </style>
                                        </head>
                                        <body>
                                            <div id="intro-overlay">
                                                <div onclick="openBox()" style="text-align: center; cursor: pointer;">
                                                    <div style="font-size: 80px;">ðŸŽ«</div>
                                                    <div style="color: white; font-size: 24px; font-weight: bold; margin-top: 20px;">Â¡Raspa tu Regalo!</div>
                                                    <div style="color: rgba(255,255,255,0.6); margin-top: 10px;">TOCA PARA EMPEZAR</div>
                                                </div>
                                            </div>

                                            <h2 style="margin-bottom: 2rem; color: #ff4d94; text-shadow: 0 0 10px rgba(255,77,148,0.3);">Â¡Regalo a la vista! ðŸŽ°</h2>

                                            <div class="scratch-container">
                                                <div class="message-bg">
                                                    <div class="photo-result">
                                                        <img src="{{image_src}}" alt="Nuestra Foto">
                                                    </div>
                                                    <div style="font-weight: 900; font-size: 1.4rem;">{{ message }}</div>
                                                    <div style="margin-top: 1rem; opacity: 0.8; font-size: 0.9rem;">- {{ sender }}</div>
                                                </div>
                                                <canvas id="scratchCanvas"></canvas>
                                            </div>

                                            <div class="audio-controls" style="display: {{audio_display}}">
                                                <div class="song-title">Audio MÃ¡gico</div>
                                                <div class="play-btn" id="play-btn">
                                                    <div id="play-icon">â–¶</div>
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
                                                let activePlatform = youtubeId && !youtubeId.includes('{{') ? 'youtube' : 'native';
                                                let isPlaying = false;
        let ytReady = false;
        let playOnReady = false;

        window.onYouTubeIframeAPIReady = function() {
            if (youtubeId && !youtubeId.includes('{{')) {
                ytPlayer = new YT.Player('youtube-player', {
                    height: '0', width: '0', videoId: youtubeId,
                    playerVars: { 'autoplay': 0, 'controls': 0, 'loop': 1, 'playlist': youtubeId },
                    events: { 
                        'onReady': () => {
                            ytReady = true;
                            if (playOnReady) {
                                ytPlayer.playVideo();
                                updateUI(true);
                            }
                        }
                    }
                });
            }
        };

        if (activePlatform === 'youtube') {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(tag);
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

                                                const canvas = document.getElementById('scratchCanvas');
                                                const ctx = canvas.getContext('2d');
                                                canvas.width = 320;
                                                canvas.height = 400;

                                                ctx.fillStyle = '#C0C0C0';
                                                ctx.fillRect(0, 0, canvas.width, canvas.height);

                                                ctx.fillStyle = '#888';
                                                ctx.font = '900 30px Outfit';
                                                ctx.textAlign = 'center';
                                                ctx.fillText('RASPA AQUÃ', 160, 180);

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
        canvas.addEventListener('touchstart', (e) => {isDrawing = true; scratch(e); });
        canvas.addEventListener('touchend', () => isDrawing = false);
        canvas.addEventListener('touchmove', (e) => {e.preventDefault(); scratch(e); });
                                            </script>
                                        </body>
                                    </html>`;

// --- THEMATIC SPECIALIZATIONS ---
// MARVEL BOOK - Importado desde mÃ³dulo mejorado
export { MARVEL_BOOK_TEMPLATE } from './fun/marvel-book.js';
export const GALAXY_GENERATOR_TEMPLATE = GALAXY_TEMPLATE;
// MUSICAL SPHERE - Importado desde mÃ³dulo mejorado
export { MUSICAL_SPHERE_TEMPLATE } from './love/musical-sphere.js';
export const PROPOSAL_TEMPLATE = LOVE_TEMPLATE.replace('SÃ â¤ï¸', 'Â¡SÃ, ACEPTO! ðŸ’');
export const FORGIVE_ME_CATS_TEMPLATE = LOVE_TEMPLATE.replace('ðŸŽ', 'ðŸ±').replace('SÃ â¤ï¸', 'SÃ, TE PERDONO â¤ï¸').replace('p {', 'p {font - family: "Comic Sans MS", cursive; ');
export const FORGIVE_ME_PENGUINS_TEMPLATE = LOVE_TEMPLATE.replace('ðŸŽ', 'ðŸ§').replace('background: #0a0514', 'background: #e3f2fd; color: #333;');
export const FLOWERS_RAMO_TEMPLATE = LOVE_TEMPLATE.replace('ðŸŽ', 'ðŸ’').replace('background: #0a0514', 'background: #fce4ec; color: #333;');
export const ENOJONA_TEMPLATE = LOVE_TEMPLATE.replace('ðŸŽ', 'ðŸ˜¡');
export const DATE_COUNTER_TEMPLATE = BIRTHDAY_TEMPLATE.replace('ðŸŽ‚', 'â°').replace('Â¡Feliz CumpleaÃ±os!', 'Nuestro Tiempo Juntos').replace('#00f2ff', '#00ff00');
export const LOVE_CERTIFICATE_TEMPLATE = LOVE_TEMPLATE.replace('ðŸŽ', 'ðŸ“œ').replace('background: rgba(255,255,255,0.1)', 'background: #f9f4e8; color: #444; border: 5px double #a67c52;');
export const COUPLE_INITIALS_TEMPLATE = LOVE_TEMPLATE.replace('ðŸŽ', 'ðŸ‘•');
export const ENCHANTED_LETTER_TEMPLATE = LOVE_TEMPLATE.replace('ðŸŽ', 'ðŸŽƒ').replace('#ff4d94', '#ff8000');
export const LOVE_VITAMINS_TEMPLATE = LOVE_TEMPLATE.replace('ðŸŽ', 'ðŸ’Š');
export const SOCCER_CARD_TEMPLATE = LOVE_TEMPLATE.replace('ðŸŽ', 'âš½').replace('#ff4d94', '#4caf50').replace('background: rgba(255,255,255,0.1)', 'background: linear-gradient(135deg, #ffd700, #b8860b); color: #000; font-weight: 900;');
export const BIRTHDAY_LAMP_TEMPLATE = BIRTHDAY_TEMPLATE;
export const DEDICATE_SONG_TEMPLATE = LOVE_TEMPLATE.replace('ðŸŽ', 'ðŸŽ§');
export const POCOYO_DANCE_TEMPLATE = LOVE_TEMPLATE.replace('ðŸŽ', 'ðŸ•º').replace('background: #0a0514', 'background: #03a9f4;');
export const BE_MY_BOYFRIEND_TEMPLATE = LOVE_TEMPLATE.replace('SÃ â¤ï¸', 'SÃ, Â¡ACEPTO! ðŸ’');
export const TE_AMO_TEMPLATE = GALAXY_TEMPLATE.replace('<h1>', '<h1>â¤ï¸ ');
export const BE_FRIENDS_TEMPLATE = LOVE_TEMPLATE.replace('ðŸŽ', 'ðŸ¤');
export const HEART_PHOTO_TEMPLATE = GALAXY_TEMPLATE.replace('ðŸŽ', 'ðŸ“¸');
export const OUR_YEAR_TEMPLATE = BIRTHDAY_TEMPLATE.replace('ðŸŽ‚', 'ðŸ“…');
export const CHRISTMAS_TREE_TEMPLATE = BIRTHDAY_TEMPLATE.replace('ðŸŽ‚', 'ðŸŽ„').replace('#00f2ff', '#2e7d32').replace('background: #05020a', 'background: #002200;');
export const NEW_YEAR_TEMPLATE = BIRTHDAY_TEMPLATE.replace('ðŸŽ‚', 'ðŸ¥‚').replace('Â¡Feliz CumpleaÃ±os!', 'Â¡Feliz AÃ±o Nuevo 2026!');
export const LAST_CHANCE_TEMPLATE = LOVE_TEMPLATE.replace('ðŸŽ', 'ðŸ”“').replace('SÃ â¤ï¸', 'SÃ, UNA ÃšLTIMA VEZ â¤ï¸');
export const HIDDEN_MESSAGE_TEMPLATE = GALAXY_TEMPLATE.replace('ðŸŽ', 'ðŸ•µï¸â€â™€ï¸');


