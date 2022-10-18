export default class Pictures {
  constructor(type, size, typeName, layer, location, number, startSize = size) {
    //this.p5 = p5;
    this.layer = layer;
    this.type = type;
    this.size = size;
    this.typeName = typeName;
    this.pos = this.layer.createVector(location[0], location[1]);
    this.typeNr = number;
    this.randomNr = this.layer.floor(this.layer.random(0, 12));

    this.startSize = startSize;
    this.finalSize = size;
  }

  show(nr, weight) {
    this.layer.imageMode(this.layer.CENTER);
    if (this.typeNr > 11) {
      this.layer.image(
        this.type[this.randomNr % this.type.length],
        this.pos.x + this.layer.random(this.layer.width * -0.04, this.layer.width * 0.04),
        this.pos.y + this.layer.random(this.layer.height * -0.015, this.layer.height * 0.015),
        this.startSize * 0.65,
        this.startSize * 0.65
      );
    } else {
      if (this.typeName === 'teas') {
        this.layer.image(
          this.type[this.randomNr % this.type.length],
          this.pos.x,
          this.pos.y,
          this.startSize,
          this.startSize
        );
        this.layer.strokeWeight(weight);
        this.layer.line(this.pos.x, this.pos.y - this.startSize / 2.1, this.pos.x, 0);
      } else {
        this.layer.image(
          this.type[nr % this.type.length],
          this.pos.x,
          this.pos.y,
          this.startSize,
          this.startSize
        );
      }
    }
  }

  shadow() {
    this.xtraCnvs.drawingContext.shadowBlur = 30;
    this.xtraCnvs.drawingContext.shadowColor = 'blue';
    //this.xtraCnvs.line(this.pos.x, this.pos.y - this.size / 2.1, this.pos.x, this.pos.y - 70);
  }
}
