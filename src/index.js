const fs = require('fs');
const path = require('path');
const prompt = require('prompt');
const parserXlsx = require('./parser/parser-xlsx-to-json')
const parserOfx = require('./parser/parser-ofx');
const moment = require('moment');
const util = require('./helpers/util');

const formatDate = 'YYYY-MM-DD-HH-mm-ss';
const outputNameDefault = `${util.normalizeDate(new Date(), formatDate)}-output.ofx`;
const xlsxPath = 'ofx-example';

const schema = {
  properties: {
    filename: {
      type: 'string',
      message: 'Filename, default folder: bank_statement, extension: xlsx',
      required: true,
      default: xlsxPath
    },
    sheetName: {
      type: 'string',
      message: 'Name of worksheet to convert',
      required: true,
      default: 'sheet1'
    },
    outputName: {
      type: 'string',
      message: 'Filename where the file will be saved',
      required: false,
      default: outputNameDefault
    }
  }
};

const main = async () => {
  prompt.start();
  const { filename, sheetName, outputName } = await prompt.get(schema);
  const xlsxPath = path.join(__dirname, `bank_statement/${filename}.xlsx`);
  
  const info = parserXlsx.generateInfoBySheet(xlsxPath, sheetName);
  
  console.log(info);
  
  const ofx = parserOfx.generateOfx(info);
  const saveFilePath = path.join(__dirname, `data/${outputName}`);

  fs.writeFile(saveFilePath, ofx, function (err) {
    if (err) return console.log(err);
  });
  
  console.log(`File created: ${saveFilePath}`);
};

main();

