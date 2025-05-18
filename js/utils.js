
// utils/CanvasManager.js
export class CanvasManager {
    constructor() {
        this.canvas = null;
        this.ctx = null;
    }
    
    initialize() {
        this.canvas = document.getElementById('main-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }
    
    getMousePosition(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    getCanvasData() {
        return this.canvas.toDataURL();
    }
    
    applyFilters(filters) {
        this.ctx.filter = Object.entries(filters)
            .map(([key, value]) => `${key}(${value}%)`)
            .join(' ');
    }
}

// utils/LayerManager.js
export class LayerManager {
    constructor() {
        this.layers = [
            { id: 'background', name: 'Background', visible: true, opacity: 100, content: null },
            { id: 'layer1', name: 'Layer 1', visible: true, opacity: 100, content: null }
        ];
        this.activeLayer = 'layer1';
    }
    
    getLayers() {
        return this.layers;
    }
    
    setActiveLayer(layerId) {
        this.activeLayer = layerId;
    }
    
    updateLayerContent(content) {
        const layer = this.layers.find(l => l.id === this.activeLayer);
        if (layer) {
            layer.content = content;
        }
    }
}

// utils/ToolManager.js
export class ToolManager {
    constructor() {
        this.tools = [
            { id: 'brush', label: 'Brush', icon: '🖌️' },
            { id: 'eraser', label: 'Eraser', icon: '🧹' },
            { id: 'circle', label: 'Circle', icon: '⭕' },
            { id: 'square', label: 'Square', icon: '⬜' },
            { id: 'star', label: 'Star', icon: '⭐' },
            { id: 'move', label: 'Move', icon: '↔️' },
            { id: 'zoom', label: 'Zoom', icon: '🔍' },
            { id: 'magic', label: 'Magic', icon: '✨' }
        ];
        this.currentTool = 'brush';
    }
    
    getTools() {
        return this.tools;
    }
    
    selectTool(toolId) {
        this.currentTool = toolId;
    }
    
    startTool(x, y) {
        // Tool-specific initialization
    }
    
    useTool(x, y) {
        // Tool-specific logic
    }
    
    endTool() {
        // Tool-specific cleanup
    }
}

// utils/FilterManager.js
export class FilterManager {
    constructor() {
        this.filters = {
            brightness: 100,
            contrast: 100,
            saturation: 100
        };
    }
    
    getFilters() {
        return this.filters;
    }
    
    updateFilter(name, value) {
        if (name in this.filters) {
            this.filters[name] = value;
        }
    }
    
    getAllFilters() {
        return { ...this.filters };
    }
}

// utils/initialize.js
export function initializeApp() {
    // Add any global initialization logic here
    console.log('Initializing Kids Photoshop App...');
}
