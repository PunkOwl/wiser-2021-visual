let wiserTubes = function(p) {
    // https://openprocessing.org/sketch/47364
    const widthX = 1280;
    const heightX = 920;

    let imageScale = 0.0;
    let dotDensity = 0.12;

    let dwidth = 0;
    let dheight = 0;

    let damping = 0.6;
    let kRadiusFactor = 0.55;
    let kSpeed = 5.0;
    let minDistFactor = 1.2;
    let nbrParticles = 2500;

    let catSpeed = 2;
    let reference = null;
    let nbrCatFrames = 5;

    let cats = [];
    let particles = [];
    let capture;
    let imgCache;

    class Particle {
        constructor(_x, _y) {
            this.x = _x;
            this.y = _y;
            this.vx = 0;
            this.vy = 0;
            this.rad = 1;
            this.fx = 0;
            this.fy = 0;
            this.wt = 0;
        }
    }

    p.setup = function() {
        // dwidth=320;
        // dheight=240;

        dwidth=widthX;
        dheight=heightX;

        p.fullscreen();
        p.createCanvas(widthX, heightX);
        
        // VIDEO
        capture = p.createCapture(p.VIDEO);
        capture.size(dwidth, dheight);

        imgCache = p.createGraphics(dwidth,dheight);
        imgCache.translate(dwidth,0);
        imgCache.scale(-1,1);

        capture.hide();
        
        imageScale = p.width / dwidth;
        
        for (let i = 0; i < nbrParticles; i++) {
            particles[i] = new Particle(p.random(p.width), p.random(p.height));
        }
        
        p.frameRate(48);
        p.smooth();
        p.noStroke();

        let medArea = (p.width * p.height) / nbrParticles;
        medRadius = p.sqrt(medArea / p.PI);
        minRadius = medRadius;
        maxRadius = medRadius * medRadius * 1;
        p.background(255);
    }


    function cat() {
    
        //カメラの画像
        if (p.frameCount % catSpeed == 0) {
            let frameCtr = (p.frameCount / catSpeed % nbrCatFrames);
            
            imgCache.image(capture,0,0,dwidth,dheight);
            reference = imgCache;
            reference.loadPixels();  //pixels配列を更新する
        
            for (let i = 0; i < nbrParticles; i++) {
                let px = parseInt(particles[i].x / imageScale);
                let py = parseInt(particles[i].y / imageScale);
                if (px >= 0 && px < dwidth && py >= 0 && py < dheight) {
                    // let v = red(pg.get(particles[i].x, particles[i].y));
                    let v = reference.pixels[(py*dwidth+px)*4];
                    particles[i].rad = p.map(v / 255.0, 0, 1, minRadius, maxRadius);
                }
            }
        }
    
        for (let i = 0; i < nbrParticles; ++i) {
            let p = particles[i];
            p.fx = p.fy = p.wt = 0;

            p.vx *= damping;
            p.vy *= damping;
        }

        // Particle -> particle interactions
        for (let i = 0; i < nbrParticles-1; ++i) {
        
            let p = particles[i];
            for (let j = i+1; j < nbrParticles; ++j) {
                let pj = particles[j];
                if (i== j || Math.abs(pj.x - p.x) > p.rad*minDistFactor ||
                Math.abs(pj.y - p.y) > p.rad*minDistFactor)
                continue;

                let  dx = p.x - pj.x;
                let  dy = p.y - pj.y;
                let  distance = Math.sqrt(dx*dx+dy*dy);

                let  maxDist = (p.rad + pj.rad);
                let  diff = maxDist - distance;
                if (diff > 0) {
                let scle = diff/maxDist;
                scle = scle*scle;
                p.wt += scle;
                pj.wt += scle;
                scle = scle*kSpeed/distance;
                p.fx += dx*scle;
                p.fy += dy*scle;
                pj.fx -= dx*scle;
                pj.fy -= dy*scle;
                }
            }
        }

        for (let i = 0; i < nbrParticles; ++i) {
            let p = particles[i];

            // keep within edges
            let dx, dy, distance, scle, diff;
            let maxDist = p.rad;
            // left edge  
            distance = dx = p.x - 0;    
            dy = 0;
            diff = maxDist - distance;
            if (diff > 0) {
                scle = diff/maxDist;
                scle = scle*scle;
                p.wt += scle;
                scle = scle*kSpeed/distance;
                p.fx += dx*scle;
                p.fy += dy*scle;
            }

            // right edge  
            dx = p.x - p.width;    
            dy = 0;
            distance = -dx;
            diff = maxDist - distance;
            if (diff > 0) {
                scle = diff/maxDist;
                scle = scle*scle;
                p.wt += scle;
                scle = scle*kSpeed/distance;
                p.fx += dx*scle;
                p.fy += dy*scle;
            }

            // top edge
            distance = dy = p.y - 0;    
            dx = 0;
            diff = maxDist - distance;
            if (diff > 0) {
                scle = diff/maxDist;
                scle = scle*scle;
                p.wt += scle;
                scle = scle*kSpeed/distance;
                p.fx += dx*scle;
                p.fy += dy*scle;
            }

            // bot edge  
            dy = p.y - p.height;    
            dx = 0;
            distance = -dy;
            diff = maxDist - distance;
            if (diff > 0) {
                scle = diff/maxDist;
                scle = scle*scle;
                p.wt += scle;
                scle = scle*kSpeed/distance;
                p.fx += dx*scle;
                p.fy += dy*scle;
            }
            if (p.wt > 0) {
                p.vx += p.fx/p.wt;
                p.vy += p.fy/p.wt;
            }
            p.x += p.vx;
            p.y += p.vy;
        }
    }

    p.draw = function() {
        cat();
        p.background(0,50);
        p.noStroke();
        p.fill(255);
        for (let i = 0; i < nbrParticles; ++i) {
            p.circle(particles[i].x, particles[i].y, medRadius*1);
        }
    }
}