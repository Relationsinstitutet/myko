export default class Pictures {
  constructor(type, size, typeName, layer, location, number, startSize = size) {
    this.layer = layer;
    this.type = type;
    this.size = size;
    this.typeName = typeName;
    this.pos = this.layer.createVector(location[0][0], location[0][1]);
    location.push(location.shift());
    this.typeNr = number;
    this.randomNr = this.layer.floor(this.layer.random(0, 12));
    this.incr = 1.75;
    this.startSize = startSize;
    this.finalSize = size;
  }

  show(weight) {
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
          this.type[this.randomNr % this.type.length],
          this.pos.x,
          this.pos.y,
          this.startSize,
          this.startSize
        );
      }
    }
  }

  grow(nr) {
    this.startSize += this.incr * (1 / (nr + 1));

    if (this.startSize > this.finalSize * 1.05) {
      this.incr = 0;
    }
    /*try and fix up to size * 1.2 and back down to size * 1, maybe a do while? inside an if block?*/
  }
}
