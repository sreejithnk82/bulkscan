const BarcodeCamera = {
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
};
