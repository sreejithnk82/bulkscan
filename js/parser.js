// Parser.js - Offline From-address parser
const Parser = {
  parse: function(text) {
    // Normalize text
    text = text.replace(/\r/g,'').replace(/\t/g,' ').replace(/\s+/g,' ').trim();

    // Split lines
    let lines = text.split('\n').map(l=>l.trim()).filter(l=>l);

    // Initialize
    let name='', phone='', pin='', city='', addressLines=[];
    let fromSection = '';

    // Step 1: Try to find From: section
    const lowerText = text.toLowerCase();
    const fromIndex = lowerText.indexOf('from');
    if(fromIndex !== -1) {
      const toIndex = lowerText.indexOf('to', fromIndex);
      fromSection = (toIndex !== -1) ? text.slice(fromIndex+4, toIndex) : text.slice(fromIndex+4);
    } else {
      fromSection = text; // fallback: whole text
    }

    // Step 2: Split From section into lines or chunks
    const chunks = fromSection.split(/,|\n/).map(c=>c.trim()).filter(c=>c);

    chunks.forEach(c=>{
      // Name: starts with "name:" or first line
      if(!name && /name[:]?/i.test(c)) {
        name = c.split(/name[:]?/i)[1].trim();
        return;
      }
      // Phone
      const phoneMatch = c.match(/\+?\d{10,12}/);
      if(phoneMatch && !phone) phone = phoneMatch[0];

      // Pin code
      const pinMatch = c.match(/\b[1-9][0-9]{5}\b/);
      if(pinMatch && !pin) pin = pinMatch[0];

      // City: line with known cities or after pin
      if(pin && !city) {
        city = c.replace(pin,'').trim();
        return;
      }

      // If not name, phone, pin, city, treat as address
      if(c && c !== name && c !== phone && c !== pin && c !== city) addressLines.push(c);
    });

    // Fallbacks
    if(!name && chunks.length) name = chunks[0];
    if(!pin) {
      const allPins = text.match(/\b[1-9][0-9]{5}\b/g);
      if(allPins && allPins.length) pin = allPins[0];
    }
    if(!city) {
      const pinIndex = chunks.findIndex(c=>c.includes(pin));
      if(pinIndex >= 0 && pinIndex < chunks.length-1) city = chunks[pinIndex+1];
    }

    const address = addressLines.join(', ');

    return {name, phone, address, city, pin};
  }
};
/*const Parser = {
  parse: function(text) {
    const lines = text.split("\n").map(l => l.trim()).filter(l => l);

    // --- PIN ---
    const pinMatch = text.match(/\b[1-9][0-9]{5}\b/);
    const pin = pinMatch ? pinMatch[0] : '';

    // --- PHONE ---
    const phoneMatch = text.match(/\+?\d{10,12}/);
    const phone = phoneMatch ? phoneMatch[0] : '';

    // --- NAME ---
    let name = '';
    for (let l of lines) {
        if (/name[:\-]/i.test(l)) {
            name = l.split(/[:\-]/)[1].trim();
            break;
        }
    }
    if (!name && lines.length > 0) name = lines[0]; // fallback

    // --- CITY ---
    let city = '';
    if (pin) {
        // try to find city around pin
        const pinLineIndex = lines.findIndex(l => l.includes(pin));
        if (pinLineIndex >= 0) {
            city = lines[pinLineIndex - 1] || lines[pinLineIndex + 1] || '';
        }
    }

    // --- ADDRESS ---
    let addressLines = lines.filter(l => !l.includes(name) && !l.includes(phone) && !l.includes(pin));
    const address = addressLines.join(', ');

    return { name, phone, address, city, pin };
  }
};*/
