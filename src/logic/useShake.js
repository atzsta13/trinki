import { useState, useEffect } from 'react';

export const useShake = (threshold = 15, onShake) => {
    useEffect(() => {

        if (typeof window === 'undefined' || !window.DeviceMotionEvent) {
            return;
        }

        let lastX = 0;
        let lastY = 0;
        let lastZ = 0;
        let lastTime = 0;

        const handleMotion = (e) => {
            const current = e.accelerationIncludingGravity;

            if (!current || current.x === null) return;

            const currentTime = Date.now();
            if ((currentTime - lastTime) > 100) {
                const diffTime = currentTime - lastTime;
                lastTime = currentTime;

                const speed = Math.abs(current.x + current.y + current.z - lastX - lastY - lastZ) / diffTime * 10000;

                if (speed > threshold) {
                    onShake();
                }

                lastX = current.x;
                lastY = current.y;
                lastZ = current.z;
            }
        };

        try {
            window.addEventListener('devicemotion', handleMotion);
        } catch (e) {
            console.warn("Device motion not supported:", e);
        }

        return () => {
            try {
                window.removeEventListener('devicemotion', handleMotion);
            } catch (e) {

            }
        };
    }, [threshold, onShake]);
};
