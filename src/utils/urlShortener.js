import { SHORTENER_API, LOCAL_DEV_IP } from '../config/appConfig';

/**
 * URL Shortener Utility using our custom Backend API with TinyURL fallback
 * @param {string} longUrl - The original long URL to shorten
 * @returns {string} - The shortened URL or original if all fail
 */
export const shortenUrl = async (longUrl) => {
    // Current user request: Do not shorten, return as is.
    return longUrl;
};
