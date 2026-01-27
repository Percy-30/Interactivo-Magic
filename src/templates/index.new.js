// ===================================
// INTERACTIVO MAGIC - TEMPLATES INDEX
// Modular Structure for Better Maintenance
// ===================================

// === LOVE CATEGORY ===
import { GALAXY_TEMPLATE } from './love/galaxy.js';
import { LOVE_TEMPLATE } from './love/love-proposal.js';

// === FUN CATEGORY ===
import { MARVEL_BOOK_TEMPLATE } from './fun/marvel-book.js';

// === SPECIALIZED VARIANTS ===
// (Mantenemos temporalmente las variantes en lÃ­nea hasta migrarlas)

export { GALAXY_TEMPLATE, LOVE_TEMPLATE, MARVEL_BOOK_TEMPLATE };

// ==================================
// BOOK LOVE TEMPLATE
// ==================================
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
        
        .page { width: 100%; height: 100%; position: absolute; top: 0; left: 0; transform-origin: left; transform-style: preserve-3d; transition: transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1); z-index: 1; }
        
        .front, .back { width: 100%; height: 100%; position: absolute; top: 0; left: 0; backface-visibility: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2.5rem; box-sizing: border-box; border-radius: 0 15px 15px 0; }
        .back { transform: rotateY(180deg); }
        
        .cover { background: linear-gradient(135deg, #800000 0%, #a00000 100%); color: white !important; border-left: 12px solid #5a0000; box-shadow: 10px 10px 30px rgba(0,0,0,0.6); }
        .cover h1 { font-family: 'Dancing Script', cursive; font-size: 2.8rem; text-align: center; margin-bottom: 0.5rem; text-shadow: 0 4px 10px rgba(0,0,0,0.3); color: white !important; }
        .cover .names { font-size: 1.2rem; font-weight: 900; color: #ffcc00 !important; text-transform: uppercase; letter-spacing: 2px; margin-top: 1rem; text-shadow: 0 2px 5px rgba(0,0,0,0.5); text-align: center; }
        .cover .emoji { font-size: 5.5rem; margin-bottom: 1.5rem; filter: drop-shadow(0 0 15px rgba(255,255,255,0.2)); }
        
        .inner-page { background: #fff9e6; color: #1a1a1a !important; box-shadow: inset 5px 0 15px rgba(0,0,0,0.15); border: 1px solid rgba(0,0,0,0.05); overflow: hidden; position: relative; min-height: 400px; display: flex; flex-direction: column; justify-content: center; }
        .inner-page h2 { font-family: 'Dancing Script', cursive; color: #800000 !important; font-size: 2.2rem; margin-bottom: 1rem; width: 100%; text-align: center; }
        .inner-page p { font-size: 1.15rem; line-height: 1.6; text-align: center; font-style: normal; font-weight: 600; color: #1a1a1a !important; width: 100%; word-wrap: break-word; }
        
        .page.flipped { transform: rotateY(-180deg); }
        
        .floating-heart { position: absolute; color: #ff4d94; opacity: 0; pointer-events: none; z-index: 100; font-size: 24px; }
        
        #intro-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #0a0514; z-index: 2000; display: flex; justify-content: center; align-items: center; transition: opacity 0.8s ease; }
        #intro-overlay.hidden { opacity: 0; pointer-events: none; }
        .box-container { text-align: center; cursor: pointer; animation: float 3s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        @media (max-width: 600px) {
            .book { width: 300px; height: 420px; }
            .cover h1 { font-size: 2.2rem; }
            .inner-page p { font-size: 1.1rem; }
            .photo-frame { width: 140px; height: 180px; }
        }

        .audio-controls { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); width: 85%; max-width: 350px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(15px); padding: 12px 20px; border-radius: 25px; border: 1px solid rgba(255, 255, 255, 0.15); display: flex; align-items: center; gap: 15px; z-index: 1000; box-shadow: 0 10px 30px rgba(0,0,0,0.5); color: white; }
        .play-btn { width: 40px; height: 40px; background: #ff4d94; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; flex-shrink: 0; color: white !important; font-weight: bold; }
        .progress-bar-container { flex-grow: 1; height: 4px; background: rgba(255, 255, 255, 0.1); border-radius: 2px; overflow: hidden; }
        .progress-bar { width: 0%; height: 100%; background: #ff4d94; border-radius: 2px; }
        .time-text { font-size: 11px; color: rgba(255, 255, 255, 0.5); min-width: 35px; font-family: monospace; }
        .song-title { position: absolute; top: -22px; left: 50%; transform: translateX(-50%); font-size: 11px; font-weight: 800; color: #ff4d94; white-space: nowrap; text-transform: uppercase; letter-spacing: 1px; }

        .photo-frame { 
            width: 180px; 
            height: 220px; 
            background: white; 
            padding: 8px; 
            box-shadow: 0 5px 15px rgba(0,0,0,0.2); 
            transform: rotate(-2deg); 
            margin-bottom: 1rem;
        }
        .photo-frame img { width: 100%; height: 100%; object-fit: cover; border: 1px solid #eee; }
        .quote-box { padding: 1.5rem; border: 2px dashed #ffb3d1; border-radius: 15px; background: rgba(255,179,209,0.1); margin: 1rem 0; font-family: 'Dancing Script', cursive; font-size: 1.4rem; line-height: 1.4; color: #800000; text-align: center; }
    </style>
</head>
<body>
    <div id="intro-overlay" onclick="openBox()">
        <div class="box-container">
            <div style="font-size: 90px; filter: drop-shadow(0 0 20px #800000);">ðŸ“–</div>
            <div style="color: white; font-size: 26px; font-weight: 900; margin-top: 25px; letter-spacing: 2px;">TU LIBRO MÃGICO</div>
            <div style="color: #ff4d94; margin-top: 10px; font-weight: bold; letter-spacing: 3px; animation: pulse 2s infinite;">TOCA PARA ABRIR</div>
        </div>
    </div>

    <div class="book" id="book" onclick="flipPage()">
        <div class="page page1" id="page1">
            <div class="front cover">
                <div class="emoji">ðŸ“–</div>
                <h1>Libro del Amor</h1>
                <div class="names">{{sender}} & {{name}}</div>
                <div style="margin-top: 2.5rem; opacity: 0.6; font-size: 0.8rem; letter-spacing: 3px; font-weight: 900; color: white !important;">UN VIAJE DE SENTIMIENTOS</div>
            </div>
            <div class="back">
                {{item_1_content}}
            </div>
        </div>
        
        {{dynamic_pages}}
    </div>

    <div class="audio-controls" style="display: {{audio_display}}">
        <div class="song-title">Audio MÃ¡gico</div>
        <div class="play-btn" id="play-btn">
            <div id="play-icon">â–¶</div>
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
                    playerVars: { 'autoplay': 0, 'controls': 0, 'loop': 1, 'playlist': youtubeId }
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
            const pages = Array.from(document.querySelectorAll('.page'));
            
            if (stage < pages.length) {
                const currentPage = pages[stage];
                currentPage.classList.add('flipped');
                pages.forEach((p, idx) => {
                    if (idx < stage) p.style.zIndex = idx + 1;
                    else if (idx === stage) p.style.zIndex = 50;
                    else p.style.zIndex = pages.length - idx;
                });

                if (stage === 0) book.classList.add('open');
                stage++;
                if (stage === 1) createHearts();
            } else {
                pages.forEach((p, idx) => {
                    p.classList.remove('flipped');
                    p.style.zIndex = pages.length - idx;
                });
                book.classList.remove('open');
                stage = 0;
            }
        }

        function createHearts() {
            for(let i=0; i<20; i++) {
                setTimeout(() => {
                    const h = document.createElement('div');
                    h.className = 'floating-heart';
                    const emojis = ['â¤ï¸', 'ðŸ’–', 'âœ¨', 'ðŸ’'];
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

        function closeBook() {
            document.getElementById('intro-overlay').classList.remove('hidden');
            document.getElementById('book').classList.remove('open');
            stage = 0;
            const pages = document.querySelectorAll('.page');
            pages.forEach((p, idx) => {
                p.classList.remove('flipped');
                p.style.zIndex = pages.length - idx;
            });
        }

        (function initPages() {
            const pages = document.querySelectorAll('.page');
            pages.forEach((p, idx) => {
                p.style.zIndex = pages.length - idx;
            });
        })();
    </script>
</body>
</html>`;

// Resto de templates inline (por ahora)
// Se migrarÃ¡ progresivamente

export const BIRTHDAY_TEMPLATE = LOVE_TEMPLATE.replace('ðŸŽ', 'ðŸŽ‚').replace('Â¡Tienes una sorpresa!', 'Â¡Feliz CumpleaÃ±os!');
export const PUZZLE_LOVE_TEMPLATE = LOVE_TEMPLATE.replace('ðŸŽ', 'ðŸ§©');
export const RULETA_LOVE_TEMPLATE = LOVE_TEMPLATE.replace('ðŸŽ', 'ðŸŽ¡');
export const SCRATCH_MESSAGE_TEMPLATE = LOVE_TEMPLATE.replace('ðŸŽ', 'ðŸŽ«');
export const PROPOSAL_TEMPLATE = LOVE_TEMPLATE.replace('SÃ â¤ï¸', 'Â¡SÃ, ACEPTO! ðŸ’');
export const FORGIVE_ME_CATS_TEMPLATE = LOVE_TEMPLATE.replace('ðŸŽ', 'ðŸ±');
export const FORGIVE_ME_PENGUINS_TEMPLATE = LOVE_TEMPLATE.replace('ðŸŽ', 'ðŸ§');
export const FLOWERS_RAMO_TEMPLATE = LOVE_TEMPLATE.replace('ðŸŽ', 'ðŸ’');
export const ENOJONA_TEMPLATE = LOVE_TEMPLATE.replace('ðŸŽ', 'ðŸ˜¡');
export const DATE_COUNTER_TEMPLATE = LOVE_TEMPLATE.replace('ðŸŽ', 'â°');
export const LOVE_CERTIFICATE_TEMPLATE = LOVE_TEMPLATE.replace('ðŸŽ', 'ðŸ“œ');
export const COUPLE_INITIALS_TEMPLATE = LOVE_TEMPLATE.replace('ðŸŽ', 'ðŸ‘•');
export const ENCHANTED_LETTER_TEMPLATE = LOVE_TEMPLATE.replace('ðŸŽ', 'ðŸŽƒ').replace('#ff4d94', '#ff8000');
export const LOVE_VITAMINS_TEMPLATE = LOVE_TEMPLATE.replace('ðŸŽ', 'ðŸ’Š');
export const SOCCER_CARD_TEMPLATE = LOVE_TEMPLATE.replace('ðŸŽ', 'âš½').replace('#ff4d94', '#4caf50');
export const BIRTHDAY_LAMP_TEMPLATE = BIRTHDAY_TEMPLATE;
export const DEDICATE_SONG_TEMPLATE = LOVE_TEMPLATE.replace('ðŸŽ', 'ðŸŽ§');
export const POCOYO_DANCE_TEMPLATE = LOVE_TEMPLATE.replace('ðŸŽ', 'ðŸ•º').replace('#0a0514', '#03a9f4');
export const BE_MY_BOYFRIEND_TEMPLATE = LOVE_TEMPLATE.replace('SÃ â¤ï¸', 'SÃ, Â¡ACEPTO! ðŸ’');
export const TE_AMO_TEMPLATE = GALAXY_TEMPLATE;
export const BE_FRIENDS_TEMPLATE = LOVE_TEMPLATE.replace('ðŸŽ', 'ðŸ¤');
export const HEART_PHOTO_TEMPLATE = GALAXY_TEMPLATE.replace('ðŸŽ', 'ðŸ“¸');
export const OUR_YEAR_TEMPLATE = BIRTHDAY_TEMPLATE.replace('ðŸŽ‚', 'ðŸ“…');
export const CHRISTMAS_TREE_TEMPLATE = BIRTHDAY_TEMPLATE.replace('ðŸŽ‚', 'ðŸŽ„').replace('#00f2ff', '#2e7d32');
export const NEW_YEAR_TEMPLATE = BIRTHDAY_TEMPLATE.replace('ðŸŽ‚', 'ðŸ¥‚');
export const LAST_CHANCE_TEMPLATE = LOVE_TEMPLATE.replace('ðŸŽ', 'ðŸ”“');
export const HIDDEN_MESSAGE_TEMPLATE = GALAXY_TEMPLATE.replace('ðŸŽ', 'ðŸ•µï¸â€â™€ï¸');
export const GALAXY_GENERATOR_TEMPLATE = GALAXY_TEMPLATE;
export const MUSICAL_SPHERE_TEMPLATE = GALAXY_TEMPLATE.replace('ðŸŽ', 'ðŸ”®');
