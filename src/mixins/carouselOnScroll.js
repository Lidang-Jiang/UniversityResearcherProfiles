import debounce from 'lodash.debounce'

function cubic(value) {
  return Math.pow(value, 3)
}

function easeInOutCubic(value) {
  return value < 0.5 ? cubic(value * 2) / 2 : 1 - cubic((1 - value) * 2) / 2
}

export default {
  mounted() {
    const rAF = window.requestAnimationFrame || ((func) => setTimeout(func, 16.67))
    let scrolling = false
    let latestScrollTop = 0
    this.container = document.querySelector('#app')
    this.onScroll = debounce(() => {
      if (!this.$refs.carousel) return
      const el = this.container
      let bannerHeight = this.bannerHeight

      // banner 高度
      if (!bannerHeight) {
        const carouselBounding = this.$refs.carousel.$el.getBoundingClientRect()
        this.bannerHeight = bannerHeight = Math.floor(carouselBounding.height)
      }

      const maxScrollTop = Math.min(el.scrollHeight - el.clientHeight, bannerHeight)
      const currentScrollTop = Math.ceil(el.scrollTop)

      if (scrolling || currentScrollTop >= maxScrollTop || el.scrollTop === 0) {
        if (currentScrollTop >= maxScrollTop || el.scrollTop === 0) {
          latestScrollTop = currentScrollTop
          scrolling = false
        }
        return
      }

      const dir = el.scrollTop < latestScrollTop ? 'up' : 'down'
      const beginTime = Date.now()
      const frameFunc = () => {
        const progress = (Date.now() - beginTime) / 400
        if (dir === 'down') {
          if (progress < 1) {
            // el.scrollTop = bannerHeight * easeInOutCubic(progress)
            el.scrollTop = latestScrollTop + (bannerHeight - latestScrollTop) * easeInOutCubic(progress)
            rAF(frameFunc)
          } else {
            latestScrollTop = el.scrollTop = maxScrollTop
            scrolling = false
          }
        } else {
          if (progress < 1) {
            // el.scrollTop = bannerHeight * (1 - easeInOutCubic(progress))
            el.scrollTop = latestScrollTop * (1 - easeInOutCubic(progress))
            rAF(frameFunc)
          } else {
            latestScrollTop = el.scrollTop = 0
            scrolling = false
          }
        }
      }
      scrolling = true
      latestScrollTop = el.scrollTop
      rAF(frameFunc)
    }, 200)
    this.container.addEventListener('scroll', this.onScroll)
  },
  beforeDestroy() {
    this.container.removeEventListener('scroll', this.onScroll)
  },
}
