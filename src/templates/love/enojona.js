export const ENOJONA_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Para mi Enojona Favorita 😠 ❤️</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Outfit:wght@400;700;900&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
            background: #0a0514; 
            color: white; 
            font-family: 'Outfit', sans-serif; 
            height: 100vh; 
            overflow: hidden; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
        }

        .backdrop {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: radial-gradient(circle at center, #2d0a1a 0%, #05020a 100%);
            z-index: 0;
        }

        .scene {
            position: relative;
            z-index: 10;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            padding: 20px;
        }

        .envelope-wrapper {
            position: relative;
            cursor: pointer;
            perspective: 2000px;
            transition: transform 0.5s;
        }

        .envelope {
            width: 340px;
            height: 240px;
            background: #f44336; 
            position: relative;
            box-shadow: 0 20px 50px rgba(0,0,0,0.6);
            border-radius: 8px;
            transition: all 0.5s;
            border: 2px solid #d32f2f;
        }

        .envelope-top {
            position: absolute;
            top: 0; left: 0; width: 0; height: 0;
            border-left: 170px solid transparent;
            border-right: 170px solid transparent;
            border-top: 130px solid #d32f2f;
            transform-origin: top;
            transition: transform 0.6s 0.2s;
            z-index: 5;
        }

        .envelope.open .envelope-top { transform: rotateX(180deg); z-index: 0; }
        .envelope.open { background: #c62828; }

        .letter-container {
            position: absolute;
            bottom: 10px;
            left: 10px;
            width: 320px;
            height: 220px;
            background: white;
            z-index: 2;
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .envelope.open .letter-container {
            transform: translateY(-80px); /* Lower displacement to prevent opening "too high" */
            height: 480px;
            width: 340px;
            left: 0;
            z-index: 200;
            box-shadow: 0 40px 120px rgba(0,0,0,0.8);
        }

        .pages {
            width: calc({{total_pages}} * 100%); /* Dynamic width */
            height: 100%;
            display: flex;
            transition: transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1);
        }

        .page {
            width: calc(100% / {{total_pages}});
            height: 100%;
            padding: 30px 25px;
            color: #333;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
        }

        .page h2 { font-family: 'Dancing Script', cursive; color: #d32f2f; margin-bottom: 20px; font-size: 2.2rem; border-bottom: 2px solid #fce4ec; padding-bottom: 5px; text-align: center; }
        .page p { font-size: 1.15rem; line-height: 1.6; color: #444; font-weight: 600; margin-bottom: 20px; text-align: center; }
        
        .photo-area {
            width: 100%;
            border-radius: 15px;
            overflow: hidden;
            margin-bottom: 20px;
            border: 4px solid #fce4ec;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
            flex-shrink: 0;
        }
        .photo-area img { width: 100%; height: auto; display: block; }

        .nav-buttons {
            display: flex;
            justify-content: space-between;
            margin-top: auto;
            padding-top: 20px;
            gap: 15px;
        }

        .btn-page {
            padding: 12px 20px;
            background: #d32f2f;
            color: white;
            border: none;
            border-radius: 30px;
            font-size: 0.9rem;
            font-weight: 800;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 5px 15px rgba(211, 47, 47, 0.3);
            transition: all 0.3s;
        }
        .btn-page:hover { transform: scale(1.05); background: #f44336; }

        #intro-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: #0a0514;
            display: flex; flex-direction: column; justify-content: center; align-items: center;
            z-index: 5000; transition: all 1s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer;
        }
        #intro-overlay.hidden { opacity: 0; visibility: hidden; transform: scale(1.1); }

        .box-emoji { font-size: 130px; filter: drop-shadow(0 0 35px #f44336); animation: angry-shake 2.5s infinite; }
        @keyframes angry-shake {
            0%, 100% { transform: rotate(0); }
            10%, 30%, 50%, 70%, 90% { transform: rotate(-8deg); }
            20%, 40%, 60%, 80% { transform: rotate(8deg); }
        }

        .magic-item { position: fixed; top: -50px; pointer-events: none; z-index: 4000; animation: magic-fall linear forwards; }
        @keyframes magic-fall { to { transform: translateY(110vh) rotate(360deg); } }

        .audio-controls { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 380px; background: rgba(0, 0, 0, 0.9); backdrop-filter: blur(20px); padding: 15px 25px; border-radius: 40px; border: 1px solid rgba(255, 255, 255, 0.15); display: flex; align-items: center; gap: 15px; z-index: 1000; color: white; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .play-btn { width: 50px; height: 50px; background: #f44336; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; box-shadow: 0 0 15px rgba(244, 67, 54, 0.4); }
        .progress-bar-container { flex-grow: 1; height: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 4px; overflow: hidden; }
        .progress-bar { width: 0%; height: 100%; background: #f44336; transition: width 0.1s linear; }

        .sender-tag { font-weight: 900; color: #d32f2f; margin-top: 15px; text-align: right; font-size: 1rem; text-transform: uppercase; letter-spacing: 1px; }

        @media (max-width: 500px) {
            .envelope { width: 300px; height: 210px; }
            .envelope-top { border-left-width: 150px; border-right-width: 150px; border-top-width: 115px; }
            .letter-container { width: 280px; height: 190px; }
            .envelope.open .letter-container { width: 320px; height: 450px; transform: translateY(-70px); }
            .box-emoji { font-size: 100px; }
        }
    </style>
</head>
<body>
    <div id="intro-overlay" onclick="openBox()">
        <div class="box-emoji">😠</div>
        <div style="color: white; font-size: 2.2rem; font-weight: 900; margin-top: 3rem; text-align: center; width: 85%;">¡Tengo una sorpresa para mi Enojona!</div>
        <div style="color: #f44336; letter-spacing: 6px; margin-top: 1.5rem; font-weight: 900; font-size: 1.1rem; animation: pulse 2s infinite;">TOCA PARA ABRIR ❤️</div>
    </div>

    <div class="backdrop"></div>
    
    <div class="scene">
        <div class="envelope-wrapper" onclick="toggleLetter()">
            <div class="envelope" id="envelope">
                <div class="envelope-top"></div>
                <div class="letter-container">
                    <div class="pages" id="pages">
                        {{dynamic_pages}}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="audio-controls" style="display: none;" id="audio-ui">
        <div class="play-btn" id="play-btn">
            <span id="play-icon" style="font-size: 1.2rem;">▶️</span><span id="pause-icon" style="display:none; font-size: 1.2rem;">||</span>
        </div>
        <div class="progress-bar-container"><div class="progress-bar" id="progress-bar"></div></div>
    </div>

    <audio id="bg-audio" src="{{audio_src}}" loop></audio>
    <div id="yt-player" style="position:fixed; opacity:0; pointer-events:none;"></div>

    <script>
        const hasAudio = '{{has_audio}}' === 'true';
        const youtubeId = "{{ youtube_id }}".replace(/[{}]/g, '');
        const totalPages = parseInt('{{total_pages}}') || 1;
        let audio = document.getElementById('bg-audio');
        let ytPlayer = null;
        let ytReady = false;

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
            const overlay = document.getElementById('intro-overlay');
            overlay.classList.add('hidden');
            setTimeout(() => { overlay.style.display = 'none'; }, 1000);

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
            startMagicalRain();

            setTimeout(() => {
                document.getElementById('envelope').classList.add('open');
            }, 1300);
        };

        function toggleLetter() {
            const env = document.getElementById('envelope');
            const isOpen = env.classList.toggle('open');
            if (!isOpen) {
                setTimeout(() => {
                    document.getElementById('pages').style.transform = 'translateX(0)';
                }, 500);
            }
        }

        window.goToPage = function(index, e) {
            if (e) e.stopPropagation();
            const pct = -(index * (100 / totalPages));
            document.getElementById('pages').style.transform = 'translateX(' + pct + '%)';
        }

        function startMagicalRain() {
            setInterval(() => {
                const p = document.createElement('div');
                p.className = 'magic-item';
                p.innerHTML = ['😠', '❤️', '✨', '😠', '✨'][Math.floor(Math.random()*5)];
                const startX = Math.random() * 100;
                const duration = 4 + Math.random() * 4;
                p.style.left = startX + 'vw';
                p.style.fontSize = (15 + Math.random() * 30) + 'px';
                p.style.animationDuration = duration + 's';
                p.style.opacity = 0.4 + Math.random() * 0.6;
                document.body.appendChild(p);
                setTimeout(() => p.remove(), duration * 1000);
            }, 300);
        }

        document.getElementById('play-btn').onclick = (e) => {
            e.stopPropagation();
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
