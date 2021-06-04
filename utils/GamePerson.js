import Vec2 from "./Vec2";
import { Howl, Howler } from 'howler';

export default class Person {
  constructor(x, y, disease, status, distances, diseaseArms, radius) {
    this.center = {
      x: x,
      y: y,
    };
    this.diseaseSpeed = disease;
    this.status = status;   // 1: Healthy; 2: Imune; 3: Sick;
    this.distances = distances;
    this.waypoints = {
      toTopRight: {
        step: 1,
        points: null,
      },
      toBottomRight: {
        step: 1,
        points: null,
      },
      toBottomLeft: {
        step: 1,
        points: null,
      },
      toTopLeft: {
        step: 1,
        points: null,
      },
    };

    this.diseaseArms = diseaseArms;
    this.surroundPeople = null;
    this.radius = radius;
    this.shieldSize = 6;
    this.maxDistanceX = this.distances.x - this.radius - this.shieldSize;
    this.maxDistanceY = this.distances.y - this.radius - this.shieldSize;

    this.colors = {
      healthy:      "#83ebce",
      healthyTransp:"#283841",
      imune:        "#EA9B1C",
      imuneTransp:  "rgba(234, 155, 28, 0.2)",
      sick:         "#e36037",
      sickTransp:   "rgba(225, 87, 64, 0.2)",
      bg:           "#030710",
      diseaseArms:  "#de3533"
    }
  }

  draw(ctx) {
    ctx.lineCap = "round";
    ctx.lineWidth = 2;
  }

  update(ctx) {
    this.draw(ctx);
    return this.status;
  }

  getDistance(x1, y1, x2, y2) {
    const xDist = x2 - x1;
    const yDist = y2 - y1;

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
  }

  setMounted(surroundPeople) {
    this.surroundPeople = surroundPeople;
  }
}
