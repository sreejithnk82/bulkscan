const OCR = {
    recognize: async function(canvas){
        const result = await Tesseract.recognize(canvas,'eng',{logger:m=>{}});
        return result.data.text;
    }
};
