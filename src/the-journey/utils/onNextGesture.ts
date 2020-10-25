const gestures = ['touchstart', 'click', 'keydown'];

export default function onNextGesture(callback: EventListener) {
  gestures.forEach((type) => {
    window.addEventListener(type, function handler(event: Event) {
      gestures.forEach((type) => window.removeEventListener(type, handler));
      callback(event);
    });
  });
}
