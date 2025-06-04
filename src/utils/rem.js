;(function flexible(window, document) {
  const docEl = document.documentElement
  const dpr = window.devicePixelRatio || 1

  function setBodyFontSize() {
    if (document.body) {
      document.body.style.fontSize = 12 * dpr + 'px'
    } else {
      document.addEventListener('DOMContentLoaded', setBodyFontSize)
    }
  }
  setBodyFontSize()

  // set 1rem = viewWidth / 12
  function setRemUnit() {
    const width = Math.min(Math.max(docEl.clientWidth, 1366), 1920)
    const rem = width / 10
    docEl.style.fontSize = rem + 'px'
  }

  setRemUnit()

  // reset rem unit on page resize
  window.addEventListener('resize', setRemUnit)
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      setRemUnit()
    }
  })
})(window, document)
