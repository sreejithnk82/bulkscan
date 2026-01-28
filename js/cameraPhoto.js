const PhotoCamera = {
    stream:null,
    startVideo: async function(){
        const video = document.getElementById("address-video");
        try{
            this.stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment",width:{ideal:1920},height:{ideal:1080}}});
            video.srcObject = this.stream;
        }catch(err){
            alert("Camera failed: "+err);
        }
    },
    stopVideo:function(){
        if(this.stream) this.stream.getTracks().forEach(t=>t.stop());
    },
    capturePhoto:function(){
        const video = document.getElementById("address-video");
        const canvas = document.getElementById("address-canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video,0,0,canvas.width,canvas.height);
        return canvas;
    }
};
