// AddressParser.js
const AddressParser = {
    parse: function(rawText) {
        const result = { name:'', phone:'', address:'', city:'', pin:'' };
        if (!rawText) return result;

        // Normalize
        let text = rawText.replace(/\n/g,','); // treat newlines as commas
        let tokens = text.split(',').map(t => t.trim()).filter(t => t);

        // --- PHONE ---
        const phoneRegex = /\b\d{6,10}\b/;
        let phoneIndex = tokens.findIndex(t => phoneRegex.test(t));
        if (phoneIndex >= 0) {
            result.phone = tokens[phoneIndex].match(phoneRegex)[0];
            tokens.splice(phoneIndex, 1);
        }

        // --- PIN ---
        const pinRegex = /\b[1-9][0-9]{5}\b/;
        let pinIndex = tokens.findIndex(t => pinRegex.test(t));
        if (pinIndex >= 0) {
            result.pin = tokens[pinIndex].match(pinRegex)[0];
        }

        // --- NAME ---
        let nameToken = tokens.find(t => /name[:\-]/i.test(t));
        if (nameToken) {
            result.name = nameToken.split(/[:\-]/)[1].trim();
            tokens = tokens.filter(t => t !== nameToken);
        } else if(tokens.length > 0) {
            result.name = tokens[0]; // assume first token
            tokens = tokens.slice(1);
        }

        // --- CITY ---
        let cityToken = '';
        if(result.pin) {
            let pinTokenIndex = tokens.findIndex(t => t.includes(result.pin));
            if(pinTokenIndex >= 0) {
                cityToken = tokens[pinTokenIndex + 1] || tokens[pinTokenIndex - 1] || '';
                if(cityToken) tokens.splice(tokens.indexOf(cityToken), 1);
            }
        }
        result.city = cityToken;

        // --- ADDRESS BODY ---
        result.address = tokens.join(', ');

        return result;
    }
};
