// AR 3D Product Viewer - JavaScript

class ProductViewer {
    constructor() {
        this.canvas = document.getElementById('viewer-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
        this.scale = 1;
        this.autoRotate = false;
        
        this.initializeElements();
        this.setupEventListeners();
        this.animate();
    }

    initializeElements() {
        this.rotationXInput = document.getElementById('rotation-x');
        this.rotationYInput = document.getElementById('rotation-y');
        this.rotationZInput = document.getElementById('rotation-z');
        this.scaleInput = document.getElementById('scale');
        this.resetBtn = document.getElementById('reset-btn');
        this.rotateAutoBtn = document.getElementById('rotate-auto-btn');
        this.rotationDisplay = document.getElementById('rotation-display');
        
        this.xValue = document.getElementById('x-value');
        this.yValue = document.getElementById('y-value');
        this.zValue = document.getElementById('z-value');
        this.scaleValue = document.getElementById('scale-value');
    }

    setupEventListeners() {
        this.rotationXInput.addEventListener('input', (e) => {
            this.rotationX = parseFloat(e.target.value);
            this.xValue.textContent = this.rotationX;
            this.updateRotationDisplay();
        });

        this.rotationYInput.addEventListener('input', (e) => {
            this.rotationY = parseFloat(e.target.value);
            this.yValue.textContent = this.rotationY;
            this.updateRotationDisplay();
        });

        this.rotationZInput.addEventListener('input', (e) => {
            this.rotationZ = parseFloat(e.target.value);
            this.zValue.textContent = this.rotationZ;
            this.updateRotationDisplay();
        });

        this.scaleInput.addEventListener('input', (e) => {
            this.scale = parseFloat(e.target.value);
            this.scaleValue.textContent = this.scale.toFixed(1);
        });

        this.resetBtn.addEventListener('click', () => this.reset());
        this.rotateAutoBtn.addEventListener('click', () => this.toggleAutoRotate());
    }

    updateRotationDisplay() {
        this.rotationDisplay.textContent = 
            `X: ${Math.round(this.rotationX)}° | Y: ${Math.round(this.rotationY)}° | Z: ${Math.round(this.rotationZ)}°`;
    }

    reset() {
        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
        this.scale = 1;
        
        this.rotationXInput.value = 0;
        this.rotationYInput.value = 0;
        this.rotationZInput.value = 0;
        this.scaleInput.value = 1;
        
        this.xValue.textContent = 0;
        this.yValue.textContent = 0;
        this.zValue.textContent = 0;
        this.scaleValue.textContent = '1';
        
        this.autoRotate = false;
        this.rotateAutoBtn.textContent = 'Auto Rotate';
        this.updateRotationDisplay();
    }

    toggleAutoRotate() {
        this.autoRotate = !this.autoRotate;
        this.rotateAutoBtn.textContent = this.autoRotate ? 'Stop Rotation' : 'Auto Rotate';
    }

    draw3DCube() {
        const size = 80;
        const vertices = [
            [-size, -size, -size],
            [size, -size, -size],
            [size, size, -size],
            [-size, size, -size],
            [-size, -size, size],
            [size, -size, size],
            [size, size, size],
            [-size, size, size]
        ];

        // Convert degrees to radians
        const rotX = (this.rotationX * Math.PI) / 180;
        const rotY = (this.rotationY * Math.PI) / 180;
        const rotZ = (this.rotationZ * Math.PI) / 180;

        // Rotate vertices
        const rotatedVertices = vertices.map(vertex => {
            let [x, y, z] = vertex;

            // Rotation X
            let y1 = y * Math.cos(rotX) - z * Math.sin(rotX);
            let z1 = y * Math.sin(rotX) + z * Math.cos(rotX);

            // Rotation Y
            let x2 = x * Math.cos(rotY) + z1 * Math.sin(rotY);
            let z2 = -x * Math.sin(rotY) + z1 * Math.cos(rotY);

            // Rotation Z
            let x3 = x2 * Math.cos(rotZ) - y1 * Math.sin(rotZ);
            let y3 = x2 * Math.sin(rotZ) + y1 * Math.cos(rotZ);

            return [x3, y3, z2];
        });

        // Project to 2D
        const projectedVertices = rotatedVertices.map(vertex => {
            const perspective = 300 / (300 + vertex[2]);
            const x = vertex[0] * perspective * this.scale;
            const y = vertex[1] * perspective * this.scale;
            return [x, y];
        });

        // Define cube edges
        const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 4], [1, 5], [2, 6], [3, 7]
        ];

        // Draw edges
        this.ctx.strokeStyle = '#667eea';
        this.ctx.lineWidth = 2;

        edges.forEach(edge => {
            const [start, end] = edge;
            const [x1, y1] = projectedVertices[start];
            const [x2, y2] = projectedVertices[end];
            
            this.ctx.beginPath();
            this.ctx.moveTo(this.canvas.width / 2 + x1, this.canvas.height / 2 + y1);
            this.ctx.lineTo(this.canvas.width / 2 + x2, this.canvas.height / 2 + y2);
            this.ctx.stroke();
        });

        // Draw vertices
        this.ctx.fillStyle = '#764ba2';
        projectedVertices.forEach(([x, y]) => {
            this.ctx.beginPath();
            this.ctx.arc(this.canvas.width / 2 + x, this.canvas.height / 2 + y, 5, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    animate() {
        // Clear canvas
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#f5f7fa');
        gradient.addColorStop(1, '#c3cfe2');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Auto rotate if enabled
        if (this.autoRotate) {
            this.rotationY = (this.rotationY + 2) % 360;
            this.rotationYInput.value = this.rotationY;
            this.yValue.textContent = Math.round(this.rotationY);
            this.updateRotationDisplay();
        }

        // Draw the 3D cube
        this.draw3DCube();

        // Continue animation
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the viewer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProductViewer();
});
