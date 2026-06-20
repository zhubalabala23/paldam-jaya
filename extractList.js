import fs from 'fs';
import * as xlsx from 'xlsx';

const workbook = xlsx.readFile('dataset/rincian_materil.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Extract column A from rows 1 to 518
let list = [];
for (let i = 1; i <= 518; i++) {
    const cellAddress = 'A' + i;
    const cell = worksheet[cellAddress];
    if (cell && cell.v) {
        list.push(cell.v.toString().trim());
    }
}

// remove duplicates and empty strings
list = [...new Set(list)].filter(Boolean);

console.log(JSON.stringify(list, null, 2));
