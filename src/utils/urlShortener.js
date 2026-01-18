import { SHORTENER_API, LOCAL_DEV_IP } from '../config/appConfig';

/**
 * URL Shortener Utility using our custom Backend API with TinyURL fallback
 * @param {string} longUrl - The original long URL to shorten
 * @returns {string} - The shortened URL or original if all fail
 */
export const shortenUrl = async (longUrl) => {
    try {
        // Use TinyURL API directly (free and no token needed for simple shortening)
        const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
        if (response.ok) {
            const shortUrl = await response.text();
            return shortUrl;
        }
        return longUrl;
    } catch (error) {
        console.error('Shortener error:', error);
        return longUrl;
    }
};
