export const BIRTHDAY_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¡Feliz Cumpleaños, {{ name }}!</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        body { margin: 0; background: #05020a; color: white; font-family: 'Outfit', sans-serif; height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .card { background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); padding: 2.5rem; border-radius: 24px; text-align: center; border: 1px solid rgba(255,255,255,0.1); width: 90%; max-width: 450px; box-shadow: 0 25px 50px rgba(0,0,0,0.5); z-index: 10; }
        h1 { background: linear-gradient(135deg, #ff4d94, #ffeead); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 2.5rem; font-weight: 900; margin-bottom: 1rem; }
        p { font-size: 1.2rem; line-height: 1.6; color: rgba(255,255,255,0.8); }
        .sender { margin-top: 2rem; font-weight: bold; color: #ff4d94; letter-spacing: 2px; text-transform: uppercase; font-size: 0.8rem; }

        #intro-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #05020a; z-index: 3000; display: flex; justify-content: center; align-items: center; transition: opacity 0.8s ease; cursor: pointer; }
        #intro-overlay.hidden { opacity: 0; pointer-events: none; }

        .audio-controls { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); width: 85%; max-width: 350px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(15px); padding: 12px 20px; border-radius: 25px; border: 1px solid rgba(255, 255, 255, 0.15); display: flex; align-items: center; gap: 15px; z-index: 1000; box-shadow: 0 10px 30px rgba(0,0,0,0.5); color: white; }
        .play-btn { width: 40px; height: 40px; background: #ff4d94; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; flex-shrink: 0; color: white !important; font-weight: bold; }
        .progress-bar-container { flex-grow: 1; height: 4px; background: rgba(255, 255, 255, 0.1); border-radius: 2px; overflow: hidden; }
        .progress-bar { width: 0%; height: 100%; background: #ff4d94; border-radius: 2px; }
        .time-text { font-size: 11px; color: rgba(255, 255, 255, 0.5); min-width: 35px; font-family: monospace; }
        .song-title { position: absolute; top: -22px; left: 50%; transform: translateX(-50%); font-size: 11px; font-weight: 800; color: #ff4d94; white-space: nowrap; text-transform: uppercase; letter-spacing: 1px; }

        .photo-result { width: 120px; height: 120px; border-radius: 50%; margin: 0 auto 1.5rem auto; display: {{ image_display }}; overflow: hidden; border: 4px solid #ff4d94; box-shadow: 0 0 20px rgba(255, 77, 148, 0.4); }
        .photo-result img { width: 100%; height: 100%; object-fit: cover; }
    </style>
</head>
<body>
    <div id="intro-overlay" onclick="openBox()">
        <div style="text-align: center;">
            <div style="font-size: 80px; filter: drop-shadow(0 0 20px #ff4d94);">🎂</div>
            <div style="color: white; font-size: 26px; font-weight: 900; margin-top: 25px; letter-spacing: 2px;">¡MIRA TU REGALO!</div>
            <div style="color: #ff4d94; margin-top: 10px; font-weight: bold; letter-spacing: 3px;">TOCA PARA ABRIR ❤️</div>
        </div>
    </div>

    <div class="card">
        <div class="photo-result"><img src="{{image_src}}" alt="Foto" onerror="this.parentElement.style.display='none'"></div>
        <div style="color: #ff4d94; font-size: 1.6rem; font-weight: 900; margin-bottom: 1rem; line-height: 1.3;">{{extra_text}}</div>
        <p>{{ message }}</p>
        <div class="sender">DE PARTE DE: {{ sender }}</div>
    </div>

    <div class="audio-controls" style="display: none;" id="audio-ui">
        <div class="song-title">Audio Mágico</div>
        <div class="play-btn" id="play-btn">
            <span id="play-icon">▶</span><span id="pause-icon" style="display:none">||</span>
        </div>
        <div class="progress-bar-container"><div class="progress-bar" id="progress-bar"></div></div>
        <div class="time-text" id="time-display">0:00</div>
    </div>

    <audio id="bg-audio" src="{{audio_src}}" loop></audio>
    <div id="yt-player" style="position:fixed; top:-100px; width:1px; height:1px; opacity:0;"></div>

    <script>
        const hasAudio = '{{has_audio}}' === 'true';
        const youtubeId = "{{ youtube_id }}".replace(/[{}]/g, '');
        let audio = document.getElementById('bg-audio');
        let ytPlayer = null;
        let ytReady = false;
        let playOnReady = false;
        let activePlatform = (youtubeId && youtubeId.length > 2) ? 'youtube' : 'native';

        if (activePlatform === 'youtube' && !window.YT_API_LOADED) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(tag);
            window.YT_API_LOADED = true;
        } else if (activePlatform === 'youtube' && window.YT && window.YT.Player) {
            setTimeout(() => { if (typeof window.onYouTubeIframeAPIReady === 'function') window.onYouTubeIframeAPIReady(); }, 500);
        }

        window.onYouTubeIframeAPIReady = function() {
            if (activePlatform === 'youtube') {
                ytPlayer = new YT.Player('yt-player', {
                    height: '0', width: '0', videoId: youtubeId,
                    playerVars: { 'autoplay': 0, 'controls': 0, 'loop': 1, 'playlist': youtubeId },
                    events: {
                        'onReady': () => { ytReady = true; if(playOnReady) { ytPlayer.playVideo(); updateUI(true); } },
                        'onStateChange': (e) => updateUI(e.data === 1)
                    }
                });
            }
        };

        function updateUI(playing) {
            const pi = document.getElementById('play-icon');
            const pa = document.getElementById('pause-icon');
            if (pi) pi.style.display = playing ? 'none' : 'inline';
            if (pa) pa.style.display = playing ? 'inline' : 'none';
        }

        audio.onplay = () => updateUI(true);
        audio.onpause = () => updateUI(false);

        window.openBox = function() {
            document.getElementById('intro-overlay').classList.add('hidden');
            if (hasAudio) {
                document.getElementById('audio-ui').style.display = 'flex';
                try {
                    if (activePlatform === 'youtube') { if (ytReady) ytPlayer.playVideo(); else playOnReady = true; }
                    else if (audio) { audio.play().catch(() => {}); }
                } catch(e) {}
            }
            startConfetti();
        };

        document.getElementById('play-btn').onclick = (e) => {
            e.stopPropagation();
            if (activePlatform === 'youtube' && ytPlayer) {
                if (ytPlayer.getPlayerState() === 1) ytPlayer.pauseVideo(); else ytPlayer.playVideo();
            } else { if (audio.paused) audio.play(); else audio.pause(); }
        };

        if (activePlatform === 'native') {
            audio.ontimeupdate = () => {
                const p = (audio.currentTime / audio.duration) * 100;
                const pb = document.getElementById('progress-bar');
                const td = document.getElementById('time-display');
                if (pb) pb.style.width = p + '%';
                if (td) {
                    const mins = Math.floor(audio.currentTime / 60);
                    const secs = Math.floor(audio.currentTime % 60);
                    td.textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;
                }
            };
        }

        function startConfetti() {
            const colors = ['#ff4d94', '#ffeead', '#00f2ff', '#fff'];
            for(let i=0; i<60; i++) {
                const c = document.createElement('div');
                c.style.cssText = 'position:fixed; left:'+Math.random()*100+'vw; top:-10px; width:8px; height:8px; z-index:5000; background:'+colors[Math.floor(Math.random()*4)]+'; border-radius:2px; pointer-events:none;';
                document.body.appendChild(c);
                c.animate([{transform:'translateY(0) rotate(0)', opacity:1}, {transform:'translateY(110vh) rotate(720deg)', opacity:0}], {duration: Math.random()*2000+2000, easing:'ease-out'}).onfinish = () => c.remove();
            }
        }
    </script>
</body>
</html>`;
