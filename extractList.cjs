const fs = require('fs');
const xlsx = require('xlsx');

const workbook = xlsx.readFile('dataset/rincian_materil.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

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

fs.writeFileSync('kaliber_list.json', JSON.stringify(list, null, 2));
console.log('Saved to kaliber_list.json');
