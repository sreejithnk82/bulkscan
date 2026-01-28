let barcodeStream = null;
let barcodeReader = null;

const video = document.getElementById("video");

async function startBarcodeScan() {
  stopBarcodeScan();

  barcodeStream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" }
  });

  video.srcObject = barcodeStream;

  barcodeReader = new ZXing.BrowserBarcodeReader();

  barcodeReader.decodeFromVideoElement(video, (result) => {
    if (result) {
      document.getElementById("barcodeInput").value = result.text;
      stopBarcodeScan();
    }
  });
}

function stopBarcodeScan() {
  if (barcodeReader) {
    barcodeReader.reset();
    barcodeReader = null;
  }

  if (barcodeStream) {
    barcodeStream.getTracks().forEach(t => t.stop());
    barcodeStream = null;
  }
}
