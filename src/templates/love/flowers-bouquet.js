export const FLOWERS_BOUQUET_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Un Ramo para Ti, {{name}}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Outfit:wght@400;700;900&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
            background: #000; 
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
            background: radial-gradient(circle at center, #1a050d 0%, #000 100%);
            z-index: 0;
        }

        .bouquet-scene {
            position: relative;
            width: 100%;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: center;
            z-index: 10;
        }

        .header-text {
            position: absolute;
            top: 40px;
            text-align: center;
            z-index: 50;
        }

        .header-text h1 {
            font-size: 2.8rem;
            font-weight: 900;
            color: #ffd700;
            text-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
            letter-spacing: 5px;
        }

        .flowers-container {
            position: absolute;
            bottom: -20px;
            width: 100%;
            max-width: 600px;
            height: 85vh;
            display: flex;
            justify-content: center;
            align-items: flex-end;
            z-index: 20;
            pointer-events: none;
        }

        .flower {
            position: absolute;
            bottom: 0px;
            left: 50%;
            transform-origin: bottom center;
            /* Use custom properties to not override rotate in animation */
            transform: translate(-50%, 0) rotate(var(--angle)) scale(var(--scale));
            animation: sway 6s ease-in-out infinite alternate;
            animation-delay: var(--delay);
        }

        @keyframes sway {
            0% { transform: translate(-50%, 0) rotate(calc(var(--angle) - 4deg)) scale(var(--scale)); }
            100% { transform: translate(-50%, 0) rotate(calc(var(--angle) + 4deg)) scale(var(--scale)); }
        }

        .flower-head {
            width: 110px; height: 110px;
            position: relative;
            clip-path: polygon(50% 0%, 58% 12%, 75% 6%, 79% 21%, 94% 25%, 90% 42%, 100% 50%, 90% 58%, 94% 75%, 79% 79%, 75% 94%, 58% 88%, 50% 100%, 42% 88%, 25% 94%, 21% 79%, 6% 75%, 10% 58%, 0% 50%, 10% 42%, 6% 25%, 21% 21%, 25% 6%, 42% 12%);
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .heart-svg {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 45px; height: 45px;
            fill: #ff0000;
            z-index: 10;
            filter: drop-shadow(0 2px 5px rgba(0,0,0,0.4));
        }

        .stem {
            width: 10px;
            background: linear-gradient(to right, #1b5e20, #2e7d32, #1b5e20);
            margin: 0 auto;
            border-radius: 5px;
            box-shadow: 2px 0 10px rgba(0,0,0,0.3);
        }

        .leaf {
            position: absolute;
            width: 45px; height: 25px;
            background: #2e7d32;
            border-radius: 60% 0;
            z-index: -1;
            box-shadow: inset 2px 2px 5px rgba(0,0,0,0.2);
        }

        .envelope-wrapper {
            position: absolute;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 100;
            cursor: pointer;
            perspective: 1000px;
        }

        .envelope {
            width: 300px; height: 200px;
            background: #fff59d;
            position: relative;
            box-shadow: 0 30px 60px rgba(0,0,0,0.8);
            border-radius: 5px;
            border: 1px solid #fbc02d;
        }

        .envelope-top {
            position: absolute;
            top: 0; left: 0; width: 0; height: 0;
            border-left: 150px solid transparent;
            border-right: 150px solid transparent;
            border-top: 100px solid #fdd835;
            transform-origin: top;
            transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 5;
        }

        .envelope.open .envelope-top { transform: rotateX(180deg); z-index: 0; }

        .letter {
            position: absolute;
            bottom: 5px; left: 10px;
            width: 280px; height: 190px;
            background: white;
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 2;
            padding: 25px;
            color: #333;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            overflow-y: auto;
        }

        .envelope.open .letter { 
            transform: translateY(-160px); 
            height: auto; 
            max-height: 450px; 
            z-index: 200; 
            box-shadow: 0 40px 100px rgba(0,0,0,0.9); 
            width: 340px; 
            left: -20px;
        }

        .letter h2 { font-family: 'Dancing Script', cursive; color: #ad1457; font-size: 2.2rem; margin-bottom: 15px; border-bottom: 2px solid #fce4ec; }
        .letter p { font-size: 1.2rem; line-height: 1.6; color: #444; font-weight: 600; }
        .sender-tag { color: #ff4081; font-weight: 800; text-align: right; margin-top: 20px; font-size: 0.9rem; text-transform: uppercase; }

        .extra-photo { width: 100%; border-radius: 12px; margin-top: 20px; display: {{image_display}}; border: 4px solid #fce4ec; }

        #intro-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: #000; display: flex; flex-direction: column; justify-content: center; align-items: center;
            z-index: 5000; transition: all 0.8s ease; cursor: pointer;
        }

        #intro-overlay.hidden { opacity: 0; visibility: hidden; }

        .audio-controls { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); width: 85%; max-width: 350px; background: rgba(0, 0, 0, 0.9); backdrop-filter: blur(15px); padding: 12px 20px; border-radius: 35px; border: 1px solid rgba(255, 255, 255, 0.1); display: flex; align-items: center; gap: 15px; z-index: 1000; color: white; }
        .play-btn { width: 45px; height: 45px; background: #ff4081; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; }
        .progress-bar-container { flex-grow: 1; height: 6px; background: rgba(255, 255, 255, 0.1); border-radius: 3px; overflow: hidden; }
        .progress-bar { width: 0%; height: 100%; background: #ff4081; }

        .magic-item { position: fixed; top: -50px; pointer-events: none; z-index: 4000; animation: magic-fall linear forwards; }
        @keyframes magic-fall { to { transform: translateY(110vh) rotate(360deg); } }

        @media (max-width: 500px) {
            .header-text h1 { font-size: 2rem; }
            .flowers-container { max-width: 450px; }
        }
    </style>
</head>
<body>
    <div id="intro-overlay" onclick="openBox()">
        <div style="font-size: 110px; filter: drop-shadow(0 0 30px #ff4081); animation: float 3s infinite;">💐</div>
        <div style="color: white; font-size: 2rem; font-weight: 900; margin-top: 3rem; text-align: center;">¡Un ramo para ti!</div>
        <div style="color: #ff4d94; letter-spacing: 5px; margin-top: 1.5rem; font-weight: 800; font-size: 1.1rem;">TOCA PARA RECIBIR ❤️</div>
    </div>

    <div class="backdrop"></div>
    
    <div class="bouquet-scene">
        <div class="header-text">
            <h1>TE AMO</h1>
        </div>

        <div class="envelope-wrapper" id="envWrap" onclick="toggleLetter()">
            <div class="envelope" id="envelope">
                <div class="envelope-top"></div>
                <div class="letter">
                    <h2>Para: {{name}}</h2>
                    <p>{{message}}</p>
                    <img src="{{image_src}}" class="extra-photo" onerror="this.style.display='none'">
                    <p style="margin-top: 15px; color: #ad1457; font-weight: 800; text-align: center;">{{extra_text}}</p>
                    <div class="sender-tag">De: {{sender}} ❤️</div>
                </div>
            </div>
        </div>

        <div class="flowers-container" id="bouquet"></div>
    </div>

    <div class="audio-controls" style="display: none;" id="audio-ui">
        <div class="play-btn" id="play-btn">
            <span id="play-icon">▶️</span><span id="pause-icon" style="display:none">||</span>
        </div>
        <div class="progress-bar-container"><div class="progress-bar" id="progress-bar"></div></div>
    </div>

    <audio id="bg-audio" src="{{audio_src}}" loop></audio>
    <div id="yt-player" style="position:fixed; opacity:0; pointer-events:none;"></div>

    <script>
        const hasAudio = '{{has_audio}}' === 'true';
        const youtubeId = "{{ youtube_id }}".replace(/[{}]/g, '');
        let audio = document.getElementById('bg-audio');
        let ytPlayer = null;

        window.onYouTubeIframeAPIReady = function() {
            if (youtubeId && youtubeId.length > 2) {
                ytPlayer = new YT.Player('yt-player', {
                    height: '0', width: '0', videoId: youtubeId,
                    playerVars: { 'autoplay': 0, 'controls': 0, 'loop': 1, 'playlist': youtubeId },
                    events: {
                        'onReady': () => { if(window.playOnReady) { ytPlayer.playVideo(); updateUI(true); } },
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
            setTimeout(() => overlay.style.display='none', 800);

            if (hasAudio) {
                document.getElementById('audio-ui').style.display = 'flex';
                if (ytPlayer) { ytPlayer.playVideo(); updateUI(true); } 
                else if (audio) { audio.play().catch(() => {}); updateUI(true); }
                else { window.playOnReady = true; }
            }
            createBouquet();
            startRain();
        };

        function toggleLetter() { document.getElementById('envelope').classList.toggle('open'); }

        function createBouquet() {
            const container = document.getElementById('bouquet');
            const colors = ['#ff4081', '#f06292', '#ffeb3b', '#4dd0e1', '#b39ddb', '#ffffff', '#81c784'];
            const count = 30;

            for (let i = 0; i < count; i++) {
                const f = document.createElement('div');
                f.className = 'flower';
                
                // Spread 150 degrees
                const angle = (i / count) * 150 - 75;
                const dist = 320 + Math.random() * 280;
                const scale = 0.6 + Math.random() * 0.5;
                const delay = (Math.random() * -5) + 's';
                
                f.style.setProperty('--angle', angle + 'deg');
                f.style.setProperty('--scale', scale);
                f.style.setProperty('--delay', delay);

                const color = colors[Math.floor(Math.random() * colors.length)];
                
                let flowerHtml = '<div class="stem" style="height: ' + dist + 'px; position: relative;">';
                for(let j=0; j<3; j++) {
                    const leafY = 70 + Math.random() * (dist - 140);
                    const isRight = Math.random() > 0.5;
                    const leafRot = isRight ? 40 : -40;
                    flowerHtml += '<div class="leaf" style="bottom:'+leafY+'px; left:50%; transform: rotate('+(isRight?0:180)+'deg) translateX('+(isRight?'-10px':'10px')+') rotate('+leafRot+'deg)"></div>';
                }
                flowerHtml += '</div>';
                flowerHtml += '<div class="flower-head" style="background:'+color+'; position: absolute; top:0; left:50%; transform: translate(-50%, -50%)">' +
                             '<svg class="heart-svg" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>' +
                             '</div>';
                f.innerHTML = flowerHtml;
                container.appendChild(f);
            }
        }

        function startRain() {
            setInterval(() => {
                const p = document.createElement('div');
                p.className = 'magic-item';
                p.innerHTML = ['🌸', '✨', '❤️', '🌺', '💖'][Math.floor(Math.random()*5)];
                p.style.left = Math.random() * 100 + 'vw';
                const dur = 5 + Math.random() * 4;
                p.style.animationDuration = dur + 's';
                document.body.appendChild(p);
                setTimeout(() => p.remove(), dur * 1000);
            }, 300);
        }

        document.getElementById('play-btn').onclick = () => {
            if (ytPlayer) { if (ytPlayer.getPlayerState() === 1) ytPlayer.pauseVideo(); else ytPlayer.playVideo(); }
            else { if (audio.paused) audio.play(); else audio.pause(); }
        };
        if (audio) { audio.ontimeupdate = () => { document.getElementById('progress-bar').style.width = (audio.currentTime / audio.duration) * 100 + '%'; }; }
    </script>
</body>
</html>`;
