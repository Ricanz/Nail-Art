const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');

// Load images for each finger
const nailImages = {
  4: new Image(),  // Thumb tip
  8: new Image(),  // Index tip
  12: new Image(), // Middle tip
  16: new Image(), // Ring tip
  20: new Image(), // Pinky tip
};

nailImages[4].src = 'assets/nail-thumb.png';
nailImages[8].src = 'assets/nail-index.png';
nailImages[12].src = 'assets/nail-middle.png';
nailImages[16].src = 'assets/nail-ring.png';
nailImages[20].src = 'assets/nail-pinky.png';

const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.8,
  minTrackingConfidence: 0.8
});

hands.onResults((results) => {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  if (results.multiHandLandmarks.length > 0) {
    const landmarks = results.multiHandLandmarks[0];

    const nailIndices = [4, 8, 12, 16, 20];

    nailIndices.forEach((index) => {
      const point = landmarks[index];
      const x = point.x * canvasElement.width;
      const y = point.y * canvasElement.height;

      const size = 25;
      const img = nailImages[index];
      if (img.complete) {
        canvasCtx.drawImage(img, x - size / 2, y - (size - 15) / 2, size, (size - 10));
      }
    });
  }

  canvasCtx.restore();
});

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 640,
  height: 480
});
camera.start();