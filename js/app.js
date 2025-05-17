/**
 * Kid's Canvas - Main Application JavaScript
 * A simple drawing application for children
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    const clearButton = document.getElementById('clear-button');
    const saveButton = document.getElementById('save-button');
    const magicButton = document.getElementById('magic-button');
    const clearModal = document.getElementById('clear-modal');
    const saveModal = document.getElementById('save-modal');
    const magicModal = document.getElementById('magic-modal');
    
    // Canvas setup
    function resizeCanvas() {
        const container = document.querySelector('.canvas-container');
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Drawing state variables
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let currentTool = 'pencil';
    let currentColor = '#ff0000';
    let currentSize = 10;
    
    // Event listeners for mouse/touch interaction
    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = getCoordinates(e);
        
        // For shape tool, just record the starting point
        if (currentTool === 'shape') {
            return;
        }
        
        // For pencil and eraser, start the line
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(lastX, lastY);
        ctx.stroke();
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        const [currentX, currentY] = getCoordinates(e);
        
        if (currentTool === 'shape') {
            // For shape tool, don't draw yet
            return;
        }
        
        // For pencil and eraser
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
        
        [lastX, lastY] = [currentX, currentY];
    }
    
    function stopDrawing(e) {
        if (!isDrawing) return;
        
        if (currentTool === 'shape') {
            // For shape tool, draw the shape now
            const [currentX, currentY] = getCoordinates(e);
            const radius = Math.sqrt(Math.pow(currentX - lastX, 2) + Math.pow(currentY - lastY, 2));
            
            ctx.beginPath();
            ctx.arc(lastX, lastY, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        isDrawing = false;
    }
    
    // Helper function to get coordinates from mouse or touch events
    function getCoordinates(e) {
        let x, y;
        
        if (e.type.includes('touch')) {
            x = e.touches[0].clientX - canvas.getBoundingClientRect().left;
            y = e.touches[0].clientY - canvas.getBoundingClientRect().top;
        } else {
            x = e.offsetX;
            y = e.offsetY;
        }
        
        return [x, y];
    }
    
    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events for mobile devices
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault(); // Prevent scrolling when drawing
        startDrawing(e);
    });
    
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault(); // Prevent scrolling when drawing
        draw(e);
    });
    
    canvas.addEventListener('touchend', stopDrawing);
    
    // Tool selection handlers
    document.querySelectorAll('.tool:not(.size)').forEach(tool => {
        tool.addEventListener('click', function() {
            document.querySelector('.tool.active:not(.size)').classList.remove('active');
            this.classList.add('active');
            
            if (this.id === 'pencil-tool') {
                currentTool = 'pencil';
                ctx.globalCompositeOperation = 'source-over';
                ctx.strokeStyle = currentColor;
            } else if (this.id === 'eraser-tool') {
                currentTool = 'eraser';
                ctx.globalCompositeOperation = 'destination-out';
            } else if (this.id === 'shape-tool') {
                currentTool = 'shape';
                ctx.globalCompositeOperation = 'source-over';
                ctx.strokeStyle = currentColor;
            }
        });
    });
    
    // Size selection handlers
    document.querySelectorAll('.size').forEach(size => {
        size.addEventListener('click', function() {
            document.querySelector('.size.active').classList.remove('active');
            this.classList.add('active');
            currentSize = parseInt(this.getAttribute('data-size'));
            ctx.lineWidth = currentSize;
        });
    });
    
    // Color selection handlers
    document.querySelectorAll('.color').forEach(color => {
        color.addEventListener('click', function() {
            document.querySelector('.color.active').classList.remove('active');
            this.classList.add('active');
            currentColor = this.getAttribute('data-color');
            if (currentTool !== 'eraser') {
                ctx.strokeStyle = currentColor;
            }
        });
    });
    
    // Clear canvas with confirmation
    clearButton.addEventListener('click', function() {
        clearModal.style.display = 'flex';
    });
    
    document.getElementById('clear-yes').addEventListener('click', function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        clearModal.style.display = 'none';
    });
    
    document.getElementById('clear-no').addEventListener('click', function() {
        clearModal.style.display = 'none';
    });
    
    // Save drawing functionality
    saveButton.addEventListener('click', function() {
        // Show the save confirmation modal
        saveModal.style.display = 'flex';
        
        // Save to local storage
        const image = canvas.toDataURL('image/png');
        const drawings = JSON.parse(localStorage.getItem('kidCanvasDrawings') || '[]');
        drawings.push({
            id: Date.now(),
            image: image,
            date: new Date().toISOString()
        });
        localStorage.setItem('kidCanvasDrawings', JSON.stringify(drawings));
        
        // For future implementation: Save to server or download file
    });
    
    document.getElementById('save-ok').addEventListener('click', function() {
        saveModal.style.display = 'none';
    });
    
    // Magic button (AI transformation placeholder)
    magicButton.addEventListener('click', function() {
        magicModal.style.display = 'flex';
        const progressBar = document.querySelector('#magic-progress div');
        
        // Simulate progress (will be replaced with actual AI API call in future)
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            progressBar.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    magicModal.style.display = 'none';
                    // In a real app, this would show the AI-transformed image
                    alert('Your drawing has been transformed! (AI feature coming soon)');
                    progressBar.style.width = '0%';
                }, 500);
            }
        }, 200);
    });
    
    // Initial setup
    ctx.lineWidth = currentSize;
    ctx.strokeStyle = currentColor;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Welcome message for first-time users
    if (!localStorage.getItem('kidCanvasVisited')) {
        alert('Welcome to Kid\'s Canvas! Click and drag to draw. Have fun creating!');
        localStorage.setItem('kidCanvasVisited', 'true');
    }
});
