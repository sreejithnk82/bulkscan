/*const BarcodeCamera = {
  scanner:null,
  start:function(onSuccess){
    if(this.scanner) this.scanner.clear().catch(()=>{});
    this.scanner = new Html5Qrcode("barcode-scanner-container");
    this.scanner.start({facingMode:"environment"}, {fps:10, qrbox:{width:250,height:150}}, onSuccess)
      .catch(err=>console.warn("Barcode camera start failed",err));
  },
  stop:function(){
    if(this.scanner) this.scanner.stop().then(()=>this.scanner.clear()).catch(()=>{});
  }
};*/
const BarcodeCamera = (function(){
  let scanner = null;
  let isRunning = false;

  return {
    start: function(onScanSuccess){
      const container = document.getElementById("barcode-scanner-container");
      
      // Stop previous scanner if exists
      if(scanner){
        try {
          scanner.stop().then(() => scanner.clear()).catch(()=>{});
          scanner = null;
          isRunning = false;
        } catch(e){ console.log("Stop error", e); }
      }

      scanner = new Html5Qrcode("barcode-scanner-container");
      const config = { fps: 10, qrbox: { width: 250, height: 150 } };
      
      scanner.start(
        { facingMode: "environment" },
        config,
        decodedText => {
          onScanSuccess(decodedText);
          // Stop immediately after successful scan
          scanner.stop().then(() => scanner.clear()).catch(()=>{});
          isRunning = false;
        },
        err => { /* ignore scanning errors */ }
      ).then(() => { isRunning = true; })
      .catch(err => {
        console.log("Barcode camera start failed:", err);
        alert("Camera access failed. Please enter barcode manually.");
      });
    },

    stop: function(){
      if(scanner && isRunning){
        return scanner.stop().then(() => scanner.clear()).then(() => {
          isRunning = false;
          scanner = null;
        }).catch(()=>{});
      }
      return Promise.resolve();
    }
  };
})();

