const App = {
    bookings:[],
    current:{},
    init:function(){
        this.showStep("step-barcode");
        BarcodeCamera.start(this.barcodeScanned);
    },
    showStep:function(id){
        document.querySelectorAll(".step-view").forEach(s=>s.classList.remove("active"));
        document.getElementById(id).classList.add("active");
    },
    barcodeScanned:function(decodedText){
        document.getElementById("barcode-input").value = decodedText;
        BarcodeCamera.stop();
    },
    goToStep2:function(){
        let code = document.getElementById("barcode-input").value.trim();
        if(!code){alert("Scan or enter barcode"); return;}
        this.current={barcode:code};
        this.showStep("step-address");
        PhotoCamera.startVideo();
    },
    captureAddress: async function(){
        const canvas = PhotoCamera.capturePhoto();
        PhotoCamera.stopVideo();
        const text = await OCR.recognize(canvas);
        const data = Parser.parse(text);
        this.current = {...this.current,...data};
        document.getElementById("review-name").value = data.name;
        document.getElementById("review-phone").value = data.phone;
        document.getElementById("review-address").value = data.address;
        document.getElementById("review-city").value = data.city;
        document.getElementById("review-pin").value = data.pin;
        this.showStep("step-review");
    },
    goBack:function(step){
        if(step===1){ // back to barcode
            this.showStep("step-barcode");
            BarcodeCamera.start(this.barcodeScanned);
            document.getElementById("barcode-input").value = "";
        }
        if(step===2){ // back to address
            this.showStep("step-address");
            PhotoCamera.startVideo();
        }
    },
    saveBooking:function(){
        this.current.name = document.getElementById("review-name").value;
        this.current.phone = document.getElementById("review-phone").value;
        this.current.address = document.getElementById("review-address").value;
        this.current.city = document.getElementById("review-city").value;
        this.current.pin = document.getElementById("review-pin").value;
        this.bookings.push({...this.current});
        document.getElementById("booking-count").textContent = this.bookings.length;
        this.showStep("step-actions");
    },
    scanNew:function(){
        this.current={};
        document.getElementById("barcode-input").value="";
        this.showStep("step-barcode");
        BarcodeCamera.start(this.barcodeScanned);
    },
    exportAll:function(){
        if(!this.bookings.length){alert("No data to export"); return;}
        const blob = new Blob([JSON.stringify(this.bookings,null,2)],{type:"application/json"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "courier_bookings.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        if(confirm("Exported. Clear session?")) this.clearAll();
    },
    clearAll:function(){
        this.bookings=[];
        document.getElementById("booking-count").textContent = 0;
        this.scanNew();
    }
};

document.addEventListener("DOMContentLoaded",()=>App.init());
