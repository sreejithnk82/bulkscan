const Parser = {
    parse: function(text){
        const lines = text.split("\n").map(l=>l.trim()).filter(l=>l);
        let pin = (text.match(/\b[1-9][0-9]{5}\b/)||[''])[0];
        let phone = (text.match(/\+?\d{10,12}/)||[''])[0];
        let name = lines[0]||'';
        let address = lines.join(' ');
        let city = '';
        return {name,phone,address,city,pin};
    }
};
