import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { isNativePlatform } from './platformUtils';
import { ADMOB_CONFIG, USE_TEST_ADS, getAdId } from '../config/admobConfig';

/**
 * Initialize AdMob SDK
 */
export const initializeAdMob = async () => {
    if (!isNativePlatform()) {
        console.log('AdMob: Not on native platform, skipping initialization');
        return;
    }

    try {
        await AdMob.initialize({
            requestTrackingAuthorization: true,
            testingDevices: USE_TEST_ADS ? ['YOUR_DEVICE_ID_HERE'] : [],
            initializeForTesting: USE_TEST_ADS,
        });
        console.log(`AdMob initialized successfully (${USE_TEST_ADS ? 'TEST MODE' : 'PRODUCTION MODE'})`);
    } catch (error) {
        console.error('AdMob initialization error:', error);
    }
};

/**
 * Show banner ad at bottom of screen
 */
export const showBannerAd = async () => {
    if (!isNativePlatform()) {
        console.log('AdMob: Not on native platform, skipping banner ad');
        return;
    }

    try {
        const options = {
            adId: getAdId('BANNER'),
            adSize: BannerAdSize.BANNER,
            position: BannerAdPosition.BOTTOM_CENTER,
            margin: 0,
            isTesting: USE_TEST_ADS,
        };

        await AdMob.showBanner(options);
        console.log('Banner ad shown successfully');
    } catch (error) {
        console.error('Error showing banner ad:', error);
    }
};

/**
 * Hide banner ad
 */
export const hideBannerAd = async () => {
    if (!isNativePlatform()) return;

    try {
        await AdMob.hideBanner();
        console.log('Banner ad hidden');
    } catch (error) {
        console.error('Error hiding banner ad:', error);
    }
};

/**
 * Remove banner ad
 */
export const removeBannerAd = async () => {
    if (!isNativePlatform()) return;

    try {
        await AdMob.removeBanner();
        console.log('Banner ad removed');
    } catch (error) {
        console.error('Error removing banner ad:', error);
    }
};

// Track ad state to avoid redundant calls
let isRewardedAdPreparing = false;
let isRewardedAdReady = false;

/**
 * Pre-load a rewarded interstitial ad
 */
export const prepareRewardedAd = async () => {
    if (!isNativePlatform()) return;
    if (isRewardedAdPreparing || isRewardedAdReady) return;

    try {
        isRewardedAdPreparing = true;
        const options = {
            adId: getAdId('REWARDED_INTERSTITIAL'),
            isTesting: USE_TEST_ADS,
        };

        console.log(`AdMob: Pre-loading Rewarded Interstitial (${options.adId})...`);

        // Listeners for Rewarded Interstitial (V8+)
        const loadListener = await AdMob.addListener('onRewardedInterstitialAdLoaded', () => {
            console.log('AdMob: event -> onRewardedInterstitialAdLoaded');
            isRewardedAdReady = true;
            isRewardedAdPreparing = false;
            loadListener.remove();
        });

        const failListener = await AdMob.addListener('onRewardedInterstitialAdFailedToLoad', (error) => {
            console.error('AdMob: event -> onRewardedInterstitialAdFailedToLoad', error);
            alert(`DEBUG: Error al cargar anuncio: ${error.message || 'Error desconocido'}`);
            isRewardedAdReady = false;
            isRewardedAdPreparing = false;
            failListener.remove();
        });

        // Fallback Listeners (Standard Rewarded Video)
        const rvLoadListener = await AdMob.addListener('onRewardedVideoAdLoaded', () => {
            console.log('AdMob: event -> onRewardedVideoAdLoaded');
            isRewardedAdReady = true;
            isRewardedAdPreparing = false;
            rvLoadListener.remove();
        });

        const rvFailListener = await AdMob.addListener('onRewardedVideoAdFailedToLoad', (error) => {
            console.error('AdMob: event -> onRewardedVideoAdFailedToLoad', error);
            rvFailListener.remove();
        });

        // Use the specific Rewarded Interstitial method
        if (typeof AdMob.prepareRewardedInterstitialAd === 'function') {
            console.log('AdMob: Using prepareRewardedInterstitialAd');
            await AdMob.prepareRewardedInterstitialAd(options);
        } else {
            console.log('AdMob: Falling back to prepareRewardVideoAd');
            await AdMob.prepareRewardVideoAd(options);
        }

    } catch (error) {
        console.error('AdMob: Error during preparation call:', error);
        isRewardedAdPreparing = false;
        isRewardedAdReady = false;
    }
};

/**
 * Show the pre-loaded rewarded interstitial ad
 */
export const showRewardedAd = async (onReward) => {
    if (!isNativePlatform()) {
        if (onReward) onReward();
        return true;
    }

    try {
        alert('DEBUG: Intentando mostrar anuncio bonificado...');

        // If not ready, wait a bit
        if (!isRewardedAdReady) {
            console.warn('AdMob: Ad not ready, waiting/preparing...');
            await prepareRewardedAd();

            let attempts = 0;
            while (!isRewardedAdReady && attempts < 40) { // Up to 4 seconds
                await new Promise(r => setTimeout(r, 100));
                attempts++;
            }
        }

        if (!isRewardedAdReady) {
            console.warn('AdMob: Giving up on ad, proceeding to generate');
            alert('DEBUG: El anuncio no cargó a tiempo. Continuando sin anuncio.');
            if (onReward) onReward();
            return false;
        }

        let rewarded = false;

        // Reward Listeners
        const rewardListener = await AdMob.addListener('onRewardedVideoAdRewarded', (reward) => {
            console.log('AdMob: event -> onRewardedVideoAdRewarded');
            rewarded = true;
            if (onReward) onReward(reward);
        });

        const riRewardListener = await AdMob.addListener('onRewardedInterstitialAdRewardReceived', (reward) => {
            console.log('AdMob: event -> onRewardedInterstitialAdRewardReceived');
            rewarded = true;
            if (onReward) onReward(reward);
        });

        // Dismiss Listeners
        const dismissListener = await AdMob.addListener('onRewardedVideoAdDismissed', () => {
            console.log('AdMob: event -> onRewardedVideoAdDismissed');
            isRewardedAdReady = false;
            cleanup();
            prepareRewardedAd();
        });

        const riDismissListener = await AdMob.addListener('onRewardedInterstitialAdDismissed', () => {
            console.log('AdMob: event -> onRewardedInterstitialAdDismissed');
            isRewardedAdReady = false;
            cleanup();
            prepareRewardedAd();
        });

        const cleanup = () => {
            rewardListener.remove();
            riRewardListener.remove();
            dismissListener.remove();
            riDismissListener.remove();
        };

        // Show
        console.log('AdMob: Executing show command...');
        if (typeof AdMob.showRewardedInterstitialAd === 'function') {
            await AdMob.showRewardedInterstitialAd();
        } else {
            await AdMob.showRewardVideoAd();
        }

        return true;
    } catch (error) {
        console.error('AdMob: Critical error showing ad:', error);
        alert(`DEBUG: Error crítico al mostrar: ${error.message}`);
        isRewardedAdReady = false;
        if (onReward) onReward();
        return false;
    }
};

/**
 * Show standard interstitial ad (e.g., on app startup)
 */
export const showInterstitial = async () => {
    if (!isNativePlatform()) {
        console.log('AdMob: Not on native platform, skipping interstitial');
        return;
    }

    try {
        const options = {
            adId: getAdId('INTERSTITIAL'),
            isTesting: USE_TEST_ADS,
        };

        // Prepare
        await AdMob.prepareInterstitial(options);
        console.log('Interstitial prepared');

        // Show
        await AdMob.showInterstitial();
        console.log('Interstitial shown');
    } catch (error) {
        console.error('Error showing interstitial:', error);
    }
};

/**
 * Check if AdMob is available
 */
export const isAdMobAvailable = () => {
    return isNativePlatform();
};
