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

const PATTERNS = {
    [HapticType.LIGHT]: () => Haptics.impact({ style: ImpactStyle.Light }),
    [HapticType.MEDIUM]: () => Haptics.impact({ style: ImpactStyle.Medium }),
    [HapticType.HEAVY]: () => Haptics.impact({ style: ImpactStyle.Heavy }),
    [HapticType.SELECTION]: () => Haptics.selectionChanged(),
    [HapticType.SUCCESS]: () => Haptics.notification({ type: NotificationType.Success }),
    [HapticType.WARNING]: () => Haptics.notification({ type: NotificationType.Warning }),
    [HapticType.ERROR]: () => Haptics.notification({ type: NotificationType.Error }),
    // Double tap feel
    [HapticType.HEARTBEAT]: () => {
        setTimeout(() => Haptics.impact({ style: ImpactStyle.Light }).catch(() => { }), 50);
        return Haptics.impact({ style: ImpactStyle.Light });
    }
};

// Fire-and-forget: Capacitor falls back to navigator.vibrate on the web and
// rejects where neither is available, which we simply ignore.
export const triggerHaptic = (type) => {
    if (!hapticsEnabled || !PATTERNS[type]) return;
    try {
        PATTERNS[type]().catch(() => { });
    } catch {
        // Plugin not available
    }
};
