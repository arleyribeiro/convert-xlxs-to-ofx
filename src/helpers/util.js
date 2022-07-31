const moment = require('moment')

function normalizeAmount(text) {
  return (text || '').replace(/[aA-zZ.$]/g, '').replace(',', '.');
}

function normalizeDate(date, format = 'YYYYMMDD') {
  if (!date) {
    throw new Error('Date is required!')
  }
  return moment(date).format(format);
}

module.exports = {
  normalizeDate: normalizeDate,
  normalizeAmount: normalizeAmount,
}