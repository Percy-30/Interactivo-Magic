// URL Shortener Utility using TinyURL API
export const shortenUrl = async (longUrl) => {
    try {
        const apiUrl = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`;
        const response = await fetch(apiUrl);

        if (response.ok) {
            const shortUrl = await response.text();
            return shortUrl;
        }

        // If shortening fails, return the original URL
        console.warn('URL shortening failed, using original URL');
        return longUrl;
    } catch (error) {
        console.error('Error shortening URL:', error);
        // Return original URL if service is unavailable
        return longUrl;
    }
};
