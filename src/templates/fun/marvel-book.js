export const MARVEL_BOOK_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Libro Marvel - {{name}}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Outfit:wght@400;700;900&display=swap');
        body { margin: 0; background: #0a0514; color: #333; font-family: 'Outfit', sans-serif; height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; perspective: 2000px; }
        .book { width: 360px; height: 500px; position: relative; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); transform-style: preserve-3d; cursor: pointer; z-index: 10; }
        .book.open { transform: translateX(25%); }
        .page { width: 100%; height: 100%; position: absolute; top: 0; left: 0; transform-origin: left; transform-style: preserve-3d; transition: transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1); z-index: 1; }
        .front, .back { width: 100%; height: 100%; position: absolute; top: 0; left: 0; backface-visibility: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; box-sizing: border-box; border-radius: 0 15px 15px 0; }
        .back { transform: rotateY(180deg); }
        .cover { background: #4a1c1c; border-left: 15px solid #2d1111; color: white !important; box-shadow: inset 0 0 100px rgba(0,0,0,0.5), 10px 10px 30px rgba(0,0,0,0.6); position: relative; }
        .cover h1 { font-family: 'Bangers', cursive; font-size: 2.2rem; text-align: center; margin-bottom: 1.5rem; color: #ffd700 !important; text-shadow: 3px 3px 0 #ed1d24; line-height: 1.2; }
        .cover-sticker { background: #ffd700; padding: 10px 20px; border-radius: 5px; color: #ed1d24; font-weight: 900; font-size: 1.2rem; transform: rotate(-2deg); margin-bottom: 2rem; border: 2px solid #ed1d24; }
        .marvel-logo-area { width: 180px; height: 160px; border: 4px solid #fff; background: #000; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .marvel-logo-area img { width: 100%; height: 100%; object-fit: contain; }
        .inner-page { background: #fffcf0; color: #1a1a1a !important; box-shadow: inset 5px 0 15px rgba(0,0,0,0.1); border: 1px solid rgba(0,0,0,0.05); padding: 2rem; display: flex; flex-direction: column; justify-content: center; align-items: center; }
        .comic-title { font-family: 'Bangers', cursive; color: #ed1d24 !important; font-size: 2rem; margin-bottom: 1rem; }
        .comic-text { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 1.1rem; text-align: center; color: #1a1a1a !important; background: #fffb00; padding: 8px 12px; box-shadow: 4px 4px 0 #000; border: 2px solid #000; margin: 10px 0; }
        .page.flipped { transform: rotateY(-180deg); }

        #intro-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #1a1a1a; z-index: 3000; display: flex; justify-content: center; align-items: center; transition: opacity 0.8s ease; cursor: pointer; }
        #intro-overlay.hidden { opacity: 0; pointer-events: none; }
        .marvel-btn { background: #ed1d24; color: white; padding: 15px 40px; font-family: 'Bangers', cursive; font-size: 2rem; border: 4px solid #fff; box-shadow: 8px 8px 0 #000; cursor: pointer; letter-spacing: 2px; }

        .audio-controls { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); width: 85%; max-width: 350px; background: rgba(0, 0, 0, 0.9); backdrop-filter: blur(15px); padding: 12px 20px; border-radius: 25px; border: 2px solid #ed1d24; display: flex; align-items: center; gap: 15px; z-index: 1000; color: white; }
        .play-btn { width: 40px; height: 40px; background: #ed1d24; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; flex-shrink: 0; color: white !important; font-weight: bold; }
        .progress-bar { width: 0%; height: 100%; background: #ffd700; border-radius: 2px; }
        .progress-bar-container { flex-grow: 1; height: 4px; background: rgba(255, 255, 255, 0.1); border-radius: 2px; overflow: hidden; }
        .song-title { position: absolute; top: -22px; left: 50%; transform: translateX(-50%); font-size: 11px; font-weight: 800; color: #ffd700; text-transform: uppercase; letter-spacing: 1px; }

        .pixel-frame { width: 220px; height: 220px; border: 8px solid #000; background: #fff; padding: 5px; position: relative; margin-bottom: 1rem; }
        .pixel-frame img { width: 100%; height: 100%; object-fit: contain; }
    </style>
</head>
<body>
    <div id="intro-overlay" onclick="openBox()">
        <div style="text-align: center;">
            <div style="font-size: 100px; margin-bottom: 20px;">📕</div>
            <button class="marvel-btn">ABRIR ARCHIVOS MARVEL</button>
        </div>
    </div>

    <div class="book" id="book" onclick="flipPage()">
        <div class="page page1" id="page1">
            <div class="front cover">
                <h1>{{message}}</h1>
                <div class="cover-sticker">CON AMOR</div>
                <div class="marvel-logo-area"><img src="{{image_src}}" alt="Cover" onerror="this.src='https://i.imgur.com/rN7Yv4T.png'"></div>
                <div style="margin-top: 2rem; font-family: 'Bangers'; font-size: 1.2rem; color: #ffd700; letter-spacing: 2px;">{{sender}} & {{name}}</div>
            </div>
            <div class="back">{{item_1_content}}</div>
        </div>
        {{dynamic_pages}}
    </div>

    <div class="audio-controls" style="display: none;" id="audio-ui">
        <div class="song-title">Marvel Theme</div>
        <div class="play-btn" id="play-btn">
            <span id="play-icon">▶</span><span id="pause-icon" style="display:none">||</span>
        </div>
        <div class="progress-bar-container"><div class="progress-bar" id="progress-bar"></div></div>
    </div>

    <audio id="bg-audio" src="{{audio_src}}" loop></audio>
    <div id="yt-player" style="position:fixed; top:-100px; width:1px; height:1px; opacity:0;"></div>

    <script>
        const hasAudio = '{{has_audio}}' === 'true';
        const youtubeId = "{{ youtube_id }}".replace(/[{}]/g, '');
        let stage = 0;
        let audio = document.getElementById('bg-audio');
        let ytPlayer = null;
        let ytReady = false;
        let playOnReady = false;
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
            document.getElementById('play-icon').style.display = playing ? 'none' : 'inline';
            document.getElementById('pause-icon').style.display = playing ? 'inline' : 'none';
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
        };

        const book = document.getElementById('book');
        function flipPage() {
            const pages = Array.from(document.querySelectorAll('.page'));
            if (stage < pages.length) {
                pages[stage].classList.add('flipped');
                pages.forEach((p, i) => { p.style.zIndex = i < stage ? i + 1 : (i === stage ? 50 : pages.length - i); });
                if (stage === 0) book.classList.add('open');
                stage++;
            } else {
                pages.forEach((p, i) => { p.classList.remove('flipped'); p.style.zIndex = pages.length - i; });
                book.classList.remove('open');
                stage = 0;
            }
        }

        (function initPages() { document.querySelectorAll('.page').forEach((p, i, a) => p.style.zIndex = a.length - i); })();
        document.getElementById('play-btn').onclick = (e) => {
            e.stopPropagation();
            if (activePlatform === 'youtube' && ytPlayer) {
                if (ytPlayer.getPlayerState() === 1) ytPlayer.pauseVideo(); else ytPlayer.playVideo();
            } else { if (audio.paused) audio.play(); else audio.pause(); }
        };
        if (activePlatform === 'native') {
            audio.ontimeupdate = () => { if(document.getElementById('progress-bar')) document.getElementById('progress-bar').style.width = (audio.currentTime / audio.duration) * 100 + '%'; };
        }
    </script>
</body>
</html>`;
