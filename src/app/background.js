class WavelengthBackground {
    constructor() {
        this.canvas = document.getElementById('background-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.animationId = null;
        this.scrollY = 0;
        this.startTime = performance.now();
        
        // Using your topography colors
        this.colors = {
            primary: { r: 35, g: 34, b: 107 },    // --topo-start
            secondary: { r: 214, g: 242, b: 255 } // --topo-end
        };
        
        this.waves = [];
        this.init();
        this.generateWaves();
        this.animate();
        
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.generateWaves();
    }
    
    handleScroll() {
        this.scrollY = window.pageYOffset || document.documentElement.scrollTop;
    }
    
    generateWaves() {
        this.waves = [];
        
        // Create diverse wave types like different musical frequencies
        const waveTypes = [
            // Bass waves - low, wide, slow
            { ampRange: [40, 80], freqRange: [0.002, 0.004], speedRange: [0.5, 1.2], thickness: 2.5 },
            // Mid waves - medium, varied
            { ampRange: [15, 45], freqRange: [0.006, 0.012], speedRange: [1.0, 2.5], thickness: 1.8 },
            // Treble waves - high, tight, fast
            { ampRange: [5, 25], freqRange: [0.015, 0.035], speedRange: [2.0, 4.5], thickness: 1.2 },
            // Harmony waves - irregular patterns
            { ampRange: [10, 30], freqRange: [0.008, 0.018], speedRange: [0.8, 3.2], thickness: 1.5 }
        ];
        
        const numWaves = 12; // More waves for complexity
        
        for (let i = 0; i < numWaves; i++) {
            const waveType = waveTypes[i % waveTypes.length];
            
            this.waves.push({
                // Varied amplitudes like music volume levels
                amplitude: waveType.ampRange[0] + Math.random() * (waveType.ampRange[1] - waveType.ampRange[0]),
                
                // Different frequencies like musical notes
                frequency: waveType.freqRange[0] + Math.random() * (waveType.freqRange[1] - waveType.freqRange[0]),
                
                // Varied speeds like different instruments
                speed: waveType.speedRange[0] + Math.random() * (waveType.speedRange[1] - waveType.speedRange[0]),
                
                // Base position relative to screen height (0-1)
                yOffsetRatio: (i + 1.5) / (numWaves + 3),
                
                // Varied opacity for depth
                opacity: 0.08 + Math.random() * 0.25,
                
                // Random starting phases
                phase: Math.random() * Math.PI * 2,
                
                // Mixed colors
                color: Math.random() > 0.4 ? this.colors.primary : this.colors.secondary,
                
                // Different line weights
                thickness: waveType.thickness,
                
                // Wave complexity (how many harmonics)
                harmonics: 1 + Math.floor(Math.random() * 3),
                
                // Amplitude modulation for organic feel
                modSpeed: 0.1 + Math.random() * 0.3,
                modDepth: 0.2 + Math.random() * 0.4,
                
                // Scroll movement factor (how much it moves with scroll)
                scrollFactor: 0.3 + Math.random() * 0.4 // Different parallax speeds
            });
        }
    }
    
    drawWave(wave, elapsedTime) {
        const { amplitude, frequency, speed, yOffsetRatio, opacity, phase, color, thickness, harmonics, modSpeed, modDepth, scrollFactor } = wave;
        
        this.ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
        this.ctx.lineWidth = thickness;
        this.ctx.lineCap = 'round';
        
        // Moving sine wave with organic modulation
        const timeOffset = elapsedTime * speed;
        
        // Amplitude modulation for breathing effect
        const ampModulation = 1 + Math.sin(elapsedTime * modSpeed) * modDepth;
        
        // Calculate Y position: base position + scroll offset (with wrapping)
        const baseY = this.canvas.height * yOffsetRatio;
        const scrollOffset = (this.scrollY * scrollFactor) % (this.canvas.height + 200);
        const yOffset = baseY + scrollOffset;
        
        // If wave goes off bottom, wrap to top
        const wrappedY = yOffset > this.canvas.height + 100 ? yOffset - (this.canvas.height + 200) : yOffset;
        
        this.ctx.beginPath();
        
        // Draw complex musical wave
        for (let x = 0; x <= this.canvas.width; x += 2) {
            let y = 0;
            
            // Add multiple harmonics like musical overtones
            for (let h = 1; h <= harmonics; h++) {
                const harmonicAmp = amplitude * ampModulation / (h * 1.5); // Decreasing harmonic strength
                const harmonicFreq = frequency * h;
                const harmonicPhase = phase * h;
                
                y += harmonicAmp * Math.sin(harmonicFreq * x + timeOffset + harmonicPhase);
            }
            
            // Add some noise for organic feel
            y += (Math.random() - 0.5) * amplitude * 0.05;
            
            const finalY = wrappedY + y;
            
            if (x === 0) {
                this.ctx.moveTo(x, finalY);
            } else {
                this.ctx.lineTo(x, finalY);
            }
        }
        
        this.ctx.stroke();
    }
    
    draw() {
        // Calculate elapsed time for animation
        const currentTime = performance.now();
        const elapsedTime = (currentTime - this.startTime) * 0.001;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw all waves
        this.waves.forEach(wave => {
            this.drawWave(wave, elapsedTime);
        });
    }
    
    animate() {
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WavelengthBackground();
});