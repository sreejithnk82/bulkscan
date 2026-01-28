let currentBarcode = "";

function show(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function goAddress() {
  currentBarcode = barcodeInput.value.trim();
  if (!currentBarcode) return alert("Barcode required");
  stopBarcodeCamera();
  show("page-address");
  startAddressCamera();
}

function backBarcode() {
  stopAddressCamera();
  show("page-barcode");
  startBarcodeCamera();
}

function captureAddress() {
  stopAddressCamera();
  show("page-done");
}

function scanNew() {
  barcodeInput.value = "";
  show("page-barcode");
  startBarcodeCamera();
}
