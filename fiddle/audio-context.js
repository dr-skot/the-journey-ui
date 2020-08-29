
let delayNode;
function init() {
  console.log('init');
  const audioContext = new AudioContext();
  console.log('got context', audioContext, 'with destination', audioContext.destination);
  navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then((stream) => {
      console.log('got stream', stream);
      const tracks = stream.getAudioTracks();
      console.log('with tracks', tracks);
      const newStream = new MediaStream([tracks[0]]);
      const streamNode = audioContext.createMediaStreamSource(newStream);
      delayNode = audioContext.createDelay(10);
      delayNode.delayTime.value = 9;
      streamNode.connect(delayNode);
      delayNode.connect(audioContext.destination);
    });
}

function setDelay(n) {
  console.log('setting delay to', n);
  delayTime.delayTime.value = n;
}

