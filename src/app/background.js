class WavelengthBackground {
    constructor() {
        this.canvas = document.getElementById('background-canvas');
        
        // Debug: Check if canvas exists
        if (!this.canvas) {
            console.error('Canvas element not found! Make sure the canvas exists in HTML.');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        
        // Debug: Check if context is available
        if (!this.ctx) {
            console.error('Canvas context not available!');
            return;
        }
        
        this.animationId = null;
        this.scrollY = 0;
        this.startTime = performance.now();
        
        // Updated colors for black theme - more visible and contrasting
        this.colors = {
            primary: { r: 68, g: 100, b: 173 },   // Bright cyan blue
            secondary: { r: 164, g: 176, b: 245 }  // Bright pink/magenta
        };
        
        this.waves = [];
        this.init();
        this.generateWaves();
        
        // Debug: Log initial state
        console.log('Canvas initialized:', this.canvas.width, 'x', this.canvas.height);
        console.log('Number of waves generated:', this.waves.length);
        
        this.animate();
        
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Debug: Ensure canvas is visible - FIXED Z-INDEX
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-10'; // Changed from -1 to -10
        this.canvas.style.pointerEvents = 'none';
        
        //console.log('Canvas dimensions set:', this.canvas.width, 'x', this.canvas.height);
    }
    
    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.generateWaves();
        //console.log('Canvas resized:', this.canvas.width, 'x', this.canvas.height);
    }
    
    handleScroll() {
        this.scrollY = window.pageYOffset || document.documentElement.scrollTop;
    }
    
    generateWaves() {
        this.waves = [];
        
        // Create diverse wave types like different musical frequencies
        const waveTypes = [
            // Bass waves - low, wide, slow, heavy noise
            { ampRange: [40, 80], freqRange: [0.002, 0.004], speedRange: [0.5, 1.2], thickness: 2.5, noiseLevel: 0.08 },
            // Mid waves - medium, varied, moderate noise
            { ampRange: [15, 45], freqRange: [0.006, 0.012], speedRange: [1.0, 2.5], thickness: 1.8, noiseLevel: 0.05 },
            // Treble waves - high, tight, fast, light noise
            { ampRange: [5, 25], freqRange: [0.015, 0.035], speedRange: [2.0, 4.5], thickness: 1.2, noiseLevel: 0.03 },
            // Harmony waves - irregular patterns, varied noise
            { ampRange: [10, 30], freqRange: [0.008, 0.018], speedRange: [0.8, 3.2], thickness: 1.5, noiseLevel: 0.06 }
        ];
        
        const numWaves = 12;
        
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
                
                // Much higher opacity for testing visibility
                opacity: 0.3 + Math.random() * 0.3, // Reduced back to reasonable levels
                
                // Random starting phases
                phase: Math.random() * Math.PI * 2,
                
                // Mixed colors - bright cyan and pink
                color: Math.random() > 0.5 ? this.colors.primary : this.colors.secondary,
                
                // Different line weights
                thickness: waveType.thickness,
                
                // Wave complexity (how many harmonics)
                harmonics: 1 + Math.floor(Math.random() * 3),
                
                // Amplitude modulation for organic feel
                modSpeed: 0.1 + Math.random() * 0.3,
                modDepth: 0.2 + Math.random() * 0.4,
                
                // Scroll movement factor (how much it moves with scroll)
                scrollFactor: 0.3 + Math.random() * 0.4,
                
                // Noise level for organic texture (varies by wave type + individual variation)
                noiseLevel: waveType.noiseLevel * (0.7 + Math.random() * 0.6),
                
                // Noise frequency (how often the noise changes)
                noiseFrequency: 0.5 + Math.random() * 1.5
            });
        }
        
        console.log('Generated waves:', this.waves.length);
    }
    
    drawWave(wave, elapsedTime) {
        const { amplitude, frequency, speed, yOffsetRatio, opacity, phase, color, thickness, harmonics, modSpeed, modDepth, scrollFactor, noiseLevel, noiseFrequency } = wave;
        
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
            
            // Add varying noise levels for organic texture
            // Noise changes over time and position for more natural feel
            const noiseTime = elapsedTime * noiseFrequency + x * 0.001;
            const baseNoise = (Math.random() - 0.5) * amplitude * noiseLevel;
            const timeNoise = Math.sin(noiseTime) * amplitude * noiseLevel * 0.3;
            const totalNoise = baseNoise + timeNoise;
            
            y += totalNoise;
            
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
        
        // Clear canvas with a test background to see if it's working
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw all waves
        this.waves.forEach((wave, index) => {
            this.drawWave(wave, elapsedTime);
        });
        
        // Debug: Draw frame counter
        this.frameCount = (this.frameCount || 0) + 1;
        if (this.frameCount % 60 === 0) { // Log every 60 frames
            //console.log('Animation running, frame:', this.frameCount);
        }
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
    console.log('DOM loaded, initializing background...');
    new WavelengthBackground();
});