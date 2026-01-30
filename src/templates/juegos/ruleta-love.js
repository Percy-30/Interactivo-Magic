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

        /* Hearts background */
        .hearts-scene {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none;
            z-index: 0;
        }
        .h-particle {
            position: absolute;
            animation: fall-p linear infinite;
        }
        @keyframes fall-p {
            0% { transform: translateY(-50px) scale(0.5); opacity: 0; }
            20% { opacity: 0.6; }
            100% { transform: translateY(110vh) scale(1.5); opacity: 0; }
        }

        .main-container {
            position: relative;
            z-index: 10;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
        }

        .top-section { text-align: center; margin-bottom: 2rem; }
        .top-section h1 { font-size: 2.5rem; font-weight: 900; margin: 0; letter-spacing: -1px; }
        .top-section p { color: rgba(0,0,0,0.4); font-size: 1.1rem; margin-top: 5px; font-weight: 500; }

        /* The Roulette */
        .wheel-shell {
            position: relative;
            width: 320px;
            height: 320px;
            background: white;
            border-radius: 50%;
            box-shadow: 0 25px 60px rgba(255, 77, 148, 0.12);
        }

        .diamond-pointer {
            position: absolute;
            top: -18px;
            left: 50%;
            transform: translateX(-50%);
            width: 44px;
            height: 44px;
            z-index: 100;
            filter: drop-shadow(0 4px 10px rgba(0,0,0,0.15));
        }

        #the-svg {
            width: 100%;
            height: 100%;
            transition: transform 6s cubic-bezier(0.15, 0, 0, 1);
        }

        .rim-dot { fill: #000; transition: fill 0.3s ease; }
        .is-spinning .rim-dot {
            animation: dot-glow 0.8s infinite alternate;
        }
        @keyframes dot-glow {
            from { fill: #000; }
            to { fill: var(--primary); transform: scale(1.2); }
        }

        .center-portal {
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
            box-shadow: 0 5px 20px rgba(0,0,0,0.06);
        }

        .beating-heart {
            font-size: 2.2rem;
            animation: bpm 1.2s ease-in-out infinite;
        }
        @keyframes bpm {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.18); }
        }

        /* Buttons & Actions */
        .action-spin-btn {
            margin-top: 3.5rem;
            background: #000;
            color: #fff;
            padding: 1.1rem 4.5rem;
            border-radius: 60px;
            border: none;
            font-size: 1.3rem;
            font-weight: 900;
            cursor: pointer;
            box-shadow: 0 15px 35px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 15px;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .action-spin-btn:hover:not(:disabled) { transform: translateY(-5px); box-shadow: 0 20px 45px rgba(0,0,0,0.25); }
        .action-spin-btn:active:not(:disabled) { transform: scale(0.95); }
        .action-spin-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Professional Success UI */
        .premium-success {
            position: fixed;
            inset: 0;
            background: rgba(255, 255, 255, 0.4);
            backdrop-filter: blur(25px);
            z-index: 6000;
            display: none;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            text-align: center;
            opacity: 0;
            transition: 1s all ease;
        }
        .premium-success.active { display: flex; opacity: 1; }

        .glass-card {
            background: rgba(255, 255, 255, 0.8);
            border: 2px solid white;
            padding: 3rem 2rem;
            border-radius: 40px;
            box-shadow: 0 30px 80px rgba(255, 77, 148, 0.15);
            max-width: 420px;
            width: 90%;
            transform: translateY(50px);
            transition: 1s transform cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .premium-success.active .glass-card { transform: translateY(0); }

        .victory-photo {
            width: 190px;
            height: 190px;
            border-radius: 50%;
            border: 8px solid #fff;
            box-shadow: 0 20px 50px rgba(255, 77, 148, 0.25);
            margin-bottom: 2.5rem;
            object-fit: cover;
            animation: rotate-slow 20s linear infinite;
        }
        @keyframes rotate-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .success-title { font-size: 2.4rem; font-weight: 900; margin: 0 0 1rem; color: #000; line-height: 1.1; }
        .success-desc { font-size: 1.1rem; color: rgba(0,0,0,0.6); line-height: 1.8; margin-bottom: 2rem; font-weight: 500; }

        /* Toast */
        .clean-toast {
            position: fixed;
            top: 30px;
            background: #fff;
            padding: 14px 35px;
            border-radius: 50px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.12);
            font-weight: 900;
            transform: translateY(-160px);
            transition: 0.6s transform cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: 9999;
        }
        .clean-toast.show { transform: translateY(0); }

        /* Audio HUD */
        .audio-hud {
            position: fixed;
            bottom: 40px;
            width: 85%;
            max-width: 400px;
            background: #fff;
            padding: 12px 25px;
            border-radius: 35px;
            box-shadow: 0 10px 45px rgba(0,0,0,0.06);
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 1000;
            border: 1px solid rgba(0,0,0,0.03);
        }
        .play-toggle {
            width: 48px; height: 48px;
            background: var(--primary);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            color: white; cursor: pointer; font-size: 1.2rem;
            box-shadow: 0 5px 15px rgba(255, 77, 148, 0.3);
        }
        .track-bg { flex-grow: 1; height: 6px; background: rgba(0,0,0,0.05); border-radius: 10px; overflow: hidden; }
        .track-fill { height: 100%; background: var(--primary); width: 0%; border-radius: 10px; }
        .hud-label { position: absolute; top: -22px; left: 50%; transform: translateX(-50%); font-size: 10px; font-weight: 900; color: var(--primary); text-transform: uppercase; letter-spacing: 3px; }

        /* Splash */
        #splash-wall {
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
        #splash-wall.fade { opacity: 0; pointer-events: none; transition: 1s all ease; }
    </style>
</head>
<body>
    <div id="splash-wall" onclick="ignite()">
        <div style="font-size: 110px; animation: bounce 2s infinite;">🎡</div>
        <div style="font-size: 2.2rem; font-weight: 900; margin-top: 2rem;">ruleta del amor</div>
        <div style="color: var(--primary); font-weight: 900; letter-spacing: 5px; margin-top: 1.5rem; font-size: 0.9rem;">TOCA PARA EMPEZAR</div>
    </div>

    <div class="hearts-scene" id="h-flow"></div>
    <div class="clean-toast" id="toast-notif">¡ups! casi... intenta de nuevo ✨</div>

    <div class="main-container">
        <div class="top-section">
            <h1>{{name}}</h1>
            <p>✨ gira la ruleta y deja que el destino decida...</p>
        </div>

        <div class="wheel-shell" id="wheel-shell">
            <div class="diamond-pointer">
                <svg viewBox="0 0 44 44">
                    <path d="M 22 44 L 0 22 L 22 0 L 44 22 Z" fill="#4db8ff" stroke="white" stroke-width="4"/>
                </svg>
            </div>
            <div class="center-portal">
                <span class="beating-heart">💓</span>
            </div>
            <svg id="the-svg" viewBox="0 0 400 400">
                <g id="svg-inner" transform="translate(200, 200)">
                    <!-- Content by JS -->
                </g>
            </svg>
        </div>

        <button class="action-spin-btn" id="spin-master-btn" onclick="triggerSpin()">
            <span>💘 Girar</span> ✨
        </button>
        <div style="margin-top: 1rem; font-size: 11px; font-weight: 900; color: var(--primary); text-transform: uppercase; letter-spacing: 3px; opacity: 0.6;">TU AUDIO MÁGICO</div>
    </div>

    <div class="premium-success" id="success-view">
        <div class="glass-card">
            <img src="{{image_src}}" class="victory-photo" alt="Wedding" onerror="this.style.display='none'">
            <div style="color: var(--primary); font-weight: 900; letter-spacing: 4px; font-size: 0.8rem; margin-bottom: 0.8rem; text-transform: uppercase;">DE: {{sender}}</div>
            <h2 class="success-title">{{extra_text}}</h2>
            <p class="success-desc">{{message}}</p>
            <div style="font-size: 3.5rem; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));">💖✨💍</div>
        </div>
    </div>

    <div class="audio-hud" id="hud-panel" style="display: none;">
        <div class="hud-label">Sintiendo la música</div>
        <div class="play-toggle" id="hud-btn">
            <span id="p-ic">▶</span>
            <span id="s-ic" style="display:none">||</span>
        </div>
        <div class="track-bg">
            <div class="track-fill" id="t-progress"></div>
        </div>
        <div style="font-size: 13px; font-weight: 900; color: rgba(0,0,0,0.2); min-width: 35px;" id="t-time">0:00</div>
    </div>

    <audio id="core-player" src="{{audio_src}}" loop></audio>
    <div id="yt-ghost-box" style="display:none"><div id="yt-instance"></div></div>

    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <script>
        const slices = [
            { t: "No 💔", c: "#ff9aaf", w: false },
            { t: "No 💔", c: "#8de6ff", w: false },
            { t: "SÍ 💖", c: "#ffaf9a", w: true },
            { t: "No 💔", c: "#ffe69a", w: false },
            { t: "No 💔", c: "#af9aff", w: false },
            { t: "No 💔", c: "#faff8d", w: false },
            { t: "No 💔", c: "#8dffc4", w: false },
            { t: "SÍ 💖", c: "#ff8db4", w: true }
        ];

        const inner = document.getElementById('svg-inner');

        slices.forEach((s, i) => {
            const sAng = i * 45;
            const eAng = (i + 1) * 45;
            const r = 180;
            const x1 = r * Math.cos(Math.PI * sAng / 180);
            const y1 = r * Math.sin(Math.PI * sAng / 180);
            const x2 = r * Math.cos(Math.PI * eAng / 180);
            const y2 = r * Math.sin(Math.PI * eAng / 180);
            
            const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
            p.setAttribute("d", "M 0 0 L " + x1 + " " + y1 + " A " + r + " " + r + " 0 0 1 " + x2 + " " + y2 + " Z");
            p.setAttribute("fill", s.c);
            p.setAttribute("stroke", "white");
            p.setAttribute("stroke-width", "4");
            inner.appendChild(p);

            const tAng = sAng + 22.5;
            const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
            const tr = 115;
            const tx = tr * Math.cos(Math.PI * tAng / 180);
            const ty = tr * Math.sin(Math.PI * tAng / 180);
            
            txt.setAttribute("x", tx);
            txt.setAttribute("y", ty);
            txt.setAttribute("transform", "rotate(" + (tAng + 90) + "," + tx + "," + ty + ")");
            txt.setAttribute("text-anchor", "middle");
            txt.setAttribute("class", "segment-label");
            txt.style.fontWeight = "900";
            txt.style.fontSize = "15px";
            txt.textContent = s.t;
            inner.appendChild(txt);

            // Rim Dots
            const dx = r * Math.cos(Math.PI * sAng / 180);
            const dy = r * Math.sin(Math.PI * sAng / 180);
            const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            dot.setAttribute("cx", dx);
            dot.setAttribute("cy", dy);
            dot.setAttribute("r", "6");
            dot.setAttribute("class", "rim-dot");
            inner.appendChild(dot);
        });

        // Closure dot
        const lDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        lDot.setAttribute("cx", 180); lDot.setAttribute("cy", 0);
        lDot.setAttribute("r", "6"); lDot.setAttribute("class", "rim-dot");
        inner.appendChild(lDot);

        const flow = document.getElementById('h-flow');
        for(let i=0; i<15; i++) {
            const h = document.createElement('div');
            h.className = 'falling-heart';
            h.innerHTML = '❤️';
            h.style.left = Math.random() * 100 + 'vw';
            h.style.animationDuration = (Math.random() * 6 + 6) + 's';
            h.style.animationDelay = (Math.random() * 5) + 's';
            h.style.fontSize = (Math.random() * 20 + 10) + 'px';
            h.className = 'h-particle';
            flow.appendChild(h);
        }

        const player = document.getElementById('core-player');
        let ytObj = null;

        function ignite() {
            document.getElementById('splash-wall').classList.add('fade');
            if('{{has_audio}}' === 'true') {
                document.getElementById('hud-panel').style.display = 'flex';
                streamMusic();
            }
        }

        function streamMusic() {
            const yId = "{{youtube_id}}";
            if(yId) {
                const s = document.createElement('script');
                s.src = "https://www.youtube.com/iframe_api";
                document.body.appendChild(s);
                window.onYouTubeIframeAPIReady = () => {
                    ytObj = new YT.Player('yt-instance', {
                        videoId: yId, height: '0', width: '0',
                        playerVars: { autoplay: 1, loop: 1, playlist: yId },
                        events: { 'onReady': () => setUI(true) }
                    });
                };
            } else {
                player.play().then(() => setUI(true)).catch(() => {});
            }
        }

        function setUI(play) {
            document.getElementById('p-ic').style.display = play ? 'none' : 'block';
            document.getElementById('s-ic').style.display = play ? 'block' : 'none';
        }

        document.getElementById('hud-btn').onclick = () => {
            const isP = document.getElementById('p-ic').style.display === 'none';
            if(isP) {
                if(ytObj) ytObj.pauseVideo(); else player.pause();
                setUI(false);
            } else {
                if(ytObj) ytObj.playVideo(); else player.play();
                setUI(true);
            }
        };

        if(!("{{youtube_id}}")) {
            player.ontimeupdate = () => {
                const perc = (player.currentTime / player.duration) * 100;
                document.getElementById('t-progress').style.width = perc + "%";
                const mm = Math.floor(player.currentTime / 60);
                const ss = Math.floor(player.currentTime % 60);
                document.getElementById('t-time').textContent = mm + ":" + (ss<10?'0':'') + ss;
            };
        }

        let totalRot = 0;
        let count = 0;
        let acting = false;

        function triggerSpin() {
            if(acting) return;
            acting = true;
            count++;
            
            const btn = document.getElementById('spin-master-btn');
            const svg = document.getElementById('the-svg');
            const shell = document.getElementById('wheel-shell');
            const toast = document.getElementById('toast-notif');
            
            btn.disabled = true;
            toast.classList.remove('show');
            shell.classList.add('is-spinning');

            let wIdx;
            if(count === 1) wIdx = [0,1,3,4,5,6][Math.floor(Math.random() * 6)];
            else wIdx = [2,7][Math.floor(Math.random() * 2)];

            // Professional Physics: random spin within the winning segment for "Professional feel"
            // Rot 0 is RIGHT. Pointer is TOP (270deg).
            // Segment i center is i*45 + 22.5. We add a small random jitter within the segment (+/- 15 deg)
            const jitter = (Math.random() * 30) - 15;
            const targetAng = (270 - (wIdx * 45 + 22.5 + jitter));
            
            // Professional Logic: Always do at least 6 FULL rotations relative to CURRENT position
            // So if totalRot is 2000, we go to at least 2000 + (360 * 6) + targetAng
            const extraSpins = 360 * (7 + Math.floor(Math.random() * 3));
            totalRot = (Math.floor(totalRot / 360) * 360) + extraSpins + targetAng;
            
            svg.style.transform = "rotate(" + totalRot + "deg)";

            setTimeout(() => {
                shell.classList.remove('is-spinning');
                if(slices[wIdx].w) {
                    revealSuccess();
                } else {
                    toast.classList.add('show');
                    btn.disabled = false;
                    btn.innerHTML = "<span>💘 Reintentar</span> ✨";
                    acting = false;
                    setTimeout(() => toast.classList.remove('show'), 3500);
                }
            }, 6200);
        }

        function revealSuccess() {
            const stop = Date.now() + 6000;
            const colors = ['#ff4d94', '#4db8ff', '#ffffff', '#ffdf8d'];
            (function r() {
                confetti({ particleCount: 5, angle: 60, spread: 65, origin: { x: 0 }, colors: colors });
                confetti({ particleCount: 5, angle: 120, spread: 65, origin: { x: 1 }, colors: colors });
                if(Date.now() < stop) requestAnimationFrame(r);
            })();
            document.getElementById('success-view').classList.add('active');
        }
    </script>
</body>
</html>`;
