import { SHORTENER_API, LOCAL_DEV_IP } from '../config/appConfig';

/**
 * URL Shortener Utility using our custom Backend API with TinyURL fallback
 * @param {string} longUrl - The original long URL to shorten
 * @returns {string} - The shortened URL or original if all fail
 */
export const shortenUrl = async (longUrl) => {
    // Return original URL as requested by user
    return longUrl;
};
