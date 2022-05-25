let noiseScale = 300;
//let noiseStr = 350;


class Particle {
  constructor(x,y,c,a,n,s) {
    this.pos = createVector(x,y);
    this.changePos = this.pos.copy();
    this.vel = createVector(0,0);
    this.dir = createVector(0,0);
    this.speed = s;//random(0.3, 1.3)
    this.c = color(c);
    this.c.setAlpha(random(a, a*2));
    this.noiseStr = n;
  }

  update() {
    let sclPos = p5.Vector.div(this.changePos, noiseScale);
    //let anglea = noise(sclPos.x)*noiseStr;//* noiseStr
    let angleb = noise(sclPos.x, sclPos.y) * this.noiseStr * TWO_PI;
    this.dir.x = cos(angleb);
    this.dir.y = sin(angleb);
    this.vel.add(this.dir);
    this.vel.mult(this.speed);
    this.vel.limit(3);
    this.changePos.add(this.vel);
  }

  show(w) {
    strokeWeight(w);
    stroke(this.c);
    point(this.changePos.x, this.changePos.y);
  }

  limit() {
    this.changePos = this.pos.copy();
    strokeWeight(w += 3);
  }

  edge() {
    if(this.changePos.x > width * 1.11 || this.changePos.x < width * -0.11 || this.changePos.y > height * 1.11 || this.changePos.y < height * -0.11) {

      this.changePos.x= random(width/6, width);
      this.changePos.y= random(height/6, height);
    }
  }

    follow() {
    let history = [];
    history.push(this.pos.copy());
    for(let hist of history) {
      let prevPos = hist;
      strokeWeight(w += 0.05);

      point(prevPos.x,prevPos.y);
    }

    if(history.length > 50) {
      let reStart = history[0];
      //this.a = 0;
      history.splice(0,1);
      //this.pos = reStart;
      //console.log(reStart.x);
    }
  }

  //setForce(force) {this.dir.add(force);}

} //end of Particle class!
