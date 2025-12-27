import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

let hapticsEnabled = true;

export const setHapticsEnabled = (enabled) => {
    hapticsEnabled = enabled;
};

export const HapticType = {
    LIGHT: 'light',
    MEDIUM: 'medium',
    HEAVY: 'heavy',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
    HEARTBEAT: 'heartbeat',
    SELECTION: 'selection'
};

export const triggerHaptic = async (type) => {
    if (!hapticsEnabled) return;

    // Use a non-blocking try-catch for maximum speed
    try {
        switch (type) {
            case HapticType.LIGHT:
                Haptics.impact({ style: ImpactStyle.Light });
                break;
            case HapticType.MEDIUM:
                Haptics.impact({ style: ImpactStyle.Medium });
                break;
            case HapticType.HEAVY:
                Haptics.impact({ style: ImpactStyle.Heavy });
                break;
            case HapticType.SELECTION:
                Haptics.selectionChanged();
                break;
            case HapticType.SUCCESS:
                Haptics.notification({ type: NotificationType.Success });
                break;
            case HapticType.WARNING:
                Haptics.notification({ type: NotificationType.Warning });
                break;
            case HapticType.ERROR:
                Haptics.notification({ type: NotificationType.Error });
                break;
            case HapticType.HEARTBEAT:
                // Double tap feel
                Haptics.impact({ style: ImpactStyle.Light });
                setTimeout(() => Haptics.impact({ style: ImpactStyle.Light }), 50);
                break;
            default:
                break;
        }
    } catch (e) {
        // Fallback to navigator.vibrate if Capacitor is not available
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            switch (type) {
                case HapticType.LIGHT:
                case HapticType.SELECTION:
                    navigator.vibrate(10);
                    break;
                case HapticType.MEDIUM:
                    navigator.vibrate(25);
                    break;
                case HapticType.HEAVY:
                    navigator.vibrate(60);
                    break;
                case HapticType.SUCCESS:
                    navigator.vibrate([10, 40, 10]);
                    break;
                case HapticType.WARNING:
                    navigator.vibrate([20, 30, 20]);
                    break;
                case HapticType.ERROR:
                    navigator.vibrate([10, 10, 10, 10, 50]);
                    break;
                default:
                    navigator.vibrate(10);
            }
        }
    }
};

export const triggerSelectionHaptic = async () => {
    if (!hapticsEnabled) return;
    try {
        await Haptics.selectionChanged();
    } catch (e) { }
};

