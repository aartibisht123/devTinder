const mongoose = require("mongoose")

const connectDB = async () => {
 await mongoose.connect(
    "mongodb+srv://aartbisht_:kiki7345@cluster0.9glgf24.mongodb.net/devTinder"
);

};

module.exports = connectDB