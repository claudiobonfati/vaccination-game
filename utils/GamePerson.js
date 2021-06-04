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

    // Drawing Person
    if (this.status === 1) {
      // Head
      ctx.beginPath();
      ctx.arc(
        this.center.x,
        this.center.y,
        this.radius,
        0,
        Math.PI * 2,
        false
      );
      ctx.lineWidth = 5;
      ctx.strokeStyle = this.colors.healthy;
      ctx.stroke();
      ctx.fillStyle = this.colors.healthyTransp;
      ctx.fill();

      // Left eye
      ctx.beginPath();
      ctx.arc(this.center.x - (this.radius / 3), this.center.y - (this.radius / 4), 2, 0, Math.PI * 2, false);
      ctx.fillStyle = this.colors.healthy;
      ctx.fill();

      // Right eye
      ctx.beginPath();
      ctx.arc(this.center.x + (this.radius / 3), this.center.y - (this.radius / 4), 2, 0, Math.PI * 2, false);
      ctx.fillStyle = this.colors.healthy;
      ctx.fill();

      // Mouth
      ctx.beginPath();
      ctx.moveTo(
        this.center.x - (this.radius / 2.5), // Starting Point
        this.center.y + (this.radius / 3), // Starting Point
      );
      ctx.lineTo(
        this.center.x + (this.radius / 2.5), // Ending Point
        this.center.y + (this.radius / 3), // Ending Point
      );
      ctx.lineWidth = 2;
      ctx.strokeStyle = this.colors.healthy;
      ctx.stroke();
    } else if (this.status === 2) {
      // Head
      ctx.beginPath();
      ctx.arc(
        this.center.x,
        this.center.y,
        this.radius,
        0,
        Math.PI * 2,
        false
      );
      ctx.lineWidth = 5;
      ctx.strokeStyle = this.colors.imune;
      ctx.stroke();
      ctx.fillStyle = this.colors.imune;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(
        this.center.x,
        this.center.y,
        this.radius + 6,
        0,
        Math.PI * 2,
        false
      );
      ctx.fillStyle = this.colors.imuneTransp;
      ctx.fill();

      // Left eye
      ctx.beginPath();
      ctx.arc(this.center.x - (this.radius / 3), this.center.y - (this.radius / 3), 2, 0, Math.PI * 2, false);
      ctx.fillStyle = this.colors.bg;
      ctx.fill();

      // Right eye
      ctx.beginPath();
      ctx.arc(this.center.x + (this.radius / 3), this.center.y - (this.radius / 3), 2, 0, Math.PI * 2, false);
      ctx.fillStyle = this.colors.bg;
      ctx.fill();

      // Mouth
      ctx.beginPath();
      ctx.moveTo(
        this.center.x - (this.radius / 2), // Starting Point
        this.center.y + (this.radius / 5), // Starting Point
      );
      ctx.bezierCurveTo(
        this.center.x - (this.radius / 2.5), // Force Curve Starting Point
        this.center.y + (this.radius / 1.5), // Force Curve Starting Point

        this.center.x + (this.radius / 2.5), // Force Curve Ending Point
        this.center.y + (this.radius / 1.5), // Force Curve Ending Point

        this.center.x + (this.radius / 2), // Ending Point
        this.center.y + (this.radius / 5), // Ending Point
      );
      ctx.lineWidth = 2;
      ctx.strokeStyle = this.colors.bg;
      ctx.stroke();
    } else if (this.status === 3) {
      // Head
      ctx.beginPath();
      ctx.arc(
        this.center.x + (Math.floor(Math.random() * 2) - 0.5),
        this.center.y + (Math.floor(Math.random() * 2) - 0.5),
        this.radius,
        0,
        Math.PI * 2,
        false
      );
      ctx.lineWidth = 5;
      ctx.strokeStyle = this.colors.sick;
      ctx.stroke();
      ctx.fillStyle = this.colors.sick;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(
        this.center.x,
        this.center.y,
        this.radius + 6,
        0,
        Math.PI * 2,
        false
      );
      ctx.fillStyle = this.colors.sickTransp;
      ctx.fill();

      // Left eye
      ctx.beginPath();
      ctx.arc(this.center.x - (this.radius / 3), this.center.y - (this.radius / 3), 2.5, 0, Math.PI * 2, false);
      ctx.fillStyle = this.colors.bg;
      ctx.fill();

      // Right eye
      ctx.beginPath();
      ctx.arc(this.center.x + (this.radius / 3), this.center.y - (this.radius / 3), 2.5, 0, Math.PI * 2, false);
      ctx.fillStyle = this.colors.bg;
      ctx.fill();

      // Mouth
      ctx.beginPath();
      ctx.moveTo(
        this.center.x - (this.radius / 2),  // Starting Point
        this.center.y + (this.radius / 2),  // Starting Point
      );
      ctx.bezierCurveTo(
        this.center.x - (this.radius / 2.5), // Force Curve Starting Point
        this.center.y + (this.radius / 5), // Force Curve Starting Point

        this.center.x + (this.radius / 2.5), // Force Curve Ending Point
        this.center.y + (this.radius / 5), // Force Curve Ending Point

        this.center.x + (this.radius / 2), // Ending Point
        this.center.y + (this.radius / 2), // Ending Point
      );
      ctx.lineWidth = 2;
      ctx.strokeStyle = this.colors.bg;
      ctx.stroke();
    }
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
