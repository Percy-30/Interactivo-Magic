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
        .page3 { z-index: 3; }
        .page4 { z-index: 2; }
        
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
        @media (max-width: 600px) {
            .book { width: 300px; height: 420px; }
            .cover h1 { font-size: 2.22rem; }
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
            background: linear-gradient(135deg, #fff9e6 0%, #e8e1cf 100%);
            border: 1px solid #ddd;
            min-height: 100px;
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
                <div class="photo-frame" style="display: {{image_display}};">
                    <img src="{{image_src}}" alt="Nuestra Foto" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.style.display='none'">
                </div>
                <h2 style="margin-top: 0; font-size: 1.8rem;">Para: {{name}}</h2>
                <div style="padding: 0 1rem; width: 100%; box-sizing: border-box;">
                    <p style="font-size: 1.1rem; line-height: 1.6; margin: 0; display: -webkit-box; -webkit-line-clamp: 6; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; white-space: pre-wrap;">{{extra_text}}</p>
                </div>
            </div>
        </div>
        <!-- Page 2: Message -->
        <div class="page page2" id="page2">
            <div class="front inner-page">
                <p style="white-space: pre-wrap;">{{message}}</p>
                <div style="margin-top: 3rem; font-family: 'Dancing Script', cursive; font-size: 1.8rem; color: #800000 !important; border-top: 1px solid rgba(128,0,0,0.1); padding-top: 1.5rem; font-weight: 700;">
                    Con amor, <br> {{sender}}
                </div>
            </div>
            <div class="back inner-page" style="background: #e8e1cf; display: flex; align-items: center; justify-content: center;">
                <div style="font-size: 5rem; opacity: 0.2;">❤️</div>
            </div>
        </div>
        <!-- Page 3: Romantic Quote -->
        <div class="page page3" id="page3">
            <div class="front inner-page" style="background: linear-gradient(135deg, #fff9e6 0%, #ffe8f0 100%);">
                <div style="font-size: 4rem; margin-bottom: 2rem;">💝</div>
                <h2 style="color: #800000; font-size: 1.8rem; margin-bottom: 2rem;">Nuestro Amor</h2>
                <p style="font-size: 1.2rem; line-height: 1.8; text-align: center; font-style: italic; color: #333;">
                    "En cada latido de mi corazón está tu nombre, en cada pensamiento tu sonrisa, 
                    y en cada momento el deseo de estar junto a ti."
                </p>
                <div style="margin-top: 2rem; font-size: 3rem;">✨</div>
            </div>
            <div class="back inner-page">
                <div style="font-size: 4rem; margin-bottom: 2rem;">🌹</div>
                <h2 style="color: #800000; font-size: 1.8rem; margin-bottom: 2rem;">Promesa Eterna</h2>
                <p style="font-size: 1.15rem; line-height: 1.7; text-align: center; font-style: italic; color: #333;">
                    "Prometo amarte en los días grises y en los soleados, en la calma y en la tormenta, 
                    hoy, mañana y siempre."
                </p>
                <div style="margin-top: 2rem; font-size: 3rem;">💕</div>
            </div>
        </div>
        <!-- Page 4: Final Message -->
        <div class="page page4" id="page4">
            <div class="front inner-page" style="background: linear-gradient(135deg, #fff0f5 0%, #fff9e6 100%);">
                <div style="font-size: 4rem; margin-bottom: 2rem;">🌟</div>
                <h2 style="color: #800000; font-size: 1.8rem; margin-bottom: 2rem;">Tú y Yo</h2>
                <p style="font-size: 1.2rem; line-height: 1.8; text-align: center; font-weight: 700; color: #800000;">
                    "Eres mi persona favorita, mi lugar seguro, mi hogar."
                </p>
                <div style="margin-top: 3rem; font-size: 2.5rem; opacity: 0.8;">💖 ✨ 💐</div>
            </div>
            <div class="back inner-page" style="background: linear-gradient(135deg, #800000 0%, #a00000 100%); color: white !important;">
                <div style="font-size: 5rem; margin-bottom: 2rem; filter: drop-shadow(0 0 20px rgba(255,255,255,0.3));">💍</div>
                <h2 style="color: #ffcc00 !important; font-size: 2rem; margin-bottom: 2rem; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">Para Siempre</h2>
                <p style="font-size: 1.3rem; line-height: 1.8; text-align: center; font-weight: 800; color: white !important; text-shadow: 0 2px 5px rgba(0,0,0,0.3);">
                    Gracias por elegirme cada día. <br><br>
                    Te amo infinitamente. 💕
                </p>
                <div style="margin-top: 2rem; font-size: 1.2rem; opacity: 0.8; letter-spacing: 2px;">{{sender}}</div>
            </div>
        </div>
    </div>

    <div class="audio-controls" style="display: {{audio_display}}">
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
            } else if (stage === 2) {
                document.getElementById('page3').classList.add('flipped');
                stage = 3;
            } else if (stage === 3) {
                document.getElementById('page4').classList.add('flipped');
                stage = 4;
            } else {
                // Reset to beginning
                document.getElementById('page1').classList.remove('flipped');
                document.getElementById('page2').classList.remove('flipped');
                document.getElementById('page3').classList.remove('flipped');
                document.getElementById('page4').classList.remove('flipped');
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
</html>`;
