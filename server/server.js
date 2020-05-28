const express = require("express");
const app = express();
const cors = require('cors')
require('dotenv').config(); 
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');

app.use(cookieParser());

// this will set up and check for the secured user id
const payload = {
    id: user._id
};
const userToken = jwt.sign(payload, process.env.SECRET_KEY);

const myFirstSecret = process.env.FIRST_SECRET_KEY;
console.log(process.env.FIRST_SECRET_KEY);

// This will fire our mongoose.connect statement to initialize our database connection
require("./config/mongoose.config");

// this alternate allows us to use cookies with express, allowing us to send and read the cookies with each req/res.
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
// app.use(express.json(), cors(), express.urlencoded({ extended: true }));

res.cookie("mycookie", "mydata", { httpOnly: true }).json({
    message: "This response has a cookie"
});

// This is where we import the users routes function from our user.routes.js file
require("./routes/projectManager.routes")(app);

app.listen(8001, () => console.log("The server is all fired up on port 8001, HakunaMatata"));
