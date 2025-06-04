<template>
  <div v-if="visible" class="empty-box">
    <img src="@/assets/images/news-empty.png" class="empty-img" />
    <div class="empty-text">{{ text }}</div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: '暂无资讯',
    },
  },
}
</script>
<style lang="scss" scoped>
.empty-box {
  width: 100%;
  text-align: center;
}

.empty-img {
  width: 280px;
  height: 200px;
}

.empty-text {
  font-size: 16px;
  line-height: 22px;
  color: var(--color-gray);
}
</style>
