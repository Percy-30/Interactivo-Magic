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

        /* Hearts flow from top */
        .hearts-container {
            position: fixed;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            overflow: hidden;
        }

        .heart {
            position: absolute;
            color: var(--primary);
            opacity: 0.6;
            animation: fall linear infinite;
        }

        @keyframes fall {
            0% { transform: translateY(-50px) scale(0); opacity: 0; }
            30% { opacity: 0.8; }
            100% { transform: translateY(100vh) scale(1.2); opacity: 0; }
        }

        .header { text-align: center; margin-bottom: 2rem; position: relative; z-index: 10; }
        .header h1 { font-size: 2.2rem; font-weight: 900; margin: 0; }
        .header p { color: rgba(0,0,0,0.5); font-size: 1rem; margin-top: 0.5rem; }

        /* The Wheel - SVG Based for perfect alignment */
        .wheel-box {
            position: relative;
            width: 320px;
            height: 320px;
            z-index: 10;
        }

        .pointer {
            position: absolute;
            top: -15px;
            left: 50%;
            transform: translateX(-50%);
            width: 40px;
            height: 40px;
            background: var(--secondary);
            clip-path: polygon(50% 100%, 0% 50%, 50% 0%, 100% 50%);
            z-index: 100;
            border: 4px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        #wheel-svg {
            width: 100%;
            height: 100%;
            filter: drop-shadow(0 15px 35px rgba(255, 77, 148, 0.15));
            transition: transform 5s cubic-bezier(0.15, 0, 0.15, 1);
        }

        .dot { fill: #000; }
        .segment-path { stroke: white; stroke-width: 2; }
        .segment-text { font-family: 'Outfit', sans-serif; font-weight: 900; font-size: 16px; fill: #000; text-anchor: middle; }

        .wheel-center {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 70px;
            height: 70px;
            background: white;
            border-radius: 50%;
            z-index: 50;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .center-heart {
            animation: pulse-heart 1.5s ease-in-out infinite;
        }

        @keyframes pulse-heart {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        /* Controls */
        .spin-btn {
            margin-top: 3rem;
            background: black;
            color: white;
            padding: 1rem 3.5rem;
            border-radius: 50px;
            border: none;
            font-weight: 900;
            font-size: 1.1rem;
            cursor: pointer;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transition: transform 0.2s;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 100;
        }

        .spin-btn:active { transform: scale(0.95); }
        .spin-btn:disabled { opacity: 0.5; filter: grayscale(1); }

        /* Audio Player Bar */
        .audio-player-bar {
            position: fixed;
            bottom: 30px;
            width: 85%;
            max-width: 380px;
            background: white;
            padding: 12px 20px;
            border-radius: 50px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.08);
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 1000;
        }

        .play-pause-btn {
            width: 42px;
            height: 42px;
            background: var(--primary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: white;
            flex-shrink: 0;
        }

        .progress-container { flex-grow: 1; height: 4px; background: rgba(0,0,0,0.05); border-radius: 10px; overflow: hidden; }
        .progress-fill { height: 100%; background: var(--primary); width: 0%; }
        .time-label { font-size: 11px; font-weight: 900; color: rgba(0,0,0,0.3); min-width: 35px; }
        .audio-subtext { position: absolute; top: -22px; left: 50%; transform: translateX(-50%); font-size: 10px; font-weight: 900; color: var(--primary); text-transform: uppercase; letter-spacing: 2px; }

        /* Success Card */
        .success-screen {
            position: fixed;
            inset: 0;
            background: var(--bg);
            z-index: 5000;
            display: none;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            text-align: center;
            opacity: 0;
            transition: 0.8s opacity ease;
        }

        .success-screen.active { display: flex; opacity: 1; }

        .result-img-box {
            width: 180px;
            height: 180px;
            border-radius: 50%;
            border: 6px solid white;
            box-shadow: 0 15px 45px rgba(255, 77, 148, 0.2);
            margin-bottom: 2rem;
            overflow: hidden;
            background: white;
        }
        .result-img-box img { width: 100%; height: 100%; object-fit: cover; }

        /* Intro Section */
        #intro-splash {
            position: fixed;
            inset: 0;
            background: var(--bg);
            z-index: 9000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }
        #intro-splash.hide { opacity: 0; pointer-events: none; transition: 0.6s all ease; }

        .toast-msg {
            position: fixed;
            top: 25px;
            background: white;
            padding: 12px 25px;
            border-radius: 50px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            font-weight: 800;
            transform: translateY(-120px);
            transition: 0.5s transform cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: 6000;
        }
        .toast-msg.show { transform: translateY(0); }

    </style>
</head>
<body>
    <div id="intro-splash" onclick="beginAdventure()">
        <div style="font-size: 90px; animation: bounce 2.2s infinite;">🎡</div>
        <div style="font-size: 1.8rem; font-weight: 900; margin-top: 1.5rem;">ruleta del amor</div>
        <div style="color: var(--primary); font-weight: 900; letter-spacing: 4px; margin-top: 1rem; font-size: 0.8rem;">TOCA PARA EMPEZAR</div>
    </div>

    <div class="hearts-container" id="hearts-flow"></div>
    <div class="toast-msg" id="toast">¡ups! casi... intenta de nuevo ✨</div>

    <div class="header">
        <h1>{{name}}</h1>
        <p>✨ gira la ruleta y deja que el destino decida...</p>
    </div>

    <div class="wheel-box">
        <div class="pointer"></div>
        <div class="wheel-center">
            <span class="center-heart">💓</span>
        </div>
        <svg id="wheel-svg" viewBox="0 0 400 400">
            <g id="wheel-content" transform="translate(200, 200)">
                <!-- Generated by JS -->
            </g>
        </svg>
    </div>

    <button class="spin-btn" id="main-spin-btn" onclick="startSpin()">
        💘 Girar ✨
    </button>

    <div class="success-screen" id="success-screen">
        <div class="result-img-box">
            <img src="{{image_src}}" alt="Victory" onerror="this.parentElement.style.display='none'">
        </div>
        <div style="color: var(--primary); font-weight: 900; letter-spacing: 3px; margin-bottom: 0.5rem; font-size: 0.8rem;">DE: {{sender}}</div>
        <h2 style="font-size: 2.5rem; font-weight: 900; margin: 0 0 1rem;">{{extra_text}}</h2>
        <p style="font-size: 1.1rem; line-height: 1.6; color: rgba(0,0,0,0.6); max-width: 300px;">{{message}}</p>
        <div style="font-size: 3rem; margin-top: 2rem;">💖✨💍</div>
    </div>

    <div class="audio-player-bar" id="audio-panel" style="display: none;">
        <div class="audio-subtext">Tu Audio Mágico</div>
        <div class="play-pause-btn" id="audio-toggle">
            <span id="p-icon">▶</span>
            <span id="s-icon" style="display:none">||</span>
        </div>
        <div class="progress-container">
            <div class="progress-fill" id="a-progress"></div>
        </div>
        <div class="time-label" id="t-label">0:00</div>
    </div>

    <audio id="main-audio" src="{{audio_src}}" loop></audio>
    <div id="yt-hidden-box" style="display:none">
        <div id="yt-player-target"></div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <script>
        const sections = [
            { text: "No 💔", color: "#ff9aaf", win: false },
            { text: "No 💔", color: "#8de6ff", win: false },
            { text: "SÍ 💖", color: "#ffaf9a", win: true },
            { text: "No 💔", color: "#ffe69a", win: false },
            { text: "No 💔", color: "#af9aff", win: false },
            { text: "No 💔", color: "#faff8d", win: false },
            { text: "No 💔", color: "#8dffc4", win: false },
            { text: "SÍ 💖", color: "#ff8db4", win: true }
        ];

        const svgContent = document.getElementById('wheel-content');
        
        // Build the segments
        sections.forEach((s, i) => {
            const angle = 45;
            const startAngle = i * angle;
            const endAngle = (i + 1) * angle;
            const x1 = 180 * Math.cos(Math.PI * startAngle / 180);
            const y1 = 180 * Math.sin(Math.PI * startAngle / 180);
            const x2 = 180 * Math.cos(Math.PI * endAngle / 180);
            const y2 = 180 * Math.sin(Math.PI * endAngle / 180);
            
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", "M 0 0 L " + x1 + " " + y1 + " A 180 180 0 0 1 " + x2 + " " + y2 + " Z");
            path.setAttribute("fill", s.color);
            path.setAttribute("stroke", "white");
            path.setAttribute("stroke-width", "2");
            svgContent.appendChild(path);
            
            // Text alignment - rotated to stay centered in slice
            const textAngle = startAngle + angle / 2;
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            const trRad = 120;
            const tx = trRad * Math.cos(Math.PI * textAngle / 180);
            const ty = trRad * Math.sin(Math.PI * textAngle / 180);
            
            text.setAttribute("x", tx);
            text.setAttribute("y", ty);
            text.setAttribute("transform", "rotate(" + (textAngle) + "," + tx + "," + ty + ")");
            text.setAttribute("class", "segment-text");
            text.textContent = s.text;
            svgContent.appendChild(text);

            // Decorative Dot at the transition
            const dotAngle = endAngle;
            const dx = 180 * Math.cos(Math.PI * dotAngle / 180);
            const dy = 180 * Math.sin(Math.PI * dotAngle / 180);
            const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            dot.setAttribute("cx", dx);
            dot.setAttribute("cy", dy);
            dot.setAttribute("r", "5");
            dot.setAttribute("fill", "#000");
            svgContent.appendChild(dot);
        });

        // Background Hearts
        const flow = document.getElementById('hearts-flow');
        for(let j=0; j<15; j++) {
            const h = document.createElement('div');
            h.className = 'heart';
            h.innerHTML = '❤️';
            h.style.left = Math.random() * 100 + 'vw';
            h.style.animationDuration = (Math.random() * 5 + 5) + 's';
            h.style.animationDelay = (Math.random() * 5) + 's';
            h.style.fontSize = (Math.random() * 20 + 10) + 'px';
            flow.appendChild(h);
        }

        /* Audio Logic */
        const audio = document.getElementById('main-audio');
        const hasAudio = '{{has_audio}}' === 'true';
        let ytPlayer = null;
        let isStarted = false;

        function beginAdventure() {
            document.getElementById('intro-splash').classList.add('hide');
            if(hasAudio) {
                document.getElementById('audio-panel').style.display = 'flex';
                initializeAudio();
            }
            isStarted = true;
        }

        function initializeAudio() {
            const ytId = "{{youtube_id}}";
            if(ytId) {
                const tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                document.body.appendChild(tag);
                window.onYouTubeIframeAPIReady = () => {
                    ytPlayer = new YT.Player('yt-player-target', {
                        videoId: ytId, height: '0', width: '0',
                        playerVars: { autoplay: 1, loop: 1, playlist: ytId },
                        events: { 'onReady': () => audioUI(true) }
                    });
                };
            } else {
                audio.play().then(() => audioUI(true)).catch(() => {});
            }
        }

        function audioUI(on) {
            document.getElementById('p-icon').style.display = on ? 'none' : 'block';
            document.getElementById('s-icon').style.display = on ? 'block' : 'none';
        }

        document.getElementById('audio-toggle').onclick = () => {
            const isPlaying = document.getElementById('p-icon').style.display === 'none';
            if(isPlaying) {
                if(ytPlayer) ytPlayer.pauseVideo(); else audio.pause();
                audioUI(false);
            } else {
                if(ytPlayer) ytPlayer.playVideo(); else audio.play();
                audioUI(true);
            }
        };

        if(!("{{youtube_id}}")) {
            audio.ontimeupdate = () => {
                const p = (audio.currentTime / audio.duration) * 100;
                document.getElementById('a-progress').style.width = p + "%";
                const m = Math.floor(audio.currentTime / 60);
                const s = Math.floor(audio.currentTime % 60);
                document.getElementById('t-label').textContent = m + ":" + (s < 10 ? '0' : '') + s;
            };
        }

        /* Spin Execution */
        let spinCount = 0;
        let isBusy = false;

        function startSpin() {
            if(isBusy) return;
            isBusy = true;
            spinCount++;
            
            const btn = document.getElementById('main-spin-btn');
            const svg = document.getElementById('wheel-svg');
            const toast = document.getElementById('toast');
            
            btn.disabled = true;
            toast.classList.remove('show');

            let index;
            if(spinCount === 1) {
                // Land on NO (0,1,3,4,5,6)
                const options = [0, 1, 3, 4, 5, 6];
                index = options[Math.floor(Math.random() * options.length)];
            } else {
                // Land on SÍ (2, 7)
                const options = [2, 7];
                index = options[Math.floor(Math.random() * options.length)];
            }

            const win = sections[index].win;
            // Note: SVG rotation 0 is right. We want the pointer (top - 270deg) to point to the segment.
            // Segment i covers [i*45, (i+1)*45]. Center is i*45 + 22.5.
            // To point to it, the SVG needs to rotate to: 270 - (i*45 + 22.5)
            const target = (270 - (index * 45 + 22.5)) + (360 * (6 + spinCount));
            svg.style.transform = "rotate(" + target + "deg)";

            setTimeout(() => {
                if(win) {
                    showVictory();
                } else {
                    toast.classList.add('show');
                    btn.disabled = false;
                    btn.innerHTML = "💘 Reintentar ✨";
                    isBusy = false;
                    setTimeout(() => toast.classList.remove('show'), 3000);
                }
            }, 5500);
        }

        function showVictory() {
            const end = Date.now() + 5000;
            const colors = ['#ff4d94', '#4db8ff', '#ffffff'];
            (function f() {
                confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: colors });
                confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: colors });
                if(Date.now() < end) requestAnimationFrame(f);
            })();
            document.getElementById('success-screen').classList.add('active');
        }
    </script>
</body>
</html>`;
