export default class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;      
  }

  length () {
    return Math.sqrt((this.x * this.x) + (this.y*this.y));
  }

  normalize () {
    let scale = this.length();
    this.x /= scale;
    this.y /= scale;
  }
}