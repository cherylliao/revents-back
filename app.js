const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const expressValidator = require('express-validator')
require('dotenv').config();
const {signup, signin, signout, requireSignin} = require('../controllers/auth');
const {userSignupValidator} = require("../validator");
// //import routes
// const authRoutes= require('./routes/auth');
// const userRoutes= require('./routes/user');
// const categoryRoutes = require("./routes/category");
// const productRoutes = require("./routes/product");
// const braintreeRoutes = require("./routes/braintree");

// app
const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-cheryl:Iphone8!@cluster0-zmvqc.mongodb.net/eventDB", 
{useNewUrlParser: true, useCreateIndex:true,useUnifiedTopology: true});



//middlewares
app.use(morgan('dev'));
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());


// //routes middleware
// app.use('/api',authRoutes);
// app.use('/api',userRoutes);
// app.use('/api', categoryRoutes);
// app.use('/api', productRoutes);
// app.use('/api', braintreeRoutes);

const port = process.env.PORT || 8000

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});