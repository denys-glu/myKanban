const express = require("express");
const app = express();
const cors = require('cors');
const port = 8000;

// This will fire our mongoose.connect statement to initialize our database connection
require("./config/mongoose.config");

app.use(express.json(), cors(), express.urlencoded({ extended: true }));

// This is where we import the users routes function from our user.routes.js file
require("./routes/myKanban.routes")(app);

const server = app.listen(port, () => console.log(`The server is all fired up on port ${port}`));


//To seperate files

const dbReq = require("./controllers/myKanban.controller");
const io = require("socket.io")(server);



io.on("connection", socket => {
    dbReq.getAllProjectsSocket(data => socket.emit("all projects", { data }))
   
    
    socket.on("update project", (data) => {
        console.log(data)
        dbReq.updateExistingProjectStatusSocket(data,data => socket.emit("all projects", { data }))
    })
})

// io.emit emits an event to all connected clients
// socket.broadcast.emit emits an event to all clients other than this particular one, referenced by the socket variable
// socket.emit emits an event directly to this specific client