// components/KidsPhotoshop.js
import { CanvasManager } from '../utils/CanvasManager.js';
import { LayerManager } from '../utils/LayerManager.js';
import { ToolManager } from '../utils/ToolManager.js';
import { FilterManager } from '../utils/FilterManager.js';

export class KidsPhotoshop {
    constructor(container) {
        this.container = container;
        this.canvasManager = new CanvasManager();
        this.layerManager = new LayerManager();
        this.toolManager = new ToolManager();
        this.filterManager = new FilterManager();
        
        this.state = {
            currentTool: 'brush',
            currentColor: '#ff0000',
            brushSize: 10,
            isDrawing: false
        };
        
        this.bindEvents();
    }
    
    bindEvents() {
        // Tool selection
        document.querySelectorAll('.tool-button').forEach(tool => {
            tool.addEventListener('click', (e) => {
                this.toolManager.selectTool(e.target.dataset.tool);
                this.updateToolUI();
            });
        });
        
        // Canvas events
        this.canvasManager.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvasManager.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvasManager.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvasManager.canvas.addEventListener('mouseleave', this.stopDrawing.bind(this));
        
        // Layer events
        document.querySelectorAll('.layer-item').forEach(layer => {
            layer.addEventListener('click', (e) => {
                this.layerManager.setActiveLayer(e.target.dataset.layerId);
                this.updateLayerUI();
            });
        });
        
        // Filter events
        document.querySelectorAll('.filter-control').forEach(control => {
            control.addEventListener('input', (e) => {
                this.filterManager.updateFilter(e.target.dataset.filter, e.target.value);
                this.applyFilters();
            });
        });
    }
    
    startDrawing(e) {
        this.state.isDrawing = true;
        const pos = this.canvasManager.getMousePosition(e);
        this.toolManager.startTool(pos.x, pos.y);
    }
    
    draw(e) {
        if (!this.state.isDrawing) return;
        
        const pos = this.canvasManager.getMousePosition(e);
        this.toolManager.useTool(pos.x, pos.y);
    }
    
    stopDrawing() {
        this.state.isDrawing = false;
        this.toolManager.endTool();
        this.layerManager.updateLayerContent(this.canvasManager.getCanvasData());
    }
    
    updateToolUI() {
        document.querySelectorAll('.tool-button').forEach(button => {
            button.classList.toggle('active', button.dataset.tool === this.state.currentTool);
        });
    }
    
    updateLayerUI() {
        document.querySelectorAll('.layer-item').forEach(item => {
            item.classList.toggle('active', item.dataset.layerId === this.layerManager.activeLayer);
        });
    }
    
    applyFilters() {
        const filters = this.filterManager.getAllFilters();
        this.canvasManager.applyFilters(filters);
    }
    
    render() {
        // Create main UI structure
        this.container.innerHTML = `
            <div class="app-container">
                ${this.renderToolbar()}
                ${this.renderCanvas()}
                ${this.renderSidePanel()}
            </div>
        `;
        
        this.canvasManager.initialize();
        this.bindEvents();
    }
    
    renderToolbar() {
        return `
            <div class="tools-panel">
                ${this.toolManager.getTools().map(tool => `
                    <button class="tool-button ${tool.id === this.state.currentTool ? 'active' : ''}"
                            data-tool="${tool.id}"
                            title="${tool.label}">
                        ${tool.icon}
                    </button>
                `).join('')}
            </div>
        `;
    }
    
    renderCanvas() {
        return `
            <div class="canvas-container">
                <div class="canvas-toolbar">
                    <input type="color" 
                           value="${this.state.currentColor}"
                           id="color-picker">
                    <input type="range"
                           min="1"
                           max="50"
                           value="${this.state.brushSize}"
                           id="size-slider">
                </div>
                <div class="canvas-wrapper">
                    <canvas id="main-canvas"></canvas>
                </div>
            </div>
        `;
    }
    
    renderSidePanel() {
        return `
            <div class="side-panel">
                ${this.renderLayers()}
                ${this.renderFilters()}
            </div>
        `;
    }
    
    renderLayers() {
        return `
            <div class="panel-section">
                <div class="panel-header">
                    <h3 class="panel-title">Layers</h3>
                    <button class="add-layer-button">+</button>
                </div>
                <div class="layers-list">
                    ${this.layerManager.getLayers().map(layer => `
                        <div class="layer-item ${layer.id === this.layerManager.activeLayer ? 'active' : ''}"
                             data-layer-id="${layer.id}">
                            <input type="checkbox" 
                                   ${layer.visible ? 'checked' : ''}
                                   data-layer-visibility="${layer.id}">
                            <span>${layer.name}</span>
                            <input type="range"
                                   min="0"
                                   max="100"
                                   value="${layer.opacity}"
                                   data-layer-opacity="${layer.id}">
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    renderFilters() {
        return `
            <div class="panel-section">
                <div class="panel-header">
                    <h3 class="panel-title">Filters</h3>
                </div>
                <div class="filters-list">
                    ${Object.entries(this.filterManager.getFilters()).map(([name, value]) => `
                        <div class="filter-item">
                            <label>${name}</label>
                            <input type="range"
                                   min="0"
                                   max="200"
                                   value="${value}"
                                   class="filter-control"
                                   data-filter="${name}">
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}
