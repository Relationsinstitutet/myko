export default class Pictures {
  constructor(type, size, typeName, xtraCnvs, p5, location, number) {
    //this.p5 = p5;
    this.xtraCnvs = xtraCnvs;
    this.type = type;
    this.size = size;
    this.typeName = typeName;
    this.pos = this.xtraCnvs.createVector(location[0], location[1]);
    this.typeNr = number;
  }

  show(nr, weight) {
    this.xtraCnvs.imageMode(this.xtraCnvs.CENTER);
    if (this.typeNr > 11) {
      //this.xtraCnvs.push();
      //this.xtraCnvs.translate(this.pos.x, this.pos.y);
      //this.xtraCnvs.rotate(
      //this.xtraCnvs.random(-this.xtraCnvs.QUARTER_PI, this.xtraCnvs.QUARTER_PI)
      //);
      this.xtraCnvs.image(
        this.type[nr % this.type.length],
        this.pos.x + this.xtraCnvs.random(this.xtraCnvs.width * -0.04, this.xtraCnvs.width * 0.04),
        this.pos.y +
          this.xtraCnvs.random(this.xtraCnvs.height * -0.015, this.xtraCnvs.height * 0.015),
        this.size * 0.65,
        this.size * 0.65
      );
      //this.xtraCnvs.pop();
    } else {
      if (this.typeName === 'teas') {
        this.xtraCnvs.image(
          this.type[nr % this.type.length],
          this.pos.x,
          this.pos.y,
          this.size,
          this.size
        ); /**/
        this.xtraCnvs.strokeWeight(2);
        this.xtraCnvs.line(this.pos.x, this.pos.y - this.size / 2.1, this.pos.x, 0);
      } else {
        this.xtraCnvs.image(
          this.type[nr % this.type.length],
          this.pos.x,
          this.pos.y,
          this.size,
          this.size
        );
      }
    }

    //this.p5.drawingContext.shadowBlur = 15;
    //this.p5.drawingContext.shadowColor = 'lightgrey';
  }
}
