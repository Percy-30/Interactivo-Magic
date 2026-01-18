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

/**
 * Show rewarded interstitial ad (e.g., when selecting a template)
 * @param {Function} onReward - Callback when user earns reward
 * @param {Function} onDismiss - Callback when ad is dismissed
 * @returns {Promise<boolean>} - Returns true if user watched ad and got reward
 */
export const showRewardedInterstitial = async (onReward, onDismiss) => {
    if (!isNativePlatform()) {
        console.log('AdMob: Not on native platform, proceeding without ad');
        if (onReward) onReward();
        return true;
    }

    try {
        const options = {
            adId: getAdId('REWARDED_INTERSTITIAL'),
            isTesting: USE_TEST_ADS,
        };

        console.log(`AdMob: Preparing Rewarded Interstitial (${options.adId})...`);

        // Prepare the ad
        await AdMob.prepareRewardVideoAd(options);

        let rewarded = false;

        // Set up event listeners
        const rewardListener = await AdMob.addListener('onRewardedVideoAdRewarded', (reward) => {
            console.log('AdMob: User earned reward!', reward);
            rewarded = true;
            if (onReward) onReward(reward);
        });

        const dismissListener = await AdMob.addListener('onRewardedVideoAdDismissed', () => {
            console.log('AdMob: Ad dismissed');
            if (onDismiss) onDismiss(rewarded);

            // Clean up
            rewardListener.remove();
            dismissListener.remove();
        });

        // Small delay to ensure prep is handled by OS
        await new Promise(resolve => setTimeout(resolve, 500));

        // Show the ad
        await AdMob.showRewardVideoAd();
        console.log('AdMob: showRewardVideoAd called');

        return true;
    } catch (error) {
        console.error('AdMob: Error showing rewarded ad:', error);
        // Fallback: if ad fails, still allow user to proceed
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
