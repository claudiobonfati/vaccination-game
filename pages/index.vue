<template>
  <div class="full-page">
    <div class="game-container" ref="refContainerGame">
      <Game />
    </div>
  </div>
</template>

<script>
  import Game from "~/components/Game";

  export default {
    components: {
      Game
    },
  }
</script>

<style lang="sass">
  @import '~bootstrap/scss/functions'
  @import '~bootstrap/scss/variables'
  @import '~assets/sass/basics/bootstrap-override'
  @import '~bootstrap/scss/mixins'

  .full-page
    width: 100%
    height: 100%
    display: -ms-flexbox
    display: -webkit-flex
    display: flex
    -webkit-flex-direction: row
    -ms-flex-direction: row
    flex-direction: row
    -webkit-flex-wrap: nowrap
    -ms-flex-wrap: nowrap
    flex-wrap: nowrap
    -webkit-justify-content: center
    -ms-flex-pack: center
    justify-content: center
    -webkit-align-content: stretch
    -ms-flex-line-pack: stretch
    align-content: stretch
    -webkit-align-items: center
    -ms-flex-align: center
    align-items: center

  .game-container
    width: 500px
    border-radius: 30px
    overflow: hidden

  @include media-breakpoint-down(lg)

  @include media-breakpoint-down(md)

  @include media-breakpoint-down(sm)
    .game-container
      width: 400px

  @include media-breakpoint-down(xs)
    .game-container
      border-radius: 0
      width: 100%
      height: 100%
</style>
