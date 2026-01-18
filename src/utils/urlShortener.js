import { SHORTENER_API, LOCAL_DEV_IP } from '../config/appConfig';

/**
 * URL Shortener Utility using our custom Backend API with TinyURL fallback
 * @param {string} longUrl - The original long URL to shorten
 * @returns {string} - The shortened URL or original if all fail
 */
export const shortenUrl = async (longUrl) => {
    try {
        const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
        const isCapacitor = typeof window !== 'undefined' && (hostname.includes('capacitor') || hostname === 'localhost' && window.location.port === '');
        const isLocalWeb = hostname === 'localhost' || hostname === '127.0.0.1';

        // Decision logic for API Endpoint:
        let apiBase = SHORTENER_API;

        if (isLocalWeb && window.location.port !== '') {
            apiBase = 'http://localhost:3001';
        } else if (isCapacitor) {
            const IS_DEV_TESTING = true; // Use local IP for dev mobile testing
            apiBase = IS_DEV_TESTING ? `http://${LOCAL_DEV_IP}:3001` : SHORTENER_API;
        }

        const shortenEndpoint = `${apiBase}/api/shorten`;

        console.log(`Intentando acortar con: ${shortenEndpoint}...`);

        try {
            const response = await fetch(shortenEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: longUrl }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.shortUrl) {
                    let finalUrl = data.shortUrl;
                    if (isCapacitor && finalUrl.includes('localhost')) {
                        finalUrl = finalUrl.replace('localhost', LOCAL_DEV_IP);
                    }
                    return finalUrl;
                }
            }
        } catch (backendError) {
            console.warn('Backend propio no disponible (DNS o Red), usando fallback de emergencia...');
        }

        // FALLBACK SECUNDARIO: TinyURL (En lo que configuras tu dominio s.ftydownloader.com)
        try {
            console.log('Solicitando link a TinyURL...');
            const tinyResponse = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
            if (tinyResponse.ok) {
                const tinyUrl = await tinyResponse.text();
                return tinyUrl;
            }
        } catch (tinyError) {
            console.error('Error con TinyURL fallback:', tinyError);
        }

        return longUrl;
    } catch (error) {
        console.error('Error fatal en acortador:', error);
        return longUrl;
    }
};
