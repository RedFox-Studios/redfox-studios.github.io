// formHandler.js
// This file handles form submission and validation

import { sendToDiscord } from './discordWebhook.js';
import { initParticleSystem } from './particleSystem.js';

export function initFormHandler() {
    const form = document.getElementById('githubForm');
    const submitButton = document.getElementById('submit-button');
    const loadingSpinner = document.getElementById('loading-spinner');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = form.username.value.trim();
        errorMessage.classList.add('hidden');
        submitButton.disabled = true;
        loadingSpinner.classList.remove('hidden');

        try {
            // Check if GitHub username exists
            const isValidUsername = await checkGithubUsername(username);

            if (!isValidUsername) {
                throw new Error('GitHub username not found');
            }

            // Send to Discord
            await sendToDiscord(username);

            // Show success message
            form.classList.add('hidden');
            successMessage.classList.remove('hidden');

            // Celebrate with particles
            const particles = initParticleSystem();
            particles.forEach(({ animation }) => {
                animation.playbackRate = 3;
                setTimeout(() => {
                    animation.playbackRate = 1;
                }, 2000);
            });

        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.classList.remove('hidden');
            submitButton.disabled = false;
        } finally {
            loadingSpinner.classList.add('hidden');
        }
    });
}

async function checkGithubUsername(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        return response.ok;
    } catch (error) {
        return false;
    }
}

