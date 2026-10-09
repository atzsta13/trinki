import { useEffect, useEffectEvent } from 'react';

// Only listens while `enabled`, so cards without a shake mechanic don't process 60 motion events per second.
export const useShake = (threshold = 15, onShake, enabled = true) => {
    // Always calls the latest callback without re-attaching the motion listener.
    const handleShake = useEffectEvent(onShake);

    useEffect(() => {
        if (!enabled || typeof window === 'undefined' || !window.DeviceMotionEvent) return;

        let lastX = 0;
        let lastY = 0;
        let lastZ = 0;
        let lastTime = 0;

        const handleMotion = (e) => {
            const current = e.accelerationIncludingGravity;
            if (!current || current.x === null) return;

            const now = Date.now();
            const diffTime = now - lastTime;
            if (diffTime <= 100) return;
            lastTime = now;

            const speed = Math.abs(current.x + current.y + current.z - lastX - lastY - lastZ) / diffTime * 10000;
            if (speed > threshold) handleShake();

            lastX = current.x;
            lastY = current.y;
            lastZ = current.z;
        };

        window.addEventListener('devicemotion', handleMotion);
        return () => window.removeEventListener('devicemotion', handleMotion);
    }, [threshold, enabled]);
};
