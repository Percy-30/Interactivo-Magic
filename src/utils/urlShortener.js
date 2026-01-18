import { SHORTENER_API, LOCAL_DEV_IP } from '../config/appConfig';

/**
 * URL Shortener Utility using our custom Backend API
 * @param {string} longUrl - The original long URL to shorten
 * @returns {string} - The shortened URL or original if failed
 */
export const shortenUrl = async (longUrl) => {
    try {
        const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
        const isCapacitor = typeof window !== 'undefined' && (hostname.includes('capacitor') || hostname === 'localhost' && window.location.port === '');
        const isLocalWeb = hostname === 'localhost' || hostname === '127.0.0.1';

        // Decision logic for API Endpoint:
        let apiBase = SHORTENER_API;

        if (isLocalWeb && window.location.port !== '') {
            // Case 1: Browser on PC (localhost:5173) -> Use local backend
            apiBase = 'http://localhost:3001';
        } else if (isCapacitor) {
            // Case 2: Running in Native App (host is localhost/capacitor but no port)
            // If you are testing locally on your network, use LOCAL_DEV_IP
            // For production builds, always use SHORTENER_API
            const IS_DEV_TESTING = true; // CHANGE THIS TO false FOR PRODUCTION RELEASE
            apiBase = IS_DEV_TESTING ? `http://${LOCAL_DEV_IP}:3001` : SHORTENER_API;
        }

        const shortenEndpoint = `${apiBase}/api/shorten`;

        const response = await fetch(shortenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: longUrl }),
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success && data.shortUrl) {
                // Ensure the returned shortUrl uses a reachable domain/IP
                // If the backend returns a localhost URL but we are on mobile, fix it
                let finalUrl = data.shortUrl;
                if (isCapacitor && finalUrl.includes('localhost')) {
                    finalUrl = finalUrl.replace('localhost', LOCAL_DEV_IP);
                }
                return finalUrl;
            }
        }

        // If custom shortener fails, fallback to original URL (avoid TinyURL delay)
        console.warn('Custom shortening failed, using original URL');
        return longUrl;
    } catch (error) {
        console.error('Error shortening URL with custom backend:', error);
        // Return original URL if service is unavailable
        return longUrl;
    }
};
