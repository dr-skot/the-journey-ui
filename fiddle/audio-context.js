
let delayNode;
function init() {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContext();
  navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then((stream) => {
      const tracks = stream.getAudioTracks();
      const newStream = new MediaStream([tracks[0]]);
      const streamNode = audioContext.createMediaStreamSource(newStream);
      delayNode = audioContext.createDelay(10);
      delayNode.delayTime.value = 9;
      streamNode.connect(delayNode);
      delayNode.connect(audioContext.destination);
    });
}

function setDelay(n) {
  delayNode.delayTime.value = n;
}

