<template>
  <div class="not-found-box">
    <div class="number-wrap">
      <span>4</span>
      <span class="animate-number">0</span>
      <span>4</span>
    </div>
    <p class="tip">Page Not Found</p>
  </div>
</template>

<script>
export default {
  name: 'Page404',
}
</script>
<style lang="scss" scoped>
.not-found-box {
  margin-top: 164px;
  margin-bottom: 41vh;
}

.number-wrap {
  @include flexLayout(center, center);

  font-size: 120px;
  font-weight: bold;
  color: var(--blue);
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}

.animate-number {
  animation: 3s rotate infinite both;
}

.tip {
  margin-top: 16px;
  font-size: 20px;
  color: var(--color-gray);
  text-align: center;
}
</style>
