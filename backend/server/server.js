const express = require("express");
const cors = require("cors");
require('../database/database');

const app = express();

app.use(express.json());
app.use(cors())

app.use('/freelancer/uploads', express.static("uploads"))
app.use('/freelancer/uploads/**', express.static("uploads/file-noImage.jpeg"))
app.use("/freelancer", require('../server/server-routing'));



const PORT = 5000;

app.listen(PORT, () => {
    console.log('server is running.. on http://localhost:'+PORT);    
})
