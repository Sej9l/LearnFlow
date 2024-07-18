// SETTING UP A SERVER
const express = require("express");
const connectDb = require("./config/db");

 const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport"); 

const app = express();
const PORT = 4000;

connectDb();

require("./models/User");
require("./models/post");
require("./models/Comment");

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(express.json());

//SESSION MIDDLEWARE ...SESSION ID IS PRESENT OR NOT IF NOT PRESNT THEN IT WILL CREATE
app.use(session({
   secret:"mysecret",
   resave: false,
   saveUninitialized : true ,
   store : new MongoStore ({mongooseConnection : mongoose.connection}),
}));
require("./config/passport");

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth" , require("./routes/auth")); 
app.use("/" , require("./routes/index"));
app.use("/post" , require("./routes/post"));
app.use("/comment" , require("./routes/comment"));
app.use("/upload" , require("./routes/upload"));

app.get("/internal-server-error", (req, res) => {
    res.render("error-500");
  });
  
  app.get("/*", (req, res) => {
    res.render("error-404");
  });
  

app.listen(PORT , () =>{
    console.log('server is running on port', PORT );
});
