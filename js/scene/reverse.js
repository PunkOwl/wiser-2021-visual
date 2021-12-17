let wiserReverse = function(p) {
    const widthX = 1280;
    const heightX = 720;

    "use strict";
    let capture;

    p.setup = function() {
        p.createCanvas(widthX, heightX);
        capture = p.createCapture(p.VIDEO);
        capture.hide();
        capture.size(widthX, heightX);
    }

    p.draw = function() {
        let mainColor = '#2C3A47';
        // let mainColor = color (random(255), random (255), random(255));
        let bgColor = '#fff';
        p.background(bgColor);

        if (capture.width > 0) {
            // let img = capture.get(0, 0, capture.width, capture.height);
            capture.loadPixels();

            const step = 12;
            for (var y = step; y < capture.height; y += step) {
                for (var x = step; x < capture.width; x += step) {
                    const darkness = getPixelDarknessAtPosition(capture, x, y);
                    const radius = 14 * darkness;
                    let sX = x * p.width / capture.width;
                    let sY = y * p.height / capture.height;
                    
                    // fill(random(210, 240), random(10, 30), random(0, 70), 83);
                    var i =y*capture.width+x;
                    p.fill(mainColor);
                    p.fill(capture.pixels[i*4],capture.pixels[i*4+1],capture.pixels[i*4+2]);
                    p.noStroke();
                    p.circle(sX, sY, radius);
                }
            }
        }
        // p.filter(p.BLUR, 3);
        p.filter(p.INVERT);
    }

    //ignore this, initially
    function getPixelDarknessAtPosition(img, x, y) {
        const mirroring = true;
        var i = y * img.width + (mirroring ? (img.width - x - 1) : x);
        return (255 - img.pixels[i * 4]) / 255;
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