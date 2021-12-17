let wiserFFT = function(p) {
    const widthX = 1280;
    const heightX = 720; // can't exceed 1024
    let mic;
    let fft;

    let spectrumMatrix;
    const spectrumScale = 1;
    let matrixIndicator = 0;

    p.setup = function() {
        spectrumMatrix = new Array(widthX).fill(0).map(() => new Array(heightX).fill(0));
        p.createCanvas(widthX, heightX);
        p.background(0);
        fft = new p5.FFT();
        mic = new p5.AudioIn();
        mic.start();
        fft.setInput(mic);
    }

    p.draw = function() {
        p.background(0);   

        let spectrum = fft.analyze();
        spectrumMatrix[matrixIndicator] = (spectrum);
        
        if(matrixIndicator == widthX) {
            matrixIndicator--;
            shiftMatrix();
        } else {
            matrixIndicator++;
        }
        

        for(let cx = 0; cx < spectrumMatrix.length; cx++) {
            for(let cy = 0; cy < heightX; cy++) {
                let colorValue = spectrumMatrix[cx][cy] * spectrumScale;
                p.set(cx, cy, p.color(colorValue, colorValue, colorValue));
            }
        }
        
        p.updatePixels();
    }

    p.keyPressed = function() {
        // Chrome
        if (p.key == "S" || p.key == "s") {
            console.log('AA');
            console.log(p.getAudioContext().state);
            if (p.getAudioContext().state !== 'running') {
                p.getAudioContext().resume();
                p.userStartAudio();
                mic.start();
                fft.setInput(mic);
                console.log("resumed");
            }
        }
    }

    function shiftMatrix() {
        for(let i = 1; i < spectrumMatrix.length; i++) {
            spectrumMatrix[i-1] = spectrumMatrix[i];
        }
    }
}