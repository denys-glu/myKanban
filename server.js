const express = require("express");
const app = express();
const cors = require('cors');
const path = require('path');
const port = 5000;

// This will fire our mongoose.connect statement to initialize our database connection
require("./config/mongoose.config");

app.use(express.json(), cors(), express.urlencoded({ extended: true }));

// This is where we import the users routes function from our user.routes.js file
require("./routes/myKanban.routes")(app);
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'))
});
// const server = app.listen(port, () => console.log(`The server is all fired up on port ${port}`));