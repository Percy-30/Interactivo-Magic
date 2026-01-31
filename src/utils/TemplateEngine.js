import { saveAs } from 'file-saver';

const TemplateEngine = {
    render: (templateHtml, data) => {
        let finalHtml = templateHtml;

        // Specific image URL fixing logic
        const fixImageUrl = (url) => {
            if (!url) return '';

            // Google Drive - improved pattern matching
            if (url.includes('drive.google.com')) {
                // Match /d/FILE_ID/view or /d/FILE_ID/edit or /file/d/FILE_ID/
                const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
                    url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                    url.match(/id=([a-zA-Z0-9_-]+)/);
                if (match) {
                    const fileId = match[1];
                    console.log('[TemplateEngine] Google Drive detected, ID:', fileId);
                    // thumbnail works best for mixed content, but uc is also common
                    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
                }
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

        console.log('[TemplateEngine DEBUG] Image data:', {
            dataImg: data.img ? data.img.substring(0, 80) + '...' : 'NONE',
            dataImageSrc: data.imageSrc ? data.imageSrc.substring(0, 80) + '...' : 'NONE',
            finalImageSrc: imageSrc ? imageSrc : 'NONE'
        });

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

        // Standard variable replacement
        finalHtml = finalHtml
            .replace(/{{name}}/g, data.name || '')
            .replace(/{{sender}}/g, data.sender || '')
            .replace(/{{message}}/g, data.message || '');

        console.log('[TemplateEngine] === IMAGE DEBUG START ===');
        console.log('[TemplateEngine] data.img:', data.img);
        console.log('[TemplateEngine] data.imageSrc:', data.imageSrc);
        console.log('[TemplateEngine] data.hasImage:', data.hasImage);
        console.log('[TemplateEngine] Final imageSrc:', imageSrc);
        console.log('[TemplateEngine] === IMAGE DEBUG END ===');

        finalHtml = finalHtml
            .replace(/{{audio_src}}/g, audioSrc)
            .replace(/{{\s*youtube_id\s*}}/g, ytId || '')
            .replace(/{{\s*audio_display\s*}}/g, (data.hasAudio || data.audio) ? 'block' : 'none')
            .replace(/{{\s*audio_src\s*}}/g, audioSrc)
            .replace(/{{\s*imagen_src\s*}}/g, imageSrc)
            .replace(/{{\s*image_src\s*}}/g, imageSrc)
            .replace(/{{\s*image_display\s*}}/g, (imageSrc || data.img) ? 'block' : 'none')
            .replace(/{{\s*has_audio\s*}}/g, (data.hasAudio || data.audio) ? 'true' : 'false')
            .replace(/{{extra_text}}/g, data.extraText || data.et || '')
            .replace(/{{extra_text_2}}/g, data.extraText2 || data.et2 || '')
            .replace(/{{extra_display}}/g, (data.extraText || data.et) ? 'block' : 'none')
            .replace(/{{start_date}}/g, data.startDate || data.sd || '')
            // Variables de Vitaminas Amor
            .replace(/{{vitamina_a_text}}/g, data.vitamina_a_text || data.va_text || '')
            .replace(/{{vitamina_a_msg}}/g, data.vitamina_a_msg || data.va_msg || '')
            .replace(/{{vitamina_a_emoji}}/g, data.vitamina_a_emoji || data.va_emoji || '')
            .replace(/{{vitamina_a_img}}/g, fixImageUrl(data.vitamina_a_img || data.va_img || ''))
            .replace(/{{vitamina_a_img_display}}/g, (data.vitamina_a_img || data.va_img) ? 'block' : 'none')

            .replace(/{{vitamina_b_text}}/g, data.vitamina_b_text || data.vb_text || '')
            .replace(/{{vitamina_b_msg}}/g, data.vitamina_b_msg || data.vb_msg || '')
            .replace(/{{vitamina_b_emoji}}/g, data.vitamina_b_emoji || data.vb_emoji || '')
            .replace(/{{vitamina_b_img}}/g, fixImageUrl(data.vitamina_b_img || data.vb_img || ''))
            .replace(/{{vitamina_b_img_display}}/g, (data.vitamina_b_img || data.vb_img) ? 'block' : 'none')

            .replace(/{{vitamina_c_text}}/g, data.vitamina_c_text || data.vc_text || '')
            .replace(/{{vitamina_c_msg}}/g, data.vitamina_c_msg || data.vc_msg || '')
            .replace(/{{vitamina_c_emoji}}/g, data.vitamina_c_emoji || data.vc_emoji || '')
            .replace(/{{vitamina_c_img}}/g, fixImageUrl(data.vitamina_c_img || data.vc_img || ''))
            .replace(/{{vitamina_c_img_display}}/g, (data.vitamina_c_img || data.vc_img) ? 'block' : 'none')

            .replace(/{{vitamina_d_text}}/g, data.vitamina_d_text || data.vd_text || '')
            .replace(/{{vitamina_d_msg}}/g, data.vitamina_d_msg || data.vd_msg || '')
            .replace(/{{vitamina_d_emoji}}/g, data.vitamina_d_emoji || data.vd_emoji || '')
            .replace(/{{vitamina_d_img}}/g, fixImageUrl(data.vitamina_d_img || data.vd_img || ''))
            .replace(/{{vitamina_d_img_display}}/g, (data.vitamina_d_img || data.vd_img) ? 'block' : 'none');

        // Dynamic Items logic (for books)
        const tid = data.t || data.templateId;
        const isBookWithStatic = (tid === 'marvel-book' || tid === 'book-love');
        const itemsOffset = data.pageOffset ? parseInt(data.pageOffset) : (isBookWithStatic ? 3 : 2);

        if (data.items && Array.isArray(data.items)) {
            let dynamicHtml = '';
            let firstItemHtml = '';

            data.items.forEach((item, index) => {
                let itemHtml = '';
                if (item.type === 'image') {
                    const frameClass = (data.t === 'marvel-book' || data.templateId === 'marvel-book') ? 'pixel-frame' : 'photo-frame';
                    const processedItemSrc = fixImageUrl(item.content || '');
                    itemHtml = `
                        <div class="${frameClass}">
                            <img src="${processedItemSrc || 'https://i.imgur.com/rN7Yv4T.png'}" alt="Foto ${index + 1}">
                        </div>
                    `;
                } else {
                    if (data.t === 'marvel-book' || data.templateId === 'marvel-book') {
                        itemHtml = `<div class="comic-text" style="font-size: 1.3rem; padding: 15px 25px; max-width: 85%; margin: 0 auto;">${item.content || '...'}</div>`;
                    } else {
                        itemHtml = `<p style="font-size: 1.3rem; line-height: 1.6; text-align: center; max-width: 90%; color: #333; margin: 0 auto;">${item.content || '...'}</p>`;
                    }
                }

                if (index === 0 && !isBookWithStatic && !data.pageOffset) {
                    firstItemHtml = itemHtml;
                } else {
                    const actualPageNum = isBookWithStatic || data.pageOffset ? (index + itemsOffset) : (index + 2);

                    dynamicHtml += `
                        <div class="page page${actualPageNum}" id="page${actualPageNum}">
                            <div class="front inner-page">${itemHtml}</div>
                            <div class="back inner-page"></div>
                        </div>
                    `;
                }
            });

            finalHtml = finalHtml
                .replace(/{{item_1_content}}/g, firstItemHtml)
                .replace(/{{dynamic_pages}}/g, dynamicHtml);
        } else {
            finalHtml = finalHtml
                .replace(/{{item_1_content}}/g, '')
                .replace(/{{dynamic_pages}}/g, '');
        }

        // Replace other placeholders
        Object.keys(data).forEach(key => {
            if (['audioSrc', 'audioFile', 'hasAudio', 'audioOption', 'items'].includes(key)) return;
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
