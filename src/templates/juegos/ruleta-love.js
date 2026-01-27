export const RULETA_LOVE_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ruleta Mágica - {{name}}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        body { margin: 0; background: #0a0514; color: white; font-family: 'Outfit', sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
        .wheel-container { position: relative; width: 300px; height: 300px; margin-bottom: 2rem; transition: transform 4s cubic-bezier(0.1, 0, 0, 1); }
        .wheel { width: 100%; height: 100%; border-radius: 50%; border: 8px solid white; background: conic-gradient(
            #ff4d94 0% 12.5%, #7000ff 12.5% 25%, #00f2ff 25% 37.5%, #ffeead 37.5% 50%,
            #ff4d94 50% 62.5%, #7000ff 62.5% 75%, #00f2ff 75% 87.5%, #ffeead 87.5% 100%
        ); position: relative; box-shadow: 0 0 30px rgba(0,0,0,0.5); }
        .pointer { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); width: 30px; height: 30px; background: white; clip-path: polygon(50% 100%, 0 0, 100% 0); z-index: 10; }
        .spin-btn { padding: 15px 40px; background: #ff4d94; border: none; border-radius: 30px; color: white; font-weight: bold; font-size: 1.2rem; cursor: pointer; box-shadow: 0 5px 15px rgba(255, 77, 148, 0.4); }
        .message-card { display: none; text-align: center; padding: 2.5rem; background: rgba(255,255,255,0.1); backdrop-filter: blur(15px); border-radius: 25px; width: 90%; max-width: 400px; border: 1px solid rgba(255,255,255,0.2); }

        #intro-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #0a0514; z-index: 2000; display: flex; justify-content: center; align-items: center; transition: opacity 0.8s ease; }
        #intro-overlay.hidden { opacity: 0; pointer-events: none; }

        /* Unified Audio Styles */
        .audio-controls { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); width: 85%; max-width: 350px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(15px); padding: 12px 20px; border-radius: 25px; border: 1px solid rgba(255, 255, 255, 0.15); display: flex; align-items: center; gap: 15px; z-index: 1000; box-shadow: 0 10px 30px rgba(0,0,0,0.5); color: white; }
        .play-btn { width: 40px; height: 40px; background: #ff4d94; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; flex-shrink: 0; color: white !important; font-weight: bold; }
        .progress-bar-container { flex-grow: 1; height: 4px; background: rgba(255, 255, 255, 0.1); border-radius: 2px; overflow: hidden; }
        .progress-bar { width: 0%; height: 100%; background: #ff4d94; border-radius: 2px; }
        .time-text { font-size: 11px; color: rgba(255, 255, 255, 0.5); min-width: 35px; font-family: monospace; }
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
            <img src="{{image_src}}" alt="Regalo especial" onerror="this.parentElement.style.display='none'">
        </div>
        <h1 style="color: #ff4d94; font-size: 2.5rem; margin-bottom: 1rem;">{{extra_text}}</h1>
        <p style="font-size: 1.3rem;">{{message}}</p>
        <div style="margin-top: 1.5rem; font-style: italic; opacity: 0.6;">De: {{sender}}</div>
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
