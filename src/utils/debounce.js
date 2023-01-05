export function debounce(fn, delay = 0) {
  let timer;
  return (...args) => {
    if (timer) {
      window.clearTimeout(timer)
    }
    timer = window.setTimeout(() => {
      fn(...args);
    }, delay)
  }
}