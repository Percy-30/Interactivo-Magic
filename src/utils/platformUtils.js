import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';

/**
 * Check if the app is running in a native mobile environment
 */
export const isNativePlatform = () => {
    return Capacitor.isNativePlatform();
};

/**
 * Get the current platform name
 */
export const getPlatform = () => {
    return Capacitor.getPlatform();
};

/**
 * Share content using native share or web fallback
 */
export const shareContent = async ({ title, text, url }) => {
    if (isNativePlatform()) {
        // Use Capacitor's native Share plugin
        try {
            await Share.share({
                title: title || 'Interactivo Magic',
                text: text || '',
                url: url || '',
                dialogTitle: 'Compartir mensaje mágico'
            });
            return { success: true, native: true };
        } catch (error) {
            console.error('Native share error:', error);
            return { success: false, error };
        }
    } else {
        // Use Web Share API fallback
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title || 'Interactivo Magic',
                    text: text || '',
                    url: url || ''
                });
                return { success: true, native: false };
            } catch (error) {
                console.error('Web share error:', error);
                return { success: false, error };
            }
        } else {
            // Fallback to clipboard
            try {
                await navigator.clipboard.writeText(url || text || '');
                return { success: true, fallback: 'clipboard' };
            } catch (error) {
                return { success: false, error };
            }
        }
    }
};
