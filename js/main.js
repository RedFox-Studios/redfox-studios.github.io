// js/main.js
// This is the main entry point for our application

import { initParticleSystem } from './particleSystem.js';
import { initFormHandler } from './formHandler.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the particle system
    initParticleSystem();

    // Initialize the form handler
    initFormHandler();
});