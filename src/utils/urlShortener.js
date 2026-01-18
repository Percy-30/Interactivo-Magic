import { SHORTENER_API } from '../config/appConfig';

/**
 * URL Shortener Utility using our custom Backend API
 * @param {string} longUrl - The original long URL to shorten
 * @returns {string} - The shortened URL or original if failed
 */
export const shortenUrl = async (longUrl) => {
    try {
        // Detect if we are on localhost to use local backend during dev
        const isLocal = typeof window !== 'undefined' &&
            (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

        // In local development, use localhost:3001, otherwise use production API
        const apiBase = isLocal ? 'http://localhost:3001' : SHORTENER_API;
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
                return data.shortUrl;
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
