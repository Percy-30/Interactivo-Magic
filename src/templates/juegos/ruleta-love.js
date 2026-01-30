export const RULETA_LOVE_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¿Quieres ser mi novia? 💖 - {{name}}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        
        :root {
            --primary: #ff4d94;
            --secondary: #4db8ff;
            --bg: #fff5f8;
            --text: #000000;
        }

        body { 
            margin: 0; 
            background: var(--bg); 
            color: var(--text); 
            font-family: 'Outfit', sans-serif; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center; 
            min-height: 100vh; 
            overflow: hidden;
            padding: 20px;
        }

        /* Hearts flow */
        .hearts-layer {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none;
            z-index: 0;
        }
        .falling-heart {
            position: absolute;
            animation: fall-vertical linear infinite;
        }
        @keyframes fall-vertical {
            0% { transform: translateY(-50px) scale(0.5); opacity: 0; }
            20% { opacity: 0.7; }
            100% { transform: translateY(110vh) scale(1.2); opacity: 0; }
        }

        .container {
            position: relative;
            z-index: 10;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
        }

        .title-group { text-align: center; margin-bottom: 2rem; }
        .title-group h1 { font-size: 2.22rem; font-weight: 900; margin: 0; letter-spacing: -0.5px; }
        .title-group p { color: rgba(0,0,0,0.4); font-size: 1rem; margin-top: 5px; }

        /* The Perfect Wheel */
        .wheel-wrap {
            position: relative;
            width: 320px;
            height: 320px;
            background: white;
            border-radius: 50%;
            box-shadow: 0 20px 60px rgba(255, 77, 148, 0.1);
        }

        /* Pointer - Improved Blue Diamond */
        .pointer-top {
            position: absolute;
            top: -18px;
            left: 50%;
            transform: translateX(-50%);
            width: 44px;
            height: 44px;
            z-index: 100;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));
        }

        #wheel-svg {
            width: 100%;
            height: 100%;
            transition: transform 5s cubic-bezier(0.15, 0, 0.15, 1);
        }

        .center-circle {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 80px;
            height: 80px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 50;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        }

        .pulse-heart {
            font-size: 2rem;
            animation: heart-beat 1.5s ease-in-out infinite;
        }
        @keyframes heart-beat {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.15); }
        }

        /* Labels & Dots */
        .segment { stroke: white; stroke-width: 4; }
        .segment-label { font-family: 'Outfit', sans-serif; font-weight: 900; font-size: 14px; fill: #000; letter-spacing: 0.5px; }

        /* Button */
        .spin-trigger {
            margin-top: 3.5rem;
            background: black;
            color: white;
            padding: 1rem 4rem;
            border-radius: 50px;
            border: none;
            font-size: 1.2rem;
            font-weight: 900;
            cursor: pointer;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            transition: transform 0.2s;
        }
        .spin-trigger:active { transform: scale(0.95); }
        .spin-trigger:disabled { opacity: 0.5; filter: grayscale(1); }

        /* Success Card */
        .win-screen {
            position: fixed;
            inset: 0;
            background: rgba(255, 245, 248, 0.98);
            z-index: 6000;
            display: none;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            text-align: center;
            opacity: 0;
            transition: 0.8s all ease;
        }
        .win-screen.show { display: flex; opacity: 1; }

        .win-photo {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            border: 8px solid white;
            box-shadow: 0 20px 50px rgba(255, 77, 148, 0.2);
            margin-bottom: 2rem;
            object-fit: cover;
        }

        /* Player Bar */
        .audio-bar {
            position: fixed;
            bottom: 35px;
            width: 85%;
            max-width: 400px;
            background: white;
            padding: 12px 25px;
            border-radius: 50px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.06);
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 1000;
        }
        .play-pause {
            width: 45px; height: 45px;
            background: var(--primary);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            color: white; cursor: pointer;
        }
        .progress-track { flex-grow: 1; height: 4px; background: rgba(0,0,0,0.05); border-radius: 10px; overflow: hidden; }
        .progress-bar { height: 100%; background: var(--primary); width: 0%; }
        .player-label { position: absolute; top: -22px; left: 50%; transform: translateX(-50%); font-size: 10px; font-weight: 900; color: var(--primary); text-transform: uppercase; letter-spacing: 2px; }

        /* Splash */
        #splash {
            position: fixed;
            inset: 0;
            background: var(--bg);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }
        #splash.hide { opacity: 0; pointer-events: none; transition: 0.8s opacity ease; }

        .toast {
            position: fixed;
            top: 30px;
            background: white;
            padding: 15px 35px;
            border-radius: 50px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            font-weight: 900;
            transform: translateY(-150px);
            transition: 0.5s transform cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: 9000;
        }
        .toast.visible { transform: translateY(0); }
    </style>
</head>
<body>
    <div id="splash" onclick="unlock()">
        <div style="font-size: 100px; animation: bounce 2s infinite;">🎡</div>
        <div style="font-size: 2.2rem; font-weight: 900; margin-top: 1.5rem;">ruleta del amor</div>
        <div style="color: var(--primary); font-weight: 900; letter-spacing: 4px; margin-top: 1.2rem; font-size: 0.8rem;">TOCA PARA EMPEZAR</div>
    </div>

    <div class="hearts-layer" id="hearts-flow"></div>
    <div class="toast" id="info-toast">¡ups! casi... intenta de nuevo ✨</div>

    <div class="container">
        <div class="title-group">
            <h1>{{name}}</h1>
            <p>✨ gira la ruleta y deja que el destino decida...</p>
        </div>

        <div class="wheel-wrap">
            <div class="pointer-top">
                <svg viewBox="0 0 44 44">
                    <path d="M 22 44 L 0 22 L 22 0 L 44 22 Z" fill="#4db8ff" stroke="white" stroke-width="4"/>
                </svg>
            </div>
            <div class="center-circle">
                <span class="pulse-heart">💓</span>
            </div>
            <svg id="wheel-svg" viewBox="0 0 400 400">
                <g id="svg-root" transform="translate(200, 200)">
                    <!-- Content built by JS -->
                </g>
            </svg>
        </div>

        <button class="spin-trigger" id="spin-btn" onclick="fireSpin()">
            <span>💘 Girar</span> ✨
        </button>
        <div style="margin-top: 0.8rem; font-size: 10px; font-weight: 900; color: var(--primary); text-transform: uppercase; letter-spacing: 2px;">TU AUDIO MÁGICO</div>
    </div>

    <div class="win-screen" id="win-screen">
        <img src="{{image_src}}" class="win-photo" alt="Success" onerror="this.style.display='none'">
        <div style="color: var(--primary); font-weight: 900; letter-spacing: 3px; font-size: 0.8rem; margin-bottom: 0.5rem;">DE: {{sender}}</div>
        <h2 style="font-size: 2.6rem; font-weight: 900; margin: 0 0 1rem;">{{extra_text}}</h2>
        <p style="font-size: 1.15rem; color: rgba(0,0,0,0.6); max-width: 320px; line-height: 1.7;">{{message}}</p>
        <div style="font-size: 3.5rem; margin-top: 2.5rem;">💖✨💍</div>
    </div>

    <div class="audio-bar" id="player-bar" style="display: none;">
        <div class="play-pause" id="audio-btn">
            <span id="p-ic">▶</span>
            <span id="s-ic" style="display:none">||</span>
        </div>
        <div class="progress-track">
            <div class="progress-bar" id="p-bar"></div>
        </div>
        <div style="font-size: 12px; font-weight: 900; color: rgba(0,0,0,0.3); min-width: 35px;" id="time-txt">0:00</div>
    </div>

    <audio id="native-player" src="{{audio_src}}" loop></audio>
    <div id="yt-container" style="display:none">
        <div id="yt-frame"></div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <script>
        const config = [
            { txt: "No 💔", color: "#ff9aaf", win: false },
            { txt: "No 💔", color: "#8de6ff", win: false },
            { txt: "SÍ 💖", color: "#ffaf9a", win: true },
            { txt: "No 💔", color: "#ffe69a", win: false },
            { txt: "No 💔", color: "#af9aff", win: false },
            { txt: "No 💔", color: "#faff8d", win: false },
            { txt: "No 💔", color: "#8dffc4", win: false },
            { txt: "SÍ 💖", color: "#ff8db4", win: true }
        ];

        const rootGroup = document.getElementById('svg-root');

        config.forEach((s, i) => {
            const startAngle = i * 45;
            const endAngle = (i + 1) * 45;
            
            const r = 180;
            const x1 = r * Math.cos(Math.PI * startAngle / 180);
            const y1 = r * Math.sin(Math.PI * startAngle / 180);
            const x2 = r * Math.cos(Math.PI * endAngle / 180);
            const y2 = r * Math.sin(Math.PI * endAngle / 180);
            
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", "M 0 0 L " + x1 + " " + y1 + " A " + r + " " + r + " 0 0 1 " + x2 + " " + y2 + " Z");
            path.setAttribute("fill", s.color);
            path.setAttribute("class", "segment");
            rootGroup.appendChild(path);

            const textAngle = startAngle + 22.5;
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            const tr = 115;
            const tx = tr * Math.cos(Math.PI * textAngle / 180);
            const ty = tr * Math.sin(Math.PI * textAngle / 180);
            
            text.setAttribute("x", tx);
            text.setAttribute("y", ty);
            text.setAttribute("transform", "rotate(" + (textAngle + 90) + "," + tx + "," + ty + ")");
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("class", "segment-label");
            text.textContent = s.txt;
            rootGroup.appendChild(text);

            const dotX = r * Math.cos(Math.PI * startAngle / 180);
            const dotY = r * Math.sin(Math.PI * startAngle / 180);
            const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            dot.setAttribute("cx", dotX);
            dot.setAttribute("cy", dotY);
            dot.setAttribute("r", "5");
            dot.setAttribute("fill", "#000");
            rootGroup.appendChild(dot);
        });

        const lastDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        const lx = 180 * Math.cos(Math.PI * 360 / 180);
        const ly = 180 * Math.sin(Math.PI * 360 / 180);
        lastDot.setAttribute("cx", lx);
        lastDot.setAttribute("cy", ly);
        lastDot.setAttribute("r", "5");
        lastDot.setAttribute("fill", "#000");
        rootGroup.appendChild(lastDot);

        const flow = document.getElementById('hearts-flow');
        for(let i=0; i<12; i++) {
            const h = document.createElement('div');
            h.className = 'falling-heart';
            h.innerHTML = '❤️';
            h.style.left = Math.random() * 100 + 'vw';
            h.style.animationDuration = (Math.random() * 5 + 5) + 's';
            h.style.animationDelay = (Math.random() * 5) + 's';
            h.style.fontSize = (Math.random() * 20 + 10) + 'px';
            flow.appendChild(h);
        }

        const native = document.getElementById('native-player');
        let yt = null;

        function unlock() {
            document.getElementById('splash').classList.add('hide');
            if('{{has_audio}}' === 'true') {
                document.getElementById('player-bar').style.display = 'flex';
                playMusic();
            }
        }

        function playMusic() {
            const yId = "{{youtube_id}}";
            if(yId) {
                const s = document.createElement('script');
                s.src = "https://www.youtube.com/iframe_api";
                document.body.appendChild(s);
                window.onYouTubeIframeAPIReady = () => {
                    yt = new YT.Player('yt-frame', {
                        videoId: yId, height: '0', width: '0',
                        playerVars: { autoplay: 1, loop: 1, playlist: yId },
                        events: { 'onReady': () => uiState(true) }
                    });
                };
            } else {
                native.play().then(() => uiState(true)).catch(() => {});
            }
        }

        function uiState(on) {
            document.getElementById('p-ic').style.display = on ? 'none' : 'block';
            document.getElementById('s-ic').style.display = on ? 'block' : 'none';
        }

        document.getElementById('audio-btn').onclick = () => {
            const active = document.getElementById('p-ic').style.display === 'none';
            if(active) {
                if(yt) yt.pauseVideo(); else native.pause();
                uiState(false);
            } else {
                if(yt) yt.playVideo(); else native.play();
                uiState(true);
            }
        };

        if(!("{{youtube_id}}")) {
            native.ontimeupdate = () => {
                const p = (native.currentTime / native.duration) * 100;
                document.getElementById('p-bar').style.width = p + "%";
                const m = Math.floor(native.currentTime / 60);
                const s = Math.floor(native.currentTime % 60);
                document.getElementById('time-txt').textContent = m + ":" + (s < 10 ? '0' : '') + s;
            };
        }

        let spinNum = 0;
        let busy = false;

        function fireSpin() {
            if(busy) return;
            busy = true;
            spinNum++;
            
            const btn = document.getElementById('spin-btn');
            const svg = document.getElementById('wheel-svg');
            const toast = document.getElementById('info-toast');
            
            btn.disabled = true;
            toast.classList.remove('visible');

            let winIdx;
            if(spinNum === 1) winIdx = [0,1,3,4,5,6][Math.floor(Math.random() * 6)];
            else winIdx = [2,7][Math.floor(Math.random() * 2)];

            const finalAng = (270 - (winIdx * 45 + 22.5)) + (360 * (6 + spinNum));
            svg.style.transform = "rotate(" + finalAng + "deg)";

            setTimeout(() => {
                if(config[winIdx].win) {
                    doSuccess();
                } else {
                    toast.classList.add('visible');
                    btn.disabled = false;
                    btn.innerHTML = "<span>💘 Reintentar</span> ✨";
                    busy = false;
                    setTimeout(() => toast.classList.remove('visible'), 3000);
                }
            }, 5500);
        }

        function doSuccess() {
            const finish = Date.now() + 5000;
            const pal = ['#ff4d94', '#4db8ff', '#ffffff'];
            (function r() {
                confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors: pal });
                confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors: pal });
                if(Date.now() < finish) requestAnimationFrame(r);
            })();
            document.getElementById('win-screen').classList.add('show');
        }
    </script>
</body>
</html>`;
