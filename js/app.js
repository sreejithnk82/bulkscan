const App = {
  bookings: [],
  current: {},
  html5QrCode: null, // store Html5Qrcode instance
  init: function () {
    this.showStep("step-barcode");
    this.startBarcodeScanner();
  },

  // --- Step navigation ---
  showStep: function (id) {
    document.querySelectorAll(".step-view").forEach((s) => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
  },

  // --- Barcode scanning ---
  startBarcodeScanner: function () {
    const containerId = "barcode-scanner-container";

    // Stop previous scanner if exists
    if (this.html5QrCode) {
      try {
        this.html5QrCode.stop().then(() => this.html5QrCode.clear()).catch(() => {});
      } catch (e) { console.log("Previous scanner stop error", e); }
    }

    this.html5QrCode = new Html5Qrcode(containerId);
    const config = { fps: 10, qrbox: { width: 250, height: 150 } };

    this.html5QrCode.start(
      { facingMode: "environment" },
      config,
      (decodedText) => {
        document.getElementById("barcode-input").value = decodedText;
        // Stop after successful scan
        this.html5QrCode.stop().then(() => this.html5QrCode.clear()).catch(() => {});
      },
      (err) => {
        // Ignore scan errors
      }
    ).catch((err) => {
      console.log("Camera start failed:", err);
      alert("Camera access failed. Please enter barcode manually.");
    });
  },

  barcodeScanned: function (decodedText) {
    document.getElementById("barcode-input").value = decodedText;
    if (this.html5QrCode) {
      this.html5QrCode.stop().then(() => this.html5QrCode.clear()).catch(() => {});
    }
  },

  proceedFromBarcode: function () {
    const code = document.getElementById("barcode-input").value.trim();
    if (!code) {
      alert("Please scan or enter a barcode");
      return;
    }

    this.current = { barcode: code };
    this.showStep("step-address");
    PhotoCamera.startVideo(); // start address camera

    // Stop scanner if still running
    try { this.html5QrCode.stop().then(() => this.html5QrCode.clear()).catch(() => {}); } catch (e) {}
  },

  // --- Step 2: Address capture ---
  captureAddress: async function () {
    const canvas = PhotoCamera.capturePhoto();
    PhotoCamera.stopVideo();

    const text = await OCR.recognize(canvas);
    const data = Parser.parse(text);

    this.current = { ...this.current, ...data };
    document.getElementById("review-name").value = data.name;
    document.getElementById("review-phone").value = data.phone;
    document.getElementById("review-address").value = data.address;
    document.getElementById("review-city").value = data.city;
    document.getElementById("review-pin").value = data.pin;

    this.showStep("step-review");
  },

  // --- Go back ---
  goBack: function (step) {
    if (step === 1) {
      this.showStep("step-barcode");
      document.getElementById("barcode-input").value = "";
      this.startBarcodeScanner();
    }
    if (step === 2) {
      this.showStep("step-address");
      PhotoCamera.startVideo();
    }
  },

  // --- Step 3: Review and save ---
  saveBooking: function () {
    this.current.name = document.getElementById("review-name").value;
    this.current.phone = document.getElementById("review-phone").value;
    this.current.address = document.getElementById("review-address").value;
    this.current.city = document.getElementById("review-city").value;
    this.current.pin = document.getElementById("review-pin").value;

    this.bookings.push({ ...this.current });
    document.getElementById("booking-count").textContent = this.bookings.length;

    this.showStep("step-actions");
  },

  // --- Scan new packet ---
  scanNew: function () {
    this.current = {};
    document.getElementById("barcode-input").value = "";
    this.showStep("step-barcode");

    // Start fresh scanner
    this.startBarcodeScanner();
  },

  // --- Export all ---
  exportAll: function () {
    if (!this.bookings.length) { alert("No data to export"); return; }

    const blob = new Blob([JSON.stringify(this.bookings, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "courier_bookings.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    if (confirm("Exported. Clear session?")) this.clearAll();
  },

  // --- Clear all ---
  clearAll: function () {
    this.bookings = [];
    document.getElementById("booking-count").textContent = 0;
    this.scanNew();
  }
};

// Initialize app
document.addEventListener("DOMContentLoaded", () => App.init());
