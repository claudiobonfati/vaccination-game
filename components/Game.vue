<template lang="html">
  <div class="c-game shadow-lg" :style="{width: width + 'px'}">
    <div id="game-header" class="px-3 px-sm-4 px-md-5 py-3 py-md-4">
      <div class="row justify-content-center align-items-center no-gutters">
        <div class="col-6 pr-0 text-left">
          <h4 class="game-font-timer font-weight-normal d-flex align-items-center">
            <span class="game-clock mr-1" :class="'gm-'+status"><span></span></span>
            <span>
              {{ getRemainingTimeDisplay() }}
            </span>
          </h4>
          <button id="game-btn-pause">
            Pause
          </button>
          <button id="game-btn-sound">
            Sound
          </button>
        </div>
        <div class="col-6 pl-3 box-scoreboard">
          <p class="mb-1 small d-flex align-items-center">
            <img class="icon-face mr-1" src="~/assets/images/game-face-imune.svg" alt="Vaccinated">
            <span class="game-border-bottom">Vaccinated:</span>
            <b class="game-color-yellow w-100 score-percent text-right game-border-bottom">00%</b>
          </p>
          <p class="mb-1 small d-flex align-items-center">
            <img class="icon-face mr-1" src="~/assets/images/game-face-healthy.svg" alt="Healthy">
            <span class="game-border-bottom">Healthy:</span>
            <b class="game-color-blue w-100 score-percent text-right game-border-bottom">00%</b>
          </p>
          <p class="mb-0 small d-flex align-items-center">
            <img class="icon-face mr-1" src="~/assets/images/game-face-sick.svg" alt="Infected">
            <span class="game-border-bottom">Infected:</span>
            <b class="game-color-red w-100 score-percent text-right game-border-bottom">00%</b>
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
            <button class="btn btn-default-orange w-100">
              Restart
            </button>
          </div>
        </div>
      </div>
      <div id="game-overlay-end" class="w-100 h-100 text-left" ref="refOverlayEnd">
        <div class="row no-gutters w-100 h-100 align-items-center justify-content-center">
          <section class="col-md-7 col-8 pb-5 text-center">
            <h5 class="mb-2 h3 font-weight-bold">
              {{ content.win.title }}
            </h5>
            <p class="mb-3" v-html="content.win.description"></p>
            <br>
            <button class="btn btn-default-blue w-100 mb-3">
              Play again
            </button>
            <a class="btn btn-default-orange w-100" href="https://youtu.be/oBSandHijDc?t=6" target="_blank">
              Learn more <feather type="external-link" class="icon"></feather>
            </a>
          </section>
          <section class="col-md-7 col-8 pb-5 text-center">
            <h5 class="mb-2 d-flex align-items-center h3 font-weight-bold">
              {{ content.lose.title }}
            </h5>
            <p class="mb-3" v-html="content.lose.description"></p>
            <br>
            <button class="btn btn-default-blue w-100 mb-3">
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
          framerate: {          // Vars needed to FPS and Timer counters
            frameCount: 0,
            fpsInterval: 0,
            startTime: 0,
            now: 0,
            then: 0,
            elapsed: 0,
          },
        },
        status: 'not-started',  // Game status: 'not-started', 'paused', 'playing' or 'ended'
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
            title: 'Congratulations, successfully eradicated disease!',
            description: 'Did you know that in order to <strong style="color: #ea9b1c;">eradicate</strong> a disease <strong style="color: #ea9b1c;">95%</strong> of the population needs to be immunized?',
          },
          lose: {
            title: 'Too bad... you need to be faster!',
            description: 'Did you know that in order to <strong style="color: #ea9b1c;">eradicate</strong> a disease <strong style="color: #ea9b1c;">95%</strong> of the population needs to be immunized?',
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

      function onResize() {
        this.init();
        this.status = 'not-started';

        if (window.innerWidth < 769) {
          this.height = this.$parent.$refs.refContainerGame.clientHeight - 115; // 115 = Mobile header height
        } else {
          this.height = 570;
        }
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
        } else if (val === 'playing') {
          TweenLite.to(refCanvas, .5, { opacity: 1, display: 'block'});
          TweenLite.to(refOverlayInitial, .5, { opacity: 0, display: 'none'});
          TweenLite.to(refOverlayPause, .5, { opacity: 0, display: 'none'});
          TweenLite.to(refOverlayEnd, .5, { opacity: 0, display: 'none'});
        } else if (val === 'ended') {
          this.pauseTimer();

          TweenLite.to(refOverlayEnd, .5, { opacity: 1, display: 'block'});
          TweenLite.to(refCanvas, .5, { opacity: 0, display: 'none'});
        }
      }
    }
  }
</script>

<style lang="sass">
  $color-light-gray: 	#b2b2b2
  $color-orange: 			#ea9b1c

  .c-game
    background-color: #0f111b
    width: 500px
    touch-action: manipulation
    display: block
    position: relative
    .icon
      width: 18px
      height: 18px
      vertical-align: -3px
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

  @include media-breakpoint-down(lg)

  @include media-breakpoint-down(md)

  @include media-breakpoint-down(sm)

  @include media-breakpoint-down(sm)
    .c-game
      .game-font-timer
        font-size: 2rem
</style>
