const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/public");

//------------------------------------------------------
const path = require("path");
const flash = require('express-flash');

const express = require("express");
const app = express();

const nocache=require("nocache")

//port
const port = process.env.PORT||3000;

app.use(flash());
app.use(nocache());
//To use CSS file.
app.use('/static',express.static(path.join(__dirname,'public')));

// for user routes
const userRoute = require("./routes/userRoute");
app.use('/',userRoute);

// for admin routes.
const adminRoute = require('./routes/adminRoute');
app.use('/admin',adminRoute);

// listening to server
app.listen(port,() =>
{
    console.log(`server is running on http://localhost:${port}`);
})
