const express = require('express')
const app = express()
const port = 3000

const bodyParser = require('body-parser')
const routes = require('./app/routes/routes')


// connect to mongodb
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/mydb', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection
.once("open", () => console.log('Connected')) 
.on("error", error => {
    console.log("MongoDB Error: Could not connect to database" );
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE"); 
  next();
});

routes(app);


app.listen(port, () => {
  console.log(`listening on port ${port}`)
})