let wiserLines = function(p) {
    const widthX = 1280;
    const heightX = 920;

    let img;
    let imgCache;

    p.setup = function () {
        p.createCanvas(widthX, heightX);
        p.background(0);
        
        img = p.createCapture(p.VIDEO);
        img.size(widthX, heightX);

        imgCache = p.createGraphics(widthX,heightX);
        imgCache.translate(widthX,0);
        imgCache.scale(-1,1);

        img.hide();
    }

    p.draw = function () {
        p.background(0);
        
        imgCache.image(img,0,0,widthX,heightX);
        imgCache.loadPixels(p.LINES);

        for (var y = 0; y < imgCache.height; y += 8) {
            p.beginShape();
            for (var x = 0; x < imgCache.width; x += 8) {
                var pixel = imgCache.pixels[(y*imgCache.width+x)*4];
                
                p.stroke(255);
                p.strokeWeight(2);
                p.noFill();
                var c = p.map(pixel, 0, 255, 0, 20);
                p.curveVertex(x, y-c);
            }
            p.endShape();
        }
    }
}