export const MUSICAL_SPHERE_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{name}} - Esfera Musical 🎵</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Outfit', sans-serif; background: #05020a; min-height: 100vh; overflow: hidden; display: flex; justify-content: center; align-items: center; perspective: 1500px; }
    .nebula { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(245, 87, 108, 0.15) 0%, transparent 50%); z-index: 0; }
    .stars-layer { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-image: radial-gradient(1px 1px at 20px 30px, #fff, rgba(0,0,0,0)), radial-gradient(2px 2px at 100px 150px, #fff, rgba(0,0,0,0)); background-size: 200px 200px; opacity: 0.3; z-index: 1; animation: starsMove 100s linear infinite; }
    @keyframes starsMove { from { background-position: 0 0; } to { background-position: 1000px 1000px; } }

    #welcome-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(5, 2, 10, 0.95); backdrop-filter: blur(20px); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 10000; transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; }
    .start-btn { background: linear-gradient(135deg, #00f2ff, #0066ff); color: white; border: none; padding: 1.2rem 3rem; border-radius: 50px; font-size: 1.2rem; font-weight: 800; box-shadow: 0 0 30px rgba(0, 242, 255, 0.4); text-transform: uppercase; letter-spacing: 2px; margin-top: 2rem; }

    .container { position: relative; z-index: 10; display: flex; flex-direction: column; align-items: center; width: 100%; padding: 2rem; }
    .scene { width: 320px; height: 320px; position: relative; margin: 3rem 0; transform-style: preserve-3d; }
    .sphere-wrapper { width: 100%; height: 100%; transform-style: preserve-3d; animation: sphereFloat 6s ease-in-out infinite; }
    @keyframes sphereFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }
    .sphere { width: 100%; height: 100%; border-radius: 50%; position: relative; overflow: hidden; background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.8) 100%); box-shadow: 0 0 80px rgba(0, 242, 255, 0.3), inset 0 0 50px rgba(0, 242, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1); display: flex; align-items: center; justify-content: center; }
    .sphere-content { width: 85%; height: 85%; border-radius: 50%; object-fit: cover; transition: transform 0.1s; }
    .sphere-text-inner { width: 80%; text-align: center; font-weight: 800; font-size: 1.5rem; background: linear-gradient(135deg, #fff 0%, #00f2ff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: pulseText 2s ease-in-out infinite; }
    @keyframes pulseText { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
    .ring { position: absolute; top: 50%; left: 50%; border: 2px solid rgba(0, 242, 255, 0.3); border-radius: 50%; transform: translate(-50%, -50%) rotateX(75deg); pointer-events: none; }
    .ring-1 { width: 420px; height: 420px; animation: rotate 10s linear infinite; }
    .ring-2 { width: 500px; height: 500px; border-color: rgba(245, 87, 108, 0.3); animation: rotate 15s linear infinite reverse; }
    @keyframes rotate { from { transform: translate(-50%, -50%) rotateX(75deg) rotateZ(0); } to { transform: translate(-50%, -50%) rotateX(75deg) rotateZ(360deg); } }

    .glass-card { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(15px); border: 1px solid rgba(255, 255, 255, 0.1); padding: 2rem; border-radius: 30px; max-width: 500px; width: 90%; text-align: center; margin-top: 1rem; }
    .sender { font-weight: 800; color: #00f2ff; font-size: 1.3rem; text-transform: uppercase; letter-spacing: 2px; }

    .audio-ui { position: fixed; bottom: 30px; background: rgba(0,0,0,0.8); border: 1px solid #00f2ff; border-radius: 50px; padding: 10px 25px; display: flex; align-items: center; gap: 15px; z-index: 1000; color: white; }
    .play-btn { width: 45px; height: 45px; background: #00f2ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #05020a; font-weight: bold; }
    .viz-bar { width: 4px; background: #00f2ff; border-radius: 2px; height: 10px; animation: bounce 0.5s ease infinite alternate; display: none; }
    @keyframes bounce { from { height: 5px; } to { height: 25px; } }
  </style>
</head>
<body>
  <div class="nebula"></div><div class="stars-layer"></div>
  <div id="welcome-overlay" onclick="openBox()">
    <div style="text-align: center;">
      <div style="font-size: 4rem; margin-bottom: 1rem;">🎵</div>
      <h1 style="color: white; font-size: 2rem;">Sintonía Especial</h1>
      <p style="color: #00f2ff; font-weight: 600;">{{name}}, una sorpresa te espera...</p>
      <button class="start-btn">EMPEZAR</button>
    </div>
  </div>

  <div class="container">
    <h1 style="color:white; font-size:2.5rem; font-weight:900;">{{name}}</h1>
    <div class="scene">
      <div class="ring ring-1"></div><div class="ring ring-2"></div>
      <div class="sphere-wrapper">
        <div class="sphere" id="sphere">
          <img src="{{image_src}}" id="sphereImg" class="sphere-content" onerror="this.style.display='none'; document.getElementById('sphereText').style.display='block';">
          <div id="sphereText" class="sphere-text-inner" style="display: none">{{extra_text}}</div>
        </div>
      </div>
    </div>
    <div class="glass-card">
      <p style="color:rgba(255,255,255,0.9); font-size:1.15rem; line-height:1.6; margin-bottom:1.5rem;">{{message}}</p>
      <p class="sender">{{sender}}</p>
    </div>
  </div>

  <div class="audio-ui" id="audio-ui" style="display: none;">
    <div class="play-btn" id="play-btn">▶</div>
    <div id="viz" style="display: flex; gap: 3px;">
      <div class="viz-bar"></div><div class="viz-bar"></div><div class="viz-bar"></div>
    </div>
    <div style="font-size: 0.8rem; font-weight: 600; letter-spacing: 1px;">AUDIO MÁGICO</div>
  </div>

  <audio id="bg-audio" src="{{audio_src}}" loop></audio>
  <div id="yt-player" style="position:fixed; opacity:0; pointer-events:none;"></div>

  <script>
    const hasAudio = '{{has_audio}}' === 'true';
    const youtubeId = "{{ youtube_id }}".replace(/[{}]/g, '');
    let audio = document.getElementById('bg-audio');
    let ytPlayer = null;
    let ytReady = false;
    let playOnReady = false;
    let isPlaying = false;
    let activePlatform = (youtubeId && youtubeId.length > 2) ? 'youtube' : 'native';

    if (activePlatform === 'youtube' && !window.YT_API_LOADED) {
        const tag = document.createElement('script'); tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag); window.YT_API_LOADED = true;
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
        isPlaying = playing;
        const btn = document.getElementById('play-btn');
        if (btn) btn.innerText = playing ? "||" : "▶";
        document.querySelectorAll('.viz-bar').forEach(b => b.style.display = playing ? 'block' : 'none');
        if (playing) startVibration(); else stopVibration();
    }

    audio.onplay = () => updateUI(true);
    audio.onpause = () => updateUI(false);

    window.openBox = function() {
        document.getElementById('welcome-overlay').classList.add('hidden');
        if (hasAudio) {
            document.getElementById('audio-ui').style.display = 'flex';
            try {
                if (activePlatform === 'youtube') { if (ytReady) ytPlayer.playVideo(); else playOnReady = true; }
                else if (audio) { audio.play().catch(() => {}); }
            } catch(e) {}
        }
    };

    document.getElementById('play-btn').onclick = (e) => {
        e.stopPropagation();
        if (activePlatform === 'youtube' && ytPlayer) {
            if (ytPlayer.getPlayerState() === 1) ytPlayer.pauseVideo(); else ytPlayer.playVideo();
        } else { if (audio.paused) audio.play(); else audio.pause(); }
    };

    let vibInterval;
    function startVibration() {
        vibInterval = setInterval(() => {
            const s = document.getElementById('sphere');
            if(s) s.style.transform = 'scale(' + (1 + Math.random() * 0.05) + ')';
        }, 100);
    }
    function stopVibration() { clearInterval(vibInterval); const s = document.getElementById('sphere'); if(s) s.style.transform = 'scale(1)'; }

    // Fallback logic
    if (!"{{image_src}}".includes("http")) {
        document.getElementById('sphereImg').style.display = 'none';
        document.getElementById('sphereText').style.display = 'block';
    }
  </script>
</body>
</html>`;
