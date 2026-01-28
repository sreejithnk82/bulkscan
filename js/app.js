const App = {
  bookings: [],
  current: {},
  
  init: function() {
    this.showStep("step-barcode");
    this.startBarcodeScanner();
  },

  showStep: function(id) {
    document.querySelectorAll(".step-view").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
  },

  // -------- Step 1: Barcode Scanner --------
 startBarcodeScanner: function() {
    const containerId = "barcode-scanner-container";

    // If scanner exists, clear it first
    if (this.html5QrCode) {
        this.html5QrCode.clear().catch(() => {});
    }

    this.html5QrCode = new Html5Qrcode(containerId);

    const config = { fps: 10, qrbox: { width: 250, height: 150 } };

    this.html5QrCode.start(
        { facingMode: "environment" },
        config,
        decodedText => {
            document.getElementById("barcode-input").value = decodedText;
            // Stop scanner after successful scan
            this.html5QrCode.stop()
                .then(() => this.html5QrCode.clear())
                .catch(() => {});
        },
        err => {
            // Ignore scan errors
        }
    ).catch(err => {
        console.log("Barcode camera start failed:", err);
        alert("Camera access failed. Please enter manually.");
    });
},

  barcodeScanned: function(decodedText) {
    document.getElementById("barcode-input").value = decodedText;
    BarcodeCamera.stop(); // Stop after successful scan
  },

  proceedFromBarcode: function() {
    const code = document.getElementById("barcode-input").value.trim();
    if(!code) {
      alert("Please scan or enter a barcode");
      return;
    }

    this.current = { barcode: code };
    this.showStep("step-address");

    // Start address camera
    try { PhotoCamera.startVideo(); } catch(e){ console.log("Address camera error", e); }

    // Ensure barcode scanner stopped
    try { BarcodeCamera.stop(); } catch(e){ console.log("Scanner stop error", e); }
  },

  // -------- Step 2: Capture Address --------
  captureAddress: async function() {
    const canvas = PhotoCamera.capturePhoto();
    PhotoCamera.stopVideo();

    const text = await OCR.recognize(canvas);
    const data = Parser.parse(text); // should return {name, phone, address, city, pin}

    this.current = {...this.current, ...data};

    // Fill review inputs
    document.getElementById("review-name").value = data.name || "";
    document.getElementById("review-phone").value = data.phone || "";
    document.getElementById("review-address").value = data.address || "";
    document.getElementById("review-city").value = data.city || "";
    document.getElementById("review-pin").value = data.pin || "";

    this.showStep("step-review");
  },

  // -------- Step Navigation --------
  goBack: function(step) {
    if(step === 1){
      this.showStep("step-barcode");
      this.startBarcodeScanner();
    }
    if(step === 2){
      this.showStep("step-address");
      PhotoCamera.startVideo();
    }
  },

  // -------- Step 3: Review & Save --------
  saveBooking: function() {
    this.current.name = document.getElementById("review-name").value;
    this.current.phone = document.getElementById("review-phone").value;
    this.current.address = document.getElementById("review-address").value;
    this.current.city = document.getElementById("review-city").value;
    this.current.pin = document.getElementById("review-pin").value;

    this.bookings.push({...this.current});
    document.getElementById("booking-count").textContent = this.bookings.length;

    this.showStep("step-actions");
  },

  // -------- Actions --------
  scanNew: function() {
    this.current = {};
    document.getElementById("barcode-input").value = "";

    // Stop previous scanner if running
    if (this.html5QrCode && this.html5QrCode.isScanning) {
        this.html5QrCode.stop()
            .then(() => this.html5QrCode.clear())
            .catch(() => {});
    }

    this.showStep("step-barcode");
    this.startBarcodeScanner();
},

  exportAll: function() {
    if(!this.bookings.length){ 
      alert("No data to export"); 
      return; 
    }

    const blob = new Blob([JSON.stringify(this.bookings, null, 2)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; 
    a.download = "courier_bookings.json"; 
    document.body.appendChild(a); 
    a.click(); 
    document.body.removeChild(a);

    if(confirm("Exported. Clear session?")) this.clearAll();
  },

  clearAll: function() {
    this.bookings = [];
    document.getElementById("booking-count").textContent = 0;
    this.scanNew();
  }
};

// Init app on page load
document.addEventListener("DOMContentLoaded", () => App.init());
