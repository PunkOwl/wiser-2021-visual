let wiserFFT = function(p) {
    const widthX = 1280;
    const heightX = 720;
    let mic;
    let fft;

    p.setup = function() {
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
        p.noStroke();
        p.fill(255, 0, 255);
        for (let i = 0; i< spectrum.length; i++){
            let x = p.map(i, 0, spectrum.length, 0, p.width);
            let h = -p.height + p.map(spectrum[i], 0, 255, p.height, 0);
            p.rect(x, p.height, p.width / spectrum.length, h )
        }

        let waveform = fft.waveform();
        p.noFill();
        p.beginShape();
        p.stroke(20);
        for (let i = 0; i < waveform.length; i++){
            let x = p.map(i, 0, waveform.length, 0, p.width);
            let y = p.map( waveform[i], -1, 1, 0, p.height);
            p.vertex(x,y);
        }
        p.endShape();

        // text('tap to play', 20, 20);
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
}