<template lang="html">
  <div class="c-game shadow-lg">
    GAME GOES HERE =)
  </div>
</template>

<script>
  export default {
    name: 'Game',
    data: function() {
      return {
      }
    },
    methods: {
    },
    mounted() {
    }
  }
</script>

<style lang="sass">
  .c-game
    background-color: #0f111b
    width: 500px
    touch-action: manipulation
    display: block
    position: relative

  @include media-breakpoint-down(lg)

  @include media-breakpoint-down(md)

  @include media-breakpoint-down(sm)

  @include media-breakpoint-down(sm)

</style>
