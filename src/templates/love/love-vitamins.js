export const LOVE_VITAMINS_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vitaminas del Amor 💊</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800;900&display=swap');
        
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
        }
        
        body {
            font-family: 'Outfit', sans-serif;
            overflow-x: hidden;
            background: linear-gradient(135deg, #ffc3e1 0%, #e7c6ff 50%, #c4d7ff 100%);
            min-height: 100vh;
            position: relative;
        }
        
        /* Fondo animado */
        .floating-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
            z-index: 0;
        }
        
        .heart-float, .pill-float {
            position: absolute;
            font-size: 2rem;
            opacity: 0.4;
            animation: float-up linear infinite;
        }
        
        @keyframes float-up {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 0.4;
            }
            90% {
                opacity: 0.4;
            }
            100% {
                transform: translateY(-100px) rotate(360deg);
                opacity: 0;
            }
        }
        
        /* Contenedor principal */
        .container {
            position: relative;
            z-index: 1;
            max-width: 600px;
            margin: 0 auto;
            padding: 2rem 1rem;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        
        /* Título */
        .title {
            font-size: 2.5rem;
            font-weight: 900;
            color: #d91b79;
            text-align: center;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
            animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        /* Mensaje */
        .message {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(10px);
            padding: 1.5rem;
            border-radius: 20px;
            text-align: center;
            font-size: 1.1rem;
            line-height: 1.6;
            color: #333;
            margin-bottom: 2rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .vitamins-text {
            font-weight: 800;
            background: linear-gradient(135deg, #ff6b9d, #c239ff, #ff6b9d);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 1.3rem;
        }
        
        /* Grid de vitaminas */
        .vitamins-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
            margin: 2rem 0;
            width: 100%;
            max-width: 400px;
        }
        
        /* Frasco de vitamina */
        .vitamin-bottle {
            position: relative;
            cursor: pointer;
            transition: all 0.3s ease;
            animation: bounce 2s ease-in-out infinite;
        }
        
        .vitamin-bottle:nth-child(1) { animation-delay: 0s; }
        .vitamin-bottle:nth-child(2) { animation-delay: 0.2s; }
        .vitamin-bottle:nth-child(3) { animation-delay: 0.4s; }
        .vitamin-bottle:nth-child(4) { animation-delay: 0.6s; }
        
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        
        .vitamin-bottle:hover {
            transform: scale(1.15) translateY(-15px);
            filter: drop-shadow(0 15px 25px rgba(0,0,0,0.3));
        }
        
        .bottle-container {
            background: white;
            border-radius: 20px;
            padding: 1.5rem 1rem;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            position: relative;
            overflow: hidden;
        }
        
        .bottle-container::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.4), transparent);
            transform: rotate(45deg);
            animation: shine 3s infinite;
        }
        
        @keyframes shine {
            0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
            100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        
        .bottle-cap {
            width: 60px;
            height: 20px;
            background: linear-gradient(135deg, #e0e0e0, #f5f5f5);
            border-radius: 10px 10px 0 0;
            margin: 0 auto 5px;
            border: 2px solid #ccc;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        
        .bottle-body {
            width: 100px;
            height: 140px;
            background: white;
            border: 3px solid #ddd;
            border-radius: 15px;
            margin: 0 auto;
            position: relative;
            overflow: hidden;
            box-shadow: inset 0 0 20px rgba(0,0,0,0.1);
        }
        
        .pills {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 75%;
            display: flex;
            flex-wrap: wrap;
            align-content: flex-end;
            padding: 10px;
            gap: 5px;
        }
        
        .pill {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            opacity: 0.9;
        }
        
        .vitamin-a .pills { background: linear-gradient(180deg, transparent, rgba(255, 215, 0, 0.3)); }
        .vitamin-a .pill { background: #FFD700; box-shadow: 0 2px 5px rgba(255, 215, 0, 0.5); }
        
        .vitamin-b .pills { background: linear-gradient(180deg, transparent, rgba(255, 99, 71, 0.3)); }
        .vitamin-b .pill { background: #FF6347; box-shadow: 0 2px 5px rgba(255, 99, 71, 0.5); }
        
        .vitamin-c .pills { background: linear-gradient(180deg, transparent, rgba(255, 165, 0, 0.3)); }
        .vitamin-c .pill { background: #FFA500; box-shadow: 0 2px 5px rgba(255, 165, 0, 0.5); }
        
        .vitamin-d .pills { background: linear-gradient(180deg, transparent, rgba(0, 191, 255, 0.3)); }
        .vitamin-d .pill { background: #00BFFF; box-shadow: 0 2px 5px rgba(0, 191, 255, 0.5); }
        
        .bottle-label {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.95);
            padding: 8px 15px;
            border-radius: 8px;
            border: 2px solid #4CAF50;
            z-index: 10;
        }
        
        .bottle-label-text {
            font-size: 0.9rem;
            font-weight: 600;
            color: #666;
            margin-bottom: 2px;
        }
        
        .bottle-letter {
            font-size: 2.5rem;
            font-weight: 900;
            color: #4CAF50;
            line-height: 1;
        }
        
        /* Modal */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            z-index: 1000;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            animation: fadeIn 0.3s ease;
        }
        
        .modal.active {
            display: flex;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .modal-content {
            background: white;
            border-radius: 25px;
            padding: 2rem;
            max-width: 400px;
            width: 100%;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: slideUp 0.3s ease;
            position: relative;
        }
        
        @keyframes slideUp {
            from {
                transform: translateY(50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        .modal-photo {
            width: 100%;
            max-width: 300px;
            aspect-ratio: 1;
            object-fit: cover;
            border-radius: 20px;
            margin: 0 auto 1.5rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            border: 4px solid #f0f0f0;
        }
        
        .modal-title {
            font-size: 2rem;
            font-weight: 800;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, #ff6b9d, #c239ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .modal-message {
            font-size: 1.2rem;
            color: #555;
            margin-bottom: 2rem;
            line-height: 1.5;
        }
        
        .close-btn {
            background: linear-gradient(135deg, #ff6b9d, #ff8eb3);
            color: white;
            border: none;
            padding: 1rem 2.5rem;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(255, 107, 157, 0.4);
            font-family: 'Outfit', sans-serif;
        }
        
        .close-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 25px rgba(255, 107, 157, 0.6);
        }
        
        .close-btn:active {
            transform: scale(0.98);
        }
        
        /* Firma */
        .sender {
            margin-top: 3rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 15px;
            text-align: center;
            font-size: 1rem;
            color: #666;
        }
        
        .sender-name {
            font-weight: 800;
            color: #d91b79;
            font-size: 1.2rem;
        }
        
        .extra-message {
            margin-top: 2rem;
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.75);
            border-radius: 20px;
            text-align: center;
            font-size: 1.1rem;
            color: #555;
            line-height: 1.6;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }
        
        /* Responsive */
        @media (max-width: 500px) {
            .title {
                font-size: 2rem;
            }
            .message {
                font-size: 1rem;
                padding: 1rem;
            }
            .vitamins-grid {
                gap: 1.5rem;
            }
            .modal-content {
                padding: 1.5rem;
            }
            .modal-title {
                font-size: 1.5rem;
            }
            .modal-message {
                font-size: 1rem;
            }
        }
    </style>
</head>
<body>
    <!-- Fondo animado -->
    <div class="floating-bg" id="floating-bg"></div>
    
    <!-- Contenedor principal -->
    <div class="container">
        <h1 class="title">Vitaminas del Amor 💕</h1>
        
        <div class="message">
            <p>{{message}}</p>
        </div>
        
        <div class="vitamins-grid">
            <!-- Vitamina A -->
            <div class="vitamin-bottle vitamin-a" onclick="openModal('A')">
                <div class="bottle-container">
                    <div class="bottle-cap"></div>
                    <div class="bottle-body">
                        <div class="bottle-label">
                            <div class="bottle-label-text">VITAMINA</div>
                            <div class="bottle-letter">A</div>
                        </div>
                        <div class="pills">
                            <div class="pill"></div>
                            <div class="pill"></div>
                            <div class="pill"></div>
                            <div class="pill"></div>
                            <div class="pill"></div>
                            <div class="pill"></div>
                            <div class="pill"></div>
                            <div class="pill"></div>
                            <div class="pill"></div>
                            <div class="pill"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Vitamina B -->
            <div class="vitamin-bottle vitamin-b" onclick="openModal('B')">
                <div class="bottle-container">
                    <div class="bottle-cap"></div>
                    <div class="bottle-body">
                        <div class="bottle-label">
                            <div class="bottle-label-text">VITAMINA</div>
                            <div class="bottle-letter">B</div>
                        </div>
                        <div class="pills">
                            <div class="pill"></div>
                            <div class="pill"></div>
                            <div class="pill"></div>
                            <div class="pill"></div>
                            <div class="pill"></div>
                            <div class="pill"></div>
                            <div class="pill"></div>
                            <div class="pill"></div>
                            <div class="pill"></div>
                            <div class="pill"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Vitamina C -->
            <div class="vitamin-bottle vitamin-c" onclick="openModal('C')">
                <div class="bottle-container">
                    <div class="bottle-cap"></div>
                    <div class="bottle-body">
                        <div class="bottle-label">
                            <div class="bottle-label-text">VITAMINA</div>
                            <div class="bottle-letter">C</div>
                        </div>
                        <div class="pills">
                            <div class="pill"></div>
                            <div class="pill"></div>
                            <div class="pill"></div>
                            <div class="pill"></div>
                            <div class="pill"></div>
                            <div class="pill"></div>
                            <div class="pill"></div>
                            <div class="pill"></div>
                            <div class="pill"></div>
                            <div class="pill"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Vitamina D -->
            <div class="vitamin-bottle vitamin-d" onclick="openModal('D')">
                <div class="bottle-container">
                    <div class="bottle-cap"></div>
                    <div class="bottle-body">
                        <div class="bottle-label">
                            <div class="bottle-label-text">VITAMINA</div>
                            <div class="bottle-letter">D</div>
                        </div>
                        <div class="pills">
                            <div class="pill"></div>
                            <div class="pill"></div>
                            <div class="pill"></div>
                            <div class="pill"></div>
                            <div class="pill"></div>
                            <div class="pill"></div>
                            <div class="pill"></div>
                            <div class="pill"></div>
                            <div class="pill"></div>
                            <div class="pill"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="extra-message" style="display: {{extra_display}}">
            {{extra_text}}
        </div>
        
        <div class="sender">
            Enviado con amor por: <span class="sender-name">{{sender}}</span>
        </div>
    </div>
    
    <!-- Modales -->
    <div class="modal" id="modal-A" onclick="closeModal(event, 'A')">
        <div class="modal-content" onclick="event.stopPropagation()">
            <img src="{{imagen_src}}" alt="Foto" class="modal-photo" id="photo-A">
            <h2 class="modal-title">A = {{vitamina_a_text}} {{vitamina_a_emoji}}</h2>
            <p class="modal-message">{{vitamina_a_msg}}</p>
            <button class="close-btn" onclick="closeModal(event, 'A')">Cerrar 💕</button>
        </div>
    </div>
    
    <div class="modal" id="modal-B" onclick="closeModal(event, 'B')">
        <div class="modal-content" onclick="event.stopPropagation()">
            <img src="{{imagen_src}}" alt="Foto" class="modal-photo" id="photo-B">
            <h2 class="modal-title">B = {{vitamina_b_text}} {{vitamina_b_emoji}}</h2>
            <p class="modal-message">{{vitamina_b_msg}}</p>
            <button class="close-btn" onclick="closeModal(event, 'B')">Cerrar 💕</button>
        </div>
    </div>
    
    <div class="modal" id="modal-C" onclick="closeModal(event, 'C')">
        <div class="modal-content" onclick="event.stopPropagation()">
            <img src="{{imagen_src}}" alt="Foto" class="modal-photo" id="photo-C">
            <h2 class="modal-title">C = {{vitamina_c_text}} {{vitamina_c_emoji}}</h2>
            <p class="modal-message">{{vitamina_c_msg}}</p>
            <button class="close-btn" onclick="closeModal(event, 'C')">Cerrar 💕</button>
        </div>
    </div>
    
    <div class="modal" id="modal-D" onclick="closeModal(event, 'D')">
        <div class="modal-content" onclick="event.stopPropagation()">
            <img src="{{imagen_src}}" alt="Foto" class="modal-photo" id="photo-D">
            <h2 class="modal-title">D = {{vitamina_d_text}} {{vitamina_d_emoji}}</h2>
            <p class="modal-message">{{vitamina_d_msg}}</p>
            <button class="close-btn" onclick="closeModal(event, 'D')">Cerrar 💕</button>
        </div>
    </div>
    
    <script>
        // Crear elementos flotantes
        function createFloatingElements() {
            const container = document.getElementById('floating-bg');
            const hearts = ['💕', '💗', '💖', '💓', '💝'];
            const pills = ['💊', '💊'];
            
            for (let i = 0; i < 15; i++) {
                const isHeart = Math.random() > 0.3;
                const element = document.createElement('div');
                element.className = isHeart ? 'heart-float' : 'pill-float';
                element.textContent = isHeart ? hearts[Math.floor(Math.random() * hearts.length)] : pills[0];
                element.style.left = Math.random() * 100 + '%';
                element.style.animationDuration = (8 + Math.random() * 4) + 's';
                element.style.animationDelay = Math.random() * 5 + 's';
                element.style.fontSize = (1.5 + Math.random() * 1.5) + 'rem';
                container.appendChild(element);
            }
        }
        
        // Abrir modal
        function openModal(vitamin) {
            const modal = document.getElementById('modal-' + vitamin);
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        // Cerrar modal
        function closeModal(event, vitamin) {
            event.stopPropagation();
            const modal = document.getElementById('modal-' + vitamin);
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        
        // Fix Google Drive images
        function fixGoogleDriveImages() {
            const images = document.querySelectorAll('.modal-photo');
            images.forEach(img => {
                let src = img.src;
                if (src.includes('drive.google.com/file/d/')) {
                    const fileId = src.split('/d/')[1]?.split('/')[0]?.split('?')[0];
                    if (fileId) {
                        img.src = 'https://drive.google.com/thumbnail?id=' + fileId + '&sz=w1000';
                    }
                }
            });
        }
        
        // Inicializar
        window.addEventListener('load', () => {
            createFloatingElements();
            fixGoogleDriveImages();
        });
        
        // Cerrar modal con tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(modal => {
                    modal.classList.remove('active');
                });
                document.body.style.overflow = 'auto';
            }
        });
    </script>
</body>
</html>
`;
