let photoStream = null;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

async function startPhotoCamera() {
  stopPhotoCamera();

  photoStream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" }
  });

  video.srcObject = photoStream;
}

function stopPhotoCamera() {
  if (photoStream) {
    photoStream.getTracks().forEach(t => t.stop());
    photoStream = null;
  }
}

async function captureAddress() {
  await startPhotoCamera();

  canvas.hidden = false;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.filter = "grayscale(100%) contrast(160%)";
  ctx.drawImage(video, 0, 0);

  stopPhotoCamera();
  runOCR();
}

async function runOCR() {
  const worker = await Tesseract.createWorker("eng");
  const { data } = await worker.recognize(canvas);
  await worker.terminate();

  parseAddressText(data.text);
}
