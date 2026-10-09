const COLORS = ['#ff00ff', '#00ffff', '#ffff00', '#ff0055', '#00ff88'];

// Runs a full-screen, click-through particle animation and removes the canvas when done.
const runParticles = (createParticle, count, drawParticle) => {
    const canvas = document.createElement('canvas');
    Object.assign(canvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: '9999'
    });
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const particles = Array.from({ length: count }, () => createParticle(canvas.width, canvas.height));

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = 0;

        particles.forEach(p => {
            if (p.life <= 0) return;
            alive++;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.vx *= p.drag;
            p.vy *= p.drag;
            p.rotation += p.rotationSpeed;
            p.life -= p.decay;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.globalAlpha = Math.max(p.life, 0);
            drawParticle(ctx, p);
            ctx.restore();
        });

        if (alive > 0) requestAnimationFrame(animate);
        else canvas.remove();
    };

    animate();
};

export const triggerConfetti = () => {
    runParticles((width, height) => ({
        x: width / 2,
        y: height / 2,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.5) * 20 - 10,
        size: Math.random() * 10 + 5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.5,
        drag: 0.95,
        life: 1,
        decay: Math.random() * 0.02 + 0.01
    }), 100, (ctx, p) => {
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    });
};

export const triggerEmojiBurst = (emojiList = ['🔥', '💯', '✨']) => {
    runParticles((width, height) => ({
        x: width / 2,
        y: height / 2 + 100,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 1) * 25,
        size: Math.random() * 30 + 20,
        text: emojiList[Math.floor(Math.random() * emojiList.length)],
        rotation: (Math.random() - 0.5) * 45,
        rotationSpeed: (Math.random() - 0.5) * 5,
        gravity: 0.8,
        drag: 0.92,
        life: 1,
        decay: Math.random() * 0.02 + 0.01
    }), 40, (ctx, p) => {
        ctx.font = `${p.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.text, 0, 0);
    });
};
