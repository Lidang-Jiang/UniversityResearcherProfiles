<template>
  <div>
    <div class="comment-box">
      <img src="@/assets/images/icon_avatar.png" alt="avatar" class="avatar" />
      <div class="flex1">
        <div class="comment-data">
          <div class="username">{{ item.name }}</div>
          <div class="date">{{ item.date }}</div>
        </div>
        <div class="content">{{ item.content }}</div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    isResponse: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
<style lang="scss" scoped>
.comment-box {
  @include flexLayout();
}

.comment-data {
  @include flexLayout(center, space-between);
}

.avatar {
  flex: none;
  width: 56px;
  height: 56px;
  margin-right: 16px;
}

.username {
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
}

.date {
  font-size: 14px;
  line-height: 20px;
  color: var(--color-gray);
}

.content {
  margin-top: 10px;
  font-size: 16px;
  line-height: 22px;
}
</style>
