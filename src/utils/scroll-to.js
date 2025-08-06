/**
 * 滚动到指定位置
 * @param {number} to 目标位置
 * @param {number} duration 动画持续时间
 * @param {Function} callback 回调函数
 */
export default function scrollTo(to, duration, callback) {
  const start = window.pageYOffset
  const change = to - start
  const increment = 20
  let currentTime = 0

  const animateScroll = () => {
    currentTime += increment
    const val = easeInOutQuad(currentTime, start, change, duration)
    window.scrollTo(0, val)
    if (currentTime < duration) {
      setTimeout(animateScroll, increment)
    } else {
      if (callback && typeof callback === 'function') {
        callback()
      }
    }
  }
  animateScroll()
}

/**
 * 缓动函数
 */
function easeInOutQuad(t, b, c, d) {
  t /= d / 2
  if (t < 1) return c / 2 * t * t + b
  t--
  return -c / 2 * (t * (t - 2) - 1) + b
} 