import { useEffect, useRef } from 'react';

export const useShake = (threshold = 15, onShake) => {
    // Keep the latest callback in a ref so the listener isn't re-attached on every render.
    const onShakeRef = useRef(onShake);
    onShakeRef.current = onShake;

    useEffect(() => {
        if (typeof window === 'undefined' || !window.DeviceMotionEvent) return;

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
            if (speed > threshold) onShakeRef.current();

            lastX = current.x;
            lastY = current.y;
            lastZ = current.z;
        };

        window.addEventListener('devicemotion', handleMotion);
        return () => window.removeEventListener('devicemotion', handleMotion);
    }, [threshold]);
};
