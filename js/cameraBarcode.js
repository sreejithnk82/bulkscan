let barcodeScanner = null;

async function startBarcodeCamera() {
  await stopBarcodeCamera();

  const box = document.getElementById("barcode-box");
  box.innerHTML = "<div id='barcodeCam'></div>";

  setTimeout(() => {
    barcodeScanner = new Html5Qrcode("barcodeCam");
    barcodeScanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      txt => {
        barcodeInput.value = txt;
        barcodeScanner.stop();
      }
    );
  }, 300);
}

async function stopBarcodeCamera() {
  if (barcodeScanner) {
    try { await barcodeScanner.stop(); } catch {}
    barcodeScanner = null;
  }
}

startBarcodeCamera();
