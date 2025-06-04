<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {}
  },
  created() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
#app {
  // display: flex;
  // height: auto;
}

.backtop {
  width: 52px;
  height: 52px;
  box-shadow: 0 6px 16px 0 rgba(#00519f, 0.12);

  &__icon.svg-icon {
    width: 28px;
    height: 28px;
    color: var(--color-black);
  }
}
</style>
