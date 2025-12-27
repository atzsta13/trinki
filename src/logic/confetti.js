

const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff0055', '#00ff88'];

const createCanvas = () => {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);
    return canvas;
};

export const triggerConfetti = () => {
    const canvas = createCanvas();

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: width / 2,
            y: height / 2,
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 0.5) * 20 - 10,
            size: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            gravity: 0.5,
            drag: 0.95,
            life: 1.0,
            decay: Math.random() * 0.02 + 0.01
        });
    }

    let animationId;

    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        let activeParticles = 0;

        particles.forEach(p => {
            if (p.life > 0) {
                activeParticles++;
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
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.life;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            }
        });

        if (activeParticles > 0) {
            animationId = requestAnimationFrame(animate);
        } else {
            document.body.removeChild(canvas);
        }
    };

    animate();
};

export const triggerEmojiBurst = (emojiList = ['🔥', '💯', '✨']) => {
    const canvas = createCanvas();
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles = [];
    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
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
            life: 1.0,
            decay: Math.random() * 0.02 + 0.01
        });
    }

    let animationId;
    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        let activeParticles = 0;

        particles.forEach(p => {
            if (p.life > 0) {
                activeParticles++;
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
                ctx.font = `${p.size}px serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.globalAlpha = p.life;
                ctx.fillText(p.text, 0, 0);
                ctx.restore();
            }
        });

        if (activeParticles > 0) {
            animationId = requestAnimationFrame(animate);
        } else {
            document.body.removeChild(canvas);
        }
    };

    animate();
};
