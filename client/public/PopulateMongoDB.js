const mongoose = require('mongoose');
const Laptop  = require('./laptopModel');

// Load the flattened data from the JSON file
// const laptops = require('./flattenedData.json');
const laptops = require('./OriginalDataFlattened.json');
let convertedLaptops = [];

laptops.forEach((laptopData) => {
// const laptop = new Laptop(laptopData);
const laptop = {...laptopData}
const dateFields = ['berlaku_sampai', 'tanggal_tkdn', 'tanggal_expire_tkdn', 'created_date', 'modified_date'];
    dateFields.forEach((field) => {
        console.log("Will Convert " + field+ ": " +  typeof laptopData[field] + " " + laptopData[field])       
    if (laptopData[field]) {
        const newDateStr = laptopData[field].split("\"").join("");
        if (newDateStr.includes("null")){
            laptop[field] = null;
            console.log("Converted " + field+ " into A NULL  value: " +  laptop[field])   
        }else{
            laptop[field] = new Date(newDateStr);
            console.log("Converted " + field+ " into : " +  laptop[field])      
        }
    } else {
        laptop[field] = null;
    }
    });
    convertedLaptops.push(laptop);
});

// Connect to the MongoDB database using Mongoose
mongoose.connect('mongodb://localhost/mydb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to database!');
    
    // Insert the laptop records into the laptops collection
    Laptop.insertMany(convertedLaptops)
      .then(() => {
        console.log('Laptop records inserted!');
        mongoose.connection.close();
      })
      .catch((err) => {
        console.error('Error inserting laptop records:', err);
        mongoose.connection.close();
      });
  })
  .catch((err) => {
    console.error('Error connecting to database:', err);
  });
