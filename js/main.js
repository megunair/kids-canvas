// main.js
import { KidsPhotoshop } from './components/KidsPhotoshop.js';
import { initializeApp } from './utils/initialize.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    const root = document.getElementById('root');
    const app = new KidsPhotoshop(root);
    app.render();
});
