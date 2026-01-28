let addressStream = null;

async function startAddressCamera() {
  const video = document.getElementById("addressVideo");
  addressStream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" }
  });
  video.srcObject = addressStream;
}

function stopAddressCamera() {
  if (addressStream) {
    addressStream.getTracks().forEach(t => t.stop());
    addressStream = null;
  }
}
