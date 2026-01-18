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
 * Recommended to call this a few seconds before you need to show it
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
        await AdMob.prepareRewardVideoAd(options);

        isRewardedAdReady = true;
        isRewardedAdPreparing = false;
        console.log('AdMob: Rewarded ad is READY and cached');
    } catch (error) {
        console.error('AdMob: Error preparing rewarded ad:', error);
        isRewardedAdPreparing = false;
        isRewardedAdReady = false;
    }
};

/**
 * Show the pre-loaded rewarded interstitial ad
 * @param {Function} onReward - Callback when user earns reward
 */
export const showRewardedAd = async (onReward) => {
    if (!isNativePlatform()) {
        if (onReward) onReward();
        return true;
    }

    try {
        // If not ready, try one last quick preparation
        if (!isRewardedAdReady) {
            console.warn('AdMob: Ad not ready yet, attempting quick preparation...');
            await prepareRewardedAd();
        }

        let rewarded = false;

        // Set up event listeners
        const rewardListener = await AdMob.addListener('onRewardedVideoAdRewarded', (reward) => {
            console.log('AdMob: Reward earned!');
            rewarded = true;
            if (onReward) onReward(reward);
        });

        const dismissListener = await AdMob.addListener('onRewardedVideoAdDismissed', () => {
            console.log('AdMob: Ad dismissed');
            isRewardedAdReady = false; // Need to load a new one for next time
            rewardListener.remove();
            dismissListener.remove();
            // Start preparing the next ad immediately for future use
            prepareRewardedAd();
        });

        // Show the ad
        await AdMob.showRewardVideoAd();
        console.log('AdMob: showRewardVideoAd executed');

        return true;
    } catch (error) {
        console.error('AdMob: Error showing rewarded ad:', error);
        isRewardedAdReady = false;
        if (onReward) onReward(); // Don't block user if ad fails
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
