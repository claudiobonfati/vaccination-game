<template lang="html">
  <div class="c-game shadow-lg" :style="{width: width + 'px'}">
    <div class="container-tips">
      <div class="box-tip shadow-lg">
        <h5>FIRST</h5>
        <p>Trap the disease as fast as possible and maybe you will have a chance.</p>
      </div>
      <div class="box-tip shadow-lg">
        <h5>THEN</h5>
        <p>Vaccine all remaining people before the timer goes out.</p>
      </div>
    </div>
    <div id="game-header" class="px-3 px-sm-4 px-md-5 py-3 py-md-4">
      <div class="row justify-content-center align-items-center no-gutters">
        <div class="col-6 pr-0 text-left">
          <h4 class="game-font-timer font-weight-normal d-flex align-items-center">
            <span class="game-clock mr-1" :class="'gm-'+status"><span></span></span>
            <span>
              {{ getRemainingTimeDisplay() }}
            </span>
          </h4>
          <button id="game-btn-pause" :class="['gm-'+status, status !== 'playing' ? 'disabled': '']" @click="pauseGame()">
            Pause
          </button>
          <button id="game-btn-sound" :class="['gm-sound-'+soundStatus, 'gm-'+status]" @click="switchSound()">
            Sound
          </button>
        </div>
        <div class="col-6 pl-3 box-scoreboard">
          <p class="mb-1 small d-flex align-items-center">
            <img class="icon-face mr-1" :src="require('~/assets/images/game-face-imune.svg')" alt="Vaccinated">
            <span class="game-border-bottom">Vaccinated:</span>
            <b class="game-color-yellow w-100 score-percent text-right game-border-bottom">{{score.imune}}%</b>
          </p>
          <p class="mb-1 small d-flex align-items-center">
            <img class="icon-face mr-1" :src="require('~/assets/images/game-face-healthy.svg')" alt="Healthy">
            <span class="game-border-bottom">Healthy:</span>
            <b class="game-color-blue w-100 score-percent text-right game-border-bottom">{{score.healthy}}%</b>
          </p>
          <p class="mb-0 small d-flex align-items-center">
            <img class="icon-face mr-1" :src="require('~/assets/images/game-face-sick.svg')" alt="Infected">
            <span class="game-border-bottom">Infected:</span>
            <b class="game-color-red w-100 score-percent text-right game-border-bottom">{{score.sick}}%</b>
          </p>
        </div>
      </div>
    </div>
    <div class="game-content" :style="{width: this.width + 'px', height: this.height + 'px'}">
      <div id="game-overlay-initial" class="w-100 h-100" :style="{ backgroundImage: 'url(' + require('@/assets/images/game-background.png') + ')' }" ref="refOverlayInitial">
        <div class="row no-gutters w-100 h-100 align-items-center justify-content-center">
          <div class="col-md-6 col-8 pb-5 text-center">
            <button class="btn btn-default-blue lay-color-black mb-3 w-100" @click="playGame()">
              Play
            </button>
          </div>
        </div>
      </div>
      <div id="game-overlay-pause" class="w-100 h-100" :style="{ backgroundImage: 'url(' + require('@/assets/images/game-background.png') + ')' }" ref="refOverlayPause">
        <div class="row no-gutters w-100 h-100 align-items-center justify-content-center">
          <div class="col-md-7 col-8 pb-5 text-center">
            <button class="btn btn-default-blue lay-color-black mb-3 w-100" @click="playGame()">
              Continue
            </button>
            <br>
            <button class="btn btn-default-orange w-100" @click="restartGame()">
              Restart
            </button>
          </div>
        </div>
      </div>
      <div id="game-overlay-end" class="w-100 h-100 text-left" ref="refOverlayEnd">
        <div class="row no-gutters w-100 h-100 align-items-center justify-content-center">
          <section class="col-md-7 col-8 pb-5 text-center" v-if="score.imune >= 95">
            <h5 class="mb-2 h3 font-weight-bold">
              {{ content.win.title }}
            </h5>
            <p class="mb-3" v-html="content.win.description"></p>
            <br>
            <button class="btn btn-default-blue w-100 mb-3" @click="restartGame()">
              Play again
            </button>
            <a class="btn btn-default-orange w-100" href="https://youtu.be/oBSandHijDc?t=6" target="_blank">
              Learn more <feather type="external-link" class="icon"></feather>
            </a>
          </section>
          <section class="col-md-7 col-8 pb-5 text-center" v-else>
            <h5 class="mb-2 d-flex align-items-center h3 font-weight-bold">
              {{ content.lose.title }}
            </h5>
            <p class="mb-3" v-html="content.lose.description"></p>
            <br>
            <button class="btn btn-default-blue w-100 mb-3" @click="restartGame()">
              Try again
            </button>
            <a class="btn btn-default-orange w-100" href="https://youtu.be/oBSandHijDc?t=6" target="_blank">
              Learn more <feather type="external-link" class="icon"></feather>
            </a>
          </section>
        </div>
      </div>
      <canvas id="c-game-canvas" :style="{width: this.width + 'px', height: this.height + 'px'}" ref="refCanvas"></canvas>
    </div>
  </div>
</template>

<script>
  import gsap from "gsap";
  import TweenLite from "gsap";
  import Person from "~/utils/GamePerson";
  import { Howl } from 'howler';

  if (process.client) {
    gsap.registerPlugin(TweenLite);
  }

  export default {
    name: 'Game',
    data: function() {
      return {
        config: {
          pausedTime: 0,        // Store paused timer to be added on continue game
          timer: 30,            // (seconds) Max. time to complete the game
          field: {
            x: 6,               // Number of columns
            y: 9,               // Number of rows
          },
          infection: {
            initInfected: 2,    // Amount of infected people initially
            velocityMobile: {   // Amount o frames to spread on mobile devices | 24 = 1s
              axes: {
                min: 72,        // 3s
                max: 120,       // 5s
              },
              diag:  {
                min: 120,       // 5s
                max: 168,       // 7s
              },
            },
            velocityDesk: {     // Amount o frames to spread on desktop devices | 24 = 1s
              axes: {
                min: 120,       // 5s
                max: 168,       // 7s
              },
              diag:  {
                min: 168,       // 7s
                max: 216,       // 9s
              },
            },
            chance: 75          // (Percent) Chance of spreading to each person
          },
          personRadius: 15,     // Radius on each person on field
          clickRadius: 15,      // Radius reacheable to immunize population
          debug: false,         // Debug mode (enable hack and show FPS)
          framerate: {          // Vars needed to FPS and Timer counters
            frameCount: 0,
            fpsInterval: 0,
            startTime: 0,
            now: 0,
            then: 0,
            elapsed: 0,
          },
        },
        score: {                // Variables needed for score counter
          healthy: 0,
          imune: 0,
          sick: 0,
        },
        status: 'not-started',  // Game status: 'not-started', 'paused', 'playing' or 'ended'
        soundStatus: 'on',     // Sound status: 'on' or 'off'
        sounds: {               // Vars needed for sounds effects
          tapCorrect: null,
          tapWrong: null,
          win: null,
          lose: null,
          bg: null,
        },
        centersArray: [],       // Position of each person on population
        population: [],         // Population array
        canvas: null,           // HTML canvas element
        ctx: null,              // CTX from canvas
        xDistance: 0,           // X distange between people on population
        yDistance: 0,           // Y distange between people on population
        width: null,            // Canvas width (get from parent)
        height: 570,            // Canvas height
        content: {
          win: {
            title: 'Congratulations, disease eradicated!',
            description: 'Did you know that in order to <strong style="color: #ea9b1c;">eradicate</strong> a disease, at least <strong style="color: #ea9b1c;">95%</strong> of the population needs to be immunized?',
          },
          lose: {
            title: 'Too bad... you need to be faster!',
            description: 'Did you know that in order to <strong style="color: #ea9b1c;">eradicate</strong> a disease, at least <strong style="color: #ea9b1c;">95%</strong> of the population needs to be immunized?',
          }
        }
      }
    },
    methods: {
      init: function() { // Initiate all dependencies for game (executed only once)
        // Default canvas variavles
        this.canvas = document.getElementById('c-game-canvas');
        this.ctx = this.canvas.getContext('2d');

        // Set Width
        this.width = this.$parent.$refs.refContainerGame.clientWidth;

        // Set actual dimentions in memory (scaled to account for extra pixel density)
        let scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas
        this.canvas.width = this.width * scale;
        this.canvas.height = this.height * scale;

        // Normalize coordinate system to use css pixels
        this.ctx.scale(scale, scale);

        // Paint canvas
        this.canvas.style.backgroundColor = "#030710";

        // Calc X and Y distances for population
        this.xDistance = Math.trunc(this.width / (this.config.field.x + 1));
        this.yDistance = Math.trunc(this.height / (this.config.field.y + 1));

        // Instanciate sounds effects
        this.sounds.tapCorrect = new Howl({ src: ['sounds/game-tap.mp3'], volume: .05 });
        this.sounds.tapWrong = new Howl({ src: ['sounds/game-wrong-tap.mp3'], volume: .15  });
        this.sounds.win = new Howl({ src: ['sounds/game-win.mp3'], volume: .4 });
        this.sounds.lose = new Howl({ src: ['sounds/game-lose.mp3'], volume: .4 });
        this.sounds.bg = new Howl({ src: ['sounds/game-background.mp3'], loop: true, volume: 0.2 });

        // Intanciate population
        this.initGame();

        // Add listeners on canvas
        this.canvas.addEventListener('click', this.click);
        if (this.config.debug) { // Enable hack on debug mode
          let clicked = false;
          let downListener = (event) => { clicked = true; };
          let moveListener = (event) => { if (clicked) { this.click(event); } };
          let upListener = (event) => { clicked = false; };
          this.canvas.addEventListener('mousedown', downListener);
          this.canvas.addEventListener('mousemove', moveListener);
          this.canvas.addEventListener('mouseup', upListener);
        }
      },
      cleanScore: function() { // Reset score to initial values
        this.score.imune = 0;
        this.score.healthy = 97;
        this.score.sick = 3;
      },
      initGame: function () { // Intanciate population
        // Clean old values if exists
        this.centersArray = [];
        this.population = [];

        // Calc people`s centers array
        for (let xCurrent = 0, x = 1; x <= this.config.field.x; x++) {
          xCurrent += this.xDistance;

          for (let yCurrent = 0, y = 1; y <= this.config.field.y; y++) {
            yCurrent += this.yDistance;
            this.centersArray.push({
              x: xCurrent,
              y: yCurrent,
            });
          }
        }

        // Reset score to initial values
        this.cleanScore();

        // Set ramdomly initial infected people
        let infected = [];
        let infectedPosition = [];
        let allowedPosition = []
        for (let i = 1; i <= this.config.field.x * this.config.field.y; i++) {
          if (
            !(i % this.config.field.y === 1) && // First Row
            !(i % this.config.field.y === 0) && // Last Row
            !(i <= this.config.field.y) && // First Column
            !(i >= (this.config.field.x * this.config.field.y) - (this.config.field.y - 1)) // Last Collum
          ) {
            allowedPosition.push(i);
          } else {
            allowedPosition.push(i);
          }
        }
        for (let i = 0; i < this.config.infection.initInfected; i++) {
          infectedPosition.push(this.randomIntFromRange(0, allowedPosition.length - 1, infectedPosition));
          infected.push(allowedPosition[infectedPosition[i]]);
        }

        // Dependencies for instanciate Person class
        let counter = 1;
        let distances = {
          x: this.xDistance,
          y: this.yDistance,
        }
        let disease = {};

        // Instanciate each Person and add to Population array
        this.centersArray.forEach(center => {
          let status = 1; // Init status: 1 = healthy; 2 = Immune; 3 = Infected

          // Randomly choose what directions will spread disease
          let diseaseArms = {
            top:          { enabled: Math.random() >= 0.5, size: 0, infected: false, },
            right:        { enabled: Math.random() >= 0.5, size: 0, infected: false, },
            bottom:       { enabled: Math.random() >= 0.5, size: 0, infected: false, },
            left:         { enabled: Math.random() >= 0.5, size: 0, infected: false, },
            topRight:     { enabled: Math.random() >= 0.5, infected: false, },
            bottomRight:  { enabled: Math.random() >= 0.5, infected: false, },
            bottomLeft:   { enabled: Math.random() >= 0.5, infected: false, },
            topLeft:      { enabled: Math.random() >= 0.5, infected: false, },
          };

          // Randomly choose velocity to spread
          if (document.body.clientWidth >= 100) {
            disease = {
              top:          this.randomIntFromRange(this.config.infection.velocityDesk.axes.min, this.config.infection.velocityDesk.axes.max),
              right:        this.randomIntFromRange(this.config.infection.velocityDesk.axes.min, this.config.infection.velocityDesk.axes.max),
              bottom:       this.randomIntFromRange(this.config.infection.velocityDesk.axes.min, this.config.infection.velocityDesk.axes.max),
              left:         this.randomIntFromRange(this.config.infection.velocityDesk.axes.min, this.config.infection.velocityDesk.axes.max),
              topRight:     this.randomIntFromRange(this.config.infection.velocityDesk.diag.min, this.config.infection.velocityDesk.diag.max),
              bottomRight:  this.randomIntFromRange(this.config.infection.velocityDesk.diag.min, this.config.infection.velocityDesk.diag.max),
              bottomLeft:   this.randomIntFromRange(this.config.infection.velocityDesk.diag.min, this.config.infection.velocityDesk.diag.max),
              topLeft:      this.randomIntFromRange(this.config.infection.velocityDesk.diag.min, this.config.infection.velocityDesk.diag.max),
            };
          } else {
            disease = {
              top:          this.randomIntFromRange(this.config.infection.velocityMobile.axes.min, this.config.infection.velocityMobile.axes.max),
              right:        this.randomIntFromRange(this.config.infection.velocityMobile.axes.min, this.config.infection.velocityMobile.axes.max),
              bottom:       this.randomIntFromRange(this.config.infection.velocityMobile.axes.min, this.config.infection.velocityMobile.axes.max),
              left:         this.randomIntFromRange(this.config.infection.velocityMobile.axes.min, this.config.infection.velocityMobile.axes.max),
              topRight:     this.randomIntFromRange(this.config.infection.velocityMobile.diag.min, this.config.infection.velocityMobile.diag.max),
              bottomRight:  this.randomIntFromRange(this.config.infection.velocityMobile.diag.min, this.config.infection.velocityMobile.diag.max),
              bottomLeft:   this.randomIntFromRange(this.config.infection.velocityMobile.diag.min, this.config.infection.velocityMobile.diag.max),
              topLeft:      this.randomIntFromRange(this.config.infection.velocityMobile.diag.min, this.config.infection.velocityMobile.diag.max),
            };
          }

          // Infect person if was previously choosed
          if (infected.includes(counter)) {
            status = 3;
            diseaseArms.top.enabled = true;
            disease.top = this.config.infection.velocityMobile.axes.min;
          }

          // Disabled disease arms for out of the field
          if (counter % this.config.field.y === 1) { // First row
            diseaseArms.top.enabled = false;
            diseaseArms.topRight.enabled = false;
            diseaseArms.topLeft.enabled = false;
          }
          if (counter % this.config.field.y === 0) { // Last row
            diseaseArms.bottom.enabled = false;
            diseaseArms.bottomLeft.enabled = false;
            diseaseArms.bottomRight.enabled = false;
          }
          if (counter <= this.config.field.y) { // First column
            diseaseArms.left.enabled = false;
            diseaseArms.topLeft.enabled = false;
            diseaseArms.bottomLeft.enabled = false;
          }
          if (counter >= (this.config.field.x * this.config.field.y) - (this.config.field.y - 1)) { // Last column
            diseaseArms.right.enabled = false;
            diseaseArms.topRight.enabled = false;
            diseaseArms.bottomRight.enabled = false;
          }

          // Instanciate Person and add to Population array
          this.population.push(new Person(center.x, center.y, disease, status, distances, diseaseArms, this.config.personRadius));

          counter++;
        });

        // Store surround people of each person to be infected later
        counter = 1;
        this.population.forEach(person => {
          let surroundPeople = [];

          // Get closest Person to each direction enabled
          if (person.diseaseArms.top.enabled) {
            surroundPeople.push({
              position: "top",
              person: this.population[(counter - 1) - 1],
            });
          }
          if (person.diseaseArms.topRight.enabled) {
            surroundPeople.push({
              position: "topRight",
              person: this.population[(counter + (this.config.field.y - 1)) - 1],
            });
          }
          if (person.diseaseArms.right.enabled) {
            surroundPeople.push({
              position: "right",
              person: this.population[(counter + this.config.field.y) - 1],
            });
          }
          if (person.diseaseArms.bottomRight.enabled) {
            surroundPeople.push({
              position: "bottomRight",
              person: this.population[(counter + (this.config.field.y + 1)) - 1],
            });
          }
          if (person.diseaseArms.bottom.enabled) {
            surroundPeople.push({
              position: "bottom",
              person: this.population[(counter + 1) - 1],
            });
          }
          if (person.diseaseArms.bottomLeft.enabled) {
            surroundPeople.push({
              position: "bottomLeft",
              person: this.population[(counter - (this.config.field.y - 1)) - 1],
            });
          }
          if (person.diseaseArms.left.enabled) {
            surroundPeople.push({
              position: "left",
              person: this.population[(counter - this.config.field.y) - 1],
            });
          }
          if (person.diseaseArms.topLeft.enabled) {
            surroundPeople.push({
              position: "topLeft",
              person: this.population[(counter - (this.config.field.y + 1)) - 1],
            });
          }

          // Save closest people into each Person (to be infected later)
          person.setMounted(surroundPeople);

          counter++;
        });
      },
      click: function(event) { // Apply vaccine on population
        let rect = event.target.getBoundingClientRect();
        let x = event.clientX - rect.left; // x position within the element.
        let y = event.clientY - rect.top;  // y position within the element.
        this.population.forEach(person => {
          if (this.getDistance(x, y, person.center.x, person.center.y) < (this.config.clickRadius * 2)) {
            var click = person.applyVaccine();
            if (this.soundStatus === 'on') {
              if (click) {
                this.sounds.tapCorrect.play();
              } else {
                this.sounds.tapWrong.play();
              }
            }
          }
        });
      },
      initTimer: function() {
        this.config.pausedTime = 0;
        this.config.framerate.then = window.performance.now();
        this.config.framerate.startTime = this.config.framerate.then;
      },
      pauseTimer: function() {
        this.config.pausedTime = this.getRemainingTime();
      },
      continueTimer: function() {
        this.config.framerate.then = window.performance.now();
        this.config.framerate.startTime = this.config.framerate.then;
      },
      startAnimating: function(fps) {
        this.config.framerate.fpsInterval = 1000 / fps;
        this.animate();
      },
      animate: function(timeStamp) {
        // Request another frame
        window.requestAnimationFrame(this.animate);

        if (this.status != 'playing') { return; }

        if (this.getRemainingTimeDisplay() === '0:00') {
          this.pauseGame();
          this.status = 'ended';
          return;
        }

        // Calc elapsed time since last loop
        this.config.framerate.now = timeStamp;
        this.config.framerate.elapsed = this.config.framerate.now - this.config.framerate.then;

        // If enough time has elapsed, draw the next frame
        if (this.config.framerate.elapsed > this.config.framerate.fpsInterval) {
          // Get ready for next frame by setting then = now, but...
          // Also, adjust for fpsInterval not being multiple of 16.67
          this.config.framerate.then = this.config.framerate.now - (this.config.framerate.elapsed % this.config.framerate.fpsInterval);

          // Clear canvas
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

          // Draw field guidelines
          for (let xCurrent = 0, x = 1; x <= this.config.field.x; x++) { // Horizontal guidelines
            xCurrent += this.xDistance;

            this.ctx.beginPath();
            this.ctx.moveTo(xCurrent, this.yDistance);
            this.ctx.lineTo(xCurrent, this.yDistance * this.config.field.y);
            this.ctx.lineWidth = .5;
            this.ctx.strokeStyle = 'rgba(255, 255, 255, .2)';
            this.ctx.stroke();
          }
          for (let yCurrent = 0, y = 1; y <= this.config.field.y; y++) { // Vertical guidelines
            yCurrent += this.yDistance;

            this.ctx.beginPath();
            this.ctx.moveTo(this.xDistance, yCurrent);
            this.ctx.lineTo(this.xDistance * this.config.field.x, yCurrent);
            this.ctx.lineWidth = .5;
            this.ctx.strokeStyle = 'rgba(255, 255, 255, .2)';
            this.ctx.stroke();
          }

          // Update population and get it status
          let scores = [];
          this.population.forEach(person => {
            scores.push(person.update(this.ctx));
          });

          // Set score
          this.score.healthy = Math.round((this.countItems(scores, 1) / this.centersArray.length) * 100);
          this.score.imune = Math.round((this.countItems(scores, 2) / this.centersArray.length) * 100);
          this.score.sick = Math.round((this.countItems(scores, 3) / this.centersArray.length) * 100);

          // Show FPS on debug mode
          if (this.config.debug) {
            let sinceStart = this.config.framerate.now - this.config.framerate.startTime;
            let currentFps = Math.round(1000 / (sinceStart / ++this.config.framerate.frameCount) * 100) / 100;

            // Write FPS on canvas
            this.ctx.font = '25px Arial';
            this.ctx.fillStyle = 'white';
            this.ctx.fillText("Time passed: " + Math.floor(sinceStart / 1000) + " - FPS: " + currentFps, 10, 30);
          }
        }
      },
      randomIntFromRange: function(min, max, except) {
        if (except) {
          let number = Math.floor(Math.random() * (max - min + 1) + min);
          return (except.includes(number)) ? this.randomIntFromRange(min, max, except) : number;
        } else {
          return Math.floor(Math.random() * (max - min + 1) + min);
        }
      },
      countItems: function(arr, what){
        var count= 0, i;
        while((i= arr.indexOf(what, i))!= -1){
          ++count;
          ++i;
        }
        return count;
      },
      getDistance: function(x1, y1, x2, y2) {
        const xDist = x2 - x1;
        const yDist = y2 - y1;

        return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
      },
      getRemainingTime: function() { // Calc timer, return int value
        let time;

        if (this.config.pausedTime !== 0) {
          time = this.config.pausedTime - ((this.config.framerate.now - this.config.framerate.startTime) / 1000);
        } else {
          time = this.config.timer - ((this.config.framerate.now - this.config.framerate.startTime) / 1000);
        }

        if (isNaN(time)) { return; }

        return time;
      },
      getRemainingTimeDisplay: function() { // Format timer to display on HTML
        if (this.status === 'playing') {
          return formatTime(this.getRemainingTime());
        } else if (this.status === 'not-started') {
          return this.config.timer + 's';
        } else {
          return formatTime(this.config.pausedTime);
        }

        function formatTime(time) {
          return time > 0 ? time.toFixed(2).toString().split('.').join(':') : '0:00';
        };
      },
      playGame: function() {
        if (this.status === 'not-started') {
          this.initTimer();
          this.startAnimating(24);
        } else if (this.status === 'paused') {
          this.continueTimer();
        }

        this.status = 'playing';
      },
      pauseGame: function() {
        if (this.status === 'playing') {
          this.pauseTimer();
          this.status = 'paused';
        }
      },
      restartGame: function() {
        this.status = 'playing';
        this.initTimer();
        this.initGame();
      },
      switchSound: function() {
        if(this.soundStatus === 'on') {
          this.soundStatus = 'off';
        } else {
          this.soundStatus = 'on';
        }
      }
    },
    mounted() {
      if (window.innerWidth < 500) {
        this.width = 300;
        this.config.personRadius = 11;
      }

      if (window.innerWidth < 769) {
        this.height = this.$parent.$refs.refContainerGame.clientHeight - 115; // 115 = Mobile header height
      }

      let { refOverlayInitial, refOverlayPause, refCanvas } = this.$refs;
      TweenLite.to(refOverlayInitial, .5, { opacity: 1, display: 'block'});
      TweenLite.to(refCanvas, .5, { opacity: 0, display: 'none'});

      function onBlur() {
        this.pauseGame();
      }

      if (/*@cc_on!@*/false) { // Check for Internet Explorer
        document.onfocusout = onBlur.bind(this);
      } else {
        window.onblur = onBlur.bind(this);
      }

      function onResize() {
        this.init();
        this.status = 'not-started';

        if (window.innerWidth < 769) {
          this.height = this.$parent.$refs.refContainerGame.clientHeight - 115; // 115 = Mobile header height
        } else {
          this.height = 570;
        }

        this.initGame();
      }

      window.addEventListener("resize", onResize.bind(this));

      this.init();
    },
    watch: {
      status: function (val) {
        let { refOverlayInitial, refOverlayPause, refCanvas, refOverlayEnd } = this.$refs;

        if (val === 'paused') {
          TweenLite.to(refOverlayPause, .5, { opacity: 1, display: 'block'});
          TweenLite.to(refCanvas, .5, { opacity: 0, display: 'none'});

          if (this.soundStatus === 'on') {
            this.sounds.bg.pause();
          }
        } else if (val === 'playing') {
          TweenLite.to(refCanvas, .5, { opacity: 1, display: 'block'});
          TweenLite.to(refOverlayInitial, .5, { opacity: 0, display: 'none'});
          TweenLite.to(refOverlayPause, .5, { opacity: 0, display: 'none'});
          TweenLite.to(refOverlayEnd, .5, { opacity: 0, display: 'none'});
          if (this.soundStatus === 'on') {
            this.sounds.bg.play();
          }
        } else if (val === 'ended') {
          this.pauseTimer();

          TweenLite.to(refOverlayEnd, .5, { opacity: 1, display: 'block'});
          TweenLite.to(refCanvas, .5, { opacity: 0, display: 'none'});
          if (this.soundStatus === 'on') {
            this.sounds.bg.pause();
            this.sounds.bg.seek(0);
            if(this.score.imune >= 95) {
              this.sounds.win.play();
            } else {
              this.sounds.lose.play();
            }
          }
        }
      },
      'score.healthy': function (val) {
        if (val === 0) {
          setTimeout(() => {
            this.status = 'ended';
          }, 200);
        }
      },
      soundStatus: function (val) {
        if (val === 'off') {
          this.sounds.bg.pause();
        } else if (val === 'on' && this.status == 'playing') {
          this.sounds.bg.play();
        }
      }
    }
  }
</script>

<style lang="sass">
  $color-light-gray: 	#b2b2b2
  $color-orange: 			#ea9b1c

  .c-game
    width: 500px
    touch-action: manipulation
    display: block
    position: relative
    border-radius: 30px
    .icon
      width: 18px
      height: 18px
      vertical-align: -3px
      display: inline-block
    #game-header
      background-color: #0f111b
      border-radius: 30px 30px 0 0
    .container-tips
      position: absolute
      top: 0
      left: -230px
    .box-tip
      position: relative
      border: 1px solid rgba(91,173,224, .15)
      padding: 30px
      padding-top: 60px
      border-radius: 30px
      width: 200px
      background-color: rgba(#0f111b, .5)
      overflow: hidden
      margin-bottom: 30px
      h5
        position: absolute
        font-size: 60px
        color: rgba(91,173,224, .08)
        left: -5px
        top: -15px
      p
        margin: 0
        color: $color-light-gray
    [class*="btn-default"]
      display: inline-block
      padding: 8px 10px
      border-radius: 5px
      background: rgb(214,130,104)
      background: -moz-linear-gradient(90deg, rgba(214,130,104,1) 0%, rgba(223,97,57,1) 100%)
      background: -webkit-linear-gradient(90deg, rgba(214,130,104,1) 0%, rgba(223,97,57,1) 100%)
      background: linear-gradient(90deg, rgba(214,130,104,1) 0%, rgba(223,97,57,1) 100%)
      color: white
      font-weight: bold
      border: 0
      transform: scale(1)
      transition: transform .2s ease-out
      box-shadow: 0
      text-decoration: none
      &:hover
        transform: scale(1.05)
        text-decoration: none
      &:focus
        text-decoration: none
        border: 0
        box-shadow: 0
        outline: none
      &[class*="btn-default-orange"]
        background: -moz-linear-gradient(90deg, rgba(214,130,104,1) 0%, rgba(223,97,57,1) 100%)
        background: -webkit-linear-gradient(90deg, rgba(214,130,104,1) 0%, rgba(223,97,57,1) 100%)
        background: linear-gradient(90deg, rgba(214,130,104,1) 0%, rgba(223,97,57,1) 100%)
      &[class*="btn-default-blue"]
        background: rgb(91,173,224);
        background: -moz-linear-gradient(90deg, rgba(91,173,224,1) 0%, rgba(140,248,198,1) 100%)
        background: -webkit-linear-gradient(90deg, rgba(91,173,224,1) 0%, rgba(140,248,198,1) 100%)
        background: linear-gradient(90deg, rgba(91,173,224,1) 0%, rgba(140,248,198,1) 100%)
        color: #030710
    .game-font-timer
      font-size: 2.5rem
    .game-color-yellow
      color: #ea9b1c
    .game-color-blue
      color: #43B7F2
    .game-color-red
      color: #e36037
    .game-border-bottom
      border-bottom: 1px solid rgba($color-light-gray, .1)
    .game-clock
      display: inline-block
      position: relative
      width: 30px
      height: 30px
      border-radius: 50%
      border: 2px solid $color-orange
      &::before
        display: block
        content: " "
        width: 2px
        height: calc(40%)
        background-color: $color-orange
        position: absolute
        left: 50%
        margin-left: -1px
        top: 10%
        transform-origin: bottom center
        border-radius: 2px
        animation: rotating 2s linear infinite
        animation-play-state: running
      &::after
        display: block
        content: " "
        width: 2px
        height: calc(30%)
        background-color: $color-orange
        position: absolute
        left: 50%
        margin-left: -1px
        top: 20%
        transform-origin: bottom center
        border-radius: 2px
        animation: rotating 6s linear infinite
        animation-play-state: running
      &.gm-paused,
      &.gm-not-started,
      &.gm-ended
        &::before,
        &::after
          animation-play-state: paused
      span
        display: block
        position: absolute
        width: 4px
        height: 4px
        border-radius: 50%
        background-color: $color-orange
        top: 50%
        left: 50%
        margin-top: -2px
        margin-left: -2px
    .game-content
      position: relative
      background-color: #030710
      line-height: 25px
      overflow: hidden
      border-radius: 0 0 30px 30px
    .box-scoreboard 100 h-100p
    .icon-face
      width: 25px
      height: 25px
    .icon-face-md
      width: 35px
      height: 35px
    [id*="game-overlay"]
      position: absolute
      z-index: 2
      background-repeat: repeat
      background-position: 0 0
      background-size: auto 100%
      animation: animatedBackground 250s linear infinite
      display: none
      opacity: 0
    #c-game-canvas
      position: absolute
      z-index: 1
    [id*="game-btn-"]
      display: inline-block
      background-color: transparent
      border: 0
      color: $color-light-gray
      position: relative
      padding: 0px 13px
      outline: 0
      &:focus,
      &:active
        outline: 0
      &.disabled
        opacity: .2
      &::before,
      &::after
        display: block
        content: " "
        position: absolute
        background-color: $color-light-gray
      &#game-btn-pause
        &::before,
        &::after
          width: 3px
          height: 12px
          top: 50%
          margin-top: -6px
          transition: all 0.2s ease-out
          opacity: 1
        &::before
          left: 0
        &::after
          left: 5px
      &#game-btn-sound
        &::before
          width: 3px
          height: 8px
          top: 50%
          margin-top: -4px
        &::before
          left: 0
        &::after
          transition: all 0.2s ease-out
          top: 50%
          margin-top: -6px
          left: 0
          background-color: transparent
          width: 0
          height: 0
          border-top: 6px solid transparent
          border-right: 10px solid $color-light-gray
          border-bottom: 6px solid transparent
        &.gm-sound-on
          &.gm-playing
            &::after
              animation: pulsing 1s linear infinite
        &.gm-sound-off
          &::after
            opacity: .2

  @keyframes animatedBackground
    from
      background-position: 0 0
    to
      background-position: -1000px 0

  @keyframes rotating
    from
      -ms-transform: rotate(0deg)
      -moz-transform: rotate(0deg)
      -webkit-transform: rotate(0deg)
      -o-transform: rotate(0deg)
      transform: rotate(0deg)
    to
      -ms-transform: rotate(360deg)
      -moz-transform: rotate(360deg)
      -webkit-transform: rotate(360deg)
      -o-transform: rotate(360deg)
      transform: rotate(360deg)

  @keyframes pulsing
    0%
      -ms-transform: scale(.9)
      -moz-transform: scale(.9)
      -webkit-transform: scale(.9)
      -o-transform: scale(.9)
      transform: scale(.9)
    50%
      -ms-transform: scale(1.1)
      -moz-transform: scale(1.1)
      -webkit-transform: scale(1.1)
      -o-transform: scale(1.1)
      transform: scale(1.1)
    0%
      -ms-transform: scale(.9)
      -moz-transform: scale(.9)
      -webkit-transform: scale(.9)
      -o-transform: scale(.9)
      transform: scale(.9)

  @include media-breakpoint-down(lg)

  @include media-breakpoint-down(md)

  @include media-breakpoint-down(sm)
    .c-game
      .container-tips
        display: none

  @include media-breakpoint-down(xs)
    .c-game
      border-radius: 0 0 0 0
      #game-header
        border-radius: 0 0 0 0
      .game-content
        border-radius: 0 0 0 0
      .game-font-timer
        font-size: 2rem
</style>
