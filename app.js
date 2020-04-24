const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express(); //Initialize App

//DB confguration
const db = require('./config/keys').MongoURI;

//Passport Configuration
require('./config/passport')(passport);

//connnect to Mongo
mongoose.connect(db,{ useNewUrlParser : true, useUnifiedTopology : true})
    .then(()=>console.log(`connected to MongoDB database`))
        .catch(err => console.log(err));

//configuring Express Handlebars
app.set('view engine','hbs');
app.engine('hbs',handlebars({
    defaultLayout : 'main',
    extname : 'hbs',
    layoutsDir : path.join(__dirname,'views/layouts'),
    partialsDir : path.join(__dirname,'views/partials')
}));

// Body Parser MiddleWare
app.use(express.urlencoded({extended : false}));

// Express Session
app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true
}));

// Passport Auth MiddleWare
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

// Global Variables for flash
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// routing setup
app.use('/',require('./routes/routes'));

const PORT = process.env.PORT || 5000; // Define Port
app.listen(PORT,()=> console.log(`server started on PORT : ${PORT}`)); // Start Server