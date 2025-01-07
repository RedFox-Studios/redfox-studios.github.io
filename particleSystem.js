// particleSystem.js
// This file handles the creation and animation of background particles

const particlesContainer = document.getElementById('particles-container');
const particleCount = 50;
const particleColors = ['#9333ea', '#eab308', '#ec4899']; // purple, yellow, pink

export function initParticleSystem() {
    const particles = Array.from({ length: particleCount }, createParticle);

    // GitHub icon interaction
    const githubIcon = document.getElementById('github-icon');
    
    githubIcon.addEventListener('mouseover', () => {
        particles.forEach(({ particle }) => {
            particle.style.opacity = '0.8';
        });
    });

    githubIcon.addEventListener('mouseout', () => {
        particles.forEach(({ particle }) => {
            particle.style.opacity = '0.5';
        });
    });

    githubIcon.addEventListener('click', () => {
        particles.forEach(({ animation }) => {
            animation.playbackRate = animation.playbackRate === 1 ? 2 : 1;
        });
    });

    return particles;
}

function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.width = `${Math.random() * 5 + 2}px`;
    particle.style.height = particle.style.width;
    particle.style.background = particleColors[Math.floor(Math.random() * particleColors.length)];
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = `${Math.random() * 100}vh`;
    particlesContainer.appendChild(particle);

    const animation = particle.animate(
        [
            { transform: 'translate(0, 0)' },
            { transform: `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px)` }
        ],
        {
            duration: Math.random() * 3000 + 2000,
            direction: 'alternate',
            iterations: Infinity,
            easing: 'ease-in-out'
        }
    );

    return { particle, animation };
}

