const mongoose = require("mongoose");

module.exports.init = async () => {
  await mongoose.connect("mongodb://localhost/ecommerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).catch((err) => {
    console.log(err);
  });
  console.log("Connected to MongoDB");
}
