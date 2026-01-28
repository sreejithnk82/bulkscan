function scanNew() {
  stopBarcodeScan();
  stopPhotoCamera();

  document.getElementById("barcodeInput").value = "";
  document.getElementById("nameInput").value = "";
  document.getElementById("phoneInput").value = "";
  document.getElementById("addressInput").value = "";

  document.getElementById("canvas").hidden = true;
}

function parseAddressText(text) {
  const phone = text.match(/\b[6-9]\d{9}\b/)?.[0] || "";

  const lines = text
    .split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 3);

  document.getElementById("nameInput").value = lines[0] || "";
  document.getElementById("phoneInput").value = phone;
  document.getElementById("addressInput").value = lines.join(", ");
}

function confirmEntry() {
  alert("Saved (IndexedDB + Export next)");
}
