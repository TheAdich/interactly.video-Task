const chrono = require('chrono-node');
const nlp = require('compromise');

module.exports = {
  extractNoticePeriod: (text) => {
    const doc = nlp(text);
    const numbers = doc.numbers().toNumber().out('array');
    const match = text.match(/\b(weeks?|months?|years?|days?)\b/i);
    
    if (numbers.length > 0 && match) {
      return { value: numbers[0], unit: match[0].toLowerCase() };
    }
    return null;
  },

  extractInterviewDate: (text) => chrono.parseDate(text) || null,

  extractCTC: (text) => {
    const match = text.match(/\b(\d+(\.\d+)?)\s*(lakh|lac|lakhs|cr|crore|crores|thousand|thousands)\b/i);
    if (!match) return null;
    
    let unit = match[3].toLowerCase();
    if (unit === 'lac' || unit === 'lakhs') unit = 'lakh';
    if (unit === 'crores') unit = 'crore';
    if (unit === 'thousands') unit = 'thousand';
    
    return { value: parseFloat(match[1]), unit };
  }
};
