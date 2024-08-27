export function throttle(func, delay) {
  let lastCall = 0; // 上一次执行函数的时间戳

  return function (...args) {
    const now = new Date().getTime();

    // 如果当前时间与上次调用时间的差值大于设置的延迟时间，则调用函数
    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}

export function debounce(func, delay) {
  let timeoutId; // 用于存储定时器的 ID

  return function (...args) {
    // 如果之前存在定时器，则清除它
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // 创建一个新的定时器，延迟执行函数
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
