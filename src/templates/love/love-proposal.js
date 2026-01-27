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
        
        .audio-controls { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); width: 85%; max-width: 350px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(15px); padding: 12px 20px; border-radius: 25px; border: 1px solid rgba(255, 255, 255, 0.15); display: flex; align-items: center; gap: 15px; z-index: 1000; box-shadow: 0 10px 30px rgba(0,0,0,0.5); color: white; }
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
            background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01));
            min-height: 100px;
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
            <button id="yesBtn">Sí ❤️</button>
            <button id="noBtn">NO 😢</button>
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
            const hasAudio = '{{has_audio}}' === 'true';
            setTimeout(() => {
                if (hasAudio) {
                    document.getElementById('audio-ui').style.display = 'flex';
                }
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
