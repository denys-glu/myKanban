const mongoose = require("mongoose");
const dbName = "MyKanban";
const dbPassword = process.env.DB_PASSWORD
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(`mongodb+srv://busabro:${dbPassword}@myshinycluster.qqcs1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log(`Established a connection to the database ${dbName}`))
    .catch(err => console.log("Something went wrong when connecting to the database", err));