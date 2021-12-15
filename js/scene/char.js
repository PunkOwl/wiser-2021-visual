let wiserChar = function(p) {
    const widthX = 1280;
    const heightX = 920;

    let mic;
    let fft;

    var capture;
    var radius = 20;
    var imgCache;
    let overAllTexture;

    p.setup = function() {
        p.createCanvas(widthX,heightX);
        capture = p.createCapture(p.VIDEO);
        capture.size(widthX,heightX);
        imgCache = p.createGraphics(widthX,heightX);
        imgCache.translate(widthX,0);
        imgCache.scale(-1,1);
        // println(capture.height,capture.height)
        // background(100);
        p.rectMode(p.CENTER);
        capture.hide();
        
        overAllTexture = p.createGraphics(p.width,p.height);
        overAllTexture.loadPixels();
        // noStroke()
        for(var i=0;i<p.width+50;i++){
            for(var o=0;o<p.height+50;o++){
                overAllTexture.set(i,o,p.color(100,p.noise(i/3,o/3,i*o/50)*p.random([0,50,100])));
            }
        }
        overAllTexture.updatePixels();
        
        // ====== audio input ====== //
        fft = new p5.FFT();
        mic = new p5.AudioIn();
        mic.start();
        fft.setInput(mic);
    }

    let mode = 2;

    p.draw = function() {
        // loadImage(capture)
        p.background(0);
        imgCache.image(capture,0,0,widthX,heightX);
    
        p.push();
        p.noStroke();
        p.scale(1);
        
        // mouseX indicator 
        radius = p.max(p.mouseX,0)/10+20;
        console.log(radius);

        // audio indicator
        let spectrum = fft.analyze();
        let sum = 0;
        for(let i = 0; i< spectrum.length; i++) {
            sum += spectrum[i];
        }
        sum -= 100000;
        console.log(sum);

        if(sum < 0) {
            radius = 20;
        } else {
            radius = sum * 0.0005;
        }

        for(var y=0;y<imgCache.height;y+=radius){
            for(var x=0;x<imgCache.width;x+=radius){
                var pixel = imgCache.get(x,y);
                var r = pixel[0];
                var g = pixel[1];
                var b = pixel[2];

                let bk = (r+g+b)/3;
                let bkI = 10-p.int(bk/25.5);
                
                if (mode==1) {
                    let txt = "BNP7DTS8REW"
                    p.fill(r+50,g+50,b+50);
                    p.textSize(radius);
                    p.textStyle(p.BOLD);
                    p.text(txt[bkI],x,y);
                } else if (mode==2) {
                    p.ellipse(x,y,radius/3+b/15,radius/3+b/15);
                } else if (mode==3) {
                    p.push();
                    p.translate(x,y);
                    p.rotate(b/20);
                    p.colorMode(p.HSB);
                    p.fill(r,100,100);
                    // p.strokeWeight(3);
                    // p.noFill();
                    p.rect(0,0,radius/2.5+r/20,radius/2.5+r/20);
                    p.fill(0);
                    p.ellipse(0,0,5);
                    p.pop();
                }
                // fill(0)
                // rect(x,y,radius/10+b/10-10,radius/10+b/10-20)
            }
        }
        p.pop();
    
        p.push();
        p.blendMode(p.MULTIPLY);
        p.image(overAllTexture,0,0);
        p.pop();
    // p.ellipse(p.mouseX, p.mouseY, 20, 20);
    }

    p.keyPressed = function() {
        if (p.key=="1"){
            mode=1;
        }
        if (p.key=="2"){
            mode = 2;
        }
        if (p.key=="3"){
            mode = 3;
        }
    }
}