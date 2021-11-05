const mongoose = require("mongoose");
require("dotenv").config()


const uri = process.env.connection_uri;

mongoose.connect(uri, {   
    useNewUrlParser: true,
    useUnifiedTopology:true
})

mongoose.connection.once("open", () => {
    console.log("Mongodb connection success...");
})

mongoose.connection.on("error", (error) => {
    console.log(error.message);
})

module.exports = mongoose;