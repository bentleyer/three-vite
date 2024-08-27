export default class MyEmitter extends EventTarget {
  // 定义自定义方法来发射事件
  emit(eventName, detail = {}) {
    const event = new CustomEvent(eventName, { detail });
    this.dispatchEvent(event);
  }

  // 定义监听事件的方法
  on(eventName, callback) {
    this.addEventListener(eventName, callback);
  }

  // 定义移除事件监听的方法
  off(eventName, callback) {
    this.removeEventListener(eventName, callback);
  }
}
