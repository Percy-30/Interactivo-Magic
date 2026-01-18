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
    if (!isNativePlatform() || isRewardedAdPreparing || isRewardedAdReady) return;

    try {
        isRewardedAdPreparing = true;
        const options = {
            adId: getAdId('REWARDED_INTERSTITIAL'),
            isTesting: USE_TEST_ADS,
        };

        console.log(`AdMob: Pre-loading Rewarded Interstitial (${options.adId})...`);

        // Use the specific Rewarded Interstitial method if available
        if (typeof AdMob.prepareRewardedInterstitialAd === 'function') {
            await AdMob.prepareRewardedInterstitialAd(options);
        } else {
            // Fallback to standard reward video if method name differs
            await AdMob.prepareRewardVideoAd(options);
        }

        // Listen for load success
        const loadListener = await AdMob.addListener('onRewardedInterstitialAdLoaded', () => {
            console.log('AdMob: Rewarded Interstitial LOADED');
            isRewardedAdReady = true;
            isRewardedAdPreparing = false;
            loadListener.remove();
        });

        // Listen for load failure
        const failListener = await AdMob.addListener('onRewardedInterstitialAdFailedToLoad', (error) => {
            console.error('AdMob: Rewarded Interstitial FAILED TO LOAD', error);
            isRewardedAdReady = false;
            isRewardedAdPreparing = false;
            failListener.remove();
        });

        // Some versions use these reward video listeners even for interstitials
        const rvLoadListener = await AdMob.addListener('onRewardedVideoAdLoaded', () => {
            console.log('AdMob: Ad Loaded (via RV listener)');
            isRewardedAdReady = true;
            isRewardedAdPreparing = false;
            rvLoadListener.remove();
        });

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
        // If not ready, wait up to 3 seconds for it to load
        if (!isRewardedAdReady) {
            console.warn('AdMob: Ad not ready, waiting/preparing...');
            await prepareRewardedAd();

            // Wait loop (max 3 seconds)
            let attempts = 0;
            while (!isRewardedAdReady && attempts < 30) {
                await new Promise(r => setTimeout(r, 100));
                attempts++;
            }
        }

        if (!isRewardedAdReady) {
            console.warn('AdMob: Giving up on ad, proceeding to generate');
            if (onReward) onReward();
            return false;
        }

        let rewarded = false;

        // Set up reward listener
        const rewardListener = await AdMob.addListener('onRewardedVideoAdRewarded', (reward) => {
            console.log('AdMob: Reward received!');
            rewarded = true;
            if (onReward) onReward(reward);
        });

        // Set up dismiss listener
        const dismissListener = await AdMob.addListener('onRewardedVideoAdDismissed', () => {
            console.log('AdMob: Ad closed');
            isRewardedAdReady = false;
            rewardListener.remove();
            dismissListener.remove();
            prepareRewardedAd(); // Load next one
        });

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
