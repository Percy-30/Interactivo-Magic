import { saveAs } from 'file-saver';

const TemplateEngine = {
    render: (templateHtml, data) => {
        let finalHtml = templateHtml;

        // Specific audio logic
        const audioSrc = data.audioOption === 'default'
            ? 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
            : (data.audioSrc || '');

        const extractId = (url, type) => {
            if (!url) return '';
            if (type === 'youtube') {
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
            .replace(/{{audio_display}}/g, (data.hasAudio || data.audio) ? 'display: block' : 'display: none');

        // Replace other placeholders
        Object.keys(data).forEach(key => {
            if (['audioSrc', 'audioFile', 'hasAudio', 'audioOption'].includes(key)) return;
            const regex = new RegExp(`{{${key}}}`, 'g');
            finalHtml = finalHtml.replace(regex, data[key]);
        });

        return finalHtml;
    },

    generate: (templateHtml, data) => {
        const finalHtml = TemplateEngine.render(templateHtml, data);
        const blob = new Blob([finalHtml], { type: 'text/html;charset=utf-8' });
        saveAs(blob, `mensaje-magico-${data.name.replace(/\s+/g, '-').toLowerCase()}.html`);
    }
};

export default TemplateEngine;
