const Parser = {
  parse:function(text){
    const lines = text.split("\n").map(l=>l.trim()).filter(l=>l);
    const pin = (text.match(/\b[1-9][0-9]{5}\b/)||[''])[0];
    const phone = (text.match(/\+?\d{10,12}/)||[''])[0];
    const name = lines[0]||'';
    const address = lines.join(' ');
    const city = '';
    return {name,phone,address,city,pin};
  }
};
