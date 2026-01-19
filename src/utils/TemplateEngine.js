import { saveAs } from 'file-saver';

const TemplateEngine = {
    render: (templateHtml, data) => {
        let finalHtml = templateHtml;

        // Specific image URL fixing logic
        const fixImageUrl = (url) => {
            if (!url) return '';

            // Google Drive
            if (url.includes('drive.google.com')) {
                const match = url.match(/\/d\/(.+?)\/(view|edit)/) || url.match(/id=(.+?)(&|$)/);
                if (match) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
            }

            // Imgur
            if (url.includes('imgur.com') && !url.includes('i.imgur.com') && !url.endsWith('.jpg') && !url.endsWith('.png')) {
                const id = url.split('/').pop();
                if (id) return `https://i.imgur.com/${id}.jpg`;
            }

            // Pinterest
            if (url.includes('pinterest.com/pin/')) {
                // Pinterest direct images are harder, but often we can guess the format
                // For now, if we can't easily fix it, let it be, but many direct links work.
            }

            // Google Search Image result (redirects)
            if (url.includes('google.com/imgres')) {
                const match = url.match(/imgurl=(.+?)&/);
                if (match) return decodeURIComponent(match[1]);
            }

            // OneDrive
            if (url.includes('onedrive.live.com') && url.includes('embed')) {
                return url.replace('embed', 'download');
            }

            // Google Photos (basic share links are hard to fix, but some work)
            if (url.includes('photos.app.goo.gl')) {
                // These are redirects, can't easily fix without a head request
            }

            return url;
        };

        const imageSrc = fixImageUrl(data.img || data.imageSrc || '');

        // Specific audio logic
        const audioSrc = data.audioOption === 'default'
            ? 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
            : (data.audioSrc || '');

        const extractId = (url, type) => {
            if (!url) return '';
            if (type === 'youtube') {
                if (url.length === 11 && !url.includes('/') && !url.includes('=')) return url;
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                const match = url.match(regExp);
                return (match && match[2].length === 11) ? match[2] : '';
            }
            return url;
        };

        const ytId = data.audioOption === 'youtube' ? extractId(data.youtubeUrl, 'youtube') : '';

        finalHtml = finalHtml
            .replace(/{{audio_src}}/g, audioSrc)
            .replace(/{{youtube_id}}/g, ytId || '')
            .replace(/{{audio_display}}/g, (data.hasAudio || data.audio) ? 'display: block' : 'display: none')
            .replace(/{{image_src}}/g, imageSrc)
            .replace(/{{image_display}}/g, imageSrc ? 'display: block' : 'display: none')
            .replace(/{{extra_text}}/g, data.extraText || data.et || '');

        // Replace other placeholders
        Object.keys(data).forEach(key => {
            if (['audioSrc', 'audioFile', 'hasAudio', 'audioOption'].includes(key)) return;
            const regex = new RegExp(`{{${key}}}`, 'g');
            finalHtml = finalHtml.replace(regex, data[key]);
        });

        return finalHtml;
    },

    generate: (shareUrl, data) => {
        const redirectorHtml = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mensaje Mágico para ${data.name}</title>
    
    <!-- Open Graph / Meta Social -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="InteractivoMagic | Un mensaje para ${data.name}" />
    <meta property="og:description" content="Haz clic para abrir tu sorpresa interactiva de parte de ${data.sender} ✨" />
    <meta property="og:image" content="https://interactivomagic.ftydownloader.com/og-image.jpg" />

    <style>
        body { 
            background: #0a0514; 
            color: white; 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            display: flex; 
            flex-direction: column;
            align-items: center; 
            justify-content: center; 
            height: 100vh; 
            margin: 0; 
            text-align: center;
        }
        .container {
            padding: 2rem;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            max-width: 400px;
            width: 90%;
        }
        h1 { color: #ff4d94; margin-bottom: 0.5rem; }
        p { color: rgba(255,255,255,0.7); line-height: 1.6; }
        .btn {
            display: inline-block;
            margin-top: 1.5rem;
            padding: 12px 24px;
            background: #ff4d94;
            color: white;
            text-decoration: none;
            border-radius: 12px;
            font-weight: bold;
            transition: transform 0.2s;
        }
        .btn:active { transform: scale(0.95); }
        .loader {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255,255,255,0.1);
            border-left-color: #ff4d94;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 1.5rem auto;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
    </style>
    <script>
        // Redirect after a short delay to show the nice UI
        setTimeout(() => {
            window.location.href = "${shareUrl}";
        }, 1500);
    </script>
</head>
<body>
    <div class="container">
        <h1>✨ InteractivoMagic ✨</h1>
        <p>Preparando tu sorpresa de parte de <strong>${data.sender}</strong>...</p>
        <div class="loader"></div>
        <p style="font-size: 0.9rem; margin-top: 1rem;">Si no eres redirigido, haz clic en el botón:</p>
        <a href="${shareUrl}" class="btn">Abrir Sorpresa ❤️</a>
    </div>
</body>
</html>`;

        const blob = new Blob([redirectorHtml], { type: 'text/html;charset=utf-8' });
        saveAs(blob, `mensaje-magico-${data.name.replace(/\s+/g, '-').toLowerCase()}.html`);
    }
};

export default TemplateEngine;
