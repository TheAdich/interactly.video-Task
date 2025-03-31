const chrono = require('chrono-node');

module.exports = {
  extractNoticePeriod: (text) => {
    const match = text.match(/\b(\d+)\s*(days?|weeks?|months?|years?)\b/i);
    if (!match) return null;
    return { value: parseInt(match[1], 10), unit: match[2].toLowerCase() };
  },
  extractInterviewDate: (text) => chrono.parseDate(text) || null,
  extractCTC: (text) => {
    const match = text.match(/\b(\d+(\.\d+)?)\s*(lakh|lac|L|cr)\b/i);
    if (!match) return null;
    return { value: parseFloat(match[1]), unit: match[3].toLowerCase() };
  }
};
