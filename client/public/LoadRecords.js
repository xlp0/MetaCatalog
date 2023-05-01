const mongoose = require('mongoose');
const Laptop  = require('./laptopModel');


// connect to the MongoDB database
mongoose.connect('mongodb://localhost/mydb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // find the first 5 records in the collection
    return Laptop.find({}).limit(5);
  })
  .then((docs) => {
    console.log(docs);
  })
  .catch((err) => {
    console.error(err);
  });