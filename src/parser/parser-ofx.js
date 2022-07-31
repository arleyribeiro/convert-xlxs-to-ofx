const util = require('../helpers/util');
const { v4: uuidv4 } = require('uuid');

const startOfx = (bank) => `OFXHEADER:100
DATA:OFXSGML
VERSION:102
SECURITY:NONE
ENCODING:UTF-8
CHARSET:NONE
COMPRESSION:NONE
OLDFILEUID:NONE
NEWFILEUID:NONE
<OFX>
${bankOfx(bank)}
<BANKMSGSRSV1>
<STMTTRNRS>
${bankAcctFrom(bank)}
<BANKTRANLIST>`;

const bankTransactionRange = (startDate, endDate) => `
<DTSTART>${util.normalizeDate(startDate)}</DTSTART>
<DTEND>${util.normalizeDate(endDate)}</DTEND>`;

const endOfx = (endDate, balance) => `
</BANKTRANLIST>
<LEDGERBAL>
<BALAMT>${util.normalizeAmount(balance)}</BALAMT>
<DTASOF>${util.normalizeDate(endDate)}</DTASOF>
</LEDGERBAL>
</STMTRS>
</STMTTRNRS>
</BANKMSGSRSV1>
</OFX>`;

const bankAcctFrom = (bank) => {
  const { branchId, bankId, accountNumber } = bank;
  return `<TRNUID>1</TRNUID>
  <STATUS>
  <CODE>0</CODE>
  <SEVERITY>INFO</SEVERITY>
  </STATUS>
  <STMTRS>
  <CURDEF>BRL</CURDEF>
  <BANKACCTFROM>
  <BANKID>${bankId}</BANKID>
  <BRANCHID>${branchId}</BRANCHID>
  <ACCTID>${accountNumber}</ACCTID>
  <ACCTTYPE>CHECKING</ACCTTYPE>
  </BANKACCTFROM>`;
}

const bankOfx = (bank) => {
  const { date, bankName, bankId } = bank;
  return `<SIGNONMSGSRSV1>
<SONRS>
<STATUS>
<CODE>0</CODE>
<SEVERITY>INFO</SEVERITY>
</STATUS>
<DTSERVER>${util.normalizeDate(date || new Date())}</DTSERVER>
<LANGUAGE>POR</LANGUAGE>
<FI>
<ORG>${bankName}</ORG>
<FID>${bankId}</FID>
</FI>
</SONRS>
</SIGNONMSGSRSV1>`;
};

const bankStatement = ({ date, amount, description, type, id }) => {
  return `
<STMTTRN>
<TRNTYPE>${type || 'OTHER'}</TRNTYPE>
<DTPOSTED>${util.normalizeDate(date, 'YYYYMMDD')}</DTPOSTED>
<TRNAMT>${util.normalizeAmount(amount)}</TRNAMT>
<FITID>${id || uuidv4()}</FITID>
<MEMO>${description}</MEMO>
</STMTTRN>`;
};

const generateOfx = (info) => {
  const { startDate, endDate, ledgerBalance, transactions, bank } = info;

  const ofxTransactions = (transactions || []).map(transaction => {
    return bankStatement(transaction);
  }).join('');

  return `${startOfx(bank)}
    ${bankTransactionRange(startDate, endDate)}
    ${ofxTransactions}
    ${endOfx(endDate, ledgerBalance)}`;
};

module.exports = {
  generateOfx: generateOfx
};