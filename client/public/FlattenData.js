const fs = require('fs');

// Read data from file
const rawData = fs.readFileSync('OriginalLaptopData.json');
const laptops = JSON.parse(rawData);

// Flatten data
const flattenedLaptops = laptops.map((laptop) => {
  return laptop?.data;
});

// Write flattened data to file
fs.writeFileSync('OriginalDataFlattened.json', JSON.stringify(flattenedLaptops, null, 2));

console.log('Data flattened and saved to flattenedData.json');
