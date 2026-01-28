// Parser.js - Offline address parser for courier PWA
const Parser = {
  parse: function(text) {
    // 1. Normalize OCR text
    text = text.replace(/\r/g,'').replace(/\t/g,' ').replace(/\s+/g,' ').trim();

    // 2. Split into lines
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    // 3. Initialize fields
    let name = '';
    let phone = '';
    let pin = '';
    let city = '';
    let addressLines = [];

    // 4. Detect known labels
    lines.forEach(line => {
      const l = line.toLowerCase();

      // Name
      if(l.includes('name:') || l.startsWith('name')) {
        name = line.split(/name[:]?/i)[1].trim();
      }

      // Phone
      if(l.includes('phone:') || l.match(/\+?\d{10,12}/)) {
        const match = line.match(/\+?\d{10,12}/);
        if(match) phone = match[0];
      }

      // PIN code
      const pinMatch = line.match(/\b[1-9][0-9]{5}\b/);
      if(pinMatch) pin = pinMatch[0];

      // City
      if(l.includes('city:')) {
        city = line.split(/city[:]?/i)[1].trim();
      }

      // Address detection
      if(l.includes('address:')) {
        const a = line.split(/address[:]?/i)[1].trim();
        if(a) addressLines.push(a);
      }
    });

    // 5. Fallback heuristics if labels not found
    // Name: first line if empty
    if(!name && lines.length) name = lines[0];

    // Phone: regex if not found
    if(!phone) {
      const phoneMatch = text.match(/\+?\d{10,12}/);
      if(phoneMatch) phone = phoneMatch[0];
    }

    // PIN: last 6-digit number in text if not found
    if(!pin) {
      const allPins = text.match(/\b[1-9][0-9]{5}\b/g);
      if(allPins && allPins.length) pin = allPins[allPins.length - 1];
    }

    // City: line near PIN or last line
    if(!city) {
      const pinIndex = lines.findIndex(l=>l.includes(pin));
      if(pinIndex > 0) city = lines[pinIndex - 1];
      else city = lines[lines.length - 1];
    }

    // Address: all lines except name, phone, city, pin
    lines.forEach(line => {
      if(line && line !== name && line !== city && !line.includes(phone) && !line.includes(pin)) {
        if(!line.toLowerCase().includes('from') && !line.toLowerCase().includes('to')) {
          addressLines.push(line);
        }
      }
    });
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
