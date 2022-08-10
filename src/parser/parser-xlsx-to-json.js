'use strict';
const excelToJson = require('convert-excel-to-json');
const { first, last, size } = require('lodash');
const util = require('../helpers/util');

const PAGE_NAME = 'Página1';
const PAGE_BANK = 'bank';

const mapBankToJson = (filePath, pageName = PAGE_BANK) => {
  const page = pageName || PAGE_BANK;
  const result = excelToJson({
    sourceFile: filePath,
    sheets: [{
      name: page,
      header:{
        rows: 1
      },
      columnToKey: {
        A: 'bankId',
        B: 'bankName',
        C: 'branchId',
        D: 'accountNumber'
      }
    }]
  });
  return first(result && result[page]);
};

const mapExcelToJson = (filePath, pageName = PAGE_NAME) => {
  const page = pageName || PAGE_NAME;
  const result = excelToJson({
    sourceFile: filePath,
    sheets: [{
      name: page,
      header:{
        rows: 1
      },
      columnToKey: {
        A: 'date', // move date
        B: 'description', // description
        C: 'amount', // amount
        D: 'balance', // account balance
        E: 'startDate',
        F: 'endDate'
      }
    }]
  });
  return normalizeData((result && result[page]) || []);
};

const normalizeTransactions = (transactions) => {
  if (size(transactions) === 1) {
    const transaction = first(transactions);
    const { description, amount, balance, startDate, endDate } = transaction || {};
    if (!description && !balance && !amount && startDate && endDate) {
      return [];
    }
  }
  return transactions;
};

const generateInfoBySheet = (filePath, pageName = PAGE_NAME) => {
  const transactions = mapExcelToJson(filePath, pageName);
  const firstTransaction = first(transactions) || {};
  const lastTransaction = getLastTransaction(transactions) || {};
  const { startDate, endDate } = firstTransaction;
  const { balance: ledgerBalance = '0,00' } = lastTransaction;
  const bank = mapBankToJson(filePath);
  
  return {
    bank,
    startDate,
    endDate,
    ledgerBalance,
    transactions: normalizeTransactions(transactions)
  }
};

const getLastTransaction = (transactions) => {
  return size(transactions) > 0 ? last(transactions) : {};
}

const normalizeData = (transactions) => {
  return (transactions || []).map(transaction => {
    const { amount } = transaction;
    const value = util.normalizeAmount(amount);
    const type = parseFloat(value) < 0 ? 'DEBIT' : 'CREDIT';
    return {
      ...transaction,
      type
    }
  })
};

module.exports = {
  generateInfoBySheet: generateInfoBySheet
};