export default function onNextGesture(callback: EventListener) {
  const listenerTypes = ['touchstart', 'click', 'keydown'];
  const callbackOnce = (event: Event) => {
    listenerTypes.forEach((type) => {
      document.removeEventListener(type, callbackOnce);
    });
    callback(event);
  }
  listenerTypes.forEach((type) => {
    document.addEventListener(type, callbackOnce, { once: true });
  });
}
