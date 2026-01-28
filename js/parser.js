const Parser = {
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
};
